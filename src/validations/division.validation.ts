import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

export function useDivisionValidation() {
  const { t } = useTranslation();

  const facurity = t('Faculty');

  const departSchema = yup.object().shape({
    name: yup.string().required('Department name is required'),
    description: yup.string().required('Department description is required'),
    faculty: yup.string().when('has_faculty', {
      is: (has_faculty: any) => has_faculty === true,
      then: yup.string().required(`${facurity} + ' is required`),
      otherwise: yup.string(),
    }),
    has_faculty: yup.boolean(),
  });

  const facultySchema = yup.object().shape({
    name: yup.string().required('Department name is required'),
    description: yup.string().required('Department description is required'),
  });
  return { departSchema, facultySchema };
}
