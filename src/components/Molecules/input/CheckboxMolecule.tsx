import React from 'react';

import { commonInputProps, ValueType } from '../../../types';
import Checkbox from '../../Atoms/Input/CheckBox';
import ILabel from '../../Atoms/Text/ILabel';

interface IProps extends commonInputProps {
  isFlex?: boolean;
  values: string[];
}

export default function CheckboxMolecule(props: IProps) {
  const handleChange = (e: ValueType<HTMLInputElement>) => {
    let selected: string[] = [...props.values];
    if (!props.values.includes(e.value as string)) selected.push(e.value as string);
    else selected = [...selected.filter((el) => el != e.value)];

    props.handleChange({ name: props.name, value: selected });
  };
  return (
    <div className="py-2">
      <ILabel size="sm" weight="bold">
        {props.placeholder}
      </ILabel>
      <div className={props.isFlex ? 'grid grid-cols-2' : 'block'}>
        {props.options?.map((op: any, i) => (
          <div className="pt-2 px-1" key={i}>
            <Checkbox
              name={props.name}
              value={op.value}
              checked={props.values.includes(op.value)}
              label={op.label}
              handleChange={handleChange}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
