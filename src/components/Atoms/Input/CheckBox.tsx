import '../../../styles/components/Atoms/input/checkbox.scss';

import React, { FormEvent, useEffect, useState } from 'react';

import { ValueType } from '../../../types';

interface Props {
  label?: string;
  name: string;
  disabled?: boolean;
  handleChange: (_e: ValueType<HTMLInputElement>) => any;
  checked?: boolean;
  value: string;
  className?: string;
}

export default function Checkbox(props: Props) {
  const [checked, setChecked] = useState(false);

  const handleCheck = (e: FormEvent<HTMLInputElement>) => {
    setChecked(!checked);
    props.handleChange({ name: props.name, value: props.value, event: e });
  };

  useEffect(() => setChecked(!!props.checked), [props.checked]);

  return (
    <>
      <label className="inline-flex items-center">
        <input
          name={props.name}
          type="checkbox"
          className={`check-box h-5 w-5 text-primary-500 focus:ring-primary-400 focus:ring-opacity-25  ${props.className}`}
          checked={checked}
          disabled={props.disabled}
          value={props.value}
          onChange={handleCheck}
        />
        {props.label && (
          <span className="text-sm px-2 text-black font-medium capitalize">
            {props.label}
          </span>
        )}
      </label>
    </>
  );
}
