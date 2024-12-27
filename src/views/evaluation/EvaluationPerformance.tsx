import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { getStudentsByClass } from '../../store/administration/class.store';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { getEvaluationPerformance } from '../../store/evaluation/school-report.store';
import { ParamType, Privileges, ValueType } from '../../types';
import { IClass } from '../../types/services/class.types';
import { IPerformanceTable } from '../../types/services/report.types';
import { calculateGrade } from '../../utils/school-report';

export default function EvaluationPerformance() {
  const { id: evaluationId } = useParams<ParamType>();
  const { data: performance, isLoading: isPerformanceLoading } =
    getEvaluationPerformance(evaluationId);
  const [currentClassId, setCurrentClassId] = useState('');
  const [isPrinting, setisPrinting] = useState(false);
  const report = useRef(null);
  const picked_role = usePickedRole();
  const [formattedData, setFormattedData] = useState<IPerformanceTable[]>([]);
  const [classes, setclasses] = useState<IClass[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(false);

  const { data: students, isLoading: isStudentsLoading } =
    getStudentsByClass(currentClassId) || [];

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationById(evaluationId).data?.data || {};
  function handleChange(e: ValueType) {
    setCurrentClassId(e.value.toString());
  }
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  const { t } = useTranslation();

  useEffect(() => {
    function formatPerfomanceData() {
      if (students?.data.data && performance?.data.data) {
        performance.data.data.sort((a, b) => {
          let aTotal = 0,
            bTotal = 0;
          a.questionPoints?.forEach((question) => {
            aTotal += question.obtainedTotal;
          });
          b.questionPoints?.forEach((question) => {
            bTotal += question.obtainedTotal;
          });
          return bTotal - aTotal;
        });
        let formattedData: IPerformanceTable[] = [];
        performance.data.data.map(async (record) => {
          // if this student is in the current class
          let student = students.data.data.find(
            (student) => student.student.id === record.student.admin_id,
          )?.student;
          if (student) {
            let total = {
              obtained: 0,
              max: 0,
            };

            let processed: IPerformanceTable = {
              rank: student.user.person?.current_rank?.abbreviation || '',
              first_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
                ? student.user.person?.alias_first_name || ' '
                : student.user.first_name,
              last_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
                ? student.user.person?.alias_last_name || ' '
                : student.user.last_name,
              // reg_number: student.reg_number,
              id: record.student.admin_id,
            };

            record.questionPoints?.forEach((question) => {
              total.max += question.questionTotal;
              total.obtained += question.obtainedTotal;

              const questionHtml = question.question;
              const div = document.createElement('div');
              div.innerHTML = questionHtml;
              // const questionText = div.textContent || div.innerText;

              // processed[`${questionText} /${question.questionTotal}`] =
              // question.obtainedTotal.toString();
            });

            processed[`total /${total.max}`] = total.obtained || '0';
            processed['percentage'] = isNaN((total.obtained / total.max) * 100)
              ? '0'
              : ((total.obtained / total.max) * 100).toFixed(2);
            processed['grade'] = calculateGrade(total.obtained, total.max);

            formattedData.push(processed);
          }
        });
        setFormattedData(formattedData);
      }
    }

    formatPerfomanceData();
    // console.log(console.log(formattedData));
  }, [students?.data.data, performance?.data.data]);

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
    documentTitle: `${evaluationInfo?.name} evaluation performance report`,
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
