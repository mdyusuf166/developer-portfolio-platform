import { basename } from 'node:path';

import { AppError } from '../errors/AppError.js';

export const uploadMaxBytes = 10 * 1024 * 1024;

export type UploadMetadata = {
  originalName: string;
  contentType: string;
  size: number;
  purpose?: string;
};

const safeOriginalName = (name: string) => {
  const base = basename(name.replaceAll('\\', '/'))
    .replace(/[^A-Za-z0-9._ -]/g, '_')
    .trim()
    .slice(0, 160);
  return base || 'upload';
};

export const normalizeUploadMetadata = (input: UploadMetadata): UploadMetadata => ({
  originalName: safeOriginalName(input.originalName),
  contentType: input.contentType.trim().toLowerCase(),
  size: input.size,
  purpose: input.purpose?.trim().slice(0, 80) || undefined
});

const svgIsSafe = (file: Buffer) => {
  const text = file.toString('utf8');
  return /^(?:<\?xml[^>]*>\s*)?<svg\b/i.test(text.trim()) &&
    !/(?:<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|<iframe\b|<style\b[^>]*>[\s\S]*?@import|\burl\s*\(|\bon[a-z]+\s*=|javascript\s*:|data\s*:\s*text\/html|(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/|data:))/i.test(text);
};

const detectFormat = (file: Buffer, declaredType: string) => {
  if (file.length >= 3 && file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff) return 'image/jpeg';
  if (file.length >= 8 && file.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (file.length >= 12 && file.toString('ascii', 0, 4) === 'RIFF' && file.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  if (file.length >= 5 && file.toString('ascii', 0, 5) === '%PDF-') return 'application/pdf';
  if (declaredType === 'image/svg+xml' && svgIsSafe(file)) return 'image/svg+xml';
  return undefined;
};

export function validateStoredUpload(file: Buffer, declaredType: string) {
  if (file.length === 0) throw new AppError('The uploaded file is empty', 400, 'EMPTY_FILE');
  if (file.length > uploadMaxBytes) throw new AppError('Files must be 10 MiB or smaller', 413, 'UPLOAD_TOO_LARGE');

  const contentType = declaredType.trim().toLowerCase();
  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf'];
  const detectedType = detectFormat(file, contentType);
  if (!detectedType) {
    if (supportedTypes.includes(contentType)) throw new AppError('The file contents do not match the declared media type', 400, 'INVALID_FILE_SIGNATURE');
    throw new AppError('Only JPEG, PNG, WebP, SVG, or PDF files are allowed', 415, 'UNSUPPORTED_MEDIA_TYPE');
  }
  if (detectedType !== contentType && !(detectedType === 'image/jpeg' && contentType === 'image/jpg')) {
    throw new AppError('The file contents do not match the declared media type', 400, 'INVALID_FILE_SIGNATURE');
  }
  return { mimeType: detectedType, size: file.length };
}
