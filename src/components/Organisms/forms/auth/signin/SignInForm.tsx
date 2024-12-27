import React, { FormEvent, useState } from 'react';
import { useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';

import useAuthenticator from '../../../../../hooks/useAuthenticator';
import { ValueType } from '../../../../../types';
import { LoginInfo } from '../../../../../types';
import { loginSchema } from '../../../../../validations/user.validation';
import Button from '../../../../Atoms/custom/Button';
import PasswordInput from '../../../../Atoms/Input/PasswordInput';
import Heading from '../../../../Atoms/Text/Heading';
import InputMolecule from '../../../../Molecules/input/InputMolecule';

const SignInForm = () => {
  const { login, isLoggingIn, logout } = useAuthenticator();
  const { url } = useRouteMatch();

  const [details, setDetails] = useState<LoginInfo>({
    username: '',
    password: '',
  });

  const initialErrorState: LoginInfo = {
    username: '',
    password: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const handleChange = (e: ValueType) => {
    setDetails((details) => ({
      ...details,
      [e.name]: e.value,
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(logout, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = loginSchema.validate(details, {
      abortEarly: false,
    });

    validatedForm
      .then(() => login(e, details))
      .catch((err) => {
        const validatedErr: LoginInfo = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof LoginInfo] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  return (
    <>
      <div className="py-11">
        <Heading
          fontSize="lg"
          className="md:text-2xl"
          fontWeight="semibold"
          color="primary">
          Sign In
        </Heading>
        <p className="text-txt-secondary text-sm md:text-base pt-2">
          Enter your credentials to continue
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <InputMolecule
            required={false}
            error={errors.username}
            onCopy={(e: any) => {
              e.preventDefault();
              return false;
            }}
            name="username"
            placeholder="Enter your username"
            value={details.username}
            handleChange={handleChange}>
            Username
          </InputMolecule>
          <PasswordInput
            required={false}
            // error={errors.password}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={details.password}
            handleChange={handleChange}>
            Password
          </PasswordInput>
        </div>
        <div className="flex justify-end w-80">
          <Link to={`${url}/forgot-pass`}>
            <span className="text-sm text-primary-500">Forgot password?</span>
          </Link>
        </div>

        <Button isLoading={isLoggingIn} type="submit">
          Sign In
        </Button>
      </form>

      <div className="text-txt-secondary py-2">
        <p className="text-sm text-txt-secondary">
          Not sure you&apos;re registered?
          <span className="text-primary-500 font-bold px-2">
            <Link to={`${url}/search`}>Find out</Link>
          </span>
        </p>
      </div>
    </>
  );
};

export default SignInForm;
