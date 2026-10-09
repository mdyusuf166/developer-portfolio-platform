import { AppError } from '../errors/AppError.js';

export type UploadAuthorizationRequest = {
  objectKey: string;
  contentType: string;
  maximumBytes: number;
  expiresAt: Date;
  writeOnce: true;
};

export type UploadAuthorization = {
  url: string;
  method: 'PUT';
  headers: Record<string, string>;
  expiresAt: string;
};

export type StoredObject = {
  objectKey: string;
  contentType: string;
  bytes: Buffer;
};

export type ReadAuthorizationRequest = {
  objectKey: string;
  expiresAt: Date;
  responseHeaders: Record<string, string>;
};

export interface UploadStorage {
  authorizeUpload(input: UploadAuthorizationRequest): Promise<UploadAuthorization>;
  /** Implementations must stop reading at maximumBytes + 1 and never buffer an unbounded object. */
  inspectObject(objectKey: string, maximumBytes: number): Promise<StoredObject | null>;
  /** The signed response must enforce these headers, including nosniff and SVG CSP where applicable. */
  authorizeRead(input: ReadAuthorizationRequest): Promise<string>;
  deleteObject(objectKey: string): Promise<void>;
}

const storageUnavailable = async (): Promise<never> => {
  throw new AppError('Durable upload storage is not configured', 503, 'UPLOAD_STORAGE_UNAVAILABLE');
};

// Production remains fail-closed until an approved provider adapter is supplied.
export const unavailableUploadStorage: UploadStorage = {
  authorizeUpload: storageUnavailable,
  inspectObject: storageUnavailable,
  authorizeRead: storageUnavailable,
  deleteObject: storageUnavailable
};
