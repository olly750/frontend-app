import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import AddCard from '../../components/Molecules/cards/AddCard';
import ModuleCard from '../../components/Molecules/cards/modules/ModuleCard';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import TableHeader from '../../components/Molecules/table/TableHeader';
import enrollmentStore from '../../store/administration/enrollment.store';
import intakeProgramStore, {
  getModulesByLevel,
} from '../../store/administration/intake-program.store';
import { CommonCardDataType, Privileges } from '../../types';
import { IntakeLevelParam } from '../../types/services/intake-program.types';
import { advancedTypeChecker } from '../../utils/getOption';
import EnrollInstructorToLevel from './EnrollInstructorToLevel';
import EnrollStudent from './EnrollStudent';
import LevelInstrctors from './LevelInstructors';
import LevelStudents from './LevelStudents';

function IntakeLevelModule() {
  const history = useHistory();
  const { t } = useTranslation();

  const { path } = useRouteMatch();
  const { id, intakeId, intakeProg, level } = useParams<IntakeLevelParam>();

  const [levelModules, setlevelModules] = useState<CommonCardDataType[]>([]);

  const { data: instructorProgramLevel, isLoading: instructorsLoading } =
    enrollmentStore.getInstructorsInProgramLevel(level);
  const { data: levelModuleStore, isLoading } = getModulesByLevel(parseInt(level));

  const initialShowSidebar = {
    showStudent: false,
    showInstructor: false,
    enrollStudent: false,
    enrollInstructor: false,
  };
  const [showSidebar, setShowSidebar] = useState(initialShowSidebar);

  useEffect(() => {
    let newModule: CommonCardDataType[] = [];
    levelModuleStore?.data.data.forEach((mod) => {
      newModule.push({
        status: {
          type: advancedTypeChecker(mod.generic_status),
          text: mod.generic_status.toString(),
        },
        intake_module_id:mod.id,
        id: mod.module.id,
        code: mod.module.code,
        title: mod.module.name,
        description: mod.module.description,
        subTitle: `total subject: ${mod.module.total_num_subjects || 'None'}`,
      });
    });

    setlevelModules(newModule);
  }, [levelModuleStore?.data.data]);

  const { data: periods, isLoading: prdLoading } = intakeProgramStore.getPeriodsByLevel(
    parseInt(level),
  );
 
  return (
    <>
      <TableHeader usePadding={false} showBadge={false} showSearch={false}>
        <>
          <Permission privilege={Privileges.CAN_CREATE_INSTRUCTORS_ON_LEVEL_PROGRAM}>
            <EnrollInstructorToLevel
              existing={instructorProgramLevel?.data.data || []}
              showSidebar={showSidebar.enrollInstructor}
              handleShowSidebar={() =>
                setShowSidebar({
                  ...initialShowSidebar,
                  enrollInstructor: !showSidebar.enrollInstructor,
                })
              }
            />
          </Permission>

          <Permission privilege={Privileges.CAN_CREATE_STUDENTS_ON_LEVEL_PROGRAM}>
            <EnrollStudent
              showSidebar={showSidebar.enrollStudent}
              handleShowSidebar={() =>
                setShowSidebar({
                  ...initialShowSidebar,
                  enrollStudent: !showSidebar.enrollStudent,
                })
              }
            />
          </Permission>
        </>
        <Permission privilege={Privileges.CAN_ACCESS_INSTRUCTORS_ON_LEVEL_PROGRAM}>
          <LevelInstrctors
            isLoading={instructorsLoading}
            instructorsData={instructorProgramLevel?.data.data || []}
            showSidebar={showSidebar.showInstructor}
            handleShowSidebar={() =>
              setShowSidebar({
                ...initialShowSidebar,
                showInstructor: !showSidebar.showInstructor,
              })
            }
          />
        </Permission>
        <Permission privilege={Privileges.CAN_ACCESS_STUDENTS_ON_LEVEL_PROGRAM}>
          <LevelStudents
            showSidebar={showSidebar.showStudent}
            handleShowSidebar={() =>
              setShowSidebar({
                ...initialShowSidebar,
                showStudent: !showSidebar.showStudent,
              })
            }
          />
        </Permission>
        <Permission privilege={Privileges.CAN_ACCESS_TIMETABLE}>
        <Button
          styleType="outline"
          onClick={() => history.push(`/dashboard/schedule/timetable/${level}/current`)}>
          View timetable
        </Button>
        </Permission>
        <Permission privilege={Privileges.CAN_ACCESS_REPORTS}>
          <Button
            styleType="outline"
            onClick={() => history.push(`/dashboard/intakes/peformance/${level}`)}>
            View level reports
          </Button>
        </Permission>
        {prdLoading ? (
          <></>
        ) : periods?.data.data.length === 0 ? (
          <Permission privilege={Privileges.CAN_CREATE_INTAKE_PROGRAM_LEVELS}>
            <Button
              styleType="outline"
              onClick={() =>
                path.includes('learn')
                  ? history.push(
                      `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${level}/add-period`,
                    )
                  : path.includes('teach')
                  ? history.push(
                      `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${level}/add-period`,
                    )
                  : path.includes('manage')
                  ? history.push(
                      `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${level}/add-period`,
                    )
                  : {}
              }>
              Add {t('Period')}
            </Button>
          </Permission>
        ) : (
          <Button
            styleType="outline"
            onClick={() =>
              path.includes('learn')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${level}/view-period/${periods?.data.data[0].id}/view-class`,
                  )
                : path.includes('teach')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${level}/view-period/${periods?.data.data[0].id}/view-class`,
                  )
                : path.includes('manage')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${level}/view-period/${periods?.data.data[0].id}/view-class`,
                  )
                : {}
            }>
            {t('View_period').replace('_', ' ')}
          </Button>
        )}
      </TableHeader>
      <section className="mt-4 flex flex-wrap justify-start gap-4">
        {isLoading ? (
          <Loader />
        ) : levelModules.length <= 0 ? (
          <NoDataAvailable
            privilege={Privileges.CAN_CREATE_INTAKE_PROGRAM_LEVELS}
            buttonLabel="Add new modules"
            title={'No modules available in this level'}
            handleClick={() =>
              history.push(
                `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/${level}/add-module`,
              )
            }
            description="This level has not received any planned modules to take. you can add one from the button below."
          />
        ) : (
          <>
            <Permission privilege={Privileges.CAN_CREATE_INTAKE_PROGRAM_LEVELS}>
              <AddCard
                title={'Add new modules'}
                onClick={() =>
                  history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/${level}/add-module`,
                  )
                }
              />
            </Permission>
            {levelModules &&
              levelModules.map((module, index) => (
                <ModuleCard
                  showMenus={true}
                  intakeProgMod={true}
                  course={module}
                  key={index}
                  intakeProg={intakeProg}
                  editUrl={`/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/${level}/edit-module/${module.id}`}
                />
              ))}
          </>
        )}
      </section>
    </>
  );
}

export default IntakeLevelModule;
