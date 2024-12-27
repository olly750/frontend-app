import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import Table from '../../components/Molecules/table/Table';
import usePickedRole from '../../hooks/usePickedRole';
import {
  classStore,
  getClassById,
  getStudentsByClass,
} from '../../store/administration/class.store';
import { getModulesByLevel } from '../../store/administration/intake-program.store';
import { getModuleTermPerformance } from '../../store/evaluation/school-report.store';
import { Privileges, SelectData } from '../../types';
import { IPerformanceTable } from '../../types/services/report.types';
import { calculateGrade } from '../../utils/school-report';

interface IParamType {
  levelId: string;
  classId: string;
}

export default function TermModulePerfomance() {
  const [moduleId, setModuleId] = useState<string | undefined>(undefined);
  const { levelId, classId } = useParams<IParamType>();
  const history = useHistory();
  const picked_role = usePickedRole();
  //   data from backend
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  const { data: classInfo } = getClassById(classId);
  const periodId = classInfo?.data.data.intake_academic_year_period_id.toString();

  const classesPeriod = classStore.getClassByPeriod(periodId || '');
  const classes = classesPeriod.data?.data.data.map((cl) => cl.id).join(',');

  const { data, isLoading } = getModuleTermPerformance(moduleId, periodId, classes);
  const { data: modules, isLoading: modulesLoading } = getModulesByLevel(
    parseInt(levelId),
  );
  const { data: studentsData } = getStudentsByClass(classId) || [];

  // auto select first module
  useEffect(() => {
    if (modules?.data.data.length && classes?.length && !moduleId)
      setModuleId(modules.data.data[0].module.id.toString());
  }, [moduleId, modules, classes]);

  const formattedData: IPerformanceTable[] = [];

  const rankedStudents =
    studentsData?.data.data.filter((stud) => stud.student.user.person?.current_rank) ||
    [];
  const unrankedStudents =
    studentsData?.data.data.filter(
      (stud) => stud !== rankedStudents.find((ranked) => ranked.id === stud.id),
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

  finalStudents.forEach((student) => {
    let overallTotal = 0;
    data?.data.data.map((record) => {
      let total = {
        obtained: 0,
        max: 0,
      };
      if (record.student.admin_id === student.student.id) {
        let processed: IPerformanceTable = {
          rank: student.student.user.person?.current_rank?.abbreviation || '',
          first_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
            ? student.student.user.person?.alias_first_name || ''
            : student.student.user.first_name,
          last_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
            ? student.student.user.person?.alias_last_name || ''
            : student.student.user.last_name,
          // reg_number: record.student.reg_number,
          id: record.student.admin_id,
        };

        record.evaluationAttempts?.forEach((evaluation) => {
          total.max += evaluation.maximum;
          total.obtained += evaluation.obtained;

          processed[`${evaluation.evaluationName} /${evaluation.maximum}`] =
            evaluation.obtained.toString();
        });

        processed['grade'] = calculateGrade(total.obtained, total.max);
        processed[`total /${total.max}`] = total.obtained;
        overallTotal = total.max;
        formattedData.push(processed);
      }
    });

    //sort formatted data
    let totalF = `total /${overallTotal}`;
    formattedData.sort((a, b) =>
      a[totalF] < b[totalF] ? 1 : b[totalF] < a[totalF] ? -1 : 0,
    );
  });

  return (
    <>
      <div className="flex items-center pt-4 pb-6 gap-4">
        <Button
          styleType={'text'}
          onClick={() => history.goBack()}
          icon
          className="flex items-center p-2 hover:underline">
          <Icon name="chevron-left" fill="primary" size={16} />
          Back
        </Button>
        <SelectMolecule
          loading={modulesLoading}
          value={moduleId}
          handleChange={(e) => setModuleId(e.value.toString())}
          name={'module'}
          options={(modules?.data.data || []).map(
            (m) =>
              ({ label: m.module.name, value: m.module.id.toString() } as SelectData),
          )}
        />
      </div>

      {isLoading ? (
        <Loader />
      ) : formattedData.length === 0 ? (
        <NoDataAvailable
          title={'Nothing to show here'}
          description={'There are no submissions available for this evaluation'}
        />
      ) : (
        <Table data={formattedData} hide={['id']} />
      )}
    </>
  );
}
