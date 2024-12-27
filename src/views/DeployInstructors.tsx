import moment from 'moment';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../components/Atoms/custom/Button';
import DateMolecule from '../components/Molecules/input/DateMolecule';
import InputMolecule from '../components/Molecules/input/InputMolecule';
import SelectMolecule from '../components/Molecules/input/SelectMolecule';
import useAuthenticator from '../hooks/useAuthenticator';
import academyStore from '../store/administration/academy.store';
import instructordeploymentStore from '../store/instructordeployment.store';
import { ParamType, ValueType } from '../types';
import { AcademyInfo } from '../types/services/academy.types';
import { DeployInstructor } from '../types/services/instructor.types';
import { getDropDownOptions } from '../utils/getOption';
import { deployInstSchema } from '../validations/user.validation';

interface DeployInstError
  extends Pick<DeployInstructor, 'deployed_on' | 'deployment_number' | 'academy_id'> {}

export default function DeployInstructors() {
  const { user } = useAuthenticator();
  const history = useHistory();
  const { id } = useParams<ParamType>();
  const { mutate } = instructordeploymentStore.deploy();
  const [deployInst, setDeployInst] = useState<DeployInstructor>({
    academy_id: '',
    deployed_on: '',
    institution_id: '',
    deployment_number: `DEP-${parseInt(Math.random() * 10000 + '')}`,
    description: '',
    user_id: '',
  });

  const initialErrorState: DeployInstError = {
    deployed_on: '',
    deployment_number: '',
    academy_id: '',
  };
  const [errors, setErrors] = useState(initialErrorState);

  useEffect(() => {
    setDeployInst((inst) => ({ ...inst, user_id: id }));
  }, [id]);

  useEffect(() => {
    setDeployInst((inst) => ({ ...inst, institution_id: user?.institution.id + '' }));
  }, [user?.institution.id]);

  const academies: AcademyInfo[] | undefined =
    academyStore.fetchAcademies().data?.data.data || [];

  function handleChange(e: ValueType) {
    setDeployInst((inst) => ({
      ...inst,
      [e.name]: e.value,
    }));
  }

  function deployInstruct(e: FormEvent) {
    e.preventDefault();

    const validatedForm = deployInstSchema.validate(deployInst, {
      abortEarly: false,
    });

    validatedForm
      .then(async () => {
        mutate(deployInst, {
          onSuccess(data) {
            toast.success(data.data.message);
            history.goBack();
          },
          onError(error: any) {
            toast.error(error.response.data.message);
          },
        });
      })
      .catch((err) => {
        const validatedErr: DeployInstError = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof DeployInstError] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={deployInstruct}>
      <DateMolecule
        error={errors.deployed_on}
        handleChange={handleChange}
        startYear={moment().year() - 20}
        endYear={moment().year()}
        reverse={false}
        name="deployed_on"
        width="60 md:w-80">
        Deployment date
      </DateMolecule>
      <InputMolecule
        error={errors.deployment_number}
        required={false}
        name="deployment_number"
        value={deployInst.deployment_number}
        handleChange={handleChange}>
        Deployment number
      </InputMolecule>
      <InputMolecule
        required={false}
        name="description"
        value={deployInst.description}
        handleChange={handleChange}>
        Description
      </InputMolecule>
      <SelectMolecule
        error={errors.academy_id}
        hasError={errors.academy_id !== ''}
        options={getDropDownOptions({ inputs: academies || [] })}
        name="academy_id"
        placeholder="select academy"
        value={deployInst.academy_id}
        handleChange={handleChange}>
        Academy
      </SelectMolecule>
      <div className="pt-3">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
