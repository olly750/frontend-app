import * as yup from 'yup';

export const newModuleSchema = yup.object().shape({
  name: yup.string().required('module name is required'),
  description: yup.string().required('module description is required'),
});

export const subjectPrdSchema = yup.object().shape({
  intakeProgramModuleLevelId: yup.number().required('Module is required'),
  subjectId: yup.string().required('Subject is required'),
  inchargeId: yup.string().required('Incharge is required'),
  plannedStartOn: yup.string().required('Start date is required'),
  plannedEndOn: yup.string().required('End date is required'),
  satus: yup.string().required('Status is required'),
});

export const programSchema = yup.object().shape({
  name: yup.string().required('Program name is required'),
  code: yup.string().required('Program code is required'),
  description: yup.string().required('Program description is required'),
  in_charge_id: yup.string().required('Program incharge is required'),
});

export const newProgramSchema = yup.object().shape({
  name: yup.string().required('Program name is required'),
  code: yup.string().required('Program code is required'),
  description: yup.string().required('Program description is required'),
  in_charge_id: yup.string().required('Program incharge is required'),
  department_id: yup.string().when('has_faculty', {
    is: (has_faculty: any) => has_faculty === true,
    then: yup.string().required('Department is required'),
    otherwise: yup.string(),
  }),
  has_faculty: yup.boolean(),
});

export const academicYearSchema = yup.object().shape({
  plannedStartOn: yup.string().required('Start date is required'),
  plannedEndOn: yup.string().required('End date is required'),
});

export const programSyllabusSchema = yup.object().shape({
  purpose: yup.string().required('Syllabus purpose is required'),
  file: yup.string().required('File must be uploaded').nullable(),
});
