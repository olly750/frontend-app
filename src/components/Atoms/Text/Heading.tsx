import '../../../styles/components/Atoms/text/heading.scss';

import React, { ReactNode } from 'react';

import { colorStyle } from '../../../global/global-vars';
import { Color, fontSize, fontWeight } from '../../../types';

type HeadingProps = {
  fontSize?: fontSize;
  fontWeight?: fontWeight;
  color?: Color;
  className?: string;
  children: ReactNode;
};

const Heading = ({
  fontSize = 'lg',
  fontWeight = 'medium',
  color = 'txt-primary',
  className,
  children,
}: HeadingProps) => {
  return (
    <h2
      className={`text-${fontSize} font-${fontWeight} text-${colorStyle[color]} ${
        className && className
      }`}>
      {children}
    </h2>
  );
};

export default Heading;
