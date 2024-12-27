import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Panel from '../../components/Atoms/custom/Panel';
import Heading from '../../components/Atoms/Text/Heading';
import Accordion from '../../components/Molecules/Accordion';
import DateMolecule from '../../components/Molecules/input/DateMolecule';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import RadioMolecule from '../../components/Molecules/input/RadioMolecule';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import { queryClient } from '../../plugins/react-query';
import intakeProgramStore, {
  getModulesByLevel,
} from '../../store/administration/intake-program.store';
import { moduleStore } from '../../store/administration/modules.store';
import { ValueType } from '../../types';
import { Instructor } from '../../types/services/instructor.types';
import {
  AddLevelToModule,
  AddLevelToModuleErrors,
  IntakeLevelParam,
  IntakeModuleStatus,
  ModuleParticipation,
} from '../../types/services/intake-program.types';
import { getDropDownOptions, getDropDownStatusOptions } from '../../utils/getOption';
import { intakeProgramLevelSchema } from '../../validations/level.validation';

const initialErrorState = {
  incharge_id: '',
  module_id: '',
  planned_end_on: '',
  planned_start_on: '',
};

function NewIntakeLevelModule() {
  const { id, level: levelId, intakeProg } = useParams<IntakeLevelParam>();
  const initialState = {
    academic_year_program_intake_level_id: parseInt(levelId),
    actual_end_on: '',
    actual_start_on: '',
    credits: 0,
    incharge_id: '',
    intake_status: IntakeModuleStatus.DRAFT,
    marks: 0,
    module_id: '',
    module_participation: ModuleParticipation.COMPULSORY,
    pass_mark: 0,
    planned_end_on: '',
    planned_start_on: '',
    weight: 0,
  };

  const [values, setvalues] = useState<AddLevelToModule>(initialState);
  const [errors, setErrors] = useState<AddLevelToModuleErrors>(initialErrorState);

  const history = useHistory();

  const [totalModules, setTotalModules] = useState<AddLevelToModule[]>([]);

  function handleChange(e: ValueType) {
    setvalues({ ...values, [e.name]: e.value });
  }

  const { mutateAsync, isLoading } = intakeProgramStore.addModuleToLevel();

  const levels =
    intakeProgramStore.getLevelsByIntakeProgram(intakeProg).data?.data.data || [];

  const { data: getAllModuleStore, isLoading: mLoading } =
    moduleStore.getModulesByProgram(id);
  const { data: levelModuleStore, isLoading: lmLoading } = getModulesByLevel(
    parseInt(levelId),
  );

  //remove modules from getAllModuleStore that are already in levelModuleStore
  const modules =
    getAllModuleStore?.data.data.filter((m) => {
      return !levelModuleStore?.data.data.find((lm) => lm.module.id == m.id);
    }) || [];

  const instructorInPrograms =
    intakeProgramStore.getInstructorsByIntakeProgram(intakeProg);

  const instructors =
    instructorInPrograms.data?.data.data.map((instr) => instr.instructor) || [];

  useEffect(() => {
    setvalues((prevValues) => {
      return { ...prevValues, academic_year_program_intake_level_id: parseInt(levelId) };
    });
  }, [levelId]);

  async function addMore() {
    let payload: AddLevelToModule[] = [];

    payload.push(values);

    await mutateAsync(payload, {
      onSuccess() {
        toast.success('module added to level');
        queryClient.invalidateQueries(['levels/modules']);
        history.push(
          `/dashboard/modules/${
            values.module_id
          }/instructors?showMenus=${true}&intkPrg=${intakeProg}`,
        );
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
    setTotalModules([...totalModules, values]);

    setvalues(initialState);
  }

  function submitForm() {
    let payload: AddLevelToModule[] = [];

    payload.push(values);

    const validatedForm = intakeProgramLevelSchema.validate(values, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        mutateAsync(payload, {
          onSuccess: () => {
            toast.success('module added to level');
            queryClient.invalidateQueries(['levels/modules']);
            history.push(
              `/dashboard/modules/${
                values.module_id
              }/instructors?showMenus=${true}&intkPrg=${intakeProg}`,
            );
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
      })
      .catch((err) => {
        const validatedErr: AddLevelToModuleErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof AddLevelToModuleErrors] = el.message;
        });
        setErrors(validatedErr);
      });
    setvalues(initialState);
    setTotalModules([]);
  }

  let level = levels.find((lv) => (lv.id = levelId));
  const { t } = useTranslation();

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full mx-auto">
      <div className="bg-main pl-10 pt-6">
        <Heading fontWeight="semibold" fontSize="2xl" className="py-4">
          Add modules to a level
        </Heading>
        <Heading fontWeight="medium" fontSize="sm" className="pb-8" color="txt-secondary">
          Let’s add many modules on this intake level
        </Heading>
        <div className="flex flex-col gap-2">
          <SelectMolecule
            handleChange={handleChange}
            name="module_id"
            placeholder={mLoading || lmLoading ? 'Loading modules' : 'Select modules'}
            options={getDropDownOptions({
              inputs: modules,
            })}
            error={errors.module_id}
            hasError={errors.module_id != ''}
            value={values.module_id}>
            <p className="font-medium">Modules</p>
          </SelectMolecule>
          <SelectMolecule
            placeholder={
              instructorInPrograms.isLoading ? 'Loading incharge' : 'Select incharge'
            }
            error={errors.incharge_id}
            hasError={errors.incharge_id != ''}
            options={getDropDownOptions({
              inputs: instructors,
              labelName: ['first_name', 'last_name'],
              //@ts-ignore
              getOptionLabel: (instr: Instructor) =>
                instr.user.first_name + ' ' + instr.user.last_name,
            })}
            name="incharge_id"
            value={values.incharge_id}
            handleChange={handleChange}>
            <p className="font-medium">{t('Instructor')} Incharge</p>
          </SelectMolecule>
        </div>
        <div className="flex flex-col gap-3">
          <RadioMolecule
            handleChange={handleChange}
            name="module_participation"
            value={values.module_participation}
            options={getDropDownStatusOptions(ModuleParticipation)}>
            Participation Status
          </RadioMolecule>
          <div className="flex gap-2 w-80">
            <InputMolecule
              name="pass_mark"
              width="40"
              placeholder="Number"
              value={values.pass_mark}
              type="number"
              handleChange={handleChange}>
              <p className="normal-case">Pass mark</p>
            </InputMolecule>
            <InputMolecule
              name="marks"
              width="40"
              placeholder="Number"
              value={values.marks}
              type="number"
              handleChange={handleChange}>
              <p className="normal-case">Out of marks</p>
            </InputMolecule>
          </div>
        </div>
        <div className="flex gap-2">
          <InputMolecule
            name="weight"
            width="40"
            placeholder="Number"
            value={values.weight}
            type="number"
            handleChange={handleChange}>
            <p className="normal-case">Module weight</p>
          </InputMolecule>
          <SelectMolecule
            placeholder="status"
            value={values.intake_status}
            options={getDropDownStatusOptions(IntakeModuleStatus)}
            name="intake_status"
            width="40"
            handleChange={handleChange}>
            <p className="font-medium">Module Status</p>
          </SelectMolecule>
        </div>
        <div className="flex flex-col gap-2">
          <DateMolecule
            startYear={moment(
              level?.planed_start_on === '' ? undefined : level?.planed_start_on,
            ).year()}
            endYear={moment(
              level?.planed_end_on === '' ? undefined : level?.planed_end_on,
            ).year()}
            handleChange={handleChange}
            reverse={false}
            error={errors.planned_start_on}
            name="planned_start_on">
            Start Date
          </DateMolecule>
          <DateMolecule
            startYear={moment(
              values.planned_start_on === '' ? undefined : values.planned_start_on,
            ).year()}
            defaultValue={values.planned_start_on}
            endYear={moment(
              level?.planed_end_on === '' ? undefined : level?.planed_end_on,
            ).year()}
            handleChange={handleChange}
            error={errors.planned_end_on}
            name="planned_end_on">
            End Date
          </DateMolecule>
        </div>
        <div className="text-primary-500 text-sm flex flex-col w-96">
          <Button
            hoverStyle="no-underline"
            type="button"
            styleType="text"
            className="flex items-center justify-end"
            isLoading={isLoading || isLoading}
            onClick={() => addMore()}>
            <Icon name="add" size={12} fill="primary" />
            <span className="font-semibold">Add module</span>
          </Button>
        </div>
        <div className="pt-2 pb-8">
          <Button isLoading={isLoading} onClick={submitForm}>
            Save
          </Button>
        </div>
      </div>

      <div className="px-5 md:pl-48">
        {totalModules.length > 0 && <p className="pt-10 pb-4 font-semibold">Modules</p>}
        <Accordion>
          {totalModules.map((mod) => {
            return (
              <Panel
                key={mod.module_id}
                title={
                  modules?.find((module) => module.id === mod.module_id)?.name || 'Module'
                }
                badge={{ type: mod.intake_status, text: mod.intake_status }}
                className="bg-main"
                bgColor="main"
                subtitle={mod.module_participation}>
                <div>Pass marks: {mod.pass_mark}</div>
                <div>Out of marks: {mod.marks}</div>
                <div>Start Date: {mod.planned_start_on}</div>
                <div>End Date: {mod.planned_end_on}</div>
              </Panel>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}

export default NewIntakeLevelModule;
