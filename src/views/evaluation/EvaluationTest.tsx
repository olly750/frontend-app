/* eslint-disable react-hooks/exhaustive-deps */
import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Countdown, { zeroPad } from 'react-countdown';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import toast from 'react-hot-toast';
import { UseQueryResult } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import StudentQuestionsSectionBased from '../../components/Organisms/evaluation/StudentQuestionsSectionBased';
import * as markingStore from '../../store/administration/marking.store';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ParamType, Response } from '../../types';
import {
  IEvaluationSettingType,
  StudentEvalParamType,
} from '../../types/services/evaluation.types';
import { IEvaluationInfo } from '../../types/services/evaluation.types';
import { StudentEvaluationInfo } from '../../types/services/marking.types';
import { useEvaluationStore } from '../../zustand/evaluation';

let timer: NodeJS.Timeout;

type AlertMessage = {
  title: string;
  message: string;
  heading: string;
  action: string;
};

const alertMessage: AlertMessage[] = [
  {
    title: 'Do you want to continue?',
    message:
      'Full screen should be enabled for this evaluation to avoid cheating. If you disable it or change tabs/windows/desktop the evaluation will be auto submitted.',
    heading: 'Enable Full screen',
    action: 'Enable',
  },
  {
    title: 'Attention User',
    message:
      'If you continue to leave tabs, windows, or exit full screen mode, your evaluation may be submitted prematurely. Please ensure that you complete your evaluation before navigating away from this page.',
    heading: 'Cheating Suspected',
    action: 'I Understand',
  },
];

function message(suspects: number) {
  if (suspects < 0) return alertMessage[0];

  return alertMessage[1];
}

export default function EvaluationTest() {
  const { evaluationId } = useParams<StudentEvalParamType>();
  const { id: studentEvaluationId } = useParams<ParamType>();
  let studentEvaluationData = markingStore.getStudentEvaluationById(studentEvaluationId);

  const evaluationById = evaluationStore.getEvaluationById(evaluationId);

  return (
    <EvaluationTestDisplay
      evaluationById={evaluationById}
      studentEvaluationData={studentEvaluationData}
    />
  );
}

type Props = {
  evaluationById: UseQueryResult<AxiosResponse<Response<IEvaluationInfo>>>;
  studentEvaluationData: UseQueryResult<AxiosResponse<Response<StudentEvaluationInfo>>>;
};

