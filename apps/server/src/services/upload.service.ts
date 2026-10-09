import { unlink } from 'node:fs/promises';
import { basename, join } from 'node:path';

import { prisma } from '../lib/prisma.js';
import { projectUploadsDirectory, parseMultipartUpload, storeUpload } from '../lib/project-upload.js';
import { AppError } from '../errors/AppError.js';

export const uploadService = {
  async create(body: Buffer, contentType: string) {
    const upload = parseMultipartUpload(body, contentType);
    const stored = await storeUpload(upload);
    try {
      return await prisma.uploadAsset.create({ data: stored });
    } catch (error) {
      await unlink(join(projectUploadsDirectory, stored.filename)).catch(() => undefined);
      throw error;
    }
  },

  list() {
    return prisma.uploadAsset.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });
  },

  async delete(id: string) {
    const asset = await prisma.uploadAsset.findUnique({ where: { id } });
    if (!asset) throw new AppError('Upload not found', 404, 'NOT_FOUND');
    if (basename(asset.filename) !== asset.filename) throw new AppError('Invalid stored file path', 400, 'INVALID_FILE_PATH');
    await unlink(join(projectUploadsDirectory, asset.filename)).catch((error: unknown) => {
      if (!(error instanceof Error) || !('code' in error) || error.code !== 'ENOENT') throw error;
    });
    await prisma.uploadAsset.delete({ where: { id } });
    return asset;
  }
};