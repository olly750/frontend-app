import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import usePickedRole from '../../hooks/usePickedRole';
import academicperiodStore from '../../store/administration/academicperiod.store';
import { getLevelTermlyOverallReport } from '../../store/evaluation/school-report.store';
import { Privileges } from '../../types';
import { IPerformanceTable } from '../../types/services/report.types';
import ClassPeriodPerformance from './ClassPeriodPerformance';
import DSReportOnStudent from './DSReportOnStudent';
import EndOfLevelReport from './EndOfLevelReport';
import EndTermForm from './EndTermForm';
import LevelPerformanceReport from './LevelPerformanceReport';
import StudentAcademicReport from './StudentAcademicReport';
import StudentEndTermForm from './StudentEndTermForm';

interface ParamType {
  levelId: string;
}

export default function LevelPerformance() {
  const { levelId } = useParams<ParamType>();
  const { path } = useRouteMatch();
  const { t } = useTranslation();

  const list = [
    { to: 'home', title: 'Institution Admin' },
    { to: 'programs', title: t('Program') },
    { to: 'level', title: 'Performance' },
  ];
  const { data: prds } = academicperiodStore.getPeriodsByIntakeLevelId(levelId);

  const prdIds = prds?.data.data.map((prd) => prd.id).join(',');

  const { data } = getLevelTermlyOverallReport(prdIds || '');

  const picked_role = usePickedRole();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  let performance: IPerformanceTable[] = [];
  data?.data.data.sort((a, b) => {
    return b.position - a.position;
  });
  data?.data.data?.forEach((record) => {
    let processed: IPerformanceTable = {
      term:
        prds?.data.data.find((prd) => prd.id === record.intakeAcademicYearPeriod.adminId)
          ?.academic_period.name || '',
      reg_number: record.student.reg_number,
      id: record.student.admin_id,
      first_name: '',
      last_name: '',
      rank: '',
    };

    record.attemptedEvaluations?.forEach((mark) => {
      processed[`${mark.evaluation} /${mark.totalMarks}`] = mark.obtainedMarks.toString();
    });

    processed[`total /${record.totalMarks}`] = `${record.obtainedMarks}`;

    // processed['Grade'] = calculateGrade(
    //   record.quiz_obtained_marks + record.exam_obtained_marks,
    //   record.total_marks,
    // );

    // processed['position'] = record.position;
    performance.push(processed);
  });

  // const { data, isLoading } = classStore.getClassByPeriod(levelId);

  // const periods: CommonCardDataType[] = data?.data.data.map((clas) => ({
  //   id: clas.id,
  //   code: clas.academic_period.name.toUpperCase(),
  //   description:
  //     clas.academic_year_program_intake_level.academic_program_level.level.description,
  //   title: clas.academic_period.academic_year.name,
  //   status: {
  //     type: advancedTypeChecker(clas.progress_status),
  //     text: clas.progress_status.toString(),
  //   },
  // })) || [];

  // const classes: CommonCardDataType[] =
  //   data?.data.data.map((clas) => ({
  //     id: clas.id,
  //     code: clas.class_group_type.toUpperCase(),
  //     description:
  //       clas.academic_year_program_intake_level.academic_program_level.level.description,
  //     title: clas.class_name,
  //     status: {
  //       type: advancedTypeChecker(clas.generic_status),
  //       text: clas.generic_status.toString(),
  //     },
  //   })) || [];

  return (
    <>
      <BreadCrumb list={list} />

      <Switch>
        <Route
          exact
          path={`${path}/:classId/report/:studentId/:periodId`}
          render={() => (
            <Tabs>
              <Tab label="Academic report">
                <StudentAcademicReport />
              </Tab>
              <Tab label="(Student) Informative report">
                <StudentEndTermForm />
              </Tab>
              <Tab
                label={
                  hasPrivilege(Privileges.CAN_WRITE_INFORMATIVE_REPORT)
                    ? '(Manage) Informative report'
                    : ''
                }>
                <Permission privilege={Privileges.CAN_WRITE_INFORMATIVE_REPORT}>
                  <EndTermForm />
                </Permission>
              </Tab>
              <Tab label="TEWT report">
                <DSReportOnStudent />
              </Tab>
              <Tab label="Yearly report">
                <EndOfLevelReport />
              </Tab>
            </Tabs>
          )}
        />
        <Route path={`${path}/:classId`} component={ClassPeriodPerformance} />
        <Route path={`${path}`} render={() => <LevelPerformanceReport />} />
      </Switch>
    </>
  );
}
