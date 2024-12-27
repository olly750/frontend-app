import { Editor } from '@tiptap/react';
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { lessonStore } from '../../../../store/administration/lesson.store';
import { ValueType } from '../../../../types';
import {
  LessonPlan,
  LessonTextAreaErrors,
  LessonTimeErrors,
} from '../../../../types/services/lesson.types';
import { formatDateToIso, formatDateToYyMmDd } from '../../../../utils/date-helper';
import {
  lessonPlanTextAreaSchema,
  lessonPlanTimeSchema,
} from '../../../../validations/lesson.validation';
import Button from '../../../Atoms/custom/Button';
import Error from '../../../Atoms/Text/Error';
import ILabel from '../../../Atoms/Text/ILabel';
import Tiptap from '../../../Molecules/editor/Tiptap';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import Stepper from '../../../Molecules/Stepper/Stepper';

interface IProps {
  lessonPlan: LessonPlan;
  display_label: string;
  handleChange?: (_e: ValueType) => any;
  handleNext: <T>(_e: FormEvent<T>) => any;
}

interface TipIProp extends IProps {
  setlessonPlan: React.Dispatch<React.SetStateAction<LessonPlan>>;
}
interface ParamType {
  planId: string;
}
function UpdateLessonPlan() {
  const { planId } = useParams<ParamType>();
  const [currentStep, setCurrentStep] = useState(0);

  const [lessonPlan, setlessonPlan] = useState<LessonPlan>({
    id: '',
    class_policy: '',
    end_time: '',
    grading: '',
    instructor_id: '',
    lesson_id: '',
    lesson_objective: '',
    lesson_requirements: '',
    start_time: '',
    text_books: '',
  });

  function handleChange(e: ValueType) {
    setlessonPlan({ ...lessonPlan, [e.name]: e.value });
  }

  const { mutateAsync } = lessonStore.modifyLessonPlan();

  const plan = lessonStore.getLessonPlanById(planId);

  useEffect(() => {
    if (plan.data) {
      const _plan = plan?.data.data.data;
      setlessonPlan({
        id: _plan.id,
        class_policy: _plan.class_policy,
        end_time: _plan.end_time,
        grading: _plan.grading,
        instructor_id: _plan.instructor.id + '',
        lesson_id: _plan.lesson.id + '',
        lesson_objective: _plan.lesson_objective,
        lesson_requirements: _plan.lesson_requirements,
        start_time: _plan.start_time,
        text_books: _plan.text_books,
      });
    }
  }, [plan.data]);

  async function handleSubmit<T>(e: FormEvent<T>) {
    e.preventDefault();
    if (currentStep === 0) setCurrentStep(currentStep + 1);
    else {
      await mutateAsync(
        {
          ...lessonPlan,
          start_time: formatDateToIso(lessonPlan.start_time),
          end_time: formatDateToIso(lessonPlan.end_time),
        },
        {
          async onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries(['lessonplan/lesson/id']);
            history.go(-1);
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred please try again');
          },
        },
      );
    }
  }

  return (
    <div className="w-full">
      <Stepper
        currentStep={currentStep}
        completeStep={currentStep}
        width="w-64"
        isVertical={false}
        isInline={false}
        navigateToStepHandler={() => {}}>
        <LessonTimeComponent
          display_label="info"
          lessonPlan={lessonPlan}
          handleChange={handleChange}
          handleNext={handleSubmit}
        />
        <LessonTextArea
          display_label="more"
          lessonPlan={lessonPlan}
          setlessonPlan={setlessonPlan}
          handleNext={handleSubmit}
        />
      </Stepper>
    </div>
  );
}

function LessonTimeComponent({ lessonPlan, handleChange, handleNext }: IProps) {
  const initialErrorState: LessonTimeErrors = {
    start_time: '',
    end_time: '',
  };

  const [errors, setErrors] = useState<LessonTimeErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = lessonPlanTimeSchema.validate(lessonPlan, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        handleNext(e);
      })

      .catch((err) => {
        const validatedErr: LessonTimeErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof LessonTimeErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <InputMolecule
        required={false}
        error={errors.start_time}
        value={
          lessonPlan.start_time
            ? formatDateToYyMmDd(lessonPlan.start_time)
            : lessonPlan.start_time
        }
        name="start_time"
        type="date"
        handleChange={handleChange}>
        Start Date
      </InputMolecule>
      <InputMolecule
        required={false}
        error={errors.end_time}
        value={
          lessonPlan.end_time
            ? formatDateToYyMmDd(lessonPlan.end_time)
            : lessonPlan.end_time
        }
        name="end_time"
        type="date"
        handleChange={handleChange}>
        End Date
      </InputMolecule>
      <InputMolecule
        value={lessonPlan.grading}
        name="grading"
        type="number"
        handleChange={handleChange}>
        Grading
      </InputMolecule>
      <div className="mt-5">
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
}

function LessonTextArea({ lessonPlan, setlessonPlan, handleNext }: TipIProp) {
  const { t } = useTranslation();
  const initialErrorState: LessonTextAreaErrors = {
    lesson_objective: '',
    lesson_requirements: '',
    text_books: '',
    class_policy: '',
  };

  const [errors, setErrors] = useState<LessonTextAreaErrors>(initialErrorState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validatedForm = lessonPlanTextAreaSchema.validate(lessonPlan, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        handleNext(e);
      })

      .catch((err) => {
        const validatedErr: LessonTextAreaErrors = initialErrorState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof LessonTextAreaErrors] = el.message;
        });
        setErrors(validatedErr);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 py-2">
        <ILabel size="sm" textTransform="normal-case">
          Lesson Objective
        </ILabel>
        <Tiptap
          content={lessonPlan.lesson_objective}
          handleChange={(editor: Editor) => {
            setlessonPlan((lessonPlan) => ({
              ...lessonPlan,
              lesson_objective: editor.getHTML(),
            }));
          }}
        />
        {errors.lesson_objective && <Error>{errors.lesson_objective}</Error>}
      </div>
      <div className="flex flex-col gap-2 py-2">
        <ILabel size="sm" textTransform="normal-case">
          Lesson Requirements
        </ILabel>
        <Tiptap
          content={lessonPlan.lesson_requirements}
          handleChange={(editor: Editor) => {
            setlessonPlan((lessonPlan) => ({
              ...lessonPlan,
              lesson_requirements: editor.getHTML(),
            }));
          }}
        />
        {errors.lesson_requirements && <Error>{errors.lesson_requirements}</Error>}
      </div>
      <div className="flex flex-col gap-2 py-2">
        <ILabel size="sm" textTransform="normal-case">
          Text Books
        </ILabel>
        <Tiptap
          content={lessonPlan.text_books}
          handleChange={(editor: Editor) => {
            setlessonPlan((lessonPlan) => ({
              ...lessonPlan,
              text_books: editor.getHTML(),
            }));
          }}
        />
        {errors.text_books && <Error>{errors.text_books}</Error>}
      </div>
      <div className="flex flex-col gap-2 py-2">
        <ILabel size="sm" textTransform="normal-case">
          {t('Class')} Policy
        </ILabel>
        <Tiptap
          content={lessonPlan.class_policy}
          handleChange={(editor: Editor) => {
            setlessonPlan((lessonPlan) => ({
              ...lessonPlan,
              class_policy: editor.getHTML(),
            }));
          }}
        />
        {errors.class_policy && <Error>{errors.class_policy}</Error>}
      </div>
      <div className="mt-5">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
export default UpdateLessonPlan;
