import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Loader from '../../components/Atoms/custom/Loader';
import AddCard from '../../components/Molecules/cards/AddCard';
import ModuleCard from '../../components/Molecules/cards/modules/ModuleCard';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import useInstructorModules from '../../hooks/getInstructorModules';
import { CommonCardDataType, Privileges } from '../../types';
import { Instructor } from '../../types/services/instructor.types';
import { IntakeProgParam } from '../../types/services/intake-program.types';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { advancedTypeChecker } from '../../utils/getOption';
import { getObjectFromLocalStrg } from '../../utils/utils';

function IntakeProgramModules() {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [programModules, setProgramModules] = useState<CommonCardDataType[]>([]);
  const { id, intakeProg } = useParams<IntakeProgParam>();
  const { t } = useTranslation();
  const instructorInfo: Instructor | null = getObjectFromLocalStrg(
    getLocalStorageData('instructorInfo'),
  );

  let { getAllModuleStore, instructorModules, instModules } = useInstructorModules(
    id,
    instructorInfo?.id + '',
  );

  useEffect(() => {
    let newModules: CommonCardDataType[] = [];

    getAllModuleStore.data?.data.data.forEach((mod) =>
      newModules.push({
        status: {
          type: advancedTypeChecker(mod.generic_status),
          text: mod.generic_status.toString(),
        },
        id: mod.id,
        code: mod.code,
        title: mod.name,
        description: mod.description,
        subTitle: `total subject: ${mod.total_num_subjects || 'None'}`,
      }),
    );
    setProgramModules(newModules);
  }, [getAllModuleStore.data?.data.data, id]);

  //inner component
  const ModuleDisplay = ({
    modules,
    isLoading,
  }: {
    modules: CommonCardDataType[];
    isLoading: boolean;
  }) => {
    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <section className="mt-4 flex flex-wrap justify-start gap-4">
            {modules.length <= 0 ? (
              <NoDataAvailable
                privilege={Privileges.CAN_CREATE_INTAKE_PROGRAM_MODULES}
                buttonLabel="Add new modules"
                title={'No modules available'}
                handleClick={() => history.push(`${url}/add`)}
                description={
                  'Looks like there are no modules assigned to you or are in this intake ' +
                  t('Program') +
                  ' yet!'
                }
              />
            ) : (
              <>
                <Permission privilege={Privileges.CAN_CREATE_INTAKE_PROGRAM_MODULES}>
                  <AddCard
                    title={'Add new module'}
                    onClick={() => history.push(`${url}/add`)}
                  />
                </Permission>
                {modules.map((module, index) => (
                  <ModuleCard
                     intakeProgMod={false}
                    intakeProg={intakeProg}
                    course={module}
                    showMenus={true}
                    key={index}
                  />
                ))}
              </>
            )}
          </section>
        )}
      </>
    );
  };

  return (
    <>
      {instructorInfo ? (
        <Tabs>
          <Tab label={`Modules assigned to ${t('Instructor')}`}>
            <ModuleDisplay
              modules={instModules}
              isLoading={instructorModules.isLoading}
            />
          </Tab>
          <Tab label={`Other modules in the program`}>
            <ModuleDisplay
              modules={programModules.filter(
                (mod) => !instModules.map((mod) => mod.id).includes(mod.id),
              )}
              isLoading={getAllModuleStore.isLoading}
            />
          </Tab>
        </Tabs>
      ) : (
        <ModuleDisplay modules={programModules} isLoading={getAllModuleStore.isLoading} />
      )}
    </>
  );
}

export default IntakeProgramModules;
