import React from 'react';

import { Color, fontSize, fontWeight } from '../../../types';
import Avatar, { IAvatar } from '../../Atoms/custom/Avatar';
import Badge from '../../Atoms/custom/Badge';
import ILabel from '../../Atoms/Text/ILabel';

interface ICard extends IAvatar {
  children: React.ReactNode;
  txtSize?: fontSize;
  fontWeight?: fontWeight;
  color?: Color;
  subtitle?: string;
  alt: string;
  size?: string;
  src: string;
  bgColor?: Color;
}

export default function AcademyProfileCard({
  children,
  src,
  bgColor = 'secondary',
  alt,
  size = '55',
  txtSize = 'xs',
  fontWeight = 'semibold',
  color = 'primary',
  subtitle = '',
  round,
}: ICard) {
  return (
    <Badge
      roundWidth="md"
      className="flex gap-5 h-16  w-full p-4 items-center"
      badgecolor={bgColor}>
      <Avatar round={round} src={src} alt={alt} size={size} />
      <div className="flex flex-col items-center">
        <ILabel size={txtSize} weight={fontWeight} color={color} className="text-center">
          {children}
        </ILabel>
        <ILabel size="sm" weight="normal" color="primary">
          {subtitle && subtitle}
        </ILabel>
      </div>
    </Badge>
  );
}
