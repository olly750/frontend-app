import moment from 'moment';
import React from 'react';

import Avatar from '../../../components/Atoms/custom/Avatar';
import Badge from '../../../components/Atoms/custom/Badge';
import Heading from '../../../components/Atoms/Text/Heading';
import ILabel from '../../../components/Atoms/Text/ILabel';
import { AcademyInfo } from '../../../types/services/academy.types';
import { usePicture } from '../../../utils/file-util';

function AcademiesCard({ academies }: { academies: AcademyInfo[] }) {
  return (
    <div className="max-w-sm py-4 px-6 bg-main rounded-md max-h-80 overflow-auto">
      <Heading fontWeight="semibold" fontSize="base" className="pt-6 pb-7">
        Academies
      </Heading>
      {academies.length === 0 ? (
        <Badge
          fontWeight="medium"
          badgecolor="secondary"
          badgetxtcolor="txt-secondary"
          fontSize="sm"
          className="mx-2">
          User not enrolled in any academy
        </Badge>
      ) : (
        academies.map((academy) => (
          <div key={academy.id} className="flex gap-3 h-16 w-full items-center py-12">
            <Avatar
              src={usePicture(
                academy.logo_attachment_id,
                academy.id,
                '/images/rdf-logo.png',
                'logos',
              )}
              alt="academy logo"
              size="48"
              round={false}
            />
            <div>
              <p className="py-2">
                <ILabel size="sm" weight="medium" color="primary">
                  {academy.name}
                </ILabel>
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex text-sm">
                  <p className="text-txt-secondary pr-2">From: </p>
                  <p className="text-txt-primary px-2">
                    {moment(academy.created_on).format('ddd, YYYY-MM-DD')}
                  </p>
                </div>
                <div className="flex text-sm">
                  <p className="text-txt-secondary pr-1">To </p>
                  <p className="text-txt-primary px-2">
                    {moment().format('ddd, YYYY-MM-DD')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AcademiesCard;
