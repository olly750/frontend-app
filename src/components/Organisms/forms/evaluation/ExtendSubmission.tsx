import React, { FormEvent } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { evaluationStore } from '../../../../store/evaluation/evaluation.store';
import { ValueType } from '../../../../types';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';

export default function ExtendSubmission() {
  const [minutes, setMinutes] = useState<string>();
  const { studentEvaluationId } = useParams<any>();
  const history = useHistory();
  const { mutate: extendEvaluation } = evaluationStore.extendStudentEvaluation();

  function handleChange({ value }: ValueType) {
    setMinutes(value.toString());
  }
  function extendStudentEvaluation() {
    extendEvaluation(
      { id: studentEvaluationId, minutes: minutes || '' },
      {
        onSuccess: () => {
          toast.success('Evaluation extended', { duration: 3000 });
          history.goBack();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      },
    );
  }
  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();
    if (!minutes) {
      toast.error('Please enter minutes');
      return;
    }
    extendStudentEvaluation();
  }

  return (
    <form onSubmit={submitForm}>
      <InputMolecule
        required={false}
        name="minutes"
        placeholder="Minutes"
        type="number"
        handleChange={handleChange}
        value={minutes}>
        Number of minutes to add
      </InputMolecule>

      <div>
        <Button type="submit" full>
          Save
        </Button>
      </div>
    </form>
  );
}
