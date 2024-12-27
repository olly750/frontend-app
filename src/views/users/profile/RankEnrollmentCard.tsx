import React from 'react';

import Badge from '../../../components/Atoms/custom/Badge';
import Heading from '../../../components/Atoms/Text/Heading';
import { UserInfo } from '../../../types/services/user.types';

function RankEnrollmentCard({ user }: { user: UserInfo }) {
  const CurrentRankCard = () => {
    return (
      <div className="flex flex-col gap-3 w-full">
        <div className="flex text-sm items-center">
          <p className="text-txt-secondary">Current rank</p>
          <p className="text-txt-primary px-2 font-semibold">
            {user.person?.current_rank?.name || '-----'} -{' '}
            {user.person?.current_rank?.abbreviation}
          </p>
        </div>
        <div className="flex text-sm items-center">
          <p className="text-txt-secondary">Unit name: </p>
          <p className="text-txt-primary px-2 font-semibold">
            {user.person?.rank_depart || '-----'}
          </p>
        </div>
        <div className="flex text-sm items-center">
          <p className="text-txt-secondary">On: </p>
          <p className="text-txt-primary px-2 font-semibold">
            {user.person?.date_of_issue || '-----'}{' '}
          </p>
        </div>
        <div className="flex text-sm items-center">
          <p className="text-txt-secondary">Issued at: </p>
          <p className="text-txt-primary px-2 font-semibold">
            {user.person?.place_of_issue || '-----'}{' '}
          </p>
        </div>

        <div className="flex text-sm items-center pt-2">
          <p className="text-txt-secondary">
            Date of Commission <br /> (Started The Career):{' '}
          </p>
          <p className="text-txt-primary px-2 font-semibold">
            {user.person?.date_of_commission || '-----'}{' '}
          </p>
        </div>
        <div className="flex text-sm items-center">
          <p className="text-txt-secondary">Date of Last Promotion: </p>
          <p className="text-txt-primary px-2 font-semibold">
            {user.person?.date_of_last_promotion || '-----'}{' '}
          </p>
        </div>
      </div>
    );
  };

  const OtherRankCard = () => {
    return (
      <div className="flex text-sm items-center py-3">
        <p className="text-txt-secondary">Other rank</p>
        <p className="text-txt-primary px-2 font-semibold">{user.person?.other_rank}</p>
      </div>
    );
  };
  return (
    <div className="max-w-sm py-4 px-6 bg-main rounded-md max-h-96 overflow-auto">
      <Heading fontWeight="semibold" fontSize="base" className="pt-6 pb-7">
        Rank Enrollment
      </Heading>
      {user.person?.current_rank && user.person?.other_rank ? (
        <>
          <CurrentRankCard />
          <OtherRankCard />
        </>
      ) : user.person?.current_rank ? (
        <CurrentRankCard />
      ) : user.person?.other_rank ? (
        <OtherRankCard />
      ) : (
        <Badge
          fontWeight="medium"
          badgecolor="secondary"
          badgetxtcolor="txt-secondary"
          fontSize="sm"
          className="mx-2">
          Ranks are currently not specificied
        </Badge>
      )}
    </div>
  );
}

export default RankEnrollmentCard;
