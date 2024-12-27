import React from 'react';
import { ReactSVG } from 'react-svg';
import styled, { css } from 'styled-components';

import { bgStyle } from '../../../global/global-vars';
import { getPrimaryColor } from '../../../hooks/useTheme';
import { Color, colorStyleType, IconType } from '../../../types';

type IProps = {
  name: IconType;
  size?: number;
  fill?: Color;
  stroke?: Color;
  transform?: string;
  bgColor?: Color;
  useheightandpadding?: boolean;
  className?: string;
  padding?: string;
};

const iconStyle: colorStyleType = {
  primary: getPrimaryColor(),
  error: '#EF4444',
  warning: '#FACD23',
  main: '#FFF',
  success: '#3CD278',
  'txt-secondary': '#949ca5',
};

// @ts-ignore
// TODO: @blessing fix this
const StyledSVGIcon = styled(ReactSVG)`
  svg {
    ${({ size }: IProps) =>
      size &&
      css`
        width: ${size}px;
        height: ${size}px;
      `}

    ${({ transform }: IProps) =>
      transform &&
      css`
        transform: ${transform};
      `}
    path,circle {
      ${({ stroke }: IProps) =>
        stroke &&
        css`
          stroke: ${iconStyle[stroke]};
        `}
      ${({ fill }: IProps) =>
        fill &&
        css`
          fill: ${iconStyle[fill]};
        `}
    }
  }
`;

export default function Icon({
  name,
  fill = 'none',
  stroke = 'none',
  transform = '',
  size = 24,
  bgColor,
  className = '',
  useheightandpadding = true,
  padding,
}: IProps) {
  return (
    <span
      className={`${bgColor && bgStyle[bgColor]} ${padding || 'p-4'} ${
        size > 16 && useheightandpadding ? 'w-12 h-12' : 'w-8 h-8'
      } flex items-center justify-center rounded-lg ${className}`}>
      <StyledSVGIcon
        src={`/icons/${name}.svg`}
        stroke={stroke}
        transform={transform}
        fill={fill}
        size={size}
      />
    </span>
  );
}
