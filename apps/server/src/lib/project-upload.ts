import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { AppError } from '../errors/AppError.js';

const currentDirectory = dirname(fileURLToPath(import.meta.url));
export const projectUploadsDirectory = resolve(process.env.UPLOADS_DIR ?? resolve(currentDirectory, '../../uploads'));
export const uploadMaxBytes = 10 * 1024 * 1024;

export type ParsedUpload = {
  file: Buffer;
  contentType: string;
  originalName: string;
  purpose?: string;
};

export type StoredUpload = {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  purpose?: string;
};

const boundaryFrom = (header: string) => {
  const match = /(?:^|;)\s*boundary=(?:"([^"]+)"|([^;\s]+))/i.exec(header);
  return match?.[1] ?? match?.[2];
};

const safeOriginalName = (name: string) => {
  const base = basename(name.replaceAll('\\', '/'))
    .replace(/[^A-Za-z0-9._ -]/g, '_')
    .trim()
    .slice(0, 160);
  return base || 'upload';
};

export function parseMultipartUpload(body: Buffer, contentType: string): ParsedUpload {
  const boundary = boundaryFrom(contentType);
  if (!boundary || boundary.length > 200) {
    throw new AppError('A valid multipart boundary is required', 400, 'INVALID_MULTIPART');
  }

  const delimiter = Buffer.from(`--${boundary}`);
  let cursor = body.indexOf(delimiter);
  let upload: ParsedUpload | undefined;
  let purpose: string | undefined;

  while (cursor >= 0) {
    cursor += delimiter.length;
    if (body.subarray(cursor, cursor + 2).equals(Buffer.from('--'))) break;
    if (body.subarray(cursor, cursor + 2).equals(Buffer.from('\r\n'))) cursor += 2;

    const headerEnd = body.indexOf(Buffer.from('\r\n\r\n'), cursor);
    if (headerEnd < 0) break;
    const headerText = body.toString('utf8', cursor, headerEnd);
    const nextBoundary = body.indexOf(delimiter, headerEnd + 4);
    if (nextBoundary < 0) break;
    let valueEnd = nextBoundary;
    if (body.subarray(valueEnd - 2, valueEnd).equals(Buffer.from('\r\n'))) valueEnd -= 2;
    const value = body.subarray(headerEnd + 4, valueEnd);
    const disposition = /content-disposition:\s*form-data;([^\r\n]+)/i.exec(headerText)?.[1] ?? '';
    const name = /(?:^|;)\s*name="([^"]*)"/i.exec(disposition)?.[1];
    const originalName = /(?:^|;)\s*filename="([^"]*)"/i.exec(disposition)?.[1];

    if (originalName !== undefined) {
      if (upload) throw new AppError('Upload one file per request', 400, 'TOO_MANY_FILES');
      const declaredType = /content-type:\s*([^\r\n]+)/i.exec(headerText)?.[1]?.trim().toLowerCase() ?? 'application/octet-stream';
      upload = { file: value, contentType: declaredType, originalName: safeOriginalName(originalName) };
    } else if (name === 'purpose') {
      purpose = value.toString('utf8').trim().slice(0, 80) || undefined;
    }

    cursor = nextBoundary;
  }

  if (!upload) throw new AppError('A file field is required', 400, 'FILE_REQUIRED');
  upload.purpose = purpose;
  return upload;
}

const svgIsSafe = (file: Buffer) => {
  const text = file.toString('utf8');
  return /^(?:<\?xml[^>]*>\s*)?<svg\b/i.test(text.trim()) &&
    !/(?:<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|<iframe\b|<style\b[^>]*>[\s\S]*?@import|\burl\s*\(|\bon[a-z]+\s*=|javascript\s*:|data\s*:\s*text\/html|(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/|data:))/i.test(text);
};

const detectFormat = (file: Buffer, declaredType: string) => {
  if (file.length >= 3 && file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff) return { mimeType: 'image/jpeg', extension: 'jpg' };
  if (file.length >= 8 && file.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { mimeType: 'image/png', extension: 'png' };
  if (file.length >= 12 && file.toString('ascii', 0, 4) === 'RIFF' && file.toString('ascii', 8, 12) === 'WEBP') return { mimeType: 'image/webp', extension: 'webp' };
  if (file.length >= 5 && file.toString('ascii', 0, 5) === '%PDF-') return { mimeType: 'application/pdf', extension: 'pdf' };
  if (declaredType === 'image/svg+xml' && svgIsSafe(file)) return { mimeType: 'image/svg+xml', extension: 'svg' };
  return undefined;
};

export async function storeUpload(upload: ParsedUpload): Promise<StoredUpload> {
  if (upload.file.length === 0) throw new AppError('The uploaded file is empty', 400, 'EMPTY_FILE');
  if (upload.file.length > uploadMaxBytes) throw new AppError('Files must be 10 MB or smaller', 413, 'UPLOAD_TOO_LARGE');

  const format = detectFormat(upload.file, upload.contentType);
    if (!format) {
      const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
      if (supportedTypes.includes(upload.contentType)) throw new AppError('The file contents do not match the declared media type', 400, 'INVALID_FILE_SIGNATURE');
      throw new AppError('Only JPEG, PNG, WebP, SVG, or PDF files are allowed', 415, 'UNSUPPORTED_MEDIA_TYPE');
    }
  if (format.mimeType !== upload.contentType && !(format.mimeType === 'image/jpeg' && upload.contentType === 'image/jpg')) {
    throw new AppError('The file contents do not match the declared media type', 400, 'INVALID_FILE_SIGNATURE');
  }

  const filename = `${randomUUID()}.${format.extension}`;
  await mkdir(projectUploadsDirectory, { recursive: true });
  await writeFile(join(projectUploadsDirectory, filename), upload.file, { flag: 'wx', mode: 0o644 });

  return {
    filename,
    originalName: safeOriginalName(upload.originalName),
    mimeType: format.mimeType,
    size: upload.file.length,
    url: `/uploads/${filename}`,
    purpose: upload.purpose
  };
}
