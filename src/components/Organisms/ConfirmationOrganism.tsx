import React from 'react';
import toast from 'react-hot-toast';
import { useHistory, useLocation, useParams } from 'react-router-dom';

import useAuthenticator from '../../hooks/useAuthenticator';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ParamType } from '../../types';
import {
  IEvaluationStatus,
  IStudentEvaluationStart,
} from '../../types/services/evaluation.types';
import { useEvaluationStore } from '../../zustand/evaluation';
import Button from '../Atoms/custom/Button';
import Heading from '../Atoms/Text/Heading';
import PopupMolecule from '../Molecules/Popup';

interface IConfirmationProps {
  onConfirmationClose: () => void;
}

export default function ConfirmationOrganism({
  onConfirmationClose,
}: IConfirmationProps) {
  const { user } = useAuthenticator();
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { search } = useLocation();

  const evaluation = evaluationStore.getEvaluationById(id).data?.data.data;
  const studentEval = new URLSearchParams(search).get('studentEval');
  const evalId = new URLSearchParams(search).get('evaluation');
  const clearAnswersFromStore = useEvaluationStore((state) => state.clearAnswers);

  const { mutate, isLoading } = evaluationStore.studentEvaluationStart();

  function goToNext(studentEval: string, evaluationId: string) {
    history.push(
      `/dashboard/evaluations/student-evaluation/${studentEval}/${evaluationId}`,
    );
  }

  function generateStudentCode() {
    clearAnswersFromStore();
    const studentEvaluationStart: IStudentEvaluationStart = {
      attachment: '',
      evaluation_id: id,
      student_id: user?.id + '',
    };

    if (studentEval && evalId) {
      //TODO: remove this once doing evaluation is working well setLocalStorageData('studentEvaluationId', studentEval);
      toast.success('Recovered evaluation code', { duration: 5000 });
      goToNext(studentEval, evalId);
    } else {
      mutate(studentEvaluationStart, {
        onSuccess: (studentInfo) => {
          toast.success('Started evaluation', { duration: 5000 });
          goToNext(studentInfo.data.data.id, studentEvaluationStart.evaluation_id);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    }
  }

  return (
    <PopupMolecule
      closeOnClickOutSide={false}
      open
      title="Instructions"
      onClose={onConfirmationClose}>
      <div>
        <Heading fontWeight="semibold">{evaluation?.name || ''}</Heading>
        <div
          dangerouslySetInnerHTML={{
            __html: evaluation?.exam_instruction || '',
          }}
          className="leading-5 pb-6 w-96 text-txt-secondary text-sm mt-4"></div>

        <div className="flex justify-starg">
          <Button disabled={isLoading} onClick={generateStudentCode}>
            <span className="font-semibold">
              {evaluation?.evaluation_status == IEvaluationStatus.ON_GOING
                ? 'Continue evaluation'
                : 'Start Evaluation'}{' '}
            </span>
          </Button>
        </div>
      </div>
    </PopupMolecule>
  );
}
