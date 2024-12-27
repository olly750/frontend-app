import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import usePickedRole from '../../hooks/usePickedRole';
import { getClassById } from '../../store/administration/class.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { getStudentReportInTerm } from '../../store/evaluation/school-report.store';
import { Privileges } from '../../types';
import { usePicture } from '../../utils/file-util';
import { calculateGrade, formatPercentage, isFailure } from '../../utils/school-report';

interface IParamType {
  levelId: string;
  classId: string;
  studentId: string;
  periodId: string;
}

interface IReportTable {
  moduleId: string;
  moduleName: string;
  catObtained: number;
  catMax: number;
  examObtained: number;
  examMax: number;
}

export default function StudentAcademicReport() {
  const [isPrinting, setisPrinting] = useState(false);
  const picked_role = usePickedRole();

  //path params
  const { classId, studentId, periodId } = useParams<IParamType>();
  const history = useHistory();

  const { data: classInfo } = getClassById(classId);
  const { data: studentInfo } = intakeProgramStore.getStudentById(studentId);
  const { data: reportData } = getStudentReportInTerm(studentId, periodId);

  const marks: IReportTable[] = (reportData?.data.data.subject_marks || []).map((sm) => ({
    moduleId: sm.id,
    moduleName: sm.subject.title,
    catObtained: sm.quiz_obtained_marks,
    catMax: sm.quiz_marks,
    examObtained: sm.exam_obtained_marks,
    examMax: sm.exam_marks,
  }));
   console.log("report",reportData )
  const totals = {
    quizObtained: marks.reduce((partial_sum, a) => partial_sum + a.catObtained, 0),
    quizMax: marks.reduce((partial_sum, a) => partial_sum + a.catMax, 0),

    examObtained: marks.reduce((partial_sum, a) => partial_sum + a.examObtained, 0),
    examMax: marks.reduce((partial_sum, a) => partial_sum + a.examMax, 0),
  };

  const report = useRef(null);
  const { t } = useTranslation();

  const handlePrint = useReactToPrint({
    content: () => report.current,
    bodyClass: 'bg-white',
    documentTitle: studentInfo?.data
      ? `${studentInfo?.data.data.user.person?.current_rank?.abbreviation || '...'} ${
          studentInfo?.data.data.user.first_name || '...'
        }-${studentInfo?.data.data.user.last_name || '...'}-report`
      : 'student report',
    onBeforeGetContent: () => setisPrinting(true),
    onAfterPrint: () => setisPrinting(false),
  });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-5">
        <Button
          styleType={'text'}
          onClick={() => history.goBack()}
          icon
          className="flex items-center p-2 hover:underline">
          <Icon name="chevron-left" fill="primary" size={16} />
          Back
        </Button>
        <Permission privilege={Privileges.CAN_DOWNLOAD_REPORTS}>
          <Button disabled={isPrinting} onClick={() => handlePrint()}>
            Download report
          </Button>
        </Permission>
      </div>

      <div
        ref={report}
        className="px-10 py-10 bg-white mx-auto max-w-4xl border border-gray-300 print:border-none">
        <div className="flex justify-between">
          <div className="provider">
            <img
              src={usePicture(
                picked_role?.academy?.logo_attachment_id,
                picked_role?.academy_id,
                '/images/rdf-logo.png',
                'logos',
              )}
              alt="Institution logo"
              className=" w-20 object-cover block mb-5"
              onError={(e) => {
                e.currentTarget.src = '/images/rdf-logo.png';
              }}
            />
            <h2 className="text-base font-bold">
              {picked_role?.academy?.institution.name}
            </h2>
            <h2 className="text-sm font-medium py-2 uppercase">
              {picked_role?.academy?.name}
            </h2>
            <h3 className="text-sm font-medium pb-2">
              Mail: {picked_role?.academy?.email}
            </h3>
            <h3 className="text-sm font-medium">
              Tel: {picked_role?.academy?.phone_number}
            </h3>
          </div>
          <div className="student">
            <div className="w-20 mb-5">
              <img
                src={usePicture(
                  studentInfo?.data.data.user.profile_attachment_id,
                  studentInfo?.data.data.user.id,
                )}
                alt="Student profile"
                className="block w-20 h-20 object-cover border"
              />
            </div>
            <h2 className="text-sm font-bold ">
              Name:
              <span className="capitalize">
                {` ${studentInfo?.data.data.user.first_name || '...'} ${
                  studentInfo?.data.data.user.last_name || '...'
                }`}
              </span>
            </h2>
            <h2 className="text-sm py-2">
              Reg No: {studentInfo?.data.data.reg_number || '...'}
            </h2>
            <h2 className="text-sm font-medium">{`${
              classInfo?.data.data.academic_year_program_intake_level
                .academic_program_level.level.name || '...'
            } - ${
              classInfo?.data.data.academic_year_program_intake_level
                .academic_program_level.program.name || '...'
            }`}</h2>
            <h2 className="text-sm font-medium py-2">
              {`Class: ${classInfo?.data.data.class_name || '...'}`}
            </h2>
            <h2 className="text-sm font-medium">
              {classInfo?.data.data.academic_year_program_intake_level.academic_year
                .name || '...'}
            </h2>
          </div>
        </div>
        <h1 className="text-center font-bold underline my-10 text-base">COURSE REPORT</h1>

        {reportData?.data.data ? (
          <>
            {/* new grid */}
            <div className="grid grid-cols-6">
              <div className="col-span-2 border border-gray-700 px-3 flex items-center">
                <Heading fontSize="base" fontWeight="semibold">
                  Courses
                </Heading>
              </div>
              <div className="col-span-4">
                <Heading
                  fontSize="base"
                  fontWeight="semibold"
                  className="p-3 border border-gray-700 text-center uppercase">
                  term{' '}
                  {classInfo?.data.data.intake_academic_year_period?.academic_period
                    .name || ''}
                </Heading>

                <div className="grid grid-cols-3">
                  <Heading
                    fontSize="base"
                    fontWeight="semibold"
                    className="p-2 border border-gray-700 text-center">
                    Cat
                  </Heading>
                  <Heading
                    fontSize="base"
                    fontWeight="semibold"
                    className="p-2 border border-gray-700 text-center">
                    Exam
                  </Heading>
                  <Heading
                    fontSize="base"
                    fontWeight="semibold"
                    className="p-2 border border-gray-700 text-center">
                    Tot
                  </Heading>
                </div>
              </div>
            </div>

            {/* module and obtained marks title */}
            <div className="grid grid-cols-6">
              <div className="col-span-2">
                <Heading
                  fontSize="base"
                  fontWeight="semibold"
                  className="py-2 px-3 border border-gray-700">
                  Marks
                </Heading>
              </div>
              <div className="col-span-4 grid grid-cols-6">
                {[1, 2].map((i) => (
                  <React.Fragment key={i}>
                    <Heading
                      fontSize="sm"
                      fontWeight="semibold"
                      className="p-1 border border-gray-700 text-center">
                      Obt.
                    </Heading>
                    <Heading
                      fontSize="sm"
                      fontWeight="semibold"
                      className="p-1 border border-gray-700 text-center">
                      Max.
                    </Heading>
                  </React.Fragment>
                ))}
                <div className="col-span-2 grid grid-cols-3 ">
                  <Heading
                    fontSize="sm"
                    fontWeight="semibold"
                    className="p-1 border border-gray-700 text-center">
                    Obt.
                  </Heading>
                  <Heading
                    fontSize="sm"
                    fontWeight="semibold"
                    className="p-1 border border-gray-700 text-center">
                    Max.
                  </Heading>
                  <Heading
                    fontSize="sm"
                    fontWeight="semibold"
                    className="p-1 border border-gray-700 text-center">
                    Grade
                  </Heading>
                </div>
              </div>
            </div>
            {/* modules map */}
            {marks.map((m) => (
              <div key={m.moduleId} className="grid grid-cols-3">
                <p className="p-3 text-sm border border-gray-700">{m.moduleName}</p>
                <div className="grid-cols-6 col-span-2 grid">
                  <p
                    className={`p-3 text-sm border border-gray-700 ${
                      isFailure(m.catObtained, m.catMax) ? 'text-error-500' : ''
                    }`}>
                    {m.catObtained}
                  </p>
                  <p className="p-3 text-sm border border-gray-700">{m.catMax}</p>
                  <p
                    className={`p-3 text-sm border border-gray-700 
                  ${isFailure(m.examObtained, m.examMax) ? 'text-error-500' : ''}`}>
                    {m.examObtained}
                  </p>
                  <p className="p-3 text-sm border border-gray-700">{m.examMax}</p>
                  <div className="col-span-2 grid grid-cols-3">
                    <p
                      className={`p-3 text-sm border border-gray-700 
                ${
                  isFailure(m.catObtained + m.examObtained, m.examMax + m.catMax)
                    ? 'text-error-500'
                    : ''
                }`}>
                      {m.catObtained + m.examObtained}
                    </p>
                    <p className="p-3 text-sm border border-gray-700">
                      {m.examMax + m.catMax}
                    </p>
                    <p className="p-3 text-sm border border-gray-700">
                      {calculateGrade(
                        m.catObtained + m.examObtained,
                        m.examMax + m.catMax,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {/* totals row */}
            <div className="grid grid-cols-3">
              <div>
                <Heading fontSize="sm" className="p-3 border border-gray-700">
                  Total
                </Heading>
              </div>

              <div className="grid-cols-6 col-span-2 grid">
                <p className="p-3 text-sm border border-gray-700">
                  {totals.quizObtained}
                </p>
                <p className="p-3 text-sm border border-gray-700">{totals.quizMax}</p>
                <p className="p-3 text-sm border border-gray-700">
                  {totals.examObtained}
                </p>
                <p className="p-3 text-sm border border-gray-700">{totals.examMax}</p>

                <div className="col-span-2 grid grid-cols-3">
                  <p className="p-3 text-sm border border-gray-700">
                    {totals.quizObtained + totals.examObtained}
                  </p>
                  <p className="p-3 text-sm border border-gray-700">
                    {totals.quizMax + totals.examMax}
                  </p>
                  <p className="p-3 text-sm border border-gray-700">
                    {calculateGrade(
                      totals.quizObtained + totals.examObtained,
                      totals.quizMax + totals.examMax,
                    )}
                  </p>
                </div>
              </div>
            </div>
            {/* percentage */}
            <div className="grid grid-cols-6">
              <Heading
                fontSize="sm"
                fontWeight="semibold"
                className="p-3 col-span-2 border border-gray-700">
                Percentage
              </Heading>
              <Heading
                fontSize="sm"
                fontWeight="semibold"
                className="col-span-4 py-3 px-6 border border-gray-700 text-right">
                {`${formatPercentage(
                  totals.quizObtained + totals.examObtained,
                  totals.quizMax + totals.examMax,
                )} %`}
              </Heading>
            </div>
            {/* Student position */}
            <div className="grid grid-cols-6">
              <Heading
                fontSize="sm"
                fontWeight="semibold"
                className="p-3 col-span-2 border border-gray-700">
                Position
              </Heading>
              <Heading
                fontSize="sm"
                fontWeight="normal"
                className="col-span-4 py-3 px-6 border border-gray-700 text-right">
                <span className="font-bold">{reportData?.data.data.position}</span> outof
                <span className="font-bold"> {reportData?.data.data.total_students}</span>
              </Heading>
            </div>
            {/* Digital signature */}
            <div className="pt-8">
              <div className="grid grid-cols-3 py-6">
                <Heading fontSize="sm" fontWeight="semibold" className="px-3 py-2">
                  COMMANDANT
                </Heading>
                <Heading fontSize="sm" fontWeight="semibold" className="px-3 py-2">
                  CHIEF {t('Instructor')}
                </Heading>
                <Heading fontSize="sm" fontWeight="semibold" className="px-3 py-2">
                  SENIOR {t('Instructor')}
                </Heading>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12" />
                ))}
              </div>

              <div className="text-xs text-right font-medium">
                {new Date().toDateString()}
              </div>
            </div>
          </>
        ) : (
          <NoDataAvailable
            icon="academy"
            fill={false}
            showButton={false}
            title={'Report has not been processed'}
            description="This report has not been processed yet or you are currently not allowed to see it"
            privilege={Privileges.CAN_ACCESS_REPORTS}
          />
        )}
      </div>
    </div>
  );
}
