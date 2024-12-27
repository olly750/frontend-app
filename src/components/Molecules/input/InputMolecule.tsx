import React from 'react';

import { InputProps } from '../../../types';
import Input from '../../Atoms/Input/Input';
import Error from '../../Atoms/Text/Error';
import ILabel from '../../Atoms/Text/ILabel';

interface IInputMolecule<T> extends InputProps<T> {
  error?: string;
}

export default function InputMolecule<T>({
  name,
  value,
  handleChange = () => {},
  children,
  min = 0,
  max,
  error = '',
  placeholder = '',
  type = 'text',
  width = '80',
  readOnly = false,
  className = '',
  required = true,
  defaultValue,
  ...attrs
}: IInputMolecule<T>) {
  return (
    <div className="flex flex-col gap-2 pb-3">
      {children && (
        <ILabel className="capitalize w-full" size="sm" weight="medium">
          {children}
        </ILabel>
      )}

      <Input
        defaultValue={defaultValue}
        {...attrs}
        readonly={readOnly}
        min={min}
        max={max}
        required={required}
        name={name}
        placeholder={placeholder}
        fcolor={error ? 'error' : undefined}
        bcolor={error ? 'error' : 'tertiary'}
        type={type}
        width={width}
        value={value}
        handleChange={handleChange}
        className={className}
      />
      <Error>{error && error}</Error>
    </div>
  );
}
