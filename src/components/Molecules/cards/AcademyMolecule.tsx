import '../../../styles/components/Molecules/cards/AcademyMolecule.scss';

import React from 'react';

import Avatar from '../../Atoms/custom/Avatar';
import Heading from '../../Atoms/Text/Heading';

type PropType = {
  active?: boolean;
  data: any;
};

export default function AcademyMolecule({ active = false, data }: PropType) {
  return (
    <div
      id="academy-molecule"
      className={`bg-main p-6 rounded-lg ${
        active && 'border-4 border-solid border-primary-500'
      }`}>
      <Avatar src={data.image} alt={`${data.name} logo`} />
      <div>
        <Heading>{data.name}</Heading>
        <p className="text-txt-secondary h-28">{data.description}</p>
      </div>
    </div>
  );
}
