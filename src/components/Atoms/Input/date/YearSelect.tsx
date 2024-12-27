import moment from 'moment';
import React from 'react';

import { SelectData, ValueType } from '../../../../types';
import Select from '../Select';

interface YProp extends YOptProp {
  value: number;
  onChange: Function;
  id?: string;
  name: string;
  placeholder?: string;
  width?: string;
  reverse?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

interface YOptProp {
  start?: number;
  end?: number;
}

const YearSelect = (props: YProp) => {
  const renderYearOptions = ({ start = 1910, end = moment().year() }: YOptProp) => {
    let years = [];
    if (start <= end) {
      for (let i = start; i <= end; ++i) {
        years.push(i);
      }
    } else {
      for (let i = end; i >= start; --i) {
        years.push(i);
      }
    }
    if (props.reverse) {
      years.reverse();
    }
    const yearOptions: SelectData[] = [];
    years.forEach((year) => {
      yearOptions.push({ value: year + '', label: year + '' });
    });
    return yearOptions;
  };

  let years = renderYearOptions({
    start: props.start,
    end: props.end,
  });

  return (
    <Select
      disabled={props.disabled}
      name={props.name}
      placeholder={props.placeholder}
      className={props.className}
      options={years}
      value={props.value + ''}
      width={props.width}
      handleChange={(e: ValueType) => props.onChange(e)}
    />
  );
};

export default YearSelect;
