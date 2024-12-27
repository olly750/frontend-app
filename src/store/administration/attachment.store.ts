import { useMutation, useQuery } from 'react-query';

import { attachmentService } from '../../services/administration/attachment.service';

class AttachmentStore {
  addAttachment() {
    return useMutation(attachmentService.addAttachment);
  }
  getAttachementFile(fileName: string) {
    return useQuery(['attachement/fileName', fileName], () =>
      attachmentService.getAttachementFile(fileName),
    );
  }
  getAttachementById(id: string) {
    return useQuery(['attachment/id', id], () =>
      attachmentService.getAttachementById(id),
    );
  }
  deleteAttachmentById() {
    return useMutation(attachmentService.deleteAttachementById);
  }
}

export const attachementStore = new AttachmentStore();
