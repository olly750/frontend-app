import './input.scss';

import React, { useEffect, useState } from 'react';

import { colorStyle } from '../../../global/global-vars';
import { InputProps } from '../../../types';

export default function Input<T>({
  placeholder = '',
  padding = 'px-4',
  type,
  readonly = false,
  required = true,
  value = '',
  name,
  min = 0,
  max,
  full,
  fcolor = 'primary',
  bcolor = 'tertiary',
  pcolor = 'txt-secondary',
  width,
  handleChange = () => {},
  className = '',
  ...attrs
}: InputProps<T>) {
  const [_value, setValue] = useState<string>('');

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
    <input
      {...attrs}
      placeholder={placeholder}
      name={name}
      type={type}
      value={_value}
      spellCheck="true"
      readOnly={readonly}
      required={required}
      min={min}
      max={max}
      autoComplete="off"
      className={`${
        readonly ? 'bg-gray-100' : 'bg-transparent'
      } h-12 ${padding} placeholder:text-sm placeholder-${pcolor} rounded-md ${
        full ? 'w-full' : `w-full md:w-${width}`
      } focus:outline-none border-${colorStyle[bcolor]} focus:border-${
        colorStyle[fcolor]
      } border-2 ${className}`}
      onChange={handleOnChange}
    />
  );
}
