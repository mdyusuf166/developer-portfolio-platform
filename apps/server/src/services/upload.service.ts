import { randomUUID } from 'node:crypto';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { prisma } from '../lib/prisma.js';
import { AppError } from '../errors/AppError.js';
import { env } from '../config/env.js';
import { normalizeUploadMetadata, uploadMaxBytes, validateStoredUpload } from '../lib/project-upload.js';
import type { UploadStorage } from '../lib/upload-storage.js';

const uploadAuthorizationLifetimeSeconds = 300;
const publicReadLifetimeSeconds = 60;
const privateReadLifetimeSeconds = 60;
const objectKeyPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const requireHttpsStorageUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('invalid');
    return url.toString();
  } catch {
    throw new AppError('Storage returned an invalid authorization URL', 503, 'UPLOAD_STORAGE_UNAVAILABLE');
  }
};

const uploadClaims = (token: string) => {
  try {
    const payload = jwt.verify(token, env.jwtAccessSecret, { issuer: 'portfolio-api', audience: 'portfolio-upload' }) as JwtPayload & {
      sub?: string; objectKey?: string; originalName?: string; contentType?: string; size?: number; purpose?: string; kind?: string;
    };
    if (payload.kind !== 'upload' || !payload.sub || !payload.objectKey || !objectKeyPattern.test(payload.objectKey) ||
      !payload.originalName || !payload.contentType || !Number.isInteger(payload.size) || !payload.exp) {
      throw new Error('invalid');
    }
    return {
      sub: payload.sub,
      objectKey: payload.objectKey,
      originalName: payload.originalName,
      contentType: payload.contentType,
      size: payload.size,
      purpose: payload.purpose,
      exp: payload.exp
    };
  } catch {
    throw new AppError('Upload authorization is invalid or expired', 401, 'UPLOAD_AUTHORIZATION_INVALID');
  }
};

const assetIsPublic = async (assetId: string) => {
  const references = await Promise.all([
    prisma.project.findFirst({ where: { imageAssetId: assetId, status: 'published' }, select: { id: true } }),
    prisma.blogPost.findFirst({ where: { coverImageAssetId: assetId, published: true }, select: { id: true } }),
    prisma.researchItem.findFirst({ where: { imageAssetId: assetId, status: 'published' }, select: { id: true } }),
    prisma.achievement.findFirst({ where: { imageAssetId: assetId, status: 'published' }, select: { id: true } }),
    prisma.portfolioProfile.findFirst({ where: { profileImageAssetId: assetId, profileImagePublic: true }, select: { id: true } })
  ]);
  return references.some(Boolean);
};

const assetIsReferenced = async (assetId: string) => {
  const references = await Promise.all([
    prisma.project.findFirst({ where: { imageAssetId: assetId }, select: { id: true } }),
    prisma.blogPost.findFirst({ where: { coverImageAssetId: assetId }, select: { id: true } }),
    prisma.researchItem.findFirst({ where: { OR: [{ imageAssetId: assetId }, { fileAssetId: assetId }] }, select: { id: true } }),
    prisma.achievement.findFirst({ where: { OR: [{ imageAssetId: assetId }, { documentAssetId: assetId }] }, select: { id: true } }),
    prisma.portfolioProfile.findFirst({ where: { OR: [{ profileImageAssetId: assetId }, { resumeAssetId: assetId }] }, select: { id: true } })
  ]);
  return references.some(Boolean);
};

