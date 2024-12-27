import * as yup from 'yup';

export const rankSchema = yup.object().shape({
  name: yup.string().required('Rank name/title is required'),
  description: yup.string().required('Rank description is required'),
  abbreviation: yup.string().required('Rank abbreviation is required'),
  priority: yup.number().required('Rank priority is required'),
});
