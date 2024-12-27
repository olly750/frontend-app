import React, { ReactNode } from 'react';

import { Color, colorStyleType } from '../../../types';

type BadgeProps = {
  badgecolor: Color;
  badgetxtcolor?: Color;
  roundWidth?: string;
  fontWeight?: string;
  fontSize?: string;
  className?: string;
  children: ReactNode;
};

/**
 * when using this Badge, you can provide just only  badge color, so txt and bacground color will be auto selected
 * based on their variants
 */
const Badge = ({
  badgecolor,
  badgetxtcolor,
  roundWidth = 'full',
  fontWeight = 'semibold',
  fontSize = 'xs',
  className = '',
  children,
}: BadgeProps) => {
  const bg_colors: colorStyleType = {
    error: 'bg-error-400',
    success: 'bg-success-400',
    warning: 'bg-warning-400',
    primary: 'bg-primary-500',
    secondary: 'bg-secondary',
    info: 'bg-info-400',
    'txt-secondary': 'bg-txt-secondary',
    main: 'bg-main',
    reject: 'bg-error-400',
    reviewed: 'bg-[#F2EAF9]',
    marked: 'bg-[#E9EBFA]'
  };

  const txt_colors: colorStyleType = {
    error: 'text-error-500',
    success: 'text-success-500',
    warning: 'text-warning-500',
    primary: 'text-primary-500',
    secondary: 'text-secondary',
    main: 'text-main',
    reject: 'text-error-600',
    'txt-secondary': 'text-txt-secondary',
    reviewed: 'text-[#7B2CBF]',
    marked: 'text-[#2337CC]'
  };

  return (
    <>
      <span
        className={`px-4 py-2 text-${fontSize} font-${fontWeight} rounded-${roundWidth} inline-block ${className} ${(badgetxtcolor || badgecolor) && txt_colors[badgetxtcolor || badgecolor]
          } 
        ${badgecolor && bg_colors[badgecolor]}`}>
        {children}
      </span>
    </>
  );
};

export default Badge;
