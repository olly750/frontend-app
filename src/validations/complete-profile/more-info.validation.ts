import * as yup from 'yup';

export const nextOfKinSchema = yup.object().shape({
  first_name: yup.string().required("Next of kin's first name is required").min(3),
  last_name: yup.string().required("Next of kin's last name's is required").min(3),
  email: yup.string().email().nullable(),
  phone_number: yup.string().required('Phone number is required').min(10),
  // birth_date: yup.string().required("Next of kin's Date of birth is required"),
  relationship: yup
    .string()
    .required('relationship with this next of kin is required')
    .min(3),
  residence_location_id: yup.string().when('has_rwanda_nationality', {
    is: (has_rwanda_nationality: any) => has_rwanda_nationality === true,
    then: yup.string().nullable().required('location is required'),
    otherwise: yup.string().nullable(),
  }),
  document_expire_on: yup.string().when('has_passport', {
    is: (has_passport: any) => has_passport === true,
    then: yup.string().required('Passport expiry date is required'),
    otherwise: yup.string().nullable(),
  }),
  nid: yup.string().required('ID number is required'),
  spouse_name: yup.string().nullable(),
  // .when('has_spouse', {
  //   is: (has_spouse: any) => has_spouse === true,
  //   then: yup.string().required('Spouse name is required'),
  //   otherwise: yup.string(),
  // }),
  has_spouse: yup.boolean(),
  has_passport: yup.boolean(),
  has_rwanda_nationality: yup.boolean(),
});
