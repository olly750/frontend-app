import * as yup from 'yup';

import { PrivilegeFeatureType } from '../types';

export const privilegeSchema = yup.object().shape({
  name: yup.string().required('Privilege name/title is required'),
  description: yup.string().required('Privilege description is required'),
  feature_type: yup
    .string()
    .required('Privilege Feature type is required')
    .oneOf(Object.values(PrivilegeFeatureType)),
});
