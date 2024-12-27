import React from 'react';

import { ValueType } from '../../../../types';
import DropDown from '../Dropdown';

type IProp = {
  value: number;
  onChange: (_e: ValueType) => void;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name: string;
  placeholder?: string;
  width?: string;
  className?: string;
};

const SecondSelect = (sprops: IProp) => {
  const renderSecondOptions = () => {
    let sec = 60;
    const secOptions: { value: string; label: string }[] = [];
    for (let i = 0; i < sec; ++i) {
      secOptions.push({
        value: i < 10 ? '0' + i : '' + i,
        label: i < 10 ? '0' + i : '' + i,
      });
    }
    return secOptions;
  };

  return (
    <DropDown
      name={sprops.name}
      placeholder={sprops.placeholder}
      width={sprops.width}
      className={sprops.className}
      options={renderSecondOptions()}
      handleChange={(e: ValueType) => sprops.onChange(e)}
    />
  );
};

export default SecondSelect;
