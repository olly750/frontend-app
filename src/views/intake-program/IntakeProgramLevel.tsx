import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TabNavigation, { TabType } from '../../components/Molecules/tabs/TabNavigation';
import useInstructorLevels from '../../hooks/getInstructorLevels';
import intakeProgramStore, {
  getIntakeProgramsByStudent,
  getStudentLevels,
} from '../../store/administration/intake-program.store';
import { getLevelsByAcademicProgram } from '../../store/administration/program.store';
import { Privileges } from '../../types';
import {
  IntakeProgParam,
  LevelIntakeProgram,
} from '../../types/services/intake-program.types';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../utils/utils';
import LevelPeriod from '../classes/LevelPeriod';
import EnrollStudent from './EnrollStudent';
import IntakeLevelModule from './IntakeLevelModule';
import { NewIntakePeriod } from './NewIntakePeriod';

interface IntakeProgramLevelProp {
  action: 'learn' | 'manage' | 'teach';
}

function IntakeProgramLevel({ action }: IntakeProgramLevelProp) {
  const history = useHistory();
  const { path } = useRouteMatch();
  const { intakeProg, intakeId, id } = useParams<IntakeProgParam>();
  const [instLevels, setInstLevels] = useState<LevelIntakeProgram[]>([]);

  const { t } = useTranslation();

  const instructorInfo = getObjectFromLocalStrg(getLocalStorageData('instructorInfo'));

  const { data: getLevels, isLoading } =
    intakeProgramStore.getLevelsByIntakeProgram(intakeProg);
  const programLevels = getLevelsByAcademicProgram(id).data?.data.data;

  const unaddedLevels = programLevels?.filter(
    (pg) =>
      !getLevels?.data.data.map((lv) => lv.academic_program_level.id).includes(pg.id),
  );

  const instructorProgLevels = useInstructorLevels(instructorInfo?.id + '', intakeProg);

  useEffect(() => {
    setInstLevels(instructorProgLevels);
  }, [instructorProgLevels]);

  const studentInfo = getObjectFromLocalStrg(getLocalStorageData('studentInfo'));
  const studPrograms = getIntakeProgramsByStudent(studentInfo?.id.toString() || '').data
    ?.data.data;

  let studIntkProgstud = studPrograms?.find(
    (prg) => prg.intake_program.id === intakeProg,
  );

  let { data: studentLevels } = getStudentLevels(studIntkProgstud?.id.toString() || '');

  const tabs: TabType[] =
    action === 'learn'
      ? studentLevels?.data.data.map((level) => ({
          label: `${level.academic_year_program_level.academic_program_level.level.name}`,
          href: `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${level.academic_year_program_level.id}`,
        })) || []
      : action === 'teach'
      ? instLevels.map((level) => ({
          label: `${level.academic_program_level.level.name}`,
          href: `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${level.id}`,
        })) || []
      : action === 'manage'
      ? getLevels?.data.data.map((level) => ({
          label: `${level.academic_program_level.level.name}`,
          href: `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${level.id}`,
        })) || []
      : [];

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : getLevels?.data.data.length === 0 ? (
        <NoDataAvailable
          privilege={Privileges.CAN_CREATE_PROGRAM_LEVELS}
          buttonLabel="Add new level"
          icon="level"
          title={'No levels available in this ' + t('Program')}
          handleClick={() =>
            history.push(
              `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/add-level`,
            )
          }
          description="There are no levels available yet! you can add the from the button below"
        />
      ) : (
        <>
          {unaddedLevels?.length !== 0 ? (
            <Permission privilege={Privileges.CAN_CREATE_PROGRAM_LEVELS}>
              <div className="text-right">
                <Link
                  to={`/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/add-level`}>
                  <Button>Add level to {t('Program')}</Button>
                </Link>
              </div>
            </Permission>
          ) : null}
          <TabNavigation tabs={tabs}>
            <Switch>
              <Route exact path={`${path}/:level`} render={() => <IntakeLevelModule />} />
              {/* enroll student to intake program level */}
              <Route
                exact
                path={`${path}/:level/enroll-students`}
                render={() => (
                  <EnrollStudent
                    showSidebar={true}
                    handleShowSidebar={function (): void {}}
                  />
                )}
              />
              {/* add module to intake program level */}
              <Route
                path={`${path}/:level/view-period/:period`}
                render={() => <LevelPeriod />}
              />

              {/* add periods to intake level */}
              <Route
                exact
                path={`${path}/:level/add-period`}
                render={() => (
                  <PopupMolecule
                    title={'Add ' + t('Period') + ' to level'}
                    closeOnClickOutSide={false}
                    open
                    onClose={history.goBack}>
                    <NewIntakePeriod checked={0} />
                  </PopupMolecule>
                )}
              />
            </Switch>
          </TabNavigation>
        </>
      )}
    </>
  );
}

export default IntakeProgramLevel;
