import axios from 'axios';

import { ADMIN_BASE_URL } from '../plugins/axios';
// import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function UpdateAlias(id: any, data: any) {
  const response = await axios({
    method: 'put',
    url: `${ADMIN_BASE_URL}/users/addOtherNamesByPersonId/${id}?aFName=${data.aFName}&aLName=${data.aLName}`,
    headers: { Authorization: `Bearer ${tok.token}`, AccessControlAllowOrigin: '*' },
    data: { aFName: data.aFName, aLName: data.aFName, personId: id },
  });

  return response;
}
export default UpdateAlias;
