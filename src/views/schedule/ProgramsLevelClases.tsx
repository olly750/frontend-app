import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import TableHeader from '../../components/Molecules/table/TableHeader';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { Privileges } from '../../types';

interface ParamType {
  id: string;
  intakeProgramId: string;
}

export default function PrograsmLevelClasses() {
  const { intakeProgramId } = useParams<ParamType>();

  const { data: levels, isLoading: levelsLoading } =
    intakeProgramStore.getLevelsByIntakeProgram(intakeProgramId); //.data?.data.data || [];

  let programInfo = levels?.data.data[0]?.intake_program.program || undefined;
  const { t } = useTranslation();

  return (
    <div>
      <TableHeader
        showBadge={false}
        title={programInfo?.name || t('Program') + ' levels'}>
        <Permission privilege={Privileges.CAN_ACCESS_CALENDER}>
          <Link to={`/dashboard/schedule/calendar/${programInfo?.id}`}>
            <Button styleType="outline">{t('Program')} calendar</Button>
          </Link>
        </Permission>
      </TableHeader>
      {levelsLoading ? (
        <Loader />
      ) : levels?.data.data.length === 0 ? (
        <NoDataAvailable
          title={'No intake levels available'}
          description="There are no levels available yet! you can add the from the button below"
          showButton={false}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-5">
          {levels?.data.data.map((cl) => (
            <div
              key={cl.id}
              className="bg-main shadow rounded-md py-4 px-6 border-1 border-transparent hover:border-primary-500 cursor-pointer">
              <Heading fontSize="xs" color="txt-secondary" fontWeight="semibold">
                LEVEL
              </Heading>
              <Heading className="pt-6 pb-4 capitalize" fontSize="base" fontWeight="bold">
                {cl.academic_program_level.level.name}
              </Heading>

              <div>
                <Permission privilege={Privileges.CAN_ACCESS_TIMETABLE}>
                  <Link
                    className="outline-none"
                    to={`/dashboard/schedule/timetable/${cl.id}/current`}>
                    <span className="text-primary-500 text-sm font-medium">
                      View timetable
                    </span>
                  </Link>
                </Permission>
              </div>
              <div className="pt-1">
                <Permission privilege={Privileges.CAN_ACCESS_CALENDER}>
                  <Link
                    className="outline-none"
                    to={`/dashboard/schedule/calendar/${programInfo?.id}?in_level_id=${cl.id}`}>
                    <span className="text-primary-500 text-sm font-medium">
                      View calendar
                    </span>
                  </Link>
                </Permission>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
