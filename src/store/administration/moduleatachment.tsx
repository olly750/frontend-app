import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
let urls = '';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);

async function fetchDoc(OgFilename: any, id: any) {
  const response = await fetch(
    // `${ADMIN_BASE_URL}/attachments/downloadByFilename/${filename}`,
    `${ADMIN_BASE_URL}/attachments/downloadByFilename/${OgFilename}`,
    {
      method: 'get',
      headers: { Authorization: `Bearer ${tok.token}` },
    },
  );
  // console.log(response);
 
  const blob = await response.blob();
  urls = window.URL.createObjectURL(new Blob([blob])); 
  return { src: urls, OgFilename, id };
}
export default fetchDoc;
