import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { colorStyle, fontSizeStyle } from '../../../global/global-vars';
import { IconType, Privileges } from '../../../types';
import Permission from '../auth/Permission';
import Icon from './Icon';

export type linkProps = {
  title: string;
  to: string;
  icon: IconType;
  fill?: boolean;
  active?: boolean;
  privilege?: Privileges;
};

export const SidebarLink = ({
  title,
  to,
  icon,
  active,
  fill = true,
  privilege,
}: linkProps) => {
  return privilege ? (
    <Permission privilege={privilege}>
      <div
        className={`px-8 cursor-pointer py-0 border-l-4 ${
          active ? 'border-primary-500 bg-main border-b-2' : 'border-transparent'
        }`}>
        <Link to={to} className="flex items-center">
          <Icon
            name={icon}
            size={21}
            stroke={!fill && active ? 'primary' : 'none'}
            fill={fill && active ? 'primary' : 'none'}
          />
          <span
            className={`text-${colorStyle[active ? 'primary' : 'gray']} ${
              fontSizeStyle['sm']
            } px-1 font-medium capitalize`}>
            {title}
          </span>
        </Link>
      </div>
    </Permission>
  ) : (
    <div
      className={`px-8 cursor-pointer py-0 border-l-4 ${
        active ? 'border-primary-500' : 'border-transparent'
      }`}>
      <Link to={to} className="flex items-center">
        <Icon
          name={icon}
          size={21}
          stroke={!fill && active ? 'primary' : 'none'}
          fill={fill && active ? 'primary' : 'none'}
        />
        <span
          className={`text-${colorStyle[active ? 'primary' : 'gray']} ${
            fontSizeStyle['sm']
          } px-1 font-medium capitalize`}>
          {title}
        </span>
      </Link>
    </div>
  );
};

export type sidebarLinksProps = {
  links: linkProps[];
};

export default function SidebarLinks({ links }: sidebarLinksProps) {
  const location = useLocation();
  let activeIndexAuto = links.findIndex((link) => location.pathname.startsWith(link.to));
  return (
    <div className="py-16">
      {links.map((link, i) => (
        <SidebarLink
          key={i}
          title={link.title}
          to={link.to}
          icon={link.icon}
          active={activeIndexAuto === i}
          fill={link.fill}
          privilege={link.privilege}
        />
      ))}
    </div>
  );
}
