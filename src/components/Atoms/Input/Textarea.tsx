import './input.scss';

import React, { useEffect, useState } from 'react';

import { colorStyle } from '../../../global/global-vars';
import { Color, CommonInputProps, ValueType } from '../../../types';

export interface IProps<T> extends CommonInputProps<T> {
  placeholder?: string;
  type?: string;
  readonly?: boolean;
  handleChange: (_e: ValueType) => void;
  value: string | undefined;
  className?: string;
  name: string;
  full?: boolean;
  fcolor?: Color;
  bcolor?: Color;
  pcolor?: Color;
  width?: string | number;
}

export default function Textarea<T>({
  placeholder = '',
  readonly = false,
  value,
  name,
  className = '',
  full,
  fcolor = 'primary',
  bcolor = 'tertiary',
  pcolor = 'txt-secondary',
  width = '80',
  handleChange,
  ...attrs
}: IProps<T>) {
  const [_value, setValue] = useState('');

  useEffect(() => {
    setValue(value || '');
  }, [value]);

  function handleOnChange(e: any) {
    setValue(e.target.value);
    handleChange({ name, value: e.target.value, event: e });
  }
  return (
    <textarea
      {...attrs}
      placeholder={placeholder}
      name={name}
      value={_value}
      readOnly={readonly}
      className={`bg-transparent h-16 px-3 pt-4 placeholder-${pcolor} rounded-md ${
        full ? 'w-full' : `w-${width}`
      } focus:outline-none border-${bcolor} focus:border-${
        colorStyle[fcolor]
      } border-2 ${className}`}
      /* @ts-ignore */
      onChange={handleOnChange}
    />
  );
}
