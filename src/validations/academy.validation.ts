import * as yup from 'yup';

export const academyInfoSchema = yup.object().shape({
  name: yup.string().required('Academy name is required'),
  short_name: yup.string().required('Academy Short name(Acronym) is required'),
  mission: yup.string().required('Academy mission is required'),
  moto: yup.string().required('Academy moto is required'),
});

export const academyLocationSchema = yup.object().shape({
  email: yup.string().email().required('Academy email is required'),
  phone_number: yup.string().required('Academy phone number is required').min(10),
  fax_number: yup.string().required('Academy fax number is required'),
  website_link: yup.string().required('Academy website link is required'),
  head_office_location_id: yup
    .string()
    .required('Academy head office location is required'),
  full_address: yup.string().required('Academy physical address is required'),
});

export const institutionSchema = yup.object().shape({
  name: yup.string().required('name is required'),
  short_name: yup.string().required('short name is required'),
  email: yup.string().email().required('email is required'),
  phone_number: yup.string().required('phone number is required').min(10),
  website_link: yup.string().required('website link is required'),
  moto: yup.string().required('moto is required'),
  mission: yup.string().required('mission is required'),
  fax_number: yup.string().required('fax number is required'),
  full_address: yup.string().required('physical address is required'),
});
