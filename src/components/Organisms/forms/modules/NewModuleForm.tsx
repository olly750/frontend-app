import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { moduleStore } from '../../../../store/administration/modules.store';
import programStore from '../../../../store/administration/program.store';
import { ParamType, ValueType } from '../../../../types';
import { CreateModuleInfo, ModuleError } from '../../../../types/services/modules.types';
import { newModuleSchema } from '../../../../validations/program.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

export default function NewModuleForm() {
  const history = useHistory();
  const { t } = useTranslation();

  const { id } = useParams<ParamType>();
  const program = programStore.getProgramById(id);

  const { mutateAsync, isLoading } = moduleStore.addModule();

  const initialErrorState = {
    name: '',
    description: '',
  };

  const [errors, setErrors] = useState(initialErrorState);

  const [values, setvalues] = useState<CreateModuleInfo>({
    id: '',
    name: '',
    description: '',
    has_prerequisite: false,
    program_id: id,
  });

  function handleChange(e: ValueType) {
    setvalues({ ...values, [e.name]: e.value });
  }

  function submitForm(e: FormEvent) {
    e.preventDefault();
    const validatedForm = newModuleSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(values, {
          onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['modules/program/id']);
            if (data.data.data.has_prerequisite)
              history.push(
                `/dashboard/programs/${id}/modules/${data.data.data.id}/add-prereq`,
              );
            else history.goBack();
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred please try again');
          },
        });
      })
      .catch((err) => {
        const validatedErr: ModuleError = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof ModuleError] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      <InputMolecule
        required={false}
        value={values.name}
        error={errors.name}
        handleChange={handleChange}
        name="name">
        Module name
      </InputMolecule>
      <TextAreaMolecule
        error={errors.description}
        value={values.description}
        name="description"
        // className="h-24"
        handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>

      <InputMolecule
        value={program.data?.data.data.name}
        handleChange={(_e: ValueType) => {}}
        name={'program_id'}
        readOnly
        disabled>
        {t('Program')}
      </InputMolecule>
      <RadioMolecule
        className="mt-4"
        name="has_prerequisite"
        value={values.has_prerequisite + ''}
        options={[
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ]}
        handleChange={handleChange}>
        Has Prerequesites
      </RadioMolecule>
      <div className="mt-5">
        <Button type="submit" isLoading={isLoading} onClick={() => submitForm} full>
          Save
        </Button>
      </div>
    </form>
  );
}
