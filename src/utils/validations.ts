const nameValidation = (fieldName: string, fieldValue: string) => {
  if (fieldValue.trim() === '') {
    return `${fieldName} is required`;
  }
  if (/[^a-zA-Z -]/.test(fieldValue)) {
    return 'Invalid characters';
  }
  if (fieldValue.trim().length < 3) {
    return `${fieldName} needs to be at least three characters`;
  }
  return null;
};

const emailValidation = (email: string) => {
  if (
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
  ) {
    return null;
  }
  return 'Please enter a valid email';
};

const phoneValidation = (phone: string) => {
  if (phone.trim() === '') {
    return 'phone number is required';
  }
  if (/^[0-9\b]+$/.test(phone) || phone.length < 10 || phone.length > 15) {
    return 'Please enter a valid phone number.';
  }
  return null;
};

const dateValidation = (age: number) => {
  if (!age) {
    return 'Age is required';
  }
  if (age < 18) {
    return 'Age must be at least 18';
  }
  return null;
};

const nidRwandaValidation = (nid: string) => {
  if (!nid) {
    return 'National ID is required';
  }
  if (nid.length != 16 || !isNumber(nid)) {
    return 'Rwanda National ID must be 16 numbers';
  }

  // get birth year
  var tempDate = new Date();
  tempDate.setFullYear(parseInt(nid.substring(1, 5)));

  const birth_year = tempDate.getFullYear();

  if (!(birth_year == parseInt(nid.substring(1, 5)))) {
    return 'Invalid National ID';
  }

  // get the gender
  var genderCode = parseInt(nid.substring(5, 6));
  if (genderCode !== 7 && genderCode !== 8) {
    return 'Invalid National ID';
  }

  // get country ID for citzenship
  var first_time_received = parseInt(nid.substring(13, 14));
  if (first_time_received !== 0 && first_time_received !== 1) {
    return 'Invalid National ID';
  } else {
    return '';
  }
};

function isNumber(n: string) {
  return !isNaN(parseFloat(n)) && isFinite(parseFloat(n));
}

export const validation = {
  dateValidation,
  emailValidation,
  nameValidation,
  phoneValidation,
  nidRwandaValidation,
};
