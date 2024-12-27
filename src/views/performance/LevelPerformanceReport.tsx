import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

/* A function that takes in a tableID and a filename and exports the table to excel. */
import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import academicperiodStore from '../../store/administration/academicperiod.store';
import { getLevelTermlyOverallReport } from '../../store/evaluation/school-report.store';
import { Privileges } from '../../types';
import { EvStudent, IOverallLevelPerformance } from '../../types/services/report.types';
import { calculateGrade, formatPercentage, isFailure } from '../../utils/school-report';
import { exportTableToExcel } from '../../utils/utils';

interface ParamType {
  levelId: string;
}

interface StudentLevelReport {
  student: EvStudent;
  reports: IOverallLevelPerformance[] | undefined;
  position: number;
  total_marks: number;
  obtained_marks: number;
}

export default function LevelPerformanceReport() {
  const { levelId } = useParams<ParamType>();
  const history = useHistory();
  const { data: prds, isLoading: loadingPrds } =
    academicperiodStore.getPeriodsByIntakeLevelId(levelId);

  const [usedStudents, setUsedStudents] = useState<string[]>([]);
  const [studentRpt, setStudentRpt] = useState<StudentLevelReport[]>([]);

  const [labels, setLabels] = useState<
    {
      colSpan: number;
      yearPeriod: string;
      name: string;
      subject: { title: string; total_marks: number }[];
      total_marks: number;
    }[]
  >([]);

  const prdIds = prds?.data.data.map((prd) => prd.id).join(',');

  const { data: dt, isLoading } = getLevelTermlyOverallReport(prdIds || '');

  const performance = dt?.data.data;

  const report = useRef(null);
  // const [isPrinting, setisPrinting] = useState(false);

  // const handlePrint = useReactToPrint({
  //   content: () => report.current,
  //   bodyClass: 'bg-white',
  //   documentTitle: `end of level report`,
  //   onBeforeGetContent: () => setisPrinting(true),
  //   onAfterPrint: () => setisPrinting(false),
  // });

  const studentReports = (studentId: string) => {
    setUsedStudents([...usedStudents, studentId]);
    const reports = performance?.filter((prd) => prd.student.admin_id == studentId);

    return reports;
  };
  useEffect(() => {
    let terms: string[] = [];
    if (performance) {
      performance.sort((a, b) => {
        return a.position - b.position;
      });

      performance.forEach((prd) => {
        if (!terms.includes(prd.intakeAcademicYearPeriod.adminId)) {
          const term = prds?.data.data.find(
            (p) => p.id == prd.intakeAcademicYearPeriod.adminId,
          );

          let subjects: { title: string; total_marks: number }[] = [];
          prd.attemptedEvaluations.forEach((element) => {
            subjects.push({
              title: element.evaluation,
              total_marks: element.totalMarks,
            });
          });
          setLabels((labels) => [
            ...labels,
            {
              colSpan: prd.attemptedEvaluations?.length || 0,
              yearPeriod: prd.intakeAcademicYearPeriod.adminId || '',
              name: term?.academic_period.name || '',
              total_marks: prd.totalMarks || 0,
              subject: subjects,
            },
          ]);
          terms.push(prd.intakeAcademicYearPeriod.adminId);
        }

        if (!usedStudents.includes(prd.student.admin_id))
          setStudentRpt((rpt) => [
            ...rpt,
            {
              student: {
                admin_id: prd.student.admin_id,
                reg_number: prd.student.reg_number,
                since_on: prd.student.since_on,
                id: prd.student.id,
              },
              reports: studentReports(prd.student.admin_id),
              position: prd.position,
              total_marks: prd.totalMarks,
              obtained_marks: prd.obtainedMarks,
            },
          ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [performance, prds?.data.data]);
  const compareReports = (itemA: StudentLevelReport, itemB: StudentLevelReport) => {
    if (itemA.obtained_marks < itemB.obtained_marks) {
      return -1;
    }

    if (itemA.obtained_marks > itemB.obtained_marks) {
      return 1;
    }

    return 0;
  };
  useEffect(() => {
    studentRpt?.sort(compareReports);
  }, [studentRpt]);

  return (
    <div className="max-w-full">
      <div className="my-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            styleType={'text'}
            onClick={() => history.goBack()}
            icon
            className="flex items-center p-2 hover:underline">
            <Icon name="chevron-left" fill="primary" size={16} />
            Back
          </Button>
          <Heading fontSize="2xl" fontWeight="bold" className="text-primary-600">
            Overall Level Performance
          </Heading>
        </div>
        <Permission privilege={Privileges.CAN_DOWNLOAD_REPORTS}>
          <Button onClick={() => exportTableToExcel('download-report', 'level-report')}>
            Download report
          </Button>
        </Permission>
      </div>
      {isLoading || loadingPrds ? (
        <Loader />
      ) : (
        <div
          ref={report}
          className="px-10 py-10 bg-white max-w-7xl border border-gray-300 print:border-none overflow-x-auto">
          <table className="border border-gray-700 p-3 w-full" id="download-report">
            <thead className="border border-gray-700 p-3">
              <th colSpan={2} className="border-gray-700 p-3 border">
                Student Particulars
              </th>
              {labels.map((term, i) => {
                return (
                  <>
                    {/* {currentterm ? ( */}
                    <th
                      colSpan={term.colSpan + 2}
                      className="border-gray-700 p-3 border border-x-2 uppercase"
                      key={i}>
                      {term.name}
                    </th>
                    {/* ) : null} */}
                    {labels.length - 1 === i && (
                      <th
                        colSpan={4}
                        className="border-gray-700 p-3 border border-r-2 uppercase">
                        G Remarks
                      </th>
                    )}
                  </>
                );
              })}
            </thead>
            <thead className="border border-gray-700 p-3 font-bold text-left">
              <tr className="border border-gray-700 p-3">
                <th className="d-vertical border border-gray-700  p-3">Ser</th>
                <th className="d-vertical border border-gray-700  p-3 border-r-2">
                  Reg No
                </th>
                {labels.map((subj) =>
                  subj.subject.map((evaluation, i) => (
                    <>
                      <th className={`d-vertical w-10 border border-gray-700`}>
                        {evaluation.title} / {evaluation.total_marks}
                      </th>
                      {subj.subject.length - 1 === i ? (
                        <>
                          <th
                            className={`d-vertical w-10 border border-r-2 border-gray-700 bg-zinc-300`}>
                            Total / {subj.subject.reduce((a, b) => a + b.total_marks, 0)}
                          </th>
                          <th
                            className={`d-vertical w-10 border border-gray-700 border-r-2 bg-zinc-300`}>
                            Total / 100
                          </th>
                        </>
                      ) : null}
                    </>
                  )),
                )}
                <th className={`d-vertical w-10 border border-gray-700 bg-zinc-300`}>
                  General Total / {labels.reduce((a, b) => a + b.total_marks, 0)}
                </th>
                <th className={`d-vertical w-10 border border-gray-700 bg-zinc-300`}>
                  Percentage %
                </th>
                <th className={`d-vertical w-10 border border-gray-700`}>Grade</th>
                <th
                  className={`d-vertical w-10 border border-gray-700 border-r-2 bg-zinc-300`}>
                  Position
                </th>
              </tr>
            </thead>
            <tbody className="border border-gray-700 p-3">
              {studentRpt?.map((stud, i) => {
                const gpercentage = formatPercentage(
                  stud.obtained_marks,
                  stud.total_marks,
                );
                const gGrade = calculateGrade(stud.obtained_marks, stud.total_marks);
                const ghasFailed = isFailure(stud.obtained_marks, stud.total_marks);

                return (
                  <React.Fragment key={i}>
                    <tr className="border border-gray-700 p-3">
                      <td className="border-r border-gray-700 p-3">{i + 1}</td>
                      <td className="border-r-2 border-gray-700 p-3">
                        {stud.student.reg_number}
                      </td>
                      {stud.reports?.map((rpt) => (
                        <>
                          {rpt.attemptedEvaluations.map((subj, k) => (
                            <React.Fragment key={k}>
                              <td
                                className={`p-3 text-sm border border-gray-700 ${
                                  isFailure(subj.obtainedMarks, subj.totalMarks)
                                    ? 'text-error-500'
                                    : ''
                                }`}>
                                {subj.obtainedMarks}
                              </td>
                              {rpt.attemptedEvaluations.length - 1 === i ? (
                                <>
                                  <td
                                    className={`w-10 border border-gray-700 bg-zinc-300 ${
                                      isFailure(subj.obtainedMarks, subj.totalMarks)
                                        ? 'text-error-500'
                                        : ''
                                    }`}>
                                    {rpt.obtainedMarks}
                                  </td>
                                  <td
                                    className={`w-10 border border-gray-700 border-r-2 bg-zinc-300 ${
                                      isFailure(subj.obtainedMarks, subj.totalMarks)
                                        ? 'text-error-500'
                                        : ''
                                    }`}>
                                    {formatPercentage(rpt.obtainedMarks, rpt.totalMarks)}
                                  </td>
                                </>
                              ) : null}
                            </React.Fragment>
                          ))}
                          <td
                            className={`w-10 border border-gray-700 bg-zinc-300 ${
                              isFailure(rpt.obtainedMarks, rpt.totalMarks)
                                ? 'text-error-500'
                                : ''
                            }`}>
                            {rpt.obtainedMarks}
                          </td>
                          <td
                            className={`w-10 border border-gray-700 border-r-2 bg-zinc-300 ${
                              isFailure(rpt.obtainedMarks, rpt.totalMarks)
                                ? 'text-error-500'
                                : ''
                            }`}>
                            {formatPercentage(rpt.obtainedMarks, rpt.totalMarks)}
                          </td>
                        </>
                      ))}
                      <td
                        className={`w-10 border-r border-gray-700 bg-zinc-300 ${
                          ghasFailed ? 'text-error-500' : ''
                        }`}>
                        {stud.obtained_marks}
                      </td>
                      <td
                        className={`w-10 border-r border-gray-700 bg-zinc-300 ${
                          ghasFailed ? 'text-error-500' : ''
                        }`}>
                        {gpercentage}
                      </td>
                      <td className={`w-10 border border-gray-700`}>{gGrade}</td>
                      <td
                        className={`w-10 border border-gray-700 border-r-2 bg-zinc-300`}>
                        {stud.position}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
