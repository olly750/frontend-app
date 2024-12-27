import axios from 'axios';

import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function getImages(id: string) {
  const response = await axios({
    method: 'get',
    url: `${ADMIN_BASE_URL}/gallery/galleryByIntakeProgram${id}`,
    headers: { Authorization: `Bearer ${tok.token}` },
  });
  console.log(id);

  return response.data;
}

export default getImages;
