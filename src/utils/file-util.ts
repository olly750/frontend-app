import { useState } from 'react';

import { ADMIN_BASE_URL,EVAL_BASE_URL } from '../plugins/axios';
import { LoginRes } from '../types';
import cookie from './cookie';

type attachmentType = 'profile' | 'logos';

const imageCache: Record<string, { attachmentId: string; image: string }> = {};

export async function getImage(attachmentId: string, key: string, type: attachmentType) {
  if (key in imageCache) return Promise.resolve(imageCache[key].image);

  return await fetchAndCache(attachmentId, key, type);
}

export async function invalidateCacheImage(attachmentId: string, key: string) {
  return await fetchAndCache(attachmentId, key, 'profile');
}

async function fetchAndCache(attachmentId: string, key: string, type: attachmentType) {
  if (!attachmentId) return;

  const token = cookie.getCookie('jwt_info');
  // when request is open no need to add bearer token

  // eslint-disable-next-line no-undef
  const headers: HeadersInit = {};

  if (token) {
    const jwtInfo: LoginRes = JSON.parse(token);
    headers['Authorization'] = `Bearer ${jwtInfo.token}`;
  }
  const res = await fetch(
    `${ADMIN_BASE_URL}/attachments/download/${type}/${attachmentId}`,
    {
      headers,
    },
  );

  const blob = await res.blob();

  const image = URL.createObjectURL(blob);
  imageCache[key] = { attachmentId, image };

  return image;
}

export const fileToBlob = async (file: File) =>
  new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type });

export function usePicture(
  attachmentId?: string,
  uniqueId?: string | number,
  defaultImage = '/images/default-pic.png',
  type: attachmentType = 'profile',
) {
  const [picture, setPicture] = useState(defaultImage);

  if (attachmentId && uniqueId) {
    getImage(attachmentId, uniqueId.toString(), type)
      .then((fileName) => setPicture(fileName || defaultImage))
      .catch((e) => console.error(e));
  }
  // console.log(picture);

  return picture;
}



export const downloadAttachment = async (
  filename: string,
  downloadPath = '/attachments/download/',
) => {
  // let appsType = ['doc', 'xlsx', 'pptx', 'pdf', 'docx'];
  // eslint-disable-next-line no-undef
  const headers: HeadersInit = {};
  const token = cookie.getCookie('jwt_info');
  // const content_type = appsType.includes(file_type)
  //   ? `application/${file_type}`
  //   : `image/${file_type}`;

  if (token) {
    const jwtInfo: LoginRes = JSON.parse(token);
    headers['Authorization'] = `Bearer ${jwtInfo.token}`;
  }

  let url = '';

  if (filename) {
    const res = await fetch(`${ADMIN_BASE_URL}${downloadPath}${filename}`, {
      headers,
    });
    // console.log(res);
    const blob = await res.blob();

    // const file = URL.createObjectURL(blob);

    url = window.URL.createObjectURL(new Blob([blob]));
  }

  return url;
};

export const downloadEvaluationAttachment = async (
  filename: string,
  downloadPath = '/attachments/load/',
) => {
  // let appsType = ['doc', 'xlsx', 'pptx', 'pdf', 'docx'];
  // eslint-disable-next-line no-undef
  const headers: HeadersInit = {};
  const token = cookie.getCookie('jwt_info');
  // const content_type = appsType.includes(file_type)
  //   ? `application/${file_type}`
  //   : `image/${file_type}`;

  if (token) {
    const jwtInfo: LoginRes = JSON.parse(token);
    headers['Authorization'] = `Bearer ${jwtInfo.token}`;
  }

  let url = '';

  if (filename) {
    const res = await fetch(`${EVAL_BASE_URL}${downloadPath}${filename}`, {
      headers,
    });
    // console.log(res);
    const blob = await res.blob();

    // const file = URL.createObjectURL(blob);

    url = window.URL.createObjectURL(new Blob([blob]));
  }

  return url;
};

export function removeIdFromFileName(fileName: string) {
  const indexOfDelimiter = fileName.lastIndexOf('-');
  const indexOfDelimiterOfExtension = fileName.lastIndexOf('.');

  return (
    fileName.split('').slice(0, indexOfDelimiter).join('') +
    fileName.slice(indexOfDelimiterOfExtension)
  );
}

export const downloadAttachmentByName = async (filename: any) => {
  let url = '';
  const token = cookie.getCookie('jwt_info');
  let tok = JSON.parse(token!);
  const response = await fetch(
    `${ADMIN_BASE_URL}/attachments/downloadByFilename/${filename}`,
    {
      method: 'get',
      headers: { Authorization: `Bearer ${tok.token}` },
    },
  );
  console.log(response);

  const blob = await response.blob();
  url = window.URL.createObjectURL(new Blob([blob]));
  // console.log(url);

  return { url, status: response.status };
};

export const DeleteAttachmentById = async (id: any) => {
  // let url = '';
  const token = cookie.getCookie('jwt_info');
  let tok = JSON.parse(token!);
  const response = await fetch(`${ADMIN_BASE_URL}/attachments/deleteAttachment/${id}`, {
    method: 'delete',
    headers: { Authorization: `Bearer ${tok.token}` },
  });
  // console.log(response);

  return response;
};
