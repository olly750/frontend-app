import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import ModuleCard from '../../components/Molecules/cards/modules/ModuleCard';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import TableHeader from '../../components/Molecules/table/TableHeader';
import enrollmentStore from '../../store/administration/enrollment.store';
import { moduleStore } from '../../store/administration/modules.store';
import { CommonCardDataType, Link } from '../../types';
import { Instructor } from '../../types/services/instructor.types';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { advancedTypeChecker } from '../../utils/getOption';
import { getObjectFromLocalStrg } from '../../utils/utils';

function InstrLevelModule() {
  const { url } = useRouteMatch();

  const [InstrModules, setInstrModules] = useState<CommonCardDataType[]>([]);

  const instructorInfo = getObjectFromLocalStrg(getLocalStorageData('instructorInfo'));

  const [instructor, setinstructor] = useState<Instructor>();

  useEffect(() => setinstructor(instructorInfo), [instructorInfo]);

  const { data: instModules, isLoading } = enrollmentStore.getModulesByInstructorId(
    instructor?.id + '',
  );

  const { data: allModules, isLoading: allModLoading } = moduleStore.getAllModules();

  useEffect(() => {
    const instModuleIds = instModules?.data.data.map((inst) => inst.course_module_id);

    const instructorModules = allModules?.data.data.filter((mod) =>
      instModuleIds?.includes(mod.id + ''),
    );

    let newModule: CommonCardDataType[] = [];
    instructorModules?.forEach((mod) => {
      newModule.push({
        status: {
          type: advancedTypeChecker(mod.generic_status),
          text: mod.generic_status.toString(),
        },
        id: mod.id,
        code: mod.code,
        title: mod.name,
        description: mod.description,
        subTitle: `total subject: ${mod.total_num_subjects || 'None'}`,
      });
    });

    setInstrModules(newModule);
  }, [instModules?.data.data, allModules?.data.data]);

  const list: Link[] = [
    { to: '/dashboard/inst-program', title: 'Dashboard' },
    { to: `${url}`, title: 'Modules' },
  ];

  return (
    <>
      <BreadCrumb list={list} />
      <TableHeader
        title="modules"
        totalItems={`${InstrModules.length}`}
        showBadge={false}
        showSearch={false}
      />
      <section className="mt-4 flex flex-wrap justify-start gap-4">
        {isLoading || allModLoading ? (
          <Loader />
        ) : InstrModules.length === 0 ? (
          <NoDataAvailable
            showButton={false}
            title={`There are no modules for yet`}
            description="You don't have any modules with assigned to you in this institution yet! Please contact the admin for support"
          />
        ) : (
          InstrModules &&
          InstrModules.map((module, index) => (
            <ModuleCard course={module} key={index} intakeProg={''} showMenus={true} />
          ))
        )}
      </section>
    </>
  );
}

export default InstrLevelModule;
