import React from 'react';

import { Color, CommonCardDataType, fontSize } from '../../types';
import Badge from '../Atoms/custom/Badge';
import Heading from '../Atoms/Text/Heading';

interface ICardHead extends CommonCardDataType {
  color?: Color;
  fontSize?: fontSize;
  hasTopMargin?: boolean;
}

function CardHeadMolecule({
  code,
  status,
  color = 'txt-primary',
  title,
  fontSize,
  hasTopMargin = true,
  description,
}: ICardHead) {
  return (
    <>
      <div className="flex justify-between items-center">
        <Heading fontWeight="semibold" fontSize={fontSize} color={color}>
          {code}
        </Heading>
        {status && <Badge badgecolor={status.type}>{status.text}</Badge>}
      </div>
      <div className={`${hasTopMargin ? 'mt-6' : ''}`}>
        <Heading fontWeight="semibold">{title}</Heading>
        <p
          id="course-card-description"
          className={`text-txt-secondary text-sm ${hasTopMargin ? 'mt-4' : ''}`}>
          {description}
        </p>
      </div>
    </>
  );
}

export default CardHeadMolecule;
