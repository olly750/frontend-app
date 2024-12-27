import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import React, { useEffect, useMemo, useState } from 'react';

import * as evaluationService from '../../../services/evaluation/evaluation.service';
import { IEvaluationInfo, ISubjects } from '../../../types/services/evaluation.types';
import { useEvaluationStore } from '../../../zustand/evaluation';
import Button from '../../Atoms/custom/Button';
import Loader from '../../Atoms/custom/Loader';
import Heading from '../../Atoms/Text/Heading';
import { SingleQuestionSectionBased } from './../../SingleQuestionSectionBased';

export default function StudentQuestionsSectionBased({
  evaluationInfo,
  onEvaluationEnd,
  isSubmitLoading,
}: {
  onEvaluationEnd: () => void;
  evaluationInfo: IEvaluationInfo;
  isSubmitLoading?: boolean;
}) {
  const [subjects, setSubjects] = useState<ISubjects[]>([]);

  const answers = useEvaluationStore((state) => state.answers);

  const numberOfAnsweredQuestion = useMemo(() => {
    let updatedQuestions = 0;

    for (const key in answers) {
      if (!answers[key].isDirty && answers[key].isSubmitted) {
        updatedQuestions++;
      }
    }

    return updatedQuestions;
  }, [answers]);

  const numberOfQuestion = useMemo(
    () =>
      subjects
        .map((obj) => obj.questions?.length)
        .reduce((accumulator: any, current: any) => accumulator + current, 0),
    [subjects],
  );

  const isAllQuestionAnswered = useMemo(
    () => numberOfAnsweredQuestion === numberOfQuestion,
    [numberOfQuestion, numberOfAnsweredQuestion],
  );
  const alertMessage = useMemo(
    () => `Answered ${numberOfAnsweredQuestion} /${numberOfQuestion} questions.`,
    [numberOfQuestion, numberOfAnsweredQuestion],
  );

  // const { data: studentEvaluation, isLoading } =
  //   markingStore.getStudentEvaluationById(studentEvaluationId);

  const [endEvaluationLoader, setEndEvaluationLoader] = useState(false);
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  // const { mutateAsync, isLoading: submitLoader } = evaluationStore.submitEvaluation();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    let filteredSubjects: ISubjects[] = [];
    const subjectsAbortController = new AbortController();

    async function getSubjects() {
      if (evaluationInfo?.evaluation_module_subjects) {
        for (const [index, subj] of evaluationInfo.evaluation_module_subjects.entries()) {
          const questionsData = await evaluationService.getEvaluationQuestionsBySubject(
            evaluationInfo.id,
            subj.module_subject?.adminId.toString() + '',
            subjectsAbortController.signal,
          );

          filteredSubjects.push({
            subject: subj.section_name || `Section ${index + 1}`,
            id: subj.module_subject?.adminId || '',
            questions: questionsData.data.data,
          });
        }

        setSubjects(filteredSubjects);
        setIsLoadingSubjects(false);
      }
    }

    getSubjects();

    return () => {
      subjectsAbortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evaluationInfo.evaluation_module_subjects]);

  if (isLoadingSubjects) return <Loader />;

  async function endEvaluation() {
    setEndEvaluationLoader(true);
    setEndEvaluationLoader(false);
    onEvaluationEnd();
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const goToStep = (step: number) => {
    setActiveStep(step);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <Box>
        <Stepper activeStep={activeStep} orientation="vertical">
          {subjects.map((step, index) => (
            <Step key={step.subject}>
              <StepLabel onClick={() => goToStep(index)}>
                <div className="flex justify-between bg-gray-100 hover:bg-gray-200 p-4 border-b border-gray-300 cursor-pointer">
                  <span className="text-lg capitalize">{step.subject}</span>{' '}
                  <span className="text-gray-500">
                    {step.questions?.length} Questions
                  </span>
                </div>
              </StepLabel>
              <StepContent>
                <Typography>
                  {step.questions &&
                    step.questions.map((question, index) => (
                      <SingleQuestionSectionBased
                        evaluation={evaluationInfo}
                        question={question}
                        key={index}
                        {...{ index }}
                      />
                    ))}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <div className="flex gap-4">
                    <Button disabled={index === 0} onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext}>
                      {index === subjects.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {activeStep === subjects.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <ReloadAnsweredQuestion
              message={alertMessage}
              isAllQuestionsAnswered={isAllQuestionAnswered}
            />

            {/* <Typography>you&apos;re about to confirm you have finished</Typography> */}
            <div className="flex gap-4">
              <Button onClick={handleReset}>Review</Button>
              <Button
                // variant="contained"
                onClick={endEvaluation}
                isLoading={isSubmitLoading}
                disabled={isSubmitLoading || endEvaluationLoader}>
                {isSubmitLoading || endEvaluationLoader
                  ? 'Ending evaluation'
                  : 'End evaluation'}
              </Button>
            </div>
          </Paper>
        )}
      </Box>
    </div>
  );
}

type ReloadAnsweredQuestionProps = {
  // studentEvaluation: any;
  message: string;
  isAllQuestionsAnswered: boolean;
};

function ReloadAnsweredQuestion({
  // studentEvaluation,
  message,
  isAllQuestionsAnswered,
}: ReloadAnsweredQuestionProps) {
  // const studentId: string = studentEvaluation?.data.data.student.id;
  // const evaluationId: string = studentEvaluation?.data.data.evaluation.id;

  return (
    <>
      <div className="flex items-center gap-4 py-6">
        <div>{isAllQuestionsAnswered ? <CheckIcon /> : <AlertIcon />}</div>
        <div>
          <Heading fontSize="base" fontWeight="semibold">
            <Heading fontWeight="semibold">{message}</Heading>
          </Heading>
          {!isAllQuestionsAnswered && (
            <p className="py-1 text-txt-secondary">
              Before submitting your evaluation, please make sure you answered all the
              questions.
            </p>
          )}
        </div>
      </div>
      {/* 
      <div className="flex items-center justify-between w-4/5">
        <div></div>
        <section className="flex flex-wrap justify-start gap-4 mt-2">
          {studentAnswers?.data.data?.map((studentAnswers, index: number) => {
            return (
              <PreviewStudentAnswer key={index} index={index} data={studentAnswers} />
            );
          })}
        </section>
      </div> */}
    </>
  );
}

const AlertIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="44"
    height="44"
    color="#ffd500"
    fill="none">
    <path
      d="M5.32171 9.68293C7.73539 5.41199 8.94222 3.27651 10.5983 2.72681C11.5093 2.4244 12.4907 2.4244 13.4017 2.72681C15.0578 3.27651 16.2646 5.41199 18.6783 9.68293C21.092 13.9539 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6549 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6549 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9539 5.32171 9.68293Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M12.2422 17V13C12.2422 12.5286 12.2422 12.2929 12.0957 12.1464C11.9493 12 11.7136 12 11.2422 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.992 9H12.001"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="40"
    height="40"
    viewBox="0 0 48 48">
    <path fill="#43A047" d="M40.6 12.1L17 35.7 7.4 26.1 4.6 29 17 41.3 43.4 14.9z"></path>
  </svg>
);
