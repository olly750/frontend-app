import * as yup from 'yup';

export const venueSchema = yup.object().shape({
  name: yup.string().required('Venue name is required'),
  venueType: yup.string().required('Venue type is required'),
});

export const firstTimetableSchema = yup.object().shape({
  inChargeId: yup.string().required('instructor is required'),
});

export const secondTimetableSchema = yup.object().shape({
  venueId: yup.string().required('venue is required'),
  startHour: yup.string().required('start hour is required'),
  endHour: yup.string().required('end hour is required'),
});

export const secondEditTimetableSchema = yup.object().shape({
  venue: yup.string().required('venue is required'),
  startHour: yup.string().required('start hour is required'),
  endHour: yup.string().required('end hour is required'),
  daysOfWeek: yup.string().required('Day of week is required'),
});

export const eventSchema = yup.object().shape({
  name: yup.string().required('event name/title is required'),
  code: yup.string().required('event code is required'),
  eventCategory: yup.string().required('event category is required'),
});

export const firstScheduleSchema = yup.object().shape({
  event: yup.string().required('event is required'),
  venue: yup.string().required('venue is required'),
  user_in_charge: yup.string().required('user in charge is required'),
});

export const secondScheduleSchema = yup.object().shape({
  plannedStartHour: yup.string().required('planned start hour is required'),
  plannedEndHour: yup.string().required('planned end hour is required'),
  plannedScheduleStartDate: yup.string().required('planned start date is required'),
  plannedScheduleEndDate: yup.string().when('has_date_range', {
    is: (has_date_range: any) => has_date_range === true,
    then: yup.string().required('planned end date is required'),
    otherwise: yup.string(),
  }),
});

export const thirdScheduleSchema = yup.object().shape({
  appliesTo: yup.string().required('event concerns is required'),
  // intake: yup.string().when('applies_to_level_or_class', {
  //   is: (applies_to_level_or_class: any) => applies_to_level_or_class === true,
  //   then: yup.string().required('intake is required'),
  //   otherwise: yup.string(),
  // }),
  // program: yup.string().when('applies_to_level_or_class', {
  //   is: (applies_to_level_or_class: any) => applies_to_level_or_class === true,
  //   then: yup.string().required('program is required'),
  //   otherwise: yup.string(),
  // }),
});
