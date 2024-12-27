import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import Row from '../../components/Atoms/custom/Row';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Table from '../../components/Molecules/table/Table';
import usePickedRole from '../../hooks/usePickedRole';
import { getClassById, getStudentsByClass } from '../../store/administration/class.store';
import { getClassTermlyEvaluationReport } from '../../store/evaluation/school-report.store';
import { Privileges } from '../../types';
import { StudentsInClass } from '../../types/services/class.types';
import { ITermlyPerformanceTable } from '../../types/services/report.types';
import { calculateGrade } from '../../utils/school-report';
import { exportTableToExcel } from '../../utils/utils';

interface IParamType {
  levelId: string;
  classId: string;
}

export default function ClassEvaluationPerformance() {
  const picked_role = usePickedRole();
  const history = useHistory();
  const { t } = useTranslation();
  const [performance, setPerformance] = useState<ITermlyPerformanceTable[]>([]);
  const [finalStudents, setFinalStudents] = useState<StudentsInClass[]>([]);

  const { classId } = useParams<IParamType>();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
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
  } = getClassTermlyEvaluationReport(
    classId,
    periodOfThisClass + '',
    !!periodOfThisClass,
  );

  useEffect(() => {
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

    setFinalStudents(rankedStudents.concat(unrankedStudents));
  }, [studentsData?.data.data]);

  useEffect(() => {
    let newInfo: ITermlyPerformanceTable[] = [];
    performanceData?.data.data.sort((a, b) => {
      return a.position - b.position;
    });
    performanceData?.data.data.forEach((record) => {
      finalStudents.forEach((student) => {
        // console.log(student);

        if (record.student.admin_id === student.student.id) {
          let processed: ITermlyPerformanceTable = {
            // rank: student.student.user.person?.current_rank?.abbreviation || '',
            first_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
              ? student.student.user.person?.alias_first_name || ''
              : student.student.user.first_name,
            last_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
              ? student.student.user.person?.alias_last_name || ''
              : student.student.user.last_name,
            // reg_number: record.student.reg_number,
            // id: record.student.admin_id,
          };

          record.attemptedEvaluations?.forEach((mark) => {
            processed[`${mark.evaluation} /${mark.totalMarks}`] =
              mark.obtainedMarks.toString();
          });

          processed[`total /${record.totalMarks}`] = `${record.obtainedMarks}`;

          processed['Grade'] = calculateGrade(record.obtainedMarks, record.totalMarks);

          processed['position'] = record.position;
          newInfo.push(processed);
          setPerformance(newInfo);
        }
      });
    });
  }, [finalStudents, performanceData?.data.data]);

  const getHeader = () => {
    let keys = Object.keys(performance[0]);
    let header: JSX.Element[] = []; 
    let showNumbering = true;

    showNumbering &&
      header.push(<th className={`w-10 border border-gray-700`}>Sn</th>);

    const dynamicHeaders = keys.map((key, i) => (<>
    {key ==='first name' ||key ==='last name' ?(<>
    
    <th key={i}>{key.toString().replaceAll('_', ' ')}</th>
    </>):(
       <th className={`w-10 border  border-gray-700`} key={i}>
       {key.toString().replaceAll('_', ' ')}
     </th>
    )}
       {/* <th className={`d-vertical w-10 border  border-gray-700`} key={i}>
        {key.toString().replaceAll('_', ' ')}
      </th> */}
    </>
   
    ));

    header.push(...dynamicHeaders);

    return header;
  };

  const getRowsData = () => {
    let keys = Object.keys(performance[0]);
    let showNumbering = true;
    let uniqueCol = 'id';

    return performance.map((row, index) => (
      <React.Fragment key={index}>
        <tr key={index} className="border border-gray-700 p-3">
          {showNumbering && <td className="border-r border-gray-700 p-3"> {index + 1}</td>}

          {keys.map((key) => {
            let val = row[key]; 

            return (
              <td className="border-r border-gray-700 p-3">
                 <span>{val || '----'}</span>
              </td> 
            );
          })}
        </tr>
      </React.Fragment>
    ));
  };

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
          <div className="flex items-center pt-4 pb-6 gap-4">
            <Button
              styleType={'text'}
              onClick={() => history.goBack()}
              icon
              className="flex items-center p-2 hover:underline">
              <Icon name="chevron-left" fill="primary" size={16} />
              Back
            </Button>
            <Heading fontSize="2xl" fontWeight="bold" className="text-primary-600">
              {`${
                classInfo?.data.data.class_name || t('Class')
              } Termly Evaluation Performance`}
            </Heading>
          </div>
          <Permission privilege={Privileges.CAN_DOWNLOAD_REPORTS}>
            <Button
              onClick={() =>
                exportTableToExcel('download-report', 'Termly Evaluation Performance')
              }>
              Download Excel report
            </Button>
          </Permission>

          <div className="px-10 py-10 bg-white max-w-7xl border border-gray-300 print:border-none overflow-x-auto">
            <table className="border border-gray-700 p-3 w-full" id="download-report">
              <thead className="border border-gray-700 p-3 font-bold text-left">
                <tr className="border border-gray-700 p-3">{getHeader()}</tr>
              </thead>
              <tbody className="border border-gray-700 p-3">{getRowsData()}</tbody>
            </table>
{/* 
         <Table
              tableId="download-report"
              data={performance}
              hide={['id']}
              uniqueCol="id"
              showSelect={false}
              showPagination={false}
            />   */}
          </div>
        </>
      )}
    </div>
  );
}
