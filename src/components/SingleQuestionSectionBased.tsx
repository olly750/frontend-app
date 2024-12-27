/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import { queryClient } from '../plugins/react-query';
import * as markingStore from '../store/administration/marking.store';
import { evaluationStore } from '../store/evaluation/evaluation.store';
import { ParamType, ValueType } from '../types';
import {
  IEvaluationInfo,
  IEvaluationQuestionsInfo,
  IStudentAnswer,
  ISubmissionTypeEnum,
} from '../types/services/evaluation.types';
import { removeIdFromFileName } from '../utils/file-util';
import MultipleChoiceAnswer from '../views/evaluation/MultipleChoiceAnswer';
import { useEvaluationStore } from '../zustand/evaluation';
import Button from './Atoms/custom/Button';
import Icon from './Atoms/custom/Icon';
import FileUploader from './Atoms/Input/FileUploader';
import Heading from './Atoms/Text/Heading';
import TextAreaMolecule from './Molecules/input/TextAreaMolecule';

export function SingleQuestionSectionBased({
  question,
  index,
  evaluation,
}: {
  question: IEvaluationQuestionsInfo;
  index: number;
  evaluation: IEvaluationInfo;
}) {
  const answers = useEvaluationStore((state) => state.answers);
  const setAnswer = useEvaluationStore((state) => state.setAnswer);

  const QUESTION_ID = `question_${question.id}_content`;

  const { id: studentEvaluationId } = useParams<ParamType>();
  const [questionChoices, setChoices] = useState(question.multiple_choice_answers);

  const [hideContent, setHideContent] = useState(false);

  const saveAnswerToServer = async (_localAnswer: IStudentAnswer) => {
    const isAnswerEmpty =
      !_localAnswer.open_answer || _localAnswer.open_answer.trim() === '';

    // Update the open_answer if it's empty
    const updatedAnswer = isAnswerEmpty ? null : _localAnswer.open_answer;

    // Create a new localAnswer object with the updated open_answer
    const updatedLocalAnswer = {
      ..._localAnswer,
      open_answer: updatedAnswer,
    };

    mutate(updatedLocalAnswer, {
      onSuccess(data) {
        queryClient.invalidateQueries(['studentEvaluation/answers', studentEvaluationId]);
        setAnswer(QUESTION_ID, {
          ..._localAnswer,
          open_answer: updatedLocalAnswer.open_answer,
          isSubmitted: true,
          isDirty: false,
        });
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  };

  function handleChange({ name, value }: ValueType) {
    setAnswer(QUESTION_ID, { ...answers[QUESTION_ID], isDirty: true, [name]: value });

    saveContentToLocalStorage(value.toString());
  }

  const saveContentToLocalStorage = (content: string) => {
    setAnswer(QUESTION_ID, {
      ...answers[QUESTION_ID],
      open_answer: content,
      isDirty: true,
    });
  };

  const { mutate, isLoading: isSavingAnswer } = evaluationStore.addQuestionAnswer();
  const { mutate: deleteAnswerAttachment, isLoading: removeAttachLoader } =
    evaluationStore.deleteAnswerttachment();

  let previousStudentAnswers =
    markingStore.getStudentEvaluationAnswers(studentEvaluationId).data?.data.data || [];
  const { mutate: addQuestionDocAnswer, isLoading: uploadLoader } =
    evaluationStore.addQuestionDocAnswer();

  const wasPreviouslyAnswered = useMemo(
    () =>
      previousStudentAnswers.find(
        (prevAnsw) => prevAnsw.evaluation_question.id == question.id,
      ),
    [previousStudentAnswers],
  );
  useEffect(() => {
    const previousMultipleChoiceAnswer = wasPreviouslyAnswered?.multiple_choice_answer
      ? wasPreviouslyAnswered.multiple_choice_answer.id
      : '';
    const previousOpenAnswer = wasPreviouslyAnswered
      ? wasPreviouslyAnswered.open_answer
      : '';
    const previousAttachment =
      wasPreviouslyAnswered?.student_answer_attachments &&
      wasPreviouslyAnswered?.student_answer_attachments.length > 0
        ? (wasPreviouslyAnswered?.student_answer_attachments[0]?.attachment.id as string)
        : '';

    const wasTrullyAnswered =
      !!previousAttachment || !!previousMultipleChoiceAnswer || !!previousOpenAnswer;
    const answer: typeof answers[string] = {
      ...answers[QUESTION_ID],
      evaluation_question: question.id,
      mark_scored: 0,
      isDirty: false,
      multiple_choice_answer: previousMultipleChoiceAnswer,
      open_answer: previousOpenAnswer,
      answer_attachment: previousAttachment,
      isSubmitted: wasTrullyAnswered ? true : false,
      student_evaluation: studentEvaluationId,
    };

    setAnswer(QUESTION_ID, { ...answer });
  }, [wasPreviouslyAnswered]);

  const handleUpload = (file: FileList | null) => {
    let uploadedFile = file ? file[0] : null;

    const data = new FormData();

    if (uploadedFile) data.append('file', uploadedFile);

    addQuestionDocAnswer(
      {
        id: studentEvaluationId,
        docInfo: data,
      },
      {
        onSuccess(attachmeInfo) {
          uploadedFile = null;

          queryClient.invalidateQueries([
            'studentEvaluation/answers',
            studentEvaluationId,
          ]);

          setAnswer(QUESTION_ID, {
            ...answers[QUESTION_ID],
            isDirty: true,
            answer_attachment: attachmeInfo.data.data.id.toString(),
          });

          let data: IStudentAnswer;

          if (evaluation.submision_type === ISubmissionTypeEnum.FILE) {
            // remove empty attributes
            data = {
              ...answers[QUESTION_ID],
              answer_attachment: attachmeInfo.data.data.id.toString(),
            };

            Object.keys(data).forEach(
              (key) =>
                data[key as keyof IStudentAnswer] == null &&
                delete data[key as keyof IStudentAnswer],
            );
          } else {
            data = answers[QUESTION_ID];
          }

          mutate(
            {
              ...answers[QUESTION_ID],
              answer_attachment: attachmeInfo.data.data.id.toString(),
            },
            {
              onSuccess() {
                queryClient.invalidateQueries([
                  'studentEvaluation/answers',
                  studentEvaluationId,
                ]);
                setAnswer(QUESTION_ID, {
                  ...answers[QUESTION_ID],
                  isDirty: false,
                  isSubmitted: true,
                  answer_attachment: attachmeInfo.data.data.id.toString(),
                });
              },
              onError: (error: any) => {
                toast.error(error.response.data.message);
              },
            },
          );
        },
      },
    );
  };

  function handleChoiceSelect(choiceId: string, index: number) {
    let choicesClone = [...(questionChoices || [])];
    choicesClone[index].highlight = true;
    choicesClone.forEach((ch) => {
      if (ch.id !== choiceId) {
        ch.highlight = false;
      }
    });

    setChoices(choicesClone);

    let chosenAnswer: typeof answers[string] = { ...answers[QUESTION_ID], isDirty: true };
    chosenAnswer.multiple_choice_answer = choiceId;

    mutate(chosenAnswer, {
      onSuccess(data) {
        queryClient.invalidateQueries(['studentEvaluation/answers', studentEvaluationId]);
        setAnswer(QUESTION_ID, {
          ...chosenAnswer,
          isSubmitted: true,
          isDirty: false,
        });
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  }

  const submitForm = () => {
    saveAnswerToServer(answers[QUESTION_ID]);
  };

  function disableCopyPaste(e: any) {
    e.preventDefault();
    return false;
  }

  function removeAttachment(attachmentId: string) {
    deleteAnswerAttachment(attachmentId, {
      onSuccess: () => {
        toast.success('Attachment deleted', { duration: 4000 });
        queryClient.invalidateQueries(['studentEvaluation/answers', studentEvaluationId]);
        setAnswer(QUESTION_ID, {
          ...answers[QUESTION_ID],
          isDirty: false,
          isSubmitted: false,
          answer_attachment: '',
        });
      },
      onError: (error) => {
        // @ts-ignore
        toast.error(error.response.data.message);
      },
    });
  }

  if (!answers[QUESTION_ID]) return null;

  return (
    <div className=" my-5">
      {/* question header */}
      <div
        role="button"
        onKeyUp={(e) => {
          if (e.key === 'Enter') {
            setHideContent(!hideContent);
          }
        }}
        tabIndex={0}
        className=" cursor-pointer border"
        onClick={() => setHideContent(!hideContent)}>
        <div className="w-full flex justify-between bg-gray-100 p-4">
          <div className="flex items-center space-x-4">
            <div className="h-5 w-5">
              <QuestionState
                status={
                  answers[QUESTION_ID].isDirty
                    ? 'UPDATED'
                    : !answers[QUESTION_ID].isSubmitted
                    ? 'NOT_YET_SUBMITTED'
                    : 'SUBMITTED'
                }
              />
            </div>
            <h2 className="gap-3 text-txt-primary"> {`Question ${index + 1}`}</h2>
          </div>

          <Heading className="text-gray-500" fontWeight="semibold" fontSize="sm">
            {question.mark} marks
          </Heading>
        </div>
      </div>

      <div className={`py-4 transition-all ${hideContent ? 'hidden' : ''}`}>
        {/* question */}
        <div
          dangerouslySetInnerHTML={{
            __html: question.question,
          }}
          className="py-2 font-semi-bold"
        />
        {evaluation.submision_type == ISubmissionTypeEnum.ONLINE_TEXT &&
          (question.multiple_choice_answers.length > 0 ? (
            <div className="flex flex-col gap-4 mt-8">
              {questionChoices && questionChoices?.length > 0
                ? questionChoices?.map((choiceAnswer, choiceIndex) => (
                    <MultipleChoiceAnswer
                      key={choiceAnswer.id}
                      choiceId={choiceAnswer.id}
                      handleChoiceSelect={() =>
                        handleChoiceSelect(choiceAnswer.id, choiceIndex)
                      }
                      answer_content={choiceAnswer.answer_content}
                      highlight={
                        answers[QUESTION_ID].multiple_choice_answer === choiceAnswer.id
                      }
                    />
                  ))
                : null}
            </div>
          ) : (
            <TextAreaMolecule
              rows={15}
              cols={90}
              onPaste={(e: any) => disableCopyPaste(e)}
              onCopy={(e: any) => disableCopyPaste(e)}
              autoComplete="off"
              style={{
                height: '7rem',
                width: '67rem',
              }}
              value={answers[QUESTION_ID].open_answer!}
              placeholder="Type your answer here"
              name="open_answer"
              handleChange={handleChange}
            />
          ))}
        {question.attachments?.length > 0 && (
          <div className="flex flex-col py-5">
            <Heading fontWeight="medium" fontSize="sm">
              Question documents
            </Heading>
            {question.attachments &&
              question.attachments?.map((attachment, index) => (
                <a
                  className="text-blue-800 hover:underline"
                  href={`${
                    import.meta.env.VITE_EVALUATION_API_URL
                  }/evaluation-service/api/evaluationQuestions/${
                    attachment.id
                  }/loadAttachment`}
                  target="_blank"
                  download
                  key={attachment.id}
                  rel="noreferrer">
                  {index + 1}. {removeIdFromFileName(attachment.name)}
                </a>
              ))}
          </div>
        )}
        {evaluation.submision_type === ISubmissionTypeEnum.FILE && (
          <div className="flex py-5 flex-col">
            <FileUploader
              clearFile={uploadLoader || removeAttachLoader}
              allowPreview={false}
              handleUpload={(filelist) => {
                handleUpload(filelist);
              }}
              accept="*"
              error={''}>
              <Button styleType="outline" type="button" isLoading={uploadLoader}>
                {uploadLoader ? 'uploading...' : 'upload answer file'}
              </Button>
            </FileUploader>
            <div className="py-4">
              {previousStudentAnswers
                .find((item) => item.evaluation_question.id == question.id)
                ?.student_answer_attachments.map((ans, file_question_index) => (
                  <div key={ans.attachment.id} className="flex items-center gap-8">
                    <a
                      href={`${
                        import.meta.env.VITE_EVALUATION_API_URL
                      }/evaluation-service/api/evaluationQuestions/${
                        ans.attachment.id
                      }/loadAttachment`}
                      target="_blank"
                      className="block py-2 text-blue-500 hover:underline"
                      download
                      rel="noreferrer">
                      {file_question_index + 1}.{' '}
                      {removeIdFromFileName(ans.attachment.name)}
                    </a>

                    <button
                      type="button"
                      onClick={() => removeAttachment(ans.id.toString() || '')}>
                      <Icon
                        name="cross"
                        className="cursor-pointer"
                        fill="error"
                        size={17}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {evaluation.submision_type === ISubmissionTypeEnum.ONLINE_TEXT && (
          <div className="py-3 flex justify-end">
            <Button
              className={
                answers[QUESTION_ID]?.isDirty || !answers[QUESTION_ID]?.isSubmitted
                  ? 'bg-error-500 border-error-500 hover:bg-red-600 hover:border-red-600'
                  : 'bg-success-500 border-success-500 hover:bg-green-600 hover:border-green-600'
              }
              color="none"
              onClick={() => {
                submitForm();
              }}
              disabled={uploadLoader || isSavingAnswer}>
              {isSavingAnswer
                ? 'Saving'
                : answers[QUESTION_ID].isSubmitted
                ? 'Saved'
                : 'Save'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionState({
  status = 'NOT_YET_SUBMITTED',
}: {
  status: 'NOT_YET_SUBMITTED' | 'UPDATED' | 'SUBMITTED';
}) {
  const statusColor =
    status === 'NOT_YET_SUBMITTED'
      ? 'bg-error-500'
      : status === 'UPDATED'
      ? 'bg-warning-500'
      : 'bg-success-500';
  const statusBg =
    status === 'NOT_YET_SUBMITTED'
      ? 'bg-error-400'
      : status === 'UPDATED'
      ? 'bg-warning-400'
      : 'bg-success-400';

  return (
    <span className=" relative flex items-center justify-center h-5 w-5">
      <span
        className={`absolute inline-flex h-full w-full rounded-full ${statusBg}`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${statusColor}`}></span>
    </span>
  );
}
