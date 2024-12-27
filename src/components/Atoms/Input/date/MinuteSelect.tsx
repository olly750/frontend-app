import React from 'react';

import { ValueType } from '../../../../types';
import Select from '../Select';

type MProp = {
  value: string;
  onChange: (_e: ValueType) => void;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name: string;
  placeholder?: string;
  width?: string;
  className?: string;
};

const MinuteSelect = (mprops: MProp) => {
  const renderMinuteOptions = () => {
    let min = 60;
    const minOptions: { value: string; label: string }[] = [];
    for (let i = 0; i < min; ++i) {
      minOptions.push({
        value: i < 10 ? '0' + i : '' + i,
        label: i < 10 ? '0' + i : '' + i,
      });
    }
    return minOptions;
  };

  return (
    <Select
      value={mprops.value}
      disabled={mprops.disabled}
      name={mprops.name}
      placeholder={mprops.placeholder}
      width={mprops.width}
      className={mprops.className}
      options={renderMinuteOptions()}
      handleChange={(e: ValueType) => mprops.onChange(e)}
    />
  );
};

export default MinuteSelect;
