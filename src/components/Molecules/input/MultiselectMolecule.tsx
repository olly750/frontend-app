import React, { ReactNode } from 'react';

import { MultiselectProps } from '../../../types';
import Multiselect from '../../Atoms/Input/Multiselect';
import ILabel from '../../Atoms/Text/ILabel';

interface Props extends MultiselectProps {
  children?: ReactNode | string;
  error?: string;
}

export default function MultiselectMolecule(props: Props) {
  return (
    <div className="py-2">
      <ILabel size="sm" textTransform="normal-case">
        {props.children}
      </ILabel>
      <div className="mt-2">
        <Multiselect
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
        />
      </div>
    </div>
  );
}
