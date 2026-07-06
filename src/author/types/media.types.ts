export interface MediaAsset {
  id: string;
  authorId: string;
  filename: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  bucket: string;
  uploadedAt: string;
}

export interface UploadMediaInput {
  authorId: string;
  filename: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  bucket?: string;
}
