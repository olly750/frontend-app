import React, { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../../../../hooks/useAuthenticator';
import { authenticatorStore } from '../../../../../../store/administration';
import { ChangePassword, FormPropType, ValueType } from '../../../../../../types';
import { changePasswordSchema } from '../../../../../../validations/user.validation';
import Button from '../../../../../Atoms/custom/Button';
import PasswordField from '../../../../../Atoms/Input/PasswordInput';

export default function UpdatePassword({ onSubmit }: FormPropType) {
  const { user } = useAuthenticator();

  const [form, setForm] = useState<ChangePassword>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const initialErrorState: ChangePassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  const [errors, setErrors] = useState<ChangePassword>(initialErrorState);

  const { mutateAsync, isLoading } = authenticatorStore.passwordChange();
  const history = useHistory();

  useEffect(() => {
    setForm((form) => ({
      ...form,
      institution_id: user?.institution_id || 'b832407f-fb77-4a75-8679-73bf7794f207',
      current_admin_id: user?.id + '',
    }));
  }, [user]);

  function handleChange({ name, value }: ValueType) {
    setForm((old) => ({ ...old, [name]: value }));
  }
  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();

    const validatedForm = changePasswordSchema.validate(form, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        if (form.confirmPassword !== form.newPassword) {
          toast.error('Passwords do not match');
        } else {
          mutateAsync(form, {
            onSuccess: () => {
              toast.success('Password updated');
              history.goBack();
            },
            onError: (error: any) => {
              toast.error(error.response.data.message);
            },
          });
          if (onSubmit) onSubmit(e);
        }
      })
      .catch((err) => {
        const validatedErr: ChangePassword = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ChangePassword] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      <PasswordField
        required={false}
        error={errors.currentPassword}
        name="currentPassword"
        placeholder="current password"
        type="password"
        value={form.currentPassword}
        handleChange={handleChange}>
        Current Password
      </PasswordField>
      <PasswordField
        required={false}
        error={errors.newPassword}
        name="newPassword"
        placeholder="New password"
        type="password"
        value={form.newPassword}
        handleChange={handleChange}>
        New Password
      </PasswordField>
      <PasswordField
        required={false}
        error={errors.confirmPassword}
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        value={form.confirmPassword}
        handleChange={handleChange}>
        Confirm Password
      </PasswordField>
      <div>
        <Button type="submit" isLoading={isLoading} full>
          Save
        </Button>
      </div>
    </form>
  );
}
