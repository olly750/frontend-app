import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { moduleStore } from '../../../../store/administration/modules.store';
import { ParamType, ValueType } from '../../../../types';
import { CreateModuleInfo, ModuleError } from '../../../../types/services/modules.types';
import { newModuleSchema } from '../../../../validations/program.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import RadioMolecule from '../../../Molecules/input/RadioMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

function UpdateModuleForm() {
  const history = useHistory();
  const { t } = useTranslation();

  const { id: moduleId } = useParams<ParamType>();
  const module = moduleStore.getModuleById(moduleId).data?.data.data;

  const { mutate, isLoading } = moduleStore.modifyModule();

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
    program_id: '',
  });

  useEffect(() => {
    module && setvalues({ ...module, program_id: module.program.id.toString() });
  }, [module]);

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
        mutate(values, {
          onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['modules/program/id']);
            history.goBack();
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
        value={values.name}
        error={errors.name}
        handleChange={handleChange}
        name="name">
        Module name
      </InputMolecule>
      <TextAreaMolecule
        value={values.description}
        name="description"
        className="h-24"
        handleChange={handleChange}>
        Descripiton
      </TextAreaMolecule>

      <InputMolecule
        value={module?.program.name || ''}
        handleChange={(_e: ValueType) => {}}
        name={'program_id'}
        readOnly
        disabled>
        {t('Program')}
      </InputMolecule>
      <RadioMolecule
        className="mt-4"
        name="has_prerequisite"
        value={values.has_prerequisite.toString()}
        options={[
          { label: 'Yes', value: 'true' },
          { label: 'No', value: 'false' },
        ]}
        handleChange={handleChange}>
        Has Prerequesites
      </RadioMolecule>
      <div className="mt-5">
        <Button type="submit" isLoading={isLoading} onClick={() => submitForm} full>
          Update
        </Button>
      </div>
    </form>
  );
}

export default UpdateModuleForm;
