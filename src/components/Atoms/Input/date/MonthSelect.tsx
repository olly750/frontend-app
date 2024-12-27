import React from 'react';

import { SelectData, ValueType } from '../../../../types';
import { monthNum } from '../../../../utils/date-helper';
import Select from '../Select';

type MProp = {
  year: number;
  value: number;
  onChange: (_e: ValueType) => void;
  numeric?: boolean;
  short?: boolean;
  caps?: boolean;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name: string;
  placeholder?: string;
  width?: string;
  className?: string;
};

const MonthSelect = (mprops: MProp) => {
  const renderMonthOptions = () => {
    let months = [];
    let month = 12;
    if (mprops.numeric) {
      for (let i = 1; i <= month; i++) {
        months.push(i.toString());
      }
    } else {
      for (let i = 1; i <= month; i++) {
        months.push(monthNum[i]);
      }
      if (mprops.caps) {
        months = months.map((month) => {
          return month.toUpperCase();
        });
      }
      if (mprops.short) {
        months = months.map((month) => {
          return month.substring(0, 3);
        });
      }
    }
    const monthOptions: SelectData[] = [];
    months.forEach((month, index) => {
      monthOptions.push({ value: index + 1 + '', label: month });
    });

    return monthOptions;
  };

  let months = renderMonthOptions();

  return (
    <Select
      disabled={mprops.disabled}
      value={mprops.value + ''}
      name={mprops.name}
      placeholder={mprops.placeholder}
      className={mprops.className}
      width={mprops.width}
      options={months}
      handleChange={(e: ValueType) => mprops.onChange(e)}
    />
  );
};

export default MonthSelect;
