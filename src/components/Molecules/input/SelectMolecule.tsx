import React, { ReactNode } from 'react';

import { SelectProps } from '../../../types';
import Select from '../../Atoms/Input/Select';
import ILabel from '../../Atoms/Text/ILabel';

interface Props extends SelectProps {
  children?: ReactNode | string;
  error?: string;
  disabled?: boolean;
}

export default function SelectMolecule(props: Props) {
  return (
    <div className="py-2">
      <ILabel size="sm" textTransform="normal-case">
        {props.children}
      </ILabel>
      <div className="mt-2">
        <Select
          required={props.required}
          className={props.className}
          loading={props.loading}
          value={props.value}
          width={props.width}
          disabled={props.disabled}
          name={props.name}
          options={props.options}
          placeholder={props.placeholder}
          handleChange={props.handleChange}
          hasError={props.hasError}
          capitalizeLabelAndValue={props.capitalizeLabelAndValue}
        />
      </div>
    </div>
  );
}
