import './input.scss';

import React, { useEffect, useState } from 'react';

import { colorStyle } from '../../../global/global-vars';
import { InputMarksProps } from '../../../types';

export default function InputMarks<T>({
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
  totalMarks,
  pcolor = 'txt-secondary',
  width,
  handleChange = () => {},
  ...attrs
}: InputMarksProps<T>) {
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
    <div
      className={`${
        readonly ? 'bg-gray-100' : 'bg-transparent'
      }  ${padding}  rounded-md w-[10rem] flex text-txt-secondary`}>
      <input
        {...attrs}
        placeholder={placeholder}
        name={name}
        type={type}
        value={_value}
        spellCheck="false"
        readOnly={readonly}
        required={required}
        min={min}
        max={max}
        className={`outline-none focus:outline-none h-[2rem]  h-full w-fit text-right border-b-2 text-base placeholder-${pcolor}`}
        autoComplete="off"
        onChange={handleOnChange}
      />
      <span className="pl-1 pt-1"> / {totalMarks} marks</span>
    </div>
  );
}
