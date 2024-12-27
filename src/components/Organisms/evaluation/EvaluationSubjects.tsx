import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import useAuthenticator from '../../../hooks/useAuthenticator';
import  * as  evaluationService  from '../../../services/evaluation/evaluation.service';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { ValueType } from '../../../types';
import { IEvaluationStatus } from '../../../types/services/evaluation.types';
import { getDropDownOptions } from '../../../utils/getOption';
import Button from '../../Atoms/custom/Button';
import SelectMolecule from '../../Molecules/input/SelectMolecule';

type IEvaluationSubjectsProps = { evaluationId: string; action: string };

type formatSubjectInfo = {
  id: string;
  subject: string;
  status: IEvaluationStatus;
};

export default function EvaluationSubjects({
  evaluationId,
  action,
}: IEvaluationSubjectsProps) {
  const userInfo = useAuthenticator();

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationByIdAndInstructor(evaluationId, userInfo.user?.id + '')
      .data?.data || {};
  const history = useHistory();

  const [subjects, setSubjects] = useState<formatSubjectInfo[]>([]);
  const [subjectId, setSubjectId] = useState('');
  const [moduleSubject, setModuleSubject] = useState('');

  useEffect(() => {
    let filteredInfo: formatSubjectInfo[] = [];

    async function formatSubjectInfo() {
      if (evaluationInfo?.evaluation_module_subjects) {
        for (const [index, subj] of evaluationInfo.evaluation_module_subjects.entries()) {
          let temp = {
            id: subj.subject_academic_year_period.toString(),
            subject: subj.section_name || `Section ${index + 1}`,
            status: subj.questionaire_setting_status,
          };
          if (subj.instructor_subject_assignment === userInfo.user?.id) {
            filteredInfo.push(temp);
          }
        }

        setSubjects(filteredInfo);
      }
    }
    formatSubjectInfo();
  }, [evaluationInfo?.evaluation_module_subjects, userInfo.user?.id]);

  function handleChange(e: ValueType) {
    setSubjectId(
      evaluationInfo?.evaluation_module_subjects
        .find((mod) => mod.subject_academic_year_period == e.value.toString())
        ?.subject_academic_year_period.toString() || '',
    );
    setModuleSubject(
      evaluationInfo?.evaluation_module_subjects.find(
        (mod) => mod.subject_academic_year_period == e.value.toString(),
      )?.id || '',
    );
  }

  function handleAction() {
    if (action == 'finish_setting') {
      evaluationService
        .updateEvaluationModuleSubject(moduleSubject, IEvaluationStatus.COMPLETED)
        .then(() => {
          toast.success('Marked setting status to completed');
          history.goBack();
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } else if (action == 'add_questions') {
      history.push(
        `/dashboard/evaluations/details/${evaluationId}/section/${moduleSubject}/add-questions?subject=${subjectId}`,
      );
    } else {
      return;
    }
  }

  return (
    <>
      <SelectMolecule
        handleChange={handleChange}
        name="subjectId"
        placeholder="select section"
        options={getDropDownOptions({ inputs: subjects, labelName: ['subject'] })}>
        Select subject
      </SelectMolecule>

      <div className="py-6">
        <Button onClick={handleAction} disabled={!subjectId}>
          Continue
        </Button>
      </div>
    </>
  );
}