function EvaluationTestDisplay({ evaluationById, studentEvaluationData }: Props) {
  const { evaluationId } = useParams<StudentEvalParamType>();
  const { id: studentEvaluationId } = useParams<ParamType>();
  const screen1 = useFullScreenHandle();
  const evaluation = useEvaluationStore((state) => state.evaluation);
  const addEvaluationToStorage = useEvaluationStore((state) => state.addEvaluation);
  const history = useHistory();
  const [cheatingSuspects, setCheatingSuspects] = useState(-1);
  const [displayCheatingWarning, setDisplayCheatingWarning] = useState(false);
  const [time, SetTime] = useState(0); // in milliseconds
  const [showWarning, setShowWarning] = useState(true);
  const { data: evaluationData } = evaluationStore.getEvaluationById(evaluationId);
  const clearAnswersFromStore = useEvaluationStore((state) => state.clearAnswers);

  const { data: evaluationInfo, refetch: refetchEvaluation } = evaluationById;

  const {
    data: questions,
    isSuccess,
    isError,
  } = evaluationStore.getEvaluationQuestions(evaluationId);

  const { mutate, isLoading: isSubmitLoading } = evaluationStore.submitEvaluation();

  useEffect(() => {
    if (studentEvaluationData.isSuccess) {
      addEvaluationToStorage(studentEvaluationData.data.data.data);
    }

    console.log('change in evaluation data', studentEvaluationData);
  }, [studentEvaluationData]);

  const student_extended_minutes = useMemo(
    () => (evaluation ? evaluation.extended_minutes : 0),
    [evaluation],
  );

  type SubmitEvaluationParams = { onSuccess?: () => void };

  const submitEvaluation = useCallback(
    (comment = '', { onSuccess }: SubmitEvaluationParams = {}) => {
      mutate(
        {
          studentEvaluationId,
          evaluationSubmissionComments: `auto submitted, ${comment}`,
        },
        {
          onSuccess: () => {
            toast.success('Evaluation auto submitted', {
              id: 'submitted-evaluation-message',
              duration: 5000,
            });
            onSuccess && onSuccess();
            history.push('/dashboard/intakelevels/student-assignment');
          },
          onError: (error) => {
            toast.error(error + '');
          },
        },
      );
    },
    [mutate, studentEvaluationId],
  );

  type AutoSubmitParams = {
    isCheating?: boolean;
    message?: string;
  };

  const autoSubmit = useCallback(
    async ({ isCheating, message }: AutoSubmitParams = { isCheating: true }) => {
      clearTimeout(timer);
      await refetchEvaluation();

      // use timeout to avoid race conditions
      timer = setTimeout(() => {
        if (isCheating == false) {
          submitEvaluation(message, {
            onSuccess: () => {
              clearAnswersFromStore(); // when answers are submitted clear them from store
            },
          });
        } else {
          screen1.exit();

          // since cheating suspect starts from -1, we need to check if it is greater than 2
          // aiming to give the user 3 chances before submitting the evaluation
          if (cheatingSuspects > 2) {
            setDisplayCheatingWarning(false);
            console.log('max cheating exceeded');
            submitEvaluation('Cheating suspected');
          } else {
            setDisplayCheatingWarning(true);
          }
        }
      }, 1000);
    },
    [
      evaluationInfo?.data.data.extended,
      refetchEvaluation,
      submitEvaluation,
      cheatingSuspects,
    ],
  );

  function calculateRemainingTime(studentEvaluation: StudentEvaluationInfo) {
    SetTime(studentEvaluation.remaining_time_in_seconds * 1000); // convert seconds to millseconds
  }

  useEffect(() => {
    if (!evaluation || !studentEvaluationData.data?.data.data) return;

    calculateRemainingTime(studentEvaluationData.data?.data.data);

    return () => {};
  }, [evaluation, studentEvaluationData]);

  // when user tries to leave the page, auto submit the evaluation
  useEffect(() => {
    if (!screen1.active && evaluationData?.data.data.strict) {
      setShowWarning(true);
      autoSubmit({
        isCheating: true,
        message: 'Auto submitted because student changed tab/window or opened other app',
      });
    }
    //check if active window is not changed
    window.onblur = () => {
      if (evaluationData?.data.data.strict) {
        autoSubmit({
          isCheating: true,
          message:
            'Auto submitted because student changed tab/window or opened other app',
        });
      }
    };
  }, [evaluationData?.data.data.strict, screen1.active]);

  if (!evaluation) return <Loader />;
  else
    return (
      <>
        {evaluationData?.data.data.strict && (
          <PopupMolecule
            closeOnClickOutSide={false}
            open={displayCheatingWarning}
            title={message(cheatingSuspects).title}>
            <div>
              <Heading fontWeight="semibold">{message(cheatingSuspects).heading}</Heading>
              <p className="course-card-description leading-5 pb-6 w-96 text-txt-secondary text-sm mt-4">
                {message(cheatingSuspects).message}
                {/* {cheatingSuspects} */}
              </p>

              <div className="flex justify-between pt-3">
                <div>
                  <Button
                    onClick={() => {
                      setDisplayCheatingWarning(false);
                      screen1.enter();
                      setCheatingSuspects(cheatingSuspects + 1);
                    }}>
                    {message(cheatingSuspects).action}
                  </Button>
                </div>
              </div>
            </div>
          </PopupMolecule>
        )}

        <FullScreen handle={screen1}>
          <div
            className={`${'bg-white p-12 overflow-y-auto h-screen'} ${
              !screen1.active && evaluationData?.data.data.strict && showWarning
                ? 'blur-2xl'
                : ''
            }`}>
            <div className="flex justify-between items-center sticky p-4 bg-gray-100 mb-4 border ml-8 border-gray-200 z-40">
              <Heading fontWeight="semibold">{evaluationData?.data.data.name}</Heading>
              <div className="pr-28 flex justify-center items-center gap-2">
                {student_extended_minutes > 0 && (
                  <span className="bg-green-100 text-primary text-sm font-semibold px-2.5 py-2 rounded m-8">
                    Extended ({evaluation!.extended_minutes} minutes)
                  </span>
                )}
                {/* {evaluationData?.data.data.extended && (
              <span className="bg-green-100 text-primary text-sm font-semibold px-2.5 py-2 rounded m-8">
                Extended ({evaluationInfo?.data.data.time_limit} minutes)
              </span>
            )} */}
                <Heading color="txt-secondary" fontSize="base">
                  Remaining time:
                </Heading>
                <Heading>
                  {time ? (
                    //@ts-ignore
                    <Countdown
                      key={time}
                      date={Date.now() + time}
                      onComplete={() => {
                        autoSubmit({
                          isCheating: false,
                          message:
                            'Automatically submitted because the time limit was reached.',
                        });
                      }}
                      renderer={Renderer}
                    />
                  ) : (
                    <Heading>
                      Calculating timer..., If this persists try refreshing!
                    </Heading>
                  )}
                </Heading>
              </div>
            </div>

            {evaluationInfo?.data.data.setting_type ===
            IEvaluationSettingType.SECTION_BASED ? (
              <StudentQuestionsSectionBased
                onEvaluationEnd={() =>
                  autoSubmit({ isCheating: false, message: 'Submitted by student' })
                }
                isSubmitLoading={isSubmitLoading}
                evaluationInfo={evaluationInfo.data.data}
              />
            ) : questions?.data.data.length === 0 && isSuccess ? (
              <NoDataAvailable
                icon="faculty"
                buttonLabel="Go back"
                title="No questions attached"
                handleClick={() => history.goBack()}
                description="No questions available for this evaluation at the moment. Come back later!"
              />
            ) : questions?.data.data.length === 0 && isError ? (
              <NoDataAvailable
                icon="faculty"
                buttonLabel="Go back"
                title="No questions attached"
                handleClick={() => history.goBack()}
                description="Something went wrong while loading evaluation questions!"
              />
            ) : (
              // <Loader />
              <span>loading in evaluation test</span>
            )}
          </div>
        </FullScreen>
      </>
    );
}

function Renderer({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  // Render a countdown
  return (
    <span className="text-primary-600">
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  );
}
