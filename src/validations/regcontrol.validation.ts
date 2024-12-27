import * as yup from 'yup';

export const newRegControlSchema = yup.object().shape({
  description: yup.string().required('Intake description is required'),
  expected_start_date: yup.string().required('Intake expected start date is required'),
  expected_end_date: yup.string().required('Intake expected end date is required'),
});
