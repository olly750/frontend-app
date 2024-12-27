import moment from 'moment';
import * as yup from 'yup';

import { BloodGroup, SendCommunicationMsg } from '../../types/services/user.types';

// const phoneRegExp =
//   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const personalDetailsSchema = yup.object().shape({
  first_name: yup.string().required('first name is required').min(3),
  last_name: yup.string().required('last name is required').min(3),
  // phone_number: yup.string().required('Phone number is required').min(10),
  // phone_number: yup.string().matches(phoneRegExp, 'Invalid phone number'),
  // sex: yup.string().required('gender is required').oneOf(Object.values(GenderStatus)),
  place_of_birth: yup.string().nullable(),
  place_of_birth_description: yup.string().nullable(),
  // birth_date: yup
  //   .string()
  //   .required('Date of birth is required')
  //   .test(
  //     'date of birth',
  //     'shows that you are not elligible to use the system',
  //     (value) => {
  //       return moment().diff(moment(value), 'years') >= 18;
  //     },
  //   ),
  religion: yup.string().nullable(),
  blood_group: yup
    .string()
    .oneOf(Object.values(BloodGroup))
    .required('Select the blood group')
    .nullable(),
  father_names: yup
    .string()
    .required('names of father/legal guardian are required')
    .min(3),
  mother_names: yup
    .string()
    .required('names of mother/legal guardian are required')
    .min(3),
  // marital_status: yup.string().oneOf(Object.values(MaritalStatus)),
  spouse_name: yup.string().nullable(),
  // .when('has_spouse', {
  //   is: true,
  //   then: yup.string().required('Spouse name is required'),
  //   otherwise: yup.string(),
  // }),
  // residence_location_id: yup.string().nullable(),
  place_of_residence: yup.string(),
  // doc_type: yup.string().oneOf(Object.values(DocType)),
  // nationality: yup.string(),
  nid: yup.string().required('ID number is required'),
  document_expire_on: yup.string().nullable(),
  // .when('has_passport', {
  //   is: (has_passport: any) => has_passport === true,
  //   then: yup.string().required('Passport expiry date is required'),
  //   otherwise: yup.string().nullable(),
  // }),
  has_passport: yup.boolean(),
});

export const employmentDetailsSchema = yup.object().shape({
  // current_rank_id: yup.string().required('Rank is required'),
  current_rank_id: yup.string(),
  other_rank: yup.string(),
  rank_depart: yup.string(),
  emp_no: yup.string().required('Service/Employment number is required'),
  date_of_commission: yup.string(),
  date_of_last_promotion: yup.string(),
  place_of_issue: yup.string(),
  date_of_issue: yup.string(),
});

export const accountDetailsSchema = yup.object().shape({
  username: yup.string(),
  // .required('Username is required'),
  email: yup.string().required('email is required'),
  // pin: yup.number(),
  phone: yup.string().required('Phone number is required'),
  send_communication_msg: yup.string().oneOf(Object.values(SendCommunicationMsg)),
});

export const adminProfileSchema = yup.object().shape({
  first_name: yup.string().required('First name is required'),
  last_name: yup.string().required('Last name is required'),
  email: yup.string().email().required('Email is required'),
  birth_date: yup
    .string()
    .required('Date of birth is required')
    .test(
      'date of birth',
      'shows that you are not elligible to use the system',
      (value) => {
        return moment().diff(moment(value), 'years') >= 18;
      },
    ),
  place_of_residence: yup.string().required('Place of residence is required'),
  phone: yup.string().required('Phone number is required'),
  nid: yup.string().required('ID is required'),
});
