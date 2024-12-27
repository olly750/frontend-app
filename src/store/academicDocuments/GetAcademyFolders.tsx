import axios from 'axios';

import { ADMIN_BASE_URL2 } from '../../plugins/axios';
// import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function GetAcademyFolders(academicId: any) {
  const response = await axios({
    method: 'get',
    url: `${ADMIN_BASE_URL2}/folder/getAll/${academicId}`,
    headers: { Authorization: `Bearer ${tok.token}`, AccessControlAllowOrigin: '*' },
  });
  return response.data?.data;
}
export default GetAcademyFolders;
