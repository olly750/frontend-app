import './input.scss';

import React, { useEffect, useState } from 'react';

import { colorStyle } from '../../../global/global-vars';
import { InputProps } from '../../../types';
import Button from '../custom/Button';
import Icon from '../custom/Icon';
import Error from '../Text/Error';
import ILabel from '../Text/ILabel';

interface IInputMolecule<T> extends InputProps<T> {
  error?: string;
}

export default function PasswordField<T>({
  placeholder = '',
  padding = 'pl-4',
  readonly = false,
  required = true,
  value = '',
  name,
  min = 0,
  max,
  full,
  bcolor = 'tertiary',
  pcolor = 'txt-secondary',
  handleChange = () => {},
  className = '',
  children,
  error = '',
  width = '80',
  ...attrs
}: IInputMolecule<T>) {
  const [_value, setValue] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => setValue(value?.toString()), [value]);

  function handleOnChange(e: any) {
    setValue(e.target.value);
    if (handleChange && _value !== e.target.value)
      handleChange({ name, value: e.target.value, event: e });
  }
  useEffect(() => {
    if (handleChange && _value !== value) handleChange({ name, value });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, value]);

  return (
    <div className="flex flex-col gap-2 pb-3">
      {children && (
        <ILabel className="capitalize w-full" size="sm" weight="medium">
          {children}
        </ILabel>
      )}
      <div
        className={`flex items-center rounded-md ${
          full ? 'w-full' : `w-full md:w-${width}`
        } ${
          isFocused
            ? 'border-primary-500'
            : error
            ? 'border-error-500'
            : `border-${colorStyle[bcolor]}`
        }   border-2`}>
        <input
          placeholder={placeholder}
          {...attrs}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={_value}
          spellCheck="true"
          readOnly={readonly}
          required={required}
          min={min}
          max={max}
          autoComplete="off"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`h-12 w-full ${padding} rounded-l-md focus:outline-none placeholder:text-sm placeholder-${pcolor} ${className}`}
          onChange={handleOnChange}
        />
        <Button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          icon
          styleType="text">
          <Icon name={showPassword ? 'eye-closed' : 'eye-open'} />
        </Button>
      </div>

      <Error>{error && error}</Error>
    </div>
  );
}
