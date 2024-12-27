import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export const levelSchema = yup.object().shape({
  name: yup.string().required('level name is required'),
  description: yup.string().required('level description is required'),
  flow: yup.number().required('level flow is required').min(1),
});

export const programLevelSchema = yup.object().shape({
  incharge_id: yup.string().required('Incharge is required'),
  academic_year_id: yup.string().required('Academic year is required'),
  planed_start_on: yup.string().required('Planed start on is required'),
  planed_end_on: yup.string().required('Planed end on is required'),
});

export const periodSchema = yup.object().shape({
  planed_start_on: yup.string().required('Planned start date is required'),
  planed_end_on: yup.string().required('Planned end date is required'),
  status: yup.string().required('status is required'),
});

export const intakeProgramLevelSchema = yup.object().shape({
  // credits: yup.string().required('credits field is required'),
  incharge_id: yup.string().required('Incharge is required'),
  // intake_status: yup.string().required('Intake status is required'),
  // marks: yup.string().required('marks field is required'),
  module_id: yup.string().required('module is required'),
  module_participation: yup.string().required('module participation status is required'),
  // pass_mark: yup.string().required('pass mark is required'),
  planned_end_on: yup.string().required('Planed end on is required'),
  planned_start_on: yup.string().required('Planed start on is required'),
  // weight: yup.string().required('weight is required'),
});

export function useClassValidation() {
  const { t } = useTranslation();
  // const classes = t('Class');
  const classSchema = yup.object().shape({
    class_group_type: yup.string().required(t('Class') + ' group type is required'),
    class_name: yup.string().required(t('Class') + ' name is required'),
    instructor_class_in_charge_id: yup
      .string()
      .required(t('Instructor_representative') + ' is required'),
    instructor_class_in_charge_two_id: yup
      .string()
      .required(t('Instructor_representative') + 'backup 1 is required'),
    class_representative_one_id: yup
      .string()
      .required(t('Class_representative') + ' is required'),
  });
  return { classSchema };
}
