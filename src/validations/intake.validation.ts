import * as yup from 'yup';

export const intakeInfoSchema = yup.object().shape({
  title: yup.string().required('Intake title is required'),
  total_num_students: yup.number().required('Total number of students is required'),
});

export const intakeStatusSchema = yup.object().shape({
  expected_start_date: yup.string().required('Intake expected start date is required'),
  expected_end_date: yup.string().required('Intake expected end date is required'),
  period_type: yup.string().required('Intake period type must be specified'),
  intake_status: yup.string().required('intake status must be specified'),
});

export const intakeProgramSchema = yup.object().shape({
  departmentId: yup.string().required('Department is required'),
  program_id: yup.string().required('Program is required'),
  incharge_instructor: yup.string().required('Instructor in charge is required'),
});
