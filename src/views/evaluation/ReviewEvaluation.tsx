import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import TextAreaMolecule from '../../components/Molecules/input/TextAreaMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import EvaluationContent from '../../components/Organisms/evaluation/EvaluationContent';
import useAuthenticator from '../../hooks/useAuthenticator';
import { queryClient } from '../../plugins/react-query';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ValueType } from '../../types';
import {
  IEvaluationOwnership,
  UpdateEvaluationApprovalStatusEnum,
} from '../../types/services/evaluation.types';

interface IProps {
  evaluationId: string;
}

export default function ReviewEvaluation({ evaluationId }: IProps) {
  const history = useHistory();
  const { user } = useAuthenticator();

  const evaluationApprovals =
    evaluationStore.getEvaluationReviewByEvaluationAndInstructor(
      evaluationId,
      user?.id + '',
    ).data?.data.data;

  const [remarks, setRemarks] = useState('');
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState('');

  const { mutateAsync, isLoading } = evaluationStore.reviewEvaluation();

  const review = () => {
    setOpen(true);
    let udpateEvaluationStatus = {
      evaluation_id: evaluationId,
      evaluation_reviewer_status:
        action === 'review'
          ? UpdateEvaluationApprovalStatusEnum.REVIEWED
          : UpdateEvaluationApprovalStatusEnum.REJECTED,
      instructor_id: user?.id + '',
      remarks: remarks,
    };

    if ((remarks && action === 'reject') || action === 'review') {
      mutateAsync(udpateEvaluationStatus, {
        onSuccess: () => {
          toast.success('Evaluation has been reviewiewed');
          queryClient.invalidateQueries([
            'evaluations',
            user?.id,
            IEvaluationOwnership.FOR_REVIEWING,
          ]);
          history.goBack();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    } else toast.error('A remark is needed when rejecting!');
  };

  function changeAction(action: string) {
    setOpen(true);
    setAction(action);
  }

  function closePopup() {
    setOpen(false);
    setRemarks('');
  }

  return (
    <>
      <EvaluationContent
        showSetQuestions={false}
        showActions = {true}
        evaluationId={evaluationId}
        actionType="reviews">
        <Button
          disabled={evaluationApprovals?.evaluation_reviewer_status + '' !== 'PENDING'}
          onClick={() => changeAction('review')}>
          Mark as reviewed
        </Button>
        {/* <Button
          disabled={evaluationApprovals?.evaluation_reviewer_status + '' !== 'PENDING'}
          styleType="outline"
          onClick={() => changeAction('pendig')}>
          Mark as rejected
        </Button> */}
      </EvaluationContent>

      <PopupMolecule open={open} title="Evaluation Feedback" onClose={closePopup}>
        <TextAreaMolecule
          required
          name="remarks"
          value={remarks}
          handleChange={(e: ValueType) => setRemarks(e.value + '')}>
          Remarks {action === 'review' && '(Optional)'}
          <div></div>
        </TextAreaMolecule>
        <Button onClick={review} isLoading={isLoading}>
          Save
        </Button>
      </PopupMolecule>
    </>
  );
}
