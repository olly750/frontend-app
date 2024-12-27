import React, { useEffect, useState } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import ModuleCard from '../../components/Molecules/cards/modules/ModuleCard';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import { getModulesByLevel } from '../../store/administration/intake-program.store';
import { CommonCardDataType } from '../../types';
import { advancedTypeChecker } from '../../utils/getOption';
import LessonPlan from '../subjects/LessonPlan';
import SubjectDetails from '../subjects/SubjectDetails';
import ModuleDetails from './ModuleDetails';

export default function Modules({ level }: { level?: string }) {
  const { data, isLoading, isSuccess, isError } = getModulesByLevel(
    parseInt(level || ''),
  );

  const [modules, setModules] = useState<CommonCardDataType[]>([]);
  const { path } = useRouteMatch();

  useEffect(() => {
    if (isSuccess && data?.data) {
      let newModules: CommonCardDataType[] = [];
      data?.data.data.forEach((mod) => {
        newModules.push({
          status: {
            type: advancedTypeChecker(mod.generic_status),
            text: mod.generic_status.toString(),
          },
          intake_module_id:mod.id,
          code: mod.module.code,
          title: mod.module.name,
          description: mod.module.description,
          id: mod.module.id,
        });
      });

      setModules(newModules);
    }
  }, [data, isError, isSuccess]);

  return (
    <>
      <main className="px-4">
        <Switch>
          <Route
            exact
            path={`${path}`}
            render={() => {
              return (
                <>
                  <section className="flex flex-wrap justify-start gap-2">
                    {isLoading ? (
                      <Loader />
                    ) : modules.length == 0 ? (
                      <NoDataAvailable
                        showButton={false}
                        title={'No modules available in this level'}
                        description="This level has not received any planned modules to take. Please wait for the admin to add some"
                      />
                    ) : (
                      modules.map((course, index) => (
                        <ModuleCard
                          course={course}
                          key={index}
                          intakeProg={''}
                          showMenus={true}
                        />
                      ))
                    )}
                  </section>
                </>
              );
            }}
          />
          {/* view lesson plan form  */}
          <Route
            path={`${path}/lesson-plan/:id`}
            render={() => {
              return <LessonPlan />;
            }}
          />

          {/* show subject details */}
          <Route path={`${path}/subjects/:subjectId`} component={SubjectDetails} />
          <Route
            path={`${path}/:id`}
            render={() => {
              return <ModuleDetails />;
            }}
          />
        </Switch>
      </main>
    </>
  );
}
