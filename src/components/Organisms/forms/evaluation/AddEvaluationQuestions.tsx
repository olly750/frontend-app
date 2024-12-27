/* eslint-disable react/no-unescaped-entities */
import { Editor } from '@tiptap/react';
import React, { FormEvent, Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useParams } from 'react-router-dom';

import { colorStyle } from '../../../../global/global-vars';
import { queryClient } from '../../../../plugins/react-query';
import { evaluationStore } from '../../../../store/evaluation/evaluation.store';
import { ParamType, SelectData, ValueType } from '../../../../types';
import {
  ICreateEvaluationQuestions,
  IEvaluationProps,
  IMultipleChoice,
  IQuestionType,
} from '../../../../types/services/evaluation.types';
import { removeIdFromFileName } from '../../../../utils/file-util';
import Button from '../../../Atoms/custom/Button';
import Icon from '../../../Atoms/custom/Icon';
import FileUploader from '../../../Atoms/Input/FileUploader';
import Heading from '../../../Atoms/Text/Heading';
import ILabel from '../../../Atoms/Text/ILabel';
import Tiptap from '../../../Molecules/editor/Tiptap';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

const multipleChoiceContent: IMultipleChoice = {
  answer_content: '',
  correct: false,
  id: '',
};

export default function AdddEvaluationQuestions({
  handleGoBack,
  evaluationId,
}: IEvaluationProps) {
  const { id: moduleSubject } = useParams<ParamType>();
  const { search } = useLocation();
  const subjectId = new URLSearchParams(String(search)).get('subject') || '';

  const evaluationQuestions = evaluationStore.getEvaluationQuestionsBySubject(
    evaluationId || '',
    subjectId,
  ).data?.data.data;

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationById(evaluationId + '').data?.data || {};

  const { mutate: addQuestionDoc, isLoading: uploadLoader } =
    evaluationStore.addQuestionDoc();
  const { mutate: saveMultipleQuestions, isLoading: createQuestionsLoader } =
    evaluationStore.createEvaluationQuestions();

  const { mutate: createSingleQuestion, isLoading: singleQuestionsLoader } =
    evaluationStore.createSingleEvaluationQuestion();

  const { mutate: deleteQuestion } = evaluationStore.deleteEvaluationQuestionById();
  const { mutate: deleteQuestionAttachment, isLoading: removeAttachLoader } =
    evaluationStore.deleteQuestionAttachment();

  const [questions, setQuestions] = useState<ICreateEvaluationQuestions[]>([]);

  const handleSubmittingFile = (id: string, uploadedFile: File | null) => {
    const data = new FormData();

    if (uploadedFile && uploadedFile?.size > 0) data.append('file', uploadedFile);

    addQuestionDoc(
      {
        id,
        docInfo: data,
      },
      {
        onSuccess() {
          saveMultipleQuestions(questions);
          queryClient.invalidateQueries([
            'evaluation/questionsBySubject',
            subjectId,
            evaluationId,
          ]);
          toast.success('File uploaded successfully');
        },
      },
    );
  };

  const handleUpload = (file: FileList | null, question: ICreateEvaluationQuestions) => {
    //if there is no question id then first save the question to get the question id and then save the file
    if (!question.id && file) {
      createSingleQuestion(question, {
        onSuccess(savedQuestion) {
          handleSubmittingFile(savedQuestion?.data.data.question?.id || '', file[0]);
        },
      });
    }

    if (question.id && file) {
      console.log('file here', file);
      handleSubmittingFile(question.id, file[0]);
    }
  };

  useEffect(() => {
    let allQuestions: ICreateEvaluationQuestions[] = [];

    if (evaluationQuestions?.length) {
      evaluationQuestions.map((question) => {
        console.log(question.evaluation_id);
        let questionData: ICreateEvaluationQuestions = {
          choices: question.multiple_choice_answers || [],
          evaluation_id: evaluationQuestions[0].evaluation_id ?? evaluationId,
          mark: question.mark,
          question: question.question,
          answer: question.answer,
          question_type: question.question_type,
          evaluation_module_subject_id: moduleSubject,
          submitted: false,
          id: question.id,
          attachments: [...question.attachments],
          sub_questions: [],
          parent_question_id: '',
        };
        allQuestions.push(questionData);
      });
      setQuestions(allQuestions);
    }
  }, [evaluationQuestions, moduleSubject]);

  function handleAddQuestion() {
    setQuestions([
      ...questions,
      {
        evaluation_id: evaluationId || '',
        mark: 1,
        parent_question_id: '',
        choices: [],
        id: '',
        question: '',
        question_type: IQuestionType.OPEN,
        attachments: [],
        sub_questions: [],
        submitted: false,
        answer: '',
        evaluation_module_subject_id: moduleSubject || '',
      },
    ]);
  }

  function handleRemoveQuestion(questionId: string, questionIndex: number) {
    let questionsClone = [...questions];

    if (questionId) {
      deleteQuestion(questionId, {
        onSuccess: () => {
          toast.success(`Question ${questionIndex + 1} deleted`, { duration: 2000 });
          queryClient.invalidateQueries([
            'evaluation/questionsBySubject',
            subjectId,
            evaluationId,
          ]);
          // window.history.back();
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    } else {
      if (questionIndex > -1 && questionsClone.length > 1) {
        questionsClone.splice(questionIndex, 1);
        setQuestions(questionsClone);
      }
    }
  }

  function handleChange(index: number, { name, value }: ValueType) {
    let questionInfo = [...questions];
    if (
      name === 'question_type' &&
      value === IQuestionType.OPEN &&
      questionInfo[index].choices.length > 0
    ) {
      questionInfo[index].choices = [];
      return;
    }

    if (name === 'mark') {
      if (parseFloat(value.toString()) > 0) {
        questionInfo[index] = {
          ...questionInfo[index],
          mark: parseFloat(value.toString()) || 0,
        };
        setQuestions(questionInfo);
        return;
      }
      questionInfo[index] = {
        ...questionInfo[index],
        mark: 0,
      };
      setQuestions(questionInfo);
      return;
    }

    questionInfo[index] = { ...questionInfo[index], [name]: value };

    setQuestions(questionInfo);
  }

  function handleRemoveChoice(questionIndex: number, choiceIndex: number) {
    let questionsClone = [...questions];
    let question = questionsClone[questionIndex];

    if (question.choices.length === 2) {
      toast.error('Multiple choice must have at least two choices');
    }

    if (choiceIndex > -1 && question.choices.length > 2) {
      question.choices.splice(choiceIndex, 1);

      questionsClone[questionIndex] = question;

      setQuestions(questionsClone);
    }
  }

  function handleAddMultipleMultipleChoiceAnswer(index: number) {
    let questionsClone = [...questions];
    let questionChoices = questionsClone[index];
    questionChoices.choices.push(multipleChoiceContent);
    setQuestions(questionsClone);
  }

  function handleCorrectAnswerCahnge(index: number, e: ValueType) {
    let questionsClone = [...questions];
    const question = questionsClone[index];
    let choiceIndex = question.choices.findIndex(
      (choice) => choice.answer_content === e.value,
    );
    question.choices.forEach((choice) => (choice.correct = false));
    question.choices[choiceIndex].correct = true;

    setQuestions(questionsClone);
  }

  function handleChoiceChange(questionIndex: number, choiceIndex: number, e: ValueType) {
    let questionsClone = [...questions];
    let question = questionsClone[questionIndex];

    let choiceToUpdate = question.choices[choiceIndex];
    choiceToUpdate = { ...choiceToUpdate, [e.name]: e.value };
    question.choices[choiceIndex] = choiceToUpdate;

    questionsClone[questionIndex] = question;

    setQuestions(questionsClone);
  }

  function saveQuestions(showToast = true) { 
    saveMultipleQuestions(questions, {
      onSuccess: () => {
        if (showToast) toast.success('Questions added', { duration: 5000 });
        queryClient.invalidateQueries([
          'evaluation/questionsBySubject',
          subjectId,
          evaluationId,
        ]);
        window.history.back();
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  }

  function submitForm(e: FormEvent) {
    e.preventDefault();
    saveQuestions();
  }

  function removeAttachment(questionId: string, attachmentId: string) {
    deleteQuestionAttachment(
      {
        attachmentId,
        questionId,
      },
      {
        onSuccess: () => {
          toast.success('Attachment deleted', { duration: 4000 });
          queryClient.invalidateQueries([
            'evaluation/questionsBySubject',
            subjectId,
            evaluationId,
          ]);
        },
      },
    );
  }

  function currentTotalMarks() {
    let totalMarks = 0;
    questions.forEach((question) => {
      totalMarks += Number(question.mark);
    });
    return totalMarks;
  }

  const Nq = evaluationInfo?.evaluation_module_subjects.find(
    (subject) => subject.id === moduleSubject,
  )?.number_of_questions;

  const handleChangeEditor = (editor: Editor, index: number, name: string) => {
    if (name == 'answer') {
      setQuestions((prev) => {
        let questionsClone = [...prev];
        questionsClone[index].answer = editor.getHTML();
        return questionsClone;
      });
    } else if (name == 'question') {
      setQuestions((prev) => {
        let questionsClone = [...prev];
        questionsClone[index].question = editor.getHTML();
        return questionsClone;
      });
    }
  };

  return (
    <Fragment>
      <div
        className={`${
          evaluationInfo?.evaluation_module_subjects.find(
            (subject) => subject.id === moduleSubject,
          )?.section_total_marks === currentTotalMarks() && questions.length === Nq
            ? 'bg-primary-400'
            : 'bg-red-500'
        } + sticky top-0  z-50 py-4 px-5 text-main rounded-sm flex justify-evenly`}>
        <span>{evaluationInfo?.name}</span>
        <span className="">
          {/* {questions.length} / {evaluationInfo?.number_of_questions} {questions.length > 1 ? 'questions' : 'question'} */}
          {questions.length} /{Nq === null ? 'N/A' : Nq}{' '}
          {questions.length > 1 ? `questions ` : `question`}
        </span>

        <span>
          {currentTotalMarks()}/
          {
            evaluationInfo?.evaluation_module_subjects.find(
              (subject) => subject.id === moduleSubject,
            )?.section_total_marks
          }{' '}
          marks
        </span>
      </div>

      <form className="flex flex-col" onSubmit={submitForm}>
        {questions.length ? (
          questions.map((question, index: number) => (
            <div key={`${question.id} ${index}`}>
              <div className="flex justify-between w-2/3 bg-main px-6 py-10 mt-8">
                <div className="flex flex-col">
                  <SelectMolecule
                    value={question.question_type}
                    // disabled
                    width="64"
                    name="question_type"
                    placeholder="Question type"
                    handleChange={(e: ValueType) => handleChange(index, e)}
                    options={[
                      { label: 'OPEN', value: IQuestionType.OPEN },
                      { label: 'MULTIPLE CHOICE', value: IQuestionType.MULTIPLE_CHOICE },
                    ]}>
                    Question type
                  </SelectMolecule>

                  <div className="my-2">
                    <div className="mb-2">
                      <ILabel size="sm">Question {index + 1}</ILabel>
                    </div>
                    <Tiptap
                      handleChange={(editor) =>
                        handleChangeEditor(editor, index, 'question')
                      }
                      content={question.question}
                    />
                  </div>

                  {question.question_type === IQuestionType.OPEN && (
                    <div className="my-2 bg-gray-100 rounded-md p-2">
                      <div className="mb-2">
                        <ILabel weight="bold" size="sm">
                          Question {index + 1} answer marking scheme
                        </ILabel>
                      </div>
                      <Tiptap
                        handleChange={(editor) =>
                          handleChangeEditor(editor, index, 'answer')
                        }
                        content={question.answer}
                      />
                    </div>
                  )}

                  <div className="flex items-center py-5">
                    <FileUploader
                      disableUpload={singleQuestionsLoader || !question.question}
                      allowPreview={false}
                      clearFile={uploadLoader || removeAttachLoader}
                      handleUpload={(filelist) => {
                        handleUpload(filelist, question);
                      }}
                      accept={`${evaluationInfo?.content_format}`}
                      error={''}>
                      <div className="tooltip">
                        <Button
                          disabled={singleQuestionsLoader || !question.question}
                          styleType="outline"
                          type="button"
                          isLoading={uploadLoader}>
                          {uploadLoader ? 'uploading...' : 'upload file'}
                        </Button>

                        {!question.id && (
                          <span className="tooltiptext">
                            You have to first input question name
                          </span>
                        )}
                      </div>
                    </FileUploader>
                  </div>
                  {/* multiple choice answers here */}
                  {question.question_type === IQuestionType.MULTIPLE_CHOICE &&
                    question.choices.map((multipleQuestion, choiceIndex) => (
                      <>
                        <TextAreaMolecule
                          key={`${choiceIndex}`}
                          readOnly={question.submitted}
                          name={'answer_content'}
                          value={multipleQuestion.answer_content}
                          placeholder="Enter answer"
                          handleChange={(e: ValueType) =>
                            handleChoiceChange(index, choiceIndex, e)
                          }>
                          <div className="flex items-center justify-between">
                            Answer choice {choiceIndex + 1}
                            <button
                              type="button"
                              onClick={() => handleRemoveChoice(index, choiceIndex)}>
                              <Icon name="close" size={12} />
                            </button>
                          </div>
                        </TextAreaMolecule>
                      </>
                    ))}

                  <div className="flex flex-col py-5">
                    {question.attachments &&
                      question.attachments?.length > 0 &&
                      question.attachments?.map((attachment, index) => (
                        <div key={attachment.id} className="flex items-center gap-8">
                          <a
                            className="text-blue-800 hover:underline"
                            href={`${
                              import.meta.env.VITE_EVALUATION_API_URL
                            }/evaluation-service/api/evaluationQuestions/${
                              attachment.id
                            }/loadAttachment`}
                            target="_blank"
                            download
                            rel="noreferrer">
                            {index + 1}. {removeIdFromFileName(attachment.name)}
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              removeAttachment(
                                question.id,
                                attachment.id.toString() || '',
                              )
                            }>
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

                  {question.question_type === IQuestionType.MULTIPLE_CHOICE ? (
                    <div className="-mt-4 mb-1">
                      <Button
                        type="button"
                        className="flex items-center pl-0"
                        styleType="text"
                        onClick={() => handleAddMultipleMultipleChoiceAnswer(index)}>
                        <Icon
                          name="add"
                          size={17}
                          useheightandpadding={false}
                          stroke="primary"
                        />
                        <ILabel size="sm" className="cursor-pointer">
                          Add choice
                        </ILabel>
                      </Button>
                    </div>
                  ) : null}

                  {question.choices.length > 0 &&
                  question.question_type === IQuestionType.MULTIPLE_CHOICE ? (
                    <SelectMolecule
                      value={question.choices.find((ch) => ch.correct)?.answer_content}
                      width="64"
                      name="correct_answer"
                      placeholder="Choose correct answer"
                      handleChange={(e: ValueType) => handleCorrectAnswerCahnge(index, e)}
                      options={
                        question.choices.map((ch) => ({
                          label: ch.answer_content,
                          value: ch.answer_content,
                        })) as SelectData[]
                      }>
                      Correct answer
                    </SelectMolecule>
                  ) : null}
                  <InputMolecule
                    readonly={question.submitted}
                    required={false}
                    name={'mark'}
                    style={{ width: '6rem' }}
                    value={question.mark}
                    handleChange={(e: ValueType) => handleChange(index, e)}>
                    Question marks
                  </InputMolecule>

                  <Button
                    type="button"
                    onClick={() => handleRemoveQuestion(question.id, index)}
                    styleType="text"
                    className="self-start flex justify-center items-center"
                    icon>
                    <div className="flex items-center">
                      <Icon name="close" size={12} fill="primary" />
                      <span>Remove question</span>
                    </div>
                  </Button>
                </div>

                {/* <div className="pr-14">
                <div className="flex items-center">
                  <Icon name="attach" size={17} fill="primary" />
                  <Heading color="primary" fontSize="base">
                    Attach file
                  </Heading>
                </div>
              </div> */}
              </div>
            </div>
          ))
        ) : (
          <Heading className="py-8" color="error">
            No questions created for this evaluation
          </Heading>
        )}
        <div>
          <div className="pt-6 flex flex-col">
            <div className="pb-6">
              <Button
                styleType="outline"
                type="button"
                title="test"
                onClick={handleAddQuestion}>
                Add question
              </Button>
            </div>

            {(evaluationInfo?.evaluation_module_subjects.find(
              (subject) => subject.id === moduleSubject,
            )?.section_total_marks !== currentTotalMarks() ||
              questions.length !== Nq) && (
              <div className="bg-red-100 text-red-500 py-4 px-4 gap-8 my-4 rounded flex">
                <div>
                  <Icon name="alert" stroke="error" />
                </div>
                <ul className=" gap-3  list-disc ">
                  {questions.length !== Nq && (
                    <li>
                      <strong className="font-bold">Question Number Mismatch:</strong> The
                      number of questions you've set
                      <strong> "{questions.length}"</strong> doesn't match the expected
                      total <strong>"{Nq}"</strong>.
                    </li>
                  )}

                  {evaluationInfo?.evaluation_module_subjects.find(
                    (subject) => subject.id === moduleSubject,
                  )?.section_total_marks !== currentTotalMarks() && (
                    <li className="pt-4">
                      {' '}
                      <strong>Question Marks Mismatch:</strong> The total marks for your
                      selected questions <strong>"{currentTotalMarks()}"</strong> doesn't
                      match the expected total marks{' '}
                      {
                        evaluationInfo?.evaluation_module_subjects.find(
                          (subject) => subject.id === moduleSubject,
                        )?.section_total_marks
                      }
                      . Please review and adjust the marks assigned to individual
                      questions."
                    </li>
                  )}
                </ul>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onSubmit={submitForm}
                disabled={
                  (evaluationInfo?.evaluation_module_subjects.find(
                    (subject) => subject.id === moduleSubject,
                  )?.section_total_marks !== currentTotalMarks() &&
                    questions.length !== Nq) ||
                  createQuestionsLoader ||
                  singleQuestionsLoader ||
                  uploadLoader
                }>
                save
              </Button>

              <Button onClick={handleGoBack}>Go back</Button>
            </div>
          </div>
        </div>
      </form>
    </Fragment>
  );
}