import axios from 'axios';

import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function deleteImage(id: any) {
  const response = await axios({
    method: 'delete',
    url: `${ADMIN_BASE_URL}/gallery/deleteGallery/${id}`,
    headers: { Authorization: `Bearer ${tok.token}` },
  });
  return response.data;
}

export default deleteImage;
