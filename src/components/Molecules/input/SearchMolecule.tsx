import React, { useState } from 'react';

import { CommonProps, ValueType } from '../../../types';
import Input from '../../Atoms/Input/Input';

interface ISearchMolecule<T> extends CommonProps<T> {
  handleChange: (_e: ValueType) => void;
  value?: string;
  placeholder?: string;
  width?: string;
}

export default function SearchMolecule<T>({
  handleChange,
  placeholder = 'Search here',
  value = '',
  width = 'w-72',
}: ISearchMolecule<T>) {
  const [, setFcolor] = useState<string>('tertiary');

  return (
    <div className={`flex items-center ${width}`}>
      <Input
        onFocus={() => setFcolor('primary-500')}
        onBlur={() => setFcolor('bcolor')}
        name="search"
        placeholder={placeholder}
        fcolor="error"
        bcolor="none"
        width="auto md:w-72"
        padding="0"
        value={value}
        handleChange={handleChange}
        className={'-ml-1 px-4'}
      />
    </div>
  );
}
