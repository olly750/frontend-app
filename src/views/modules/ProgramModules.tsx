import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import AddCard from '../../components/Molecules/cards/AddCard';
import ModuleCard from '../../components/Molecules/cards/modules/ModuleCard';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import { moduleStore } from '../../store/administration/modules.store';
import { CommonCardDataType, ParamType, Privileges } from '../../types';
import { advancedTypeChecker } from '../../utils/getOption';

function ProgramModules() {
  const history = useHistory();
  const { url } = useRouteMatch();
  const [programModules, setProgramModules] = useState<CommonCardDataType[]>([]);
  const { id } = useParams<ParamType>();
  const { t } = useTranslation();

  const getAllModuleStore = moduleStore.getModulesByProgram(id);

  useEffect(() => {
    let newModules: CommonCardDataType[] = [];
    getAllModuleStore.data?.data.data.forEach((module) => {
      newModules.push({
        status: {
          type: advancedTypeChecker(module.generic_status),
          text: module.generic_status.toString(),
        },
        id: module.id,
        code: module.code,
        title: module.name,
        description: module.description,
        subTitle: `total subject: ${module.total_num_subjects || 'None'}`,
      });
    });

    setProgramModules(newModules);
  }, [getAllModuleStore.data?.data.data, id]);

  return (
    <>
      {getAllModuleStore.isLoading ? (
        <Loader />
      ) : (
        <section className="mt-4 flex flex-wrap justify-start gap-4">
          {programModules.length <= 0 ? (
            <NoDataAvailable
              privilege={Privileges.CAN_CREATE_MODULES}
              buttonLabel="Add new modules"
              title={'No Modules available in this ' + t('Program')}
              handleClick={() => history.push(`${url}/add`)}
              description={
                'There are no modules available for this ' + t('Program') + ' yet'
              }
            />
          ) : (
            <>
              <AddCard
                title={'Add new module'}
                onClick={() => history.push(`/dashboard/programs/${id}/modules/add`)}
                privilege={Privileges.CAN_CREATE_MODULES}
              />
              {programModules?.map((module) => (
                <ModuleCard
                  course={module}
                  key={module.code}
                  showMenus={false}
                  intakeProg={id}
                />
              ))}
            </>
          )}
        </section>
      )}
    </>
  );
}

export default ProgramModules;
