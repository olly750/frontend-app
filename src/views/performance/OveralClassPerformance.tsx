import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import { getClassById, getStudentsByClass } from '../../store/administration/class.store';
import { getClassTermlyOverallReport } from '../../store/evaluation/school-report.store';
import { Privileges } from '../../types';
import { IPerformanceTable } from '../../types/services/report.types';
import { calculateGrade } from '../../utils/school-report';

interface IParamType {
  levelId: string;
  classId: string;
}

export function OveralClassPerformance() {
  const history = useHistory();
  const { url } = useRouteMatch();

  const { classId } = useParams<IParamType>();
  const [performance, setPerformance] = useState<IPerformanceTable[]>([]);
  const { data: classInfo, isLoading: clLoading } = getClassById(classId);

  let periodOfThisClass = classInfo?.data.data.intake_academic_year_period_id;
  const {
    data: studentsData,
    isIdle: studIdle,
    isLoading: studLoading,
  } = getStudentsByClass(classId) || [];
  const {
    data: performanceData,
    isIdle: reportIdle,
    isLoading: reportLoading,
    isError,
  } = getClassTermlyOverallReport(classId, periodOfThisClass + '', !!periodOfThisClass);

  useEffect(() => {
    let newInfo: IPerformanceTable[] = [];
    performanceData?.data.data.sort((a, b) => {
      return a.position - b.position;
    });
    performanceData?.data.data.forEach((record) => {
      studentsData?.data.data.forEach((student) => {
        if (record.student.admin_id === student.student.id) {
          let processed: IPerformanceTable = {
            rank: student.student.user.person?.current_rank?.abbreviation || '',
            first_name: student.student.user.first_name,
            last_name: student.student.user.last_name,
            // reg_number: record.student.reg_number,
            id: record.student.admin_id,
          };

          record.subject_marks?.forEach((mark) => {
            processed[`${mark.subject.title} /${mark.total_marks}`] =
              mark.obtained_marks.toString();
          });

          processed[`total /${record.total_marks}`] = `${
            record.quiz_obtained_marks + record.exam_obtained_marks
          }`;

          processed['Grade'] = calculateGrade(
            record.quiz_obtained_marks + record.exam_obtained_marks,
            record.total_marks,
          );

          processed['position'] = record.position;
          newInfo.push(processed);
          setPerformance(newInfo);
        }
      });
    });
  }, [performanceData?.data.data, studentsData?.data.data]);

  const studentActions = [
    {
      name: 'View report',
      handleAction: (id: string | number | undefined) => {
        history.push(`${url}/report/${id}/${periodOfThisClass}`); // go to view user profile
      },
    },
    // {
    //   name: 'Edit student',
    //   handleAction: (id: string | number | undefined) => {
    //     history.push(`/dashboard/users/${id}/edit`); // go to edit user
    //   },
    // },
  ];
  const { t } = useTranslation();

  return (
    <div>
      {reportLoading || reportIdle || studLoading || studIdle || clLoading ? (
        <Loader />
      ) : isError ? (
        <div>
          <h2 className="text-error-500 py-2 mb-3 font-medium tracking-widest">
            That was an error! May be this {t('Class')} has no students or no assignments
            done yet!
          </h2>
          <Button styleType="outline" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      ) : performance.length === 0 ? (
        <NoDataAvailable
          title={'No marks for this association found'}
          description={
            'No data associated with this ' +
            t('Class') +
            ' an this period found. try changing the period'
          }
          showButton={false}
        />
      ) : (
        <>
          <Button
            styleType={'text'}
            onClick={() => history.goBack()}
            icon
            className="flex items-center p-2 hover:underline">
            <Icon name="chevron-left" fill="primary" size={16} />
            Back
          </Button>
          <TableHeader
            showSearch={false}
            title={`${classInfo?.data.data.class_name || t('Class')} Performance`}
            totalItems={performance.length}>
            <Permission privilege={Privileges.CAN_PROMOTE_STUDENTS}>
              <Button
                styleType="outline"
                onClick={() => {
                  history.push(`${url}/deliberation`);
                }}>
                View in Deliberation Mode
              </Button>
            </Permission>
          </TableHeader>

          <Table
            statusColumn="status"
            data={performance}
            actions={studentActions}
            hide={['id']}
            uniqueCol="id"
          />
        </>
      )}
    </div>
  );
}
