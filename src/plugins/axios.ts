import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

import { LoginRes, Response } from '../types';
import cookie from '../utils/cookie';

const openRequests: string[] = ['/authentication/signin'];

const commonConfig: AxiosRequestConfig = {};

export const ADMIN_BASE_URL = `${
  import.meta.env.VITE_API_URL
}/administration-service/api`;

export const ADMIN_BASE_URL2 = `${
  import.meta.env.VITE_API_URL
}/administration-service/Api`;

export const EVAL_BASE_URL = `${import.meta.env.VITE_EVALUATION_API_URL}/evaluation-service/api`;
export const TIMETABLE_BASE_URL = `${import.meta.env.VITE_TIMETABLE_API_URL}/timetable-service/api`;

const administrationModuleConfig: AxiosRequestConfig = {
  ...commonConfig,
  baseURL: ADMIN_BASE_URL,
};

const evalutationModuleConfig: AxiosRequestConfig = {
  ...commonConfig,
  baseURL: EVAL_BASE_URL,
};

const timetableModuleConfig: AxiosRequestConfig = {
  ...commonConfig,
  baseURL: TIMETABLE_BASE_URL,
};

const adminstrationAxios = axios.create(administrationModuleConfig);
const evaluationAxios = axios.create(evalutationModuleConfig);
const timetableAxios = axios.create(timetableModuleConfig);

const authIgnore: string[] = ['/', '/complete-profile'];

const interceptAdminReq = (config: AxiosRequestConfig) => {
  const token = cookie.getCookie('jwt_info');

  // when request is open no need to add bearer token
  if (!openRequests.find((link) => link === config.url)) {
    if (token) {
      const jwtInfo: LoginRes = JSON.parse(token);
      // @ts-ignore
      config.headers['Authorization'] = `Bearer ${jwtInfo.token}`;
    }
  }
  return config;
};

const interceptAdminResError = (error: Error | AxiosError<AxiosResponse<Response>>) => {
  if (axios.isAxiosError(error)) {
    const e = error?.response;

    if (
      e?.status === 401 &&
      !authIgnore.includes(window.location.pathname) &&
      window.location.pathname !== '/login'
    ) {
      window.location.href = '/login';
    }

    if (import.meta.env.DEV) {
      // if (e?.status === 400) toast.error(`Bad Request on, ${e.config.url}`);
      // else toast.error((e?.data.message || e?.data?.data?.error) + '');
    }

    // unauthorized
    throw error;
  } else {
    console.log(error);
    return error;
  }
};

adminstrationAxios.interceptors.request.use(interceptAdminReq);
adminstrationAxios.interceptors.response.use((config) => config, interceptAdminResError);

evaluationAxios.interceptors.request.use(interceptAdminReq);
evaluationAxios.interceptors.response.use((config) => config, interceptAdminResError);

timetableAxios.interceptors.request.use(interceptAdminReq);
timetableAxios.interceptors.response.use((config) => config, interceptAdminResError);

export { adminstrationAxios, evaluationAxios, timetableAxios };
