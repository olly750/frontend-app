import React, { AllHTMLAttributes, DOMAttributes, FormEvent } from 'react';

import { Color, SelectData, ValueType } from '.';

export interface CommonProps<T> extends AllHTMLAttributes<DOMAttributes<T>> {}

/**
 * input props that will be shared to all input components
 */
export interface CommonInputProps<T> extends CommonProps<T> {
  handleChange: (_e: ValueType) => void;
  name: string;
  value?: string | number;
  options?: SelectData[];
}

//common input props that will be used on all reusable input components
export interface commonInputProps {
  required?: boolean;
  handleChange: (_e: ValueType) => any;
  name: string;
  options: SelectData[];
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export interface CommonStepProps {
  fetched_id?: string | number;
  display_label: string;
  prevStep?: () => void;
  nextStep: (_isComplete: boolean) => void;
  isVertical?: boolean;
}

/* @ts-ignore */
export interface InputProps<T> extends CommonInputProps<T> {
  defaultValue?: string;
  type?: string;
  readonly?: boolean;
  handleChange?: (_e: ValueType) => void;
  value: string | number | undefined;
  name: string;
  full?: boolean;
  padding?: string;
  fcolor?: Color;
  bcolor?: Color;
  pcolor?: Color;
  width?: string | number;
  className?: string;
  required?: boolean;
  reference?: React.LegacyRef<HTMLInputElement>;
}

export interface InputMarksProps<T> extends InputProps<T> {
  totalMarks: number;
}

export interface DropdownProps2 extends commonInputProps {
  isMulti?: boolean;
  noOptionsMessage?: string;
  width?: string;
  hasError?: boolean;
}

export interface DropdownProps extends commonInputProps {
  isMulti?: boolean;
  getOptionLabel?: (_option: Object) => string;
  getOptionValue?: (_option: Object) => string;
  noOptionsMessage?: string;
  width?: string;
  searchable?: boolean;
  defaultValue?: SelectData;
  styles?: Object;
  hasError?: boolean;
  height?: number;
  padding?: number;

  loading?: boolean;
  value?: string;
}

//common form props that will be used on all reusable form components
export interface CommonFormProps<T> extends Omit<CommonProps<T>, 'onSubmit'> {
  onSubmit?: <K = Element>(_e: FormEvent<K>, _data?: any) => void;
}

export interface SelectProps extends commonInputProps {
  loading?: boolean;
  value?: string;
  hasError?: boolean;
  width?: string;
  capitalizeLabelAndValue?: boolean;
}

export interface MultiselectProps extends commonInputProps {
  loading?: boolean;
  value?: string[];
  hasError?: boolean;
  width?: string;
}

export interface IChart {
  data: Object[];
  position: string;
  width?: number;
  height?: number;
  fill?: string;
}
