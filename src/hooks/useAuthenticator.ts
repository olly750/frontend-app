import { AxiosError } from 'axios';
import { FormEvent, useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import UserContext from '../context/UserContext';
import { queryClient } from '../plugins/react-query';
import { authenticatorStore } from '../store/administration';
import { LoginInfo, Response } from '../types';
import cookie from '../utils/cookie';
import { removeLocalStorageData } from '../utils/getLocalStorageItem';

let created = false;

export default function useAuthenticator() {
  const { user, setUser } = useContext(UserContext);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [_isError, setIsError] = useState(false);
  const [_error, setError] = useState<AxiosError<Response>>();
  const [userAvailabe, setUserAvailable] = useState(false);
  const { refetch } = authenticatorStore.authUser(false);
  const { mutateAsync } = authenticatorStore.login();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const history = useHistory();

  const fetchData = async () => {
    setIsUserLoading(true);
    const { data, isSuccess, isError, error } = await refetch();

    if (isSuccess && data?.data.data.id != user?.id) {
      setUser((_old) => {
        return data?.data.data;
      });
      setUserAvailable(true);
    }

    if (error) setError(error as AxiosError);

    setIsError(isError);
    setIsUserLoading(false);
  };

  useEffect(() => {
    if (!created) {
      fetchData();
      created = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login<T>(e: FormEvent<T>, details: LoginInfo) {
    e.preventDefault();

    setIsLoggingIn(true);
    const toastId = toast.loading('Authenticating...');
    await mutateAsync(details, {
      async onSuccess(data) {
        cookie.setCookie('jwt_info', JSON.stringify(data?.data.data));
        setIsLoggingIn(false);
        await fetchData();
        toast.success(data.data.message, { duration: 1200, id: toastId });
        redirectTo('/redirecting');
      },
      onError(__error) {
        setIsLoggingIn(false);
        toast.error('Authentication failed', { duration: 3000, id: toastId });
      },
    });
  }

  function logout() {
    setUser(undefined);
    setUserAvailable(false);
    removeLocalStorageData('studentInfo');
    removeLocalStorageData('instructorInfo');
    queryClient.clear();
    cookie.eraseCookie('jwt_info');
    cookie.eraseCookie('user_role');
  }

  const redirectTo = (path: string) => {
    history.push(path);
  };

  return {
    user,
    userLoading: isUserLoading,
    userAvailabe,
    isLoggingIn,
    login,
    logout,
    isError: _isError,
    error: _error,
  };
}
