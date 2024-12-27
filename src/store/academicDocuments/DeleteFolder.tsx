import axios from 'axios';

import { ADMIN_BASE_URL2 } from '../../plugins/axios';
// import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function DeleteFolder(academicId: any) {
  const response = await axios({
    method: 'delete',
    url: `${ADMIN_BASE_URL2}/folder/DeleteAcademicFolder/${academicId}`,
    headers: { Authorization: `Bearer ${tok.token}`, AccessControlAllowOrigin: '*' },
  });
  //   console.log(response);

  return response;
}
export default DeleteFolder;
