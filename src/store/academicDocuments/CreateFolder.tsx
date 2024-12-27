import axios from 'axios';

import { ADMIN_BASE_URL2 } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function CreateFolderStructure(name: any, academicId: any) {
  const response = await axios({
    method: 'post',
    url: `${ADMIN_BASE_URL2}/folder/createFolder/${academicId}`,
    headers: { Authorization: `Bearer ${tok.token}`, AccessControlAllowOrigin: '*' },
    data: { folder_name: name, academy_id: academicId },
  });
  console.log('hello');

  return response.data;
}
export default CreateFolderStructure;
