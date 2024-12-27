import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

import { Link } from '../../types';
import Icon from '../Atoms/custom/Icon';

type PropType = {
  list: Link[];
};
export default function BreadCrumb({ list }: PropType) {
  return (
    <div>
      <div className="flex ">
        {list.map((link, i) => (
          <RouteLink to={link.to} className=" flex items-center" key={i}>
            <div className="text-txt-secondary capitalize">{link.title}</div>
            {i !== list.length - 1 && <Icon size={20} name="chevron-right" />}
          </RouteLink>
        ))}
      </div>
    </div>
  );
}