export const uploadService = {
  async authorize(input: { ownerAdminId: string; originalName: string; contentType: string; size: number; purpose?: string }, storage: UploadStorage) {
    if (!Number.isInteger(input.size) || input.size < 1 || input.size > uploadMaxBytes) {
      throw new AppError('Files must be between 1 byte and 10 MiB', 413, 'UPLOAD_TOO_LARGE');
    }
    const metadata = normalizeUploadMetadata(input);
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'].includes(metadata.contentType)) {
      throw new AppError('Only JPEG, PNG, WebP, SVG, or PDF files are allowed', 415, 'UNSUPPORTED_MEDIA_TYPE');
    }
    const objectKey = randomUUID();
    const expiresAt = new Date(Date.now() + uploadAuthorizationLifetimeSeconds * 1000);
    const storageAuthorization = await storage.authorizeUpload({
      objectKey,
      contentType: metadata.contentType,
      maximumBytes: uploadMaxBytes,
      expiresAt,
      writeOnce: true
    });
    requireHttpsStorageUrl(storageAuthorization.url);
    const token = jwt.sign({
      kind: 'upload',
      objectKey,
      originalName: metadata.originalName,
      contentType: metadata.contentType,
      size: metadata.size,
      purpose: metadata.purpose
    }, env.jwtAccessSecret as jwt.Secret, {
      subject: input.ownerAdminId,
      issuer: 'portfolio-api',
      audience: 'portfolio-upload',
      expiresIn: uploadAuthorizationLifetimeSeconds
    });

    return { ...storageAuthorization, uploadToken: token, maximumBytes: uploadMaxBytes };
  },

  async finalize(token: string, ownerAdminId: string, storage: UploadStorage) {
    const claims = uploadClaims(token);
    if (claims.sub !== ownerAdminId) throw new AppError('Upload authorization is not available', 404, 'UPLOAD_NOT_FOUND');

    const existing = await prisma.uploadAsset.findUnique({ where: { filename: claims.objectKey } });
    if (existing) {
      if (existing.ownerAdminId !== ownerAdminId) throw new AppError('Upload authorization is not available', 404, 'UPLOAD_NOT_FOUND');
      return existing;
    }

    const stored = await storage.inspectObject(claims.objectKey, uploadMaxBytes);
    if (!stored || stored.objectKey !== claims.objectKey) throw new AppError('Uploaded object was not found', 409, 'UPLOAD_OBJECT_MISSING');
    if (stored.bytes.length !== claims.size || stored.contentType.trim().toLowerCase() !== claims.contentType) {
      await storage.deleteObject(claims.objectKey).catch(() => undefined);
      throw new AppError('Uploaded object metadata did not match its authorization', 400, 'UPLOAD_METADATA_MISMATCH');
    }
    let validated: ReturnType<typeof validateStoredUpload>;
    try {
      validated = validateStoredUpload(stored.bytes, stored.contentType);
    } catch (error) {
      await storage.deleteObject(claims.objectKey).catch(() => undefined);
      throw error;
    }
    const url = `/uploads/${claims.objectKey}`;
    try {
      return await prisma.uploadAsset.create({
        data: {
          filename: claims.objectKey,
          originalName: claims.originalName,
          mimeType: validated.mimeType,
          size: validated.size,
          url,
          purpose: claims.purpose,
          ownerAdminId
        }
      });
    } catch (error) {
      await storage.deleteObject(claims.objectKey).catch(() => undefined);
      throw error;
    }
  },

  list(ownerAdminId: string) {
    return prisma.uploadAsset.findMany({ where: { ownerAdminId }, orderBy: { createdAt: 'desc' }, take: 200 });
  },

  async resolvePublic(filename: string, storage: UploadStorage) {
    if (!objectKeyPattern.test(filename)) throw new AppError('Upload not found', 404, 'NOT_FOUND');
    const asset = await prisma.uploadAsset.findUnique({ where: { filename } });
    if (!asset || !(await assetIsPublic(asset.id))) throw new AppError('Upload not found', 404, 'NOT_FOUND');
    return requireHttpsStorageUrl(await storage.authorizeRead({
      objectKey: asset.filename,
      expiresAt: new Date(Date.now() + publicReadLifetimeSeconds * 1000),
      responseHeaders: { 'Content-Type': asset.mimeType, 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:", 'Content-Disposition': 'inline' }
    }));
  },

  async resolvePrivate(id: string, ownerAdminId: string, storage: UploadStorage) {
    const asset = await prisma.uploadAsset.findFirst({ where: { id, ownerAdminId } });
    if (!asset) throw new AppError('Upload not found', 404, 'NOT_FOUND');
    return requireHttpsStorageUrl(await storage.authorizeRead({
      objectKey: asset.filename,
      expiresAt: new Date(Date.now() + privateReadLifetimeSeconds * 1000),
      responseHeaders: {
        'Content-Type': asset.mimeType,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; img-src data:",
        'Content-Disposition': asset.mimeType === 'application/pdf' ? 'attachment' : 'inline'
      }
    }));
  },

  async delete(id: string, ownerAdminId: string, storage: UploadStorage) {
    const asset = await prisma.uploadAsset.findFirst({ where: { id, ownerAdminId } });
    if (!asset) throw new AppError('Upload not found', 404, 'NOT_FOUND');
    if (await assetIsReferenced(asset.id)) throw new AppError('Remove this asset from content before deleting it', 409, 'UPLOAD_IN_USE');
    await storage.deleteObject(asset.filename);
    await prisma.uploadAsset.delete({ where: { id: asset.id } });
    return asset;
  }
};
