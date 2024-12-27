/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import Loader from '../../../components/Atoms/custom/Loader';
import Heading from '../../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../../components/Molecules/input/SelectMolecule';
import Table from '../../../components/Molecules/table/Table';
import TabNavigation from '../../../components/Molecules/tabs/TabNavigation';
import { useClasses } from '../../../hooks/useClasses';
import { getStudentsByClass } from '../../../store/administration/class.store';
import  * as  markingStore  from '../../../store/administration/marking.store';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { ValueType } from '../../../types';
import { IEvaluationInfo } from '../../../types/services/evaluation.types';
import { UnMarkedStudent } from '../../../types/services/marking.types';
import { Student } from '../../../types/services/user.types';
import FieldMarkedStudents from './FieldMarkedStudents';

type PropsType = {
  evaluationId: string;
};

export default function FieldMarking({ evaluationId }: PropsType) {
  const [currentClassId, setCurrentClassId] = useState<string>('');
  const [students, setStudents] = useState<UnMarkedStudent[]>([]);
  const history = useHistory();

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationById(evaluationId).data?.data || {};
  const markedStudents =
    markingStore.getEvaluationStudentEvaluations(evaluationId).data?.data.data || [];

  const { data: studentsData, isLoading } = getStudentsByClass(currentClassId) || [];

  const [classes, setclasses] = useState(
    evaluationInfo?.intake_level_class_ids.split(',').filter((item) => item != ''),
  );

  function handleClassChange(e: ValueType) {
    setCurrentClassId(e.value.toString());
  }

  const { url, path } = useRouteMatch();

  const actions = [
    {
      name: 'Mark Student',
      // eslint-disable-next-line no-undef
      handleAction: (id: string | number | undefined | IEvaluationInfo | Student) => {
        history.push(
          `/dashboard/evaluations/details/${evaluationId}/submissions/field/${id}/mark`,
        );
      },
    },
    {
      name: 'View student',
      handleAction: (id: string | number | undefined | IEvaluationInfo | Student) => {
        history.push(`/dashboard/user/${id}/profile`);
      },
    },
  ];
  const { t } = useTranslation();

  const tabs = [
    {
      label: 'Unmarked',
      href: `${url}`,
    },
    {
      label: 'Marked',
      href: `${url}/field/marked`,
    },
  ];

  useEffect(() => {
    setclasses(
      evaluationInfo?.intake_level_class_ids.split(',').filter((item) => item != ''),
    );
  }, [evaluationInfo?.intake_level_class_ids]);

  useEffect(() => {
    let newState: UnMarkedStudent[] = [];

    let markedIds: string[] = [];

    for (let index = 0; index < markedStudents.length; index++) {
      markedIds.push(markedStudents[index].student.admin_id);
    }

    const rankedStudents =
      studentsData?.data.data.filter((stud) => stud.student.user.person?.current_rank) ||
      [];
    const unrankedStudents =
      studentsData?.data.data.filter(
        (inst) => inst !== rankedStudents.find((ranked) => ranked.id === inst.id),
      ) || [];

    rankedStudents.sort(function (a, b) {
      if (a.student.user.person && b.student.user.person) {
        return (
          a.student.user.person.current_rank?.priority -
          b.student.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });
    const finalStudents = rankedStudents.concat(unrankedStudents);

    finalStudents.forEach((std) => {
      if (!markedIds.includes(std.student.id + '')) {
        newState.push({
          id: std.student.id.toString(),
          rank: std.student.user.person?.current_rank?.abbreviation || '',
          first_name: std.student.user.first_name,
          last_name: std.student.user.last_name,
          out_of: evaluationInfo?.total_mark + '',
          obtained: 'N/A',
        });
      }
    });
    setStudents(newState);
  }, [evaluationInfo?.total_mark, markedStudents, studentsData?.data]);

  return (
    <div className="flex flex-col gap-8 -mt-20">
      <div className="pt-8">
        <Heading fontWeight="medium" fontSize="sm">
          Select {t('Class')}
        </Heading>
        <SelectMolecule
          width="80"
          className=""
          value={currentClassId}
          handleChange={handleClassChange}
          name={'type'}
          placeholder="Class name"
          options={classes?.map((cl) => useClasses(cl)) || []}
        />
      </div>
      <TabNavigation tabs={tabs}>
        <div className="pt-8"></div>
      </TabNavigation>
      <Switch>
        <Route
          exact
          path={`${path}`}
          render={() => (
            <div>
              {isLoading ? (
                <Loader />
              ) : students.length === 0 ? (
                <NoDataAvailable
                  showButton={false}
                  icon="user"
                  buttonLabel="Add new student"
                  title={'No students available'}
                  description="It looks like there aren't any students who are not marked for this evaluation"
                />
              ) : (
                <Table<UnMarkedStudent>
                  statusColumn="status"
                  data={students}
                  hide={['id']}
                  uniqueCol={'id'}
                  actions={actions}
                />
              )}
            </div>
          )}
        />
        <Route
          exact
          path={`${path}/field/marked`}
          render={() => <FieldMarkedStudents />}
        />
      </Switch>
    </div>
  );
}
