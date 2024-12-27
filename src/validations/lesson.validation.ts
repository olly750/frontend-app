import * as yup from 'yup';

export const lessonSchema = yup.object().shape({
  title: yup.string().required('Lesson title is required'),
  content: yup.string().required('Lesson content must be provided').min(5),
});

export const lessonPlanTimeSchema = yup.object().shape({
  start_time: yup.string().required('Lesson start time is required'),
  end_time: yup.string().required('Lesson end time is required'),
});

export const lessonPlanTextAreaSchema = yup.object().shape({
  lesson_objective: yup.string().required('Lesson Objective is required'),
  lesson_requirements: yup.string().required('Lesson requirements are required'),
  text_books: yup.string().required('Text books needs to be specified'),
  class_policy: yup.string().required('Class policy is required'),
});

export const newSubjectSchema = yup.object().shape({
  title: yup.string().required('Subject name is required'),
  description: yup
    .string()
    .required('Subject remarks/simple description must be provided'),
});
