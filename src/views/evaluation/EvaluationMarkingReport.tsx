import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from 'react-query';
import { useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import Table from '../../components/Molecules/table/Table';
import usePickedRole from '../../hooks/usePickedRole';
import { classService } from '../../services/administration/class.service';
import { reportService } from '../../services/evaluation/school-report.service';
import { getStudentsByClass } from '../../store/administration/class.store';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ParamType, Privileges, ValueType } from '../../types';
import { IClass, StudentsInClass } from '../../types/services/class.types';
import {
  IMarkingProgressTable,
  MarkerSectionMarkingProgressReport,
} from '../../types/services/report.types';

export default function EvaluationMarkingReport() {
  const { id: evaluationId } = useParams<ParamType>();
  const {
    data: progressReport,
    isLoading: isPerformanceLoading,
    mutate: fetchReports,
  } = useMutation((evaluationId: string) =>
    reportService.getEvaluationMarkingProgressReport(evaluationId),
  );
  const [currentClassId, setCurrentClassId] = useState('');
  const [isPrinting, setisPrinting] = useState(false);
  const report = useRef(null);
  const picked_role = usePickedRole();
  const [formattedData, setFormattedData] = useState<IMarkingProgressTable[]>([]);
  const [classes, setclasses] = useState<IClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  const { data: students, isLoading: isStudentsLoading } =
    getStudentsByClass(currentClassId) || [];
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  const { data: evaluationInfo } =
    evaluationStore.getEvaluationById(evaluationId).data?.data || {};
  function handleChange(e: ValueType) {
    setCurrentClassId(e.value.toString());
  }

  useEffect(() => fetchReports(evaluationId), [evaluationId]);

  const { t } = useTranslation();

  function getSectionLabel(sec: MarkerSectionMarkingProgressReport) {
    return `${sec.sectionNames} - ${sec.instructorNames} / ${sec.totalNumQuestions} Qs`;
  }

  useEffect(() => {
    function formatPerfomanceData() {
      if (students?.data.data && progressReport?.data.data) {
        const sectionsInEvaluation = progressReport.data.data.marker_sections;
        const sectionsInEvaluationHash: Record<
          string,
          MarkerSectionMarkingProgressReport
        > = {};
        const studentsWhoDidEvaluation = progressReport.data.data.students;
        let studentInClassHash: Record<string, StudentsInClass> = {};
        const sanitizedReportData: IMarkingProgressTable[] = [];

        students.data.data.forEach((student) => {
          studentInClassHash[student.student.id] = student;
        });

        sectionsInEvaluation.forEach((sec) => {
          sectionsInEvaluationHash[sec.sectionId] = sec;
        });

        studentsWhoDidEvaluation.forEach((stud) => {
          const foundStudent = studentInClassHash[stud.adminId];

          let reportData: IMarkingProgressTable = {
            names: '-',
            id: '-',
          };

          if (foundStudent) {
            reportData = {
              names: `${
                foundStudent.student.user.person?.current_rank.abbreviation || ''
              } ${foundStudent.student.user.first_name} ${
                foundStudent.student.user.last_name
              }`,
              id: stud.adminId,
            };
          }

          // populate data with section headers in table, to avoid missing header when student sections do not have enough data
          sectionsInEvaluation.forEach((sec) => {
            const labelName = getSectionLabel(sec);
            reportData[labelName] = 0; // by default 0 is set, it will be overrode bellow if student have certain number of questions marked
          });

          stud.markedQuestions.forEach((markedSec) => {
            const sec = sectionsInEvaluationHash[markedSec.sectionId];
            if (sec) {
              const labelName = getSectionLabel(sec);

              reportData[labelName] = markedSec.totalMarked;
            }
          });

          sanitizedReportData.push(reportData);
        });

        setFormattedData(sanitizedReportData);
      }
    }

    formatPerfomanceData();
    // console.log('hello');

    // console.log(console.log(formattedData));
  }, [students?.data.data, progressReport?.data.data]);

  useEffect(() => {
    async function fetchClasses() {
      setLoadingClasses(true);
      const classIds = evaluationInfo?.intake_level_class_ids.split(',') || [];

      const classesToShow = await Promise.all(
        classIds.map(async (cl) => {
          return (await classService.getClassById(cl)).data.data;
        }),
      );
      setclasses(classesToShow);
      setLoadingClasses(false);
    }

    fetchClasses();
  }, [evaluationInfo?.intake_level_class_ids]);

  const handlePrint = useReactToPrint({
    content: () => report.current,
    documentTitle: `${evaluationInfo?.name} evaluation progressReport report`,
    onBeforeGetContent: () => setisPrinting(true),
    onAfterPrint: () => setisPrinting(false),
    copyStyles: true,
  });

  return (
    <div className="flex flex-col gap-8 -mt-8">
      <div className="flex justify-between items-center">
        <div>
          <Heading fontWeight="medium" fontSize="sm">
            Select {t('Class')}
          </Heading>
          <SelectMolecule
            loading={loadingClasses}
            width="80"
            value={currentClassId.toString()}
            handleChange={handleChange}
            name={'type'}
            placeholder={'Select ' + t('Class')}
            options={classes?.map((cls) => ({
              value: cls.id,
              label: cls.class_name,
            }))}
          />
        </div>
        <Permission privilege={Privileges.CAN_DOWNLOAD_REPORTS}>
          <Button
            disabled={isPrinting}
            onClick={() => {
              handlePrint();
            }}>
            Print report
          </Button>
        </Permission>
      </div>
      <div>
        {isPerformanceLoading || isStudentsLoading ? (
          <Loader />
        ) : formattedData.length === 0 ? (
          <NoDataAvailable
            title={'Nothing to show here'}
            description={
              'You have not selected any class or there are no submissions available for this evaluation'
            }
          />
        ) : (
          <div ref={report}>
            <Table data={formattedData} hide={['id']} showPagination={false} />
          </div>
        )}
      </div>
    </div>
  );
}
