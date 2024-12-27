import * as yup from 'yup';

export const experienceFormSchema = yup.object().shape({
  level: yup.string().required('Insitution Name is required'),
  start_date: yup.string().required('start date is required'),
  end_date: yup.string().required('end date is required'),
  description: yup.string().required('description is required'),
  location: yup.string().required('location is required'),
  occupation: yup.string().required('occupation is required'),
  proof: yup.string(),
});
