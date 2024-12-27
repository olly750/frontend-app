import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useLocation, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Table from '../../components/Molecules/table/Table';
import enrollmentStore from '../../store/administration/enrollment.store';
import { subjectStore } from '../../store/administration/subject.store';
import { Privileges } from '../../types';
import { UserTypes } from '../../types/services/user.types';
import EnrollInstructorToSubjectAssignment from './EnrollInstructorToSubjectAssignment';
interface SubjectViewerProps {
  subjectId: string;
}

function SubjectInstructors({ subjectId }: SubjectViewerProps) {
  const { search } = useLocation();
  const intakeProg = new URLSearchParams(search).get('intkPrg') || '';
  const { path } = useRouteMatch();
  const { data: subjectData } = subjectStore.getSubject(subjectId);
  const { data: instructorInfos, isLoading } =
    enrollmentStore.getInstructorsBySubject(subjectId);
  const { t } = useTranslation();

  let instrs: UserTypes[] = [];

  const rankedInstructors =
    instructorInfos?.data.data.filter((inst) => inst.user.person?.current_rank) || [];
  const unrankedInstructors =
    instructorInfos?.data.data.filter(
      (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
    ) || [];

  rankedInstructors.sort(function (a, b) {
    if (a.user.person && b.user.person) {
      return a.user.person.current_rank?.priority - b.user.person.current_rank?.priority;
    } else {
      return 0;
    }
  });

  const finalInstructors = rankedInstructors.concat(unrankedInstructors);

  finalInstructors.map((obj) => {
    let {
      id,
      username,
      first_name,
      last_name,
      email,
      person,
      academy,
      generic_status,
      user_type,
    } = obj.user;

    let user: UserTypes = {
      id: id,
      rank: person?.current_rank?.abbreviation,
      username: username,
      'full name': first_name + ' ' + last_name,
      email: email,
      'ID Card': person?.nid || '',
      academy: academy && academy.name,
      status: generic_status,
      user_type: user_type,
      alias_last_name: undefined,
      alias_first_name: undefined,
    };

    instrs.push(user);
  });

  return (
    <Switch>
      <Route
        exact
        path={`${path}`}
        render={() => (
          <div className="flex flex-col gap-4 z-0 pt-6">
            <div className="flex justify-between items-center">
              <Heading fontSize="base" fontWeight="semibold">
                {t('Instructor')} ({0})
              </Heading>
              {intakeProg && (
                <Permission privilege={Privileges.CAN_ENROLL_INSTRUCTORS_ON_SUBJECT}>
                  <EnrollInstructorToSubjectAssignment
                    module_id={subjectData?.data.data.module.id + ''}
                    subject_id={subjectId}
                    intakeProg={intakeProg}
                    subInstructors={instructorInfos?.data.data || []}
                  />
                </Permission>
              )}
            </div>
            <>
              {isLoading ? (
                <Loader />
              ) : instructorInfos?.data.data.length === 0 ? (
                <>
                  {/* <div className="flex justify-end">
                    <EnrollInstructorToSubjectAssignment
                      subInstructors={instructorInfos?.data.data || []}
                      module_id={subjectData?.data.data.module.id + ''}
                      subject_id={subjectId}
                      intakeProg={intakeProg}
                    />
                  </div> */}
                  <NoDataAvailable
                    showButton={false}
                    icon="user"
                    title={'No ' + t('Instructor') + ' available'}
                    description={
                      'There are no ' +
                      t('Instructor') +
                      ' currently assigned to this subject'
                    }
                    privilege={Privileges.CAN_ENROLL_INSTRUCTORS_ON_SUBJECT}
                  />
                </>
              ) : (
                <Table<UserTypes>
                  statusColumn="status"
                  data={instrs}
                  selectorActions={[
                    {
                      name: 'Remove ' + t('Instructor') + ' from subject',
                      handleAction: () => {},
                      privilege: Privileges.CAN_REMOVE_INSTRUCTORS_ON_SUBJECT,
                    },
                  ]}
                  hide={['id', 'user_type']}
                  uniqueCol="id"
                />
              )}
            </>
          </div>
        )}
      />
    </Switch>
  );
}

export default SubjectInstructors;
