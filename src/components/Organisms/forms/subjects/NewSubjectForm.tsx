import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { moduleStore } from '../../../../store/administration/modules.store';
import { subjectStore } from '../../../../store/administration/subject.store';
import { ParamType, ValueType } from '../../../../types';
import { AddSubjectData } from '../../../../types/services/subject.types';
import { newSubjectSchema } from '../../../../validations/lesson.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface SubjectErrors extends Pick<AddSubjectData, 'description' | 'title'> {}

export default function NewSubjectForm() {
  const { id } = useParams<ParamType>();

  const { mutateAsync, isLoading } = subjectStore.addSubject();
  const history = useHistory();
  const module = moduleStore.getModuleById(id).data?.data.data;

  const [subject, setsubject] = useState<AddSubjectData>({
    description: '',
    module_id: id,
    title: '',
  });

  const initialErrorState: SubjectErrors = {
    description: '',
    title: '',
  };

  const [errors, setErrors] = useState<SubjectErrors>(initialErrorState);

  function handleChange(e: ValueType) {
    setsubject({ ...subject, [e.name]: e.value });
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = newSubjectSchema.validate(
      { description: subject.description, title: subject.title },
      {
        abortEarly: false,
      },
    );

    validatedForm
      .then(() => {
        mutateAsync(subject, {
          async onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['subjects/moduleId']);
            history.goBack();
            // history.push(
            //   `/dashboard/modules/${module?.id}/subjects/${data.data.data.id}/add-lesson`,
            // );
          },
          onError(error: any) {
            toast.error(error.response.data.message);
          },
        });
      })
      .catch((err) => {
        const validatedErr: SubjectErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof SubjectErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputMolecule
        value={module?.name}
        handleChange={(_e: ValueType<Event>) => {}}
        name={'module id'}
        disabled
        readOnly>
        Module
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.title}
        value={subject.title}
        handleChange={handleChange}
        name="title">
        Subject name
      </InputMolecule>
      <TextAreaMolecule
        required={false}
        error={errors.description}
        value={subject.description}
        name="description"
        handleChange={handleChange}>
        Subject remarks
      </TextAreaMolecule>
      {/* <RadioMolecule
        className="mt-4"
        value="ACTIVE"
        name="status"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
        ]}
        handleChange={handleChange}>
        Status
      </RadioMolecule> */}
      <div className="mt-5">
        <Button type="submit" isLoading={isLoading} full>
          Add
        </Button>
      </div>
    </form>
  );
}
