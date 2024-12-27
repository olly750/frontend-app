import '../../styles/components/Molecules/ActionableList.scss';

import React, { ReactNode } from 'react';

import { IconType } from '../../types';
import Icon from '../Atoms/custom/Icon';

interface PropType {
  name?: IconType;
  children: ReactNode;
  handleClick?: () => void;
}

export default function ActionableList({
  children,
  name = 'close',
  handleClick,
}: PropType) {
  return (
    <div className="flex items-center width28 bg-main justify-between py-4 px-6">
      <p>{children}</p>
      <button type="button" onClick={() => handleClick && handleClick()}>
        <Icon size={15} name={name}></Icon>
      </button>
    </div>
  );
}
