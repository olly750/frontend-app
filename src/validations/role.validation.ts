import * as yup from 'yup';

export const userAssignRoleSchema = yup.object().shape({
  academy_id: yup.string().when('chose_academy', {
    is: (has_academy: any) => has_academy === true,
    then: yup.string().required('Academy is required'),
    otherwise: yup.string(),
  }),
  // roles: yup.array().required('selecting roles is required'),
  chose_academy: yup.boolean(),
});
export const newRoleSchema = yup.object().shape({
  name: yup.string().required('role name is required'),
  academy_id: yup.string().when('chose_academy', {
    is: (chose_academy: any) => chose_academy === true,
    then: yup.string().required('Academy is required'),
    otherwise: yup.string(),
  }),
  chose_academy: yup.boolean(),
});

export const updateSchema = yup.object().shape({
  name: yup.string().required('role name is required'),
});
