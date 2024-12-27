import { ADMIN_BASE_URL } from '../../plugins/axios';
import cookie from '../../utils/cookie';
const downloadPath = '/gallery/download/galleryByFilename/';
let urls = '';
const token = cookie.getCookie('jwt_info');
let tok = JSON.parse(token!);
async function fetchImages(filename: any, id: any) {

  const response = await fetch(`${ADMIN_BASE_URL}${downloadPath}${filename}`, {
    method: 'get',
    headers: { Authorization: `Bearer ${tok.token}` },
  });
  // console.log(response);

  //  console.log("response",response);
  const blob = await response.blob();
  console.log("image blob",response)
  urls = window.URL.createObjectURL(new Blob([blob]));
  console.log("image urls",urls);
  return { src: urls, filename, id };
}
export default fetchImages;
