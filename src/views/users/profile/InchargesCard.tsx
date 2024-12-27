import React from 'react';

import Heading from '../../../components/Atoms/Text/Heading';
import CardHeadMolecule from '../../../components/Molecules/CardHeadMolecule';

function InchargesCard() {
  return (
    <div className="max-w-sm py-4 px-6 bg-main rounded-md h-80 overflow-auto">
      <Heading fontWeight="semibold" fontSize="base" className="pt-6 pb-7">
        Incharges
      </Heading>
      <div className="pb-8">
        <CardHeadMolecule
          title=""
          hasTopMargin={false}
          fontSize="sm"
          color="primary"
          code={'Gako-Academy'}
          status={{ type: 'warning', text: 'Ongoing' }}
          description={'gako@gmail.com'}
        />
      </div>
    </div>
  );
}

export default InchargesCard;
