import axios from 'axios';

import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function GetFolderDocs(folderId: any) {
  const response = await axios({
    method: 'get',
    url: `${ADMIN_BASE_URL}/attachments/getAttachmentByAcademicFolder/${folderId}`,
    headers: { Authorization: `Bearer ${tok.token}`, AccessControlAllowOrigin: '*' },
  });
  return response.data.data;
}
export default GetFolderDocs;
