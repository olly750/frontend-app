import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import DateMolecule from '../../components/Molecules/input/DateMolecule';
import DropdownMolecule from '../../components/Molecules/input/DropdownMolecule';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import RadioMolecule from '../../components/Molecules/input/RadioMolecule';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import { queryClient } from '../../plugins/react-query';
import intakeProgramStore, {
  getModuleByintakeProgramModuleLevelId,
} from '../../store/administration/intake-program.store';
import { ValueType } from '../../types';
import { Instructor } from '../../types/services/instructor.types';
import {
  EditLevelToModule,
  IntakeModuleParam,
  IntakeModuleStatus,
  ModuleParticipation,
} from '../../types/services/intake-program.types';
import { getDropDownOptions, getDropDownStatusOptions } from '../../utils/getOption';

function EditIntakeLevelModule() {
  const initialState = {
    academic_year_program_intake_level_id: 0,
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
    id: '',
  };
  const [values, setvalues] = useState<EditLevelToModule>(initialState);

  const history = useHistory();

  const { level: levelId, intakeProg, moduleId } = useParams<IntakeModuleParam>();

  //getModuleLevel data
  const { data: module } = getModuleByintakeProgramModuleLevelId(moduleId);

  function handleChange(e: ValueType) {
    setvalues({ ...values, [e.name]: e.value });
  }

  const { mutateAsync, isLoading } = intakeProgramStore.editModuleToLevel();

  const levels =
    intakeProgramStore.getLevelsByIntakeProgram(intakeProg).data?.data.data || [];

  const instructorInPrograms =
    intakeProgramStore.getInstructorsByIntakeProgram(intakeProg);

  const instructors =
    instructorInPrograms.data?.data.data.map((instr) => instr.instructor) || [];

  useEffect(() => {
    setvalues((prevValues) => {
      return { ...prevValues, academic_year_program_intake_level_id: parseInt(levelId) };
    });
  }, [levelId]);

  function submitForm() {
    mutateAsync(values, {
      onSuccess: () => {
        toast.success('module updated successfully');
        queryClient.invalidateQueries(['levels/modules']);
        setvalues(initialState);
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
  }

  let level = levels.find((lv) => (lv.id = levelId));
  const { t } = useTranslation();

  useEffect(() => {
    const moduleData = module?.data.data;

    setvalues((prev) => ({
      ...prev,
      academic_year_program_intake_level_id:
        moduleData?.academic_year_program_intake_level_id || 0,
      actual_end_on: moduleData?.actual_end_on || '',
      actual_start_on: moduleData?.actual_start_on || '',
      credits: moduleData?.credits || 0,
      incharge_id: moduleData?.incharge.id.toString() || '',
      intake_status: moduleData?.intake_status || IntakeModuleStatus.DRAFT,
      marks: moduleData?.marks || 0,
      module_id: moduleData?.module.id.toString() || '',
      module_participation:
        moduleData?.module_participation || ModuleParticipation.COMPULSORY,
      pass_mark: moduleData?.pass_mark || 0,
      planned_end_on: moduleData?.planned_end_on || '',
      planned_start_on: moduleData?.planned_start_on || '',
      weight: moduleData?.weight || 0,
      id: moduleData?.id.toString() || moduleId,
    }));
  }, [module?.data.data, moduleId]);

  console.log(module?.data.data);

  return (
    <div className="grid lg:grid-cols-2 grid-cols-1 w-full mx-auto">
      <div className="bg-main pl-10 pt-6">
        <Heading fontWeight="semibold" fontSize="2xl" className="py-4">
          Edit modules to a level
        </Heading>
        <div className="flex flex-col gap-2">
          <SelectMolecule
            placeholder={
              instructorInPrograms.isLoading ? 'Loading incharge' : 'Select incharge'
            }
            value={values.incharge_id}
            options={getDropDownOptions({
              inputs: instructors,
              labelName: ['first_name', 'last_name'],
              //@ts-ignore
              getOptionLabel: (instr: Instructor) =>
                instr.user.first_name + ' ' + instr.user.last_name,
            })}
            name="incharge_id"
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
          <DropdownMolecule
            placeholder="status"
            defaultValue={getDropDownStatusOptions(IntakeModuleStatus).find(
              (stat) => stat.value === values.intake_status,
            )}
            options={getDropDownStatusOptions(IntakeModuleStatus)}
            name="intake_status"
            width="40"
            handleChange={handleChange}>
            <p className="font-medium">Module Status</p>
          </DropdownMolecule>
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
            defaultValue={values.planned_start_on}
            name="planned_start_on">
            Start Date
          </DateMolecule>
          <DateMolecule
            startYear={moment(
              values.planned_start_on === '' ? undefined : values.planned_start_on,
            ).year()}
            defaultValue={values.planned_end_on}
            endYear={moment(
              level?.planed_end_on === '' ? undefined : level?.planed_end_on,
            ).year()}
            handleChange={handleChange}
            name="planned_end_on">
            End Date
          </DateMolecule>
        </div>
        <div className="pt-2 pb-8">
          <Button isLoading={isLoading} onClick={submitForm}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditIntakeLevelModule;
