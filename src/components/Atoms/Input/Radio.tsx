import React, { useEffect, useState } from 'react';

import { CommonInputProps } from '../../../types';

interface PropType<T> extends CommonInputProps<T> {
  type?: 'inline' | 'block';
}

/**
 * Radio button that will be taking list of options to be used
 * list should contain array of object that has {label:'',value:''}, the value will be used as unique identifier
 * while lable will be displayed on the UI
 */
export default function Radio<T>({
  value = '',
  options,
  type = 'inline',
  name,
  handleChange,
  ...attrs
}: PropType<T>) {
  const [active, setActive] = useState('');

  useEffect(() => setActive(value.toString()), [value]);

  function handleClick(value: string, e: any) {
    setActive(value);
    handleChange({ value, name, event: e });
  }

  function handleKeyPress(value: string, e: any) {
    setActive(value);
    handleChange({ value, name, event: e });
  }

  return (
    <div
      className={`flex ${type === 'block' && 'flex-col'}`}
      role="radiogroup"
      {...attrs}>
      {/* options */}
      {options?.map(({ label, value, subLabel }) => (
        <div
          role="radio"
          tabIndex={0}
          key={value}
          aria-checked={active === value}
          aria-labelledby={label}
          className={`flex cursor-pointer items-center ${
            type === 'block' ? 'w-48 rounded-lg py-2 px-2 my-1' : 'mr-4'
          }`}
          // @ts-ignore
          onClick={(e) => handleClick(value, e)}
          // @ts-ignore
          onKeyPress={(e) => handleKeyPress(value, e)}>
          {/* span */}
          <span
            className={`mx-2 w-5 h-5 rounded-full border-solid 
            ${
              active === value
                ? 'border-6 border-primary-500'
                : 'border-4 border-tertiary'
            }`}></span>
          {!subLabel ? (
            <span>{label}</span>
          ) : (
            <span className="block">
              <span className="font-semibold inline-block text-sm"> {label} </span>
              <span className="text-txt-secondary text-sm inline-block">{subLabel}</span>
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
