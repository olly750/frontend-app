import React, { ReactNode } from 'react';

import { colorStyle, fontSizeStyle, fontWeightStyle } from '../../../global/global-vars';
import { Color, fontSize, fontWeight, textTransform } from '../../../types';

interface ILabelProps {
  children: ReactNode;
  weight?: fontWeight;
  size?: fontSize;
  color?: Color;
  textTransform?: textTransform;
  className?: string;
}

export default function ILabel({
  children,
  weight = 'medium',
  size = 'sm',
  color = 'txt-primary',
  textTransform = 'capitalize',
  className = '',
  ...rest
}: ILabelProps) {
  return (
    <label
      {...rest}
      className={`${textTransform} ${fontWeightStyle[weight]} ${fontSizeStyle[size]} text-${colorStyle[color]} ${className}`}>
      {children}
    </label>
  );
}
