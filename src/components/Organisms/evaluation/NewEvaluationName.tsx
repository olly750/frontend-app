import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import usePickedRole from '../../../hooks/usePickedRole';
import { queryClient } from '../../../plugins/react-query';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { ValueType } from '../../../types';
import Button from '../../Atoms/custom/Button';
import Heading from '../../Atoms/Text/Heading';
import InputMolecule from '../../Molecules/input/InputMolecule';

export default function NewTemplate() {
  const picked_role = usePickedRole();

  const [details, setDetails] = useState({
    name: '',
    allow_submission_time: '',
    due_on: '',
    marking_reminder_date: '',
    academy_id: '',
  });

  const history = useHistory();

  //   moment(value.toString()).format('YYYY-MM-DD HH:mm:ss')

  const { mutate: addTemplate, isLoading } = evaluationStore.createTemplate();

  function handleChange({ name, value }: ValueType) {
    setDetails({
      ...details,
      [name]: value.toString(),
    });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    addTemplate(
      {
        ...details,
        academy_id: picked_role?.academy?.id,
      },
      {
        onSuccess: () => {
          toast.success('Preset created successfully');
          queryClient.invalidateQueries(['templates', picked_role?.academy_id]);
          history.push('/dashboard/evaluations/templates');
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      },
    );
  }

  return (
    <form className="bg-main mt-5 w-2/5 px-8 py-6" onSubmit={handleSubmit}>
      <Heading className="py-12" color="primary" fontWeight="bold">
        New Evaluation name
      </Heading>

      <InputMolecule
        value={details.name}
        name="name"
        handleChange={handleChange}
        placeholder="Quiz 1">
        Name
      </InputMolecule>

      <div className="flex justify-between w-80 my-5">
        <Button
          type="button"
          styleType="text"
          isLoading={isLoading}
          onClick={() => {
            history.push('/dashboard/evaluations/templates');
          }}>
          Back
        </Button>
        <Button type="submit" isLoading={isLoading}>
          save
        </Button>
      </div>
    </form>
  );
}
