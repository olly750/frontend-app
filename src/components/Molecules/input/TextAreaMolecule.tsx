import React from 'react';

import { InputProps, ValueType } from '../../../types';
import Textarea from '../../Atoms/Input/Textarea';
import Error from '../../Atoms/Text/Error';
import ILabel from '../../Atoms/Text/ILabel';

interface ITextareaMolecule<T> extends InputProps<T> {
  name: string;
  value: string | undefined;
  handleChange?: (_e: ValueType) => void;
  className?: string;
  children?: React.ReactNode;
  error?: string;
  textAreaClassName?: string;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
}
export default function TextAreaMolecule<T>({
  name,
  value,
  handleChange = () => {},
  children,
  error = '',
  readOnly = false,
  placeholder = '',
  className = '',
  textAreaClassName = '',
  type = 'text',
  ...attrs
}: ITextareaMolecule<T>) {
  return (
    <div className={`flex flex-col gap-3 mb-2 ${className}`}>
      {children ? (
        <ILabel size="sm" weight="medium">
          {children}
        </ILabel>
      ) : null}
      <Textarea
        {...attrs}
        readonly={readOnly}
        name={name}
        placeholder={placeholder}
        fcolor={error ? 'error' : undefined}
        type={type}
        value={value}
        className={textAreaClassName}
        /* @ts-ignore */
        handleChange={handleChange}
      />
      <Error>{error && error}</Error>
    </div>
  );
}
