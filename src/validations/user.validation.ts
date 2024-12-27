import moment from 'moment';
import * as yup from 'yup';

export const newUserSchema = yup.object().shape({
  spouse_name: yup.string(),
  // .when('has_spouse', {
  //   is: (has_spouse: any) => has_spouse === true,
  //   then: yup.string().required('Spouse name is required'),
  //   otherwise: yup.string(),
  // }),
  academy_id: yup.string().when('has_academy', {
    is: (has_academy: any) => has_academy === true,
    then: yup.string().required('Academy is required'),
    otherwise: yup.string(),
  }),
  birth_date: yup
    .string()
    // .required('Date of birth is required')
    .test(
      'date of birth',
      'date of birth shows that this user is not elligible to use the system',
      (value) => {
        return moment().diff(moment(value), 'years') >= 18;
      },
    ),
  email: yup.string().email().required(" kin's email is required"),
  // father_names: yup
  //   .string()
  //   .required('names of father/legal guardian are required')
  //   .min(3),
  first_name: yup.string().required('first name is required').min(3),
  intake_program_id: yup.string().when('is_student', {
    is: (is_student: any) => is_student === true,
    then: yup.string().required('Student intake and program are required fields'),
    otherwise: yup.string(),
  }),
  last_name: yup.string().required('last name is required').min(3),
  // mother_names: yup
  //   .string()
  //   .required('names of father/legal guardian are required')
  //   .min(3),
  nid: yup.string().required('ID number is required'),
  password: yup.string().min(6).required('Password is required'),
  phone: yup.string().required('Phone number is required').min(10),
  username: yup.string().required('Username is required').min(3),
  nationality: yup.string().required('Nationality is required'),
  document_expire_on: yup.string().when('has_passport', {
    is: (has_passport: any) => has_passport === true,
    then: yup.string().required('Passport expiry date is required'),
    otherwise: yup.string().nullable(),
  }),
  is_student: yup.boolean(),
  has_spouse: yup.boolean(),
  has_academy: yup.boolean(),
  has_passport: yup.boolean(),
});

export const editUserSchema = yup.object().shape({
  spouse_name: yup.string(),
  // .when('has_spouse', {
  //   is: (has_spouse: any) => has_spouse === true,
  //   then: yup.string().required('Spouse name is required'),
  //   otherwise: yup.string(),
  // }),
  academy_id: yup.string().when('has_academy', {
    is: (has_academy: any) => has_academy === true,
    then: yup.string().optional(),
    otherwise: yup.string(),
  }),
  birth_date: yup
    .string()
    // .required('Date of birth is required')
    .test(
      'date of birth',
      'date of birth shows that this user is not elligible to use the system',
      (value) => {
        return moment().diff(moment(value), 'years') >= 18;
      },
    ),
  email: yup.string().email().required(" kin's email is required"),
  // father_names: yup
  //   .string()
  //   .required('names of father/legal guardian are required')
  //   .min(3),
  first_name: yup.string().required('first name is required').min(3),
  // intake_program_id: yup.string().when('is_student', {
  //   is: (is_student: any) => is_student === true,
  //   then: yup.string().required('Student intake and program are required fields'),
  //   otherwise: yup.string(),
  // }),
  last_name: yup.string().required('last name is required').min(3),
  // mother_names: yup
  //   .string()
  //   .required('names of father/legal guardian are required')
  //   .min(3),
  nid: yup.string().required('ID number is required'),
  phone: yup.string().required('Phone number is required').min(10),
  username: yup.string().required('Username is required').min(3),
  // nationality: yup.string().required('Nationality is required'),
  document_expire_on: yup.string().when('has_passport', {
    is: (has_passport: any) => has_passport === true,
    then: yup.string().required('Passport expiry date is required'),
    otherwise: yup.string().nullable(),
  }),
  is_student: yup.boolean(),
  has_spouse: yup.boolean(),
  has_academy: yup.boolean(),
  has_passport: yup.boolean(),
});
export const userDocSchema = yup.object().shape({
  purpose: yup.string().required('Document purpose is required'),
  file: yup.string().required('File must be uploaded').nullable(),
});

export const loginSchema = yup.object().shape({
  username: yup.string().required('username is required'),
  password: yup.string().required('password is required'),
});

export const changePasswordSchema = yup.object().shape({
  currentPassword: yup.string().required('password is required'),
  newPassword: yup.string().required('password is required').min(6),
  confirmPassword: yup.string().required('password is required').min(6),
});

export const enrollmentInfoSchema = yup.object().shape({
  enroled_on: yup.string().required('Enrollmment date is required'),
  employee_number: yup.string().required('Enrollment number is required'),
});

export const enrollmentAcademySchema = yup.object().shape({
  academy_id: yup.string().when('has_academy', {
    is: (has_academy: any) => has_academy === true,
    then: yup.string().required('Academy is required'),
    otherwise: yup.string(),
  }),
  program_id: yup.string().required('Program is required'),
  intake_id: yup.string().required('intake is required'),
  has_academy: yup.boolean(),
});

export const deployInstSchema = yup.object().shape({
  deployed_on: yup.string().required('Deployment date is required'),
  deployment_number: yup.string().required('Deployment number is required'),
  academy_id: yup.string().required('Academy is required'),
});

export const importUserSchema = yup.object().shape({
  academyId: yup.string().required('Academy is required'),
  roleId: yup.string().required('Role is required'),
  program: yup.string().when('is_student', {
    is: (is_student: any) => is_student === true,
    then: yup.string().required('Program is required'),
    otherwise: yup.string(),
  }),
  intakeProgramId: yup.string().when('is_student', {
    is: (is_student: any) => is_student === true,
    then: yup.string().required('Intake is required'),
    otherwise: yup.string(),
  }),
  is_student: yup.boolean(),
});
