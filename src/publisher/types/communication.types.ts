export interface JobComment {
  id: string;
  jobId: string;
  publisherId: string;
  author: string;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

export interface JobAttachment {
  id: string;
  jobId: string;
  publisherId: string;
  filename: string;
  storagePath: string;
  uploadedAt: string;
}

export interface ProductionUpdate {
  id: string;
  jobId: string;
  publisherId: string;
  message: string;
  createdAt: string;
}
