import React from 'react';

import { IconType, Privileges } from '../../../types';
import Permission from '../../Atoms/auth/Permission';
import Button from '../../Atoms/custom/Button';
import Icon from '../../Atoms/custom/Icon';

interface IProps {
  fill?: boolean;
  title: string;
  icon?: IconType;
  description: string;
  buttonLabel?: string;
  handleClick?: () => any;
  showButton?: boolean;
  privilege?: Privileges;
}

export default function NoDataAvailable({
  title,
  icon = 'module',
  description,
  buttonLabel = 'Create new',
  handleClick,
  fill = true,
  showButton = true,
  privilege,
}: IProps) {
  return (
    <div className="w-full py-12 bg-transparent">
      <div className="text-center">
        <div className="rounded-full inline-block py-3 px-3 bg-lightgreen bg-opacity-35">
          <Icon
            name={icon}
            size={32}
            stroke={!fill ? 'primary' : 'none'}
            fill={fill ? 'primary' : 'none'}
          />
        </div>
      </div>
      <p className="text-base font-semibold pt-4 pb-2 text-center">{title}</p>
      <div className="mx-auto w-full md:w-3/4 lg:w-1/2 xl:w-1/3 ">
        <p className="text-sm font-medium text-txt-secondary text-center">
          {description}
        </p>
      </div>
      {showButton &&
        (privilege ? (
          <Permission privilege={privilege}>
            <div className="pt-4 text-center">
              <Button onClick={handleClick}>{buttonLabel}</Button>
            </div>
          </Permission>
        ) : // <div className="pt-4 text-center">
        //   <Button onClick={handleClick}>{buttonLabel}</Button>
        // </div>
        null)}
    </div>
  );
}
