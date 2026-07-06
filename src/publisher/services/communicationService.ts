import {
  getJobComments,
  addJobComment,
  getJobAttachments,
  addJobAttachment,
  getProductionUpdates,
  addProductionUpdate,
} from '../stores/communicationStore';
import type { JobComment, JobAttachment, ProductionUpdate } from '../types/communication.types';

export class CommunicationService {
  getComments(publisherId: string, jobId?: string): JobComment[] {
    return getJobComments(publisherId, jobId);
  }

  addComment(
    publisherId: string,
    jobId: string,
    content: string,
    isInternal = false
  ): JobComment {
    return addJobComment(publisherId, jobId, content, isInternal);
  }

  getAttachments(publisherId: string, jobId: string): JobAttachment[] {
    return getJobAttachments(publisherId, jobId);
  }

  addAttachment(publisherId: string, jobId: string, filename: string): JobAttachment {
    return addJobAttachment(publisherId, jobId, filename);
  }

  getUpdates(publisherId: string, jobId?: string): ProductionUpdate[] {
    return getProductionUpdates(publisherId, jobId);
  }

  postUpdate(publisherId: string, jobId: string, message: string): ProductionUpdate {
    return addProductionUpdate(publisherId, jobId, message);
  }
}

export function createCommunicationService(): CommunicationService {
  return new CommunicationService();
}
