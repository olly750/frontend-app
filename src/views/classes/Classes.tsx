import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import usePickedRole from '../../hooks/usePickedRole';
import { classStore } from '../../store/administration/class.store';
import { Privileges } from '../../types';
import { IntakePeriodParam } from '../../types/services/intake-program.types';
import SingleClass from './SingleClass';

function Classes() {
  const history = useHistory();

  const { url, path } = useRouteMatch();
  const { t } = useTranslation();
  const { intakeId, id, intakeProg, level, period } = useParams<IntakePeriodParam>();

  // const { user } = useAuthenticator();
  // const studentInfo = getStudentShipByUserId(user?.id + '' || '', !!user?.id).data?.data
  // .data[0];
  // const { data: studClasses, isLoading: studLoad } = classStore.getClassByStudentAndLevel(
  //   studentInfo?.id + '',
  //   levelId,
  // );

  const { data: classes, isLoading } = classStore.getClassByPeriod(period);
  const classGroups = classes?.data.data || [];

  // const studentClassIds = studClasses?.data.data.map((std) => std.id);
  // const studentClasses = classGroups.filter((cl) => studentClassIds?.includes(cl.id));

  const picked_role = usePickedRole();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : classGroups.length === 0 ? (
        <NoDataAvailable
          buttonLabel={'Add new ' + t('Class')}
          icon="academy"
          fill={false}
          title={'No ' + t('Class') + ' available in this period'}
          handleClick={() =>
            history.push(
              `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${level}/view-period/${period}/add-class`,
            )
          }
          description={
            `There are no` +
            t('Class') +
            ` added yet ${
              hasPrivilege(Privileges.CAN_CREATE_CLASSES)
                ? ', click on the below button to add some!'
                : ''
            }  `
          }
          privilege={Privileges.CAN_CREATE_CLASSES}
        />
      ) : (
        <Tabs>
          {classGroups.map((cl) => (
            <Tab label={cl.class_name} key={cl.id}>
              <SingleClass key={cl.id} classObject={cl} />
            </Tab>
          ))}
        </Tabs>
      )}
    </>
  );
}

export default Classes;
