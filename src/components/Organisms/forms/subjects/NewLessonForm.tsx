import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { lessonStore } from '../../../../store/administration/lesson.store';
import { subjectStore } from '../../../../store/administration/subject.store';
import { ValueType } from '../../../../types';
import { Lesson } from '../../../../types/services/lesson.types';
import { lessonSchema } from '../../../../validations/lesson.validation';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface LessonError extends Pick<Lesson, 'title' | 'content'> {}

export default function NewLessonForm() {
  const { url } = useRouteMatch();

  const urlArray = url.split('/');
  const subjectId = urlArray[urlArray.length - 2];

  const subject = subjectStore.getSubject(subjectId).data?.data.data;
  const { mutateAsync } = lessonStore.addLesson();
  const history = useHistory();

  const initialErrorState: LessonError = {
    title: '',
    content: '',
  };

  const [errors, setErrors] = useState<LessonError>(initialErrorState);

  const [lesson, setlesson] = useState<Lesson>({
    content: '',
    id: '',
    subject_id: subjectId,
    title: '',
  });

  function handleChange(e: ValueType) {
    console.log(e);
    setlesson({ ...lesson, [e.name]: e.value });
  }

  function submitForm(e: FormEvent) {
    e.preventDefault(); // prevent page to reload:

    const validatedForm = lessonSchema.validate(
      { title: lesson.title, content: lesson.content },
      {
        abortEarly: false,
      },
    );

    validatedForm
      .then(() => {
        mutateAsync(lesson, {
          async onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['lessons/subject/id']);
            history.go(-1);
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred please try again');
          },
        });
      })
      .catch((err) => {
        const validatedErr: LessonError = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof LessonError] = el.message;
        });
        setErrors(validatedErr);
      });
  }

  return (
    <form onSubmit={submitForm}>
      <InputMolecule
        name="subject_id"
        readOnly
        // this is commented due to it is an input and it is overiding the subject id with the subject name which can't be accepted on backend
        // in order to have subject id we had to use select input or show subject id in the input which could be not right
        // handleChange={handleChange}
        value={subject?.title || ''}
        disabled>
        Subject
      </InputMolecule>
      <InputMolecule
        error={errors.title}
        required={false}
        value={lesson.title}
        handleChange={handleChange}
        name="title">
        Lesson title
      </InputMolecule>
      <TextAreaMolecule
        error={errors.content}
        required={false}
        value={lesson.content}
        name="content"
        handleChange={handleChange}>
        Lesson description
      </TextAreaMolecule>
      {/* <RadioMolecule
        className="mt-4"
        value="ACTIVE"
        name="status"
        options={[
          { label: 'Active', value: 'ACTIVE' },
          { label: 'Inactive', value: 'INACTIVE' },
        ]}
        handleChange={handleChange}>
        Status
      </RadioMolecule> */}
      <div className="mt-5">
        <Button type="submit" full>
          Add
        </Button>
      </div>
    </form>
  );
}
