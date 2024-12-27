import axios from 'axios';

import { ADMIN_BASE_URL2 } from '../../plugins/axios';
// import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function UpdateFolder(name: any, folderID: any) {
  const response = await axios({
    method: 'put',
    url: `${ADMIN_BASE_URL2}/folder/updateFolder/${folderID}?folderName=${name}`,
    headers: { Authorization: `Bearer ${tok.token}`, AccessControlAllowOrigin: '*' },
    data: { folderId: folderID, folderName: name },
  });

  return response.data;
}
export default UpdateFolder;
