import React, { ReactNode } from 'react';

import { DropdownProps } from '../../../types';
import DropDown from '../../Atoms/Input/Dropdown';
import Error from '../../Atoms/Text/Error';
import ILabel from '../../Atoms/Text/ILabel';

interface Props extends DropdownProps {
  children?: ReactNode | string;
  error?: string;
}
export default function DropdownMolecule(props: Props) {
  return (
    <div className="pb-2 flex-col">
      <ILabel size="sm" textTransform="normal-case">
        {props.children}
      </ILabel>
      <div className="mt-2 flex flex-col">
        <DropDown
          width={props.width}
          disabled={props.disabled}
          name={props.name}
          options={props.options}
          placeholder={props.placeholder}
          // handleChange={(e: object) => props.handleChange({ ...e, name: props.name })}
          handleChange={props.handleChange}
          className={`w-${props.width || 'full md:w-80'} h-12 select ${
            props.className || ''
          }`}
          isMulti={props.isMulti}
          searchable={props.searchable}
          defaultValue={props.defaultValue}
          getOptionLabel={props.getOptionLabel}
          getOptionValue={props.getOptionValue}
          hasError={props.hasError ? true : props.error ? true : false}
        />
      </div>
      <p className="pt-2">{props.error ? <Error>{props.error}</Error> : <></>}</p>
      {/* </div> */}
    </div>
  );
}
