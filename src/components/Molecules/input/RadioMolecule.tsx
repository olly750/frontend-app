import React from 'react';

import { CommonInputProps, SelectData, ValueType } from '../../../types';
import Radio from '../../Atoms/Input/Radio';
import Error from '../../Atoms/Text/Error';
import ILabel from '../../Atoms/Text/ILabel';

interface PropType<T> extends CommonInputProps<T> {
  type?: 'inline' | 'block';
  error?: string;
  loading?: boolean;
  options: SelectData[];
  handleChange: (_e: ValueType) => void;
}

/**
 * Radio molecule  component that has error output
 */
export default function RadioMolecule<T>({
  value = '',
  name,
  type = 'inline',
  children,
  handleChange,
  error,
  className,
  loading = false,
  options,
  ...attrs
}: PropType<T>) {
  return (
    <div {...attrs} className={className}>
      {loading ? (
        <div className="animate-pulse w-24 h-4 bg-secondary rounded"></div>
      ) : (
        <>
          <ILabel weight="medium" size="sm">
            {children}
          </ILabel>
          <div className="mt-2">
            <Radio
              name={name}
              value={value}
              type={type}
              options={options}
              handleChange={handleChange}></Radio>
          </div>
          {error && <Error>{error}</Error>}
        </>
      )}
    </div>
  );
}
