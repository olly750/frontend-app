import React from 'react';

import { Color } from '../../../types';

export interface IAvatar {
  src: string;
  alt: string;
  size?: string;
  bgColor?: Color;
  className?: string;
  round?: boolean;
}

export default function Avatar({
  src,
  alt,
  size = '56',
  className,
  round = true,
}: IAvatar) {
  return (
    <div>
      <img
        onError={(e) => {
          e.currentTarget.src = '/images/rdf-logo.png';
        }}
        src={src}
        alt={alt}
        className={`${
          round ? 'rounded-full' : 'rounded-none'
        } box-content object-contain ${className}`}
        style={{ height: size + 'px', width: size + 'px' }}
      />
    </div>
  );
}
