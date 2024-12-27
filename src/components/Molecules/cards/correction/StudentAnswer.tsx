import React, { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import * as markingStore from '../../../../store/administration/marking.store';
import {
  addFeedbackAttachment,
  deleteFeedbackAttachment,
} from '../../../../store/evaluation/evaluation.store';
import { evaluationStore } from '../../../../store/evaluation/evaluation.store';
import { TextDecoration, ValueType } from '../../../../types';
import { IEvaluationInfo } from '../../../../types/services/evaluation.types';
import {
  MarkingCorrection,
  StudentMarkingAnswer,
} from '../../../../types/services/marking.types';
import { removeIdFromFileName,downloadEvaluationAttachment } from '../../../../utils/file-util';
import ContentSpan from '../../../../views/evaluation/ContentSpan';
import Button from '../../../Atoms/custom/Button';
import Icon from '../../../Atoms/custom/Icon';
import FileUploader from '../../../Atoms/Input/FileUploader';
import InputMarks from '../../../Atoms/Input/InputMarks';
import Heading from '../../../Atoms/Text/Heading';
import TextAreaMolecule from '../../input/TextAreaMolecule'; 


type FeedbackAttachment = {
  id: string; // or whatever type id should be
  // other properties of the attachment
};


interface PropTypes {
  data: StudentMarkingAnswer;
  full?: boolean;
  icon?: boolean;
  correction: MarkingCorrection[];
  totalMarks: number;
  index: number;
  evaluation?: IEvaluationInfo;
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
  updateQuestionPoints: (_answer_id: string, _marks: number) => void;
  createCreateNewCorrection: (
    _answer_id: string,
    _marks: number,
    _marked: boolean | undefined,
  ) => MarkingCorrection;
  setTotalMarks: Dispatch<SetStateAction<number>>;
  hoverStyle?: TextDecoration;
  className?: string;
}
export default function StudentAnswer({
  updateQuestionPoints,
  data,
  index,
  correction,
  setSaved,
  evaluation,
  createCreateNewCorrection,
}: PropTypes) {
  const correct: MarkingCorrection =
    correction.find((x) => x.answerId === data?.id) ||
    createCreateNewCorrection(data?.id, data.mark_scored, data.marked);

  const [obtainedMarks, setObtainedMarks] = useState(data.mark_scored);
  const [answerComment, setAnswerComment] = useState(data.answer_comment);
  const [shouldDisplayCommentBox, setShouldDisplayCommentBox] = useState(false);
  const [shouldDisplayMarkingScheme, setShouldDisplayMarkingScheme] = useState(false);

  const haveComment = useMemo(() => answerComment?.length > 0, [answerComment]);

   const studentAnswersFeedBack = markingStore.getStudentEvaluationAnswersFeedback(data?.id).data?.data;
 


   const { mutate: deleteAnswerAttachment, isLoading: removeAttachLoader } =  evaluationStore.deleteAnswerFeedbackattachment();

   function removeAttachment(attachmentId: string) { 
    deleteAnswerAttachment(attachmentId, {
      onSuccess: () => {
        toast.success('Attachment deleted', { duration: 4000 });
        setFeedbackAttachments(prev => prev.filter((att:any) => att.id !== attachmentId)); 
      },
      onError: (error) => {
        // @ts-ignore
        toast.error(error.response.data.message);
      },
    });
  }


    
  const { mutate: addQuestionDocAnswer, isLoading: uploadLoader } =
    addFeedbackAttachment();


  // const [feedbackAttachments, setFeedbackAttachments] = useState([]);
  const [feedbackAttachments, setFeedbackAttachments] = useState<FeedbackAttachment[]>([]);

  const handleUpload = (file: FileList | null) => {
    let uploadedFile = file ? file[0] : null;

    if (!uploadedFile) return;

    addQuestionDocAnswer({
      studentAnswerId: data.id,
      file: uploadedFile,
    }, {
      onSuccess: (attachmeInfo) => {
 
        const obj:any ={
          attachment:attachmeInfo?.data.data
        }
        setFeedbackAttachments(prev => [...prev, obj]);
        toast.success('Attachment uploaded', { duration: 4000 });
      },
      onError: (error:any) => {
        toast.error(error.response.data.message);
      }
    });
  };

  useEffect(() => {
    if (studentAnswersFeedBack && studentAnswersFeedBack.data) {
      setFeedbackAttachments(studentAnswersFeedBack.data);
    }
  }, [studentAnswersFeedBack]);

  function updateCorrectionMarks(e: ValueType) {
    if (Number(e.value) > data.evaluation_question.mark) {
      setObtainedMarks(0);
      toast.error('Marks cannot be greater than total marks');
      return;
    }
    setObtainedMarks(Number(e.value) || 0);
    updateQuestionPoints(data.id, obtainedMarks);
    setSaved(false);
  }
  const { mutate } = markingStore.saveAnswer();
  function saveAnswer() {
    mutate(
      { data: { marks: obtainedMarks, answerComment }, id: data.id },
      {
        onSuccess: () => {
          toast.success('Answer saved successfully');
        },
        onError: (error: any) => {
          toast.error(error.response.data.message + '', { duration: 3000 });
        },
      },
    );
  }
  // useEffect(() => {
  //   setAnswerComment(answer_comment || '');
  // }, [answer_comment]);
  function clickUpdateMarks(isCorrect: boolean) {
    if (isCorrect && obtainedMarks == 0) {
      setObtainedMarks(Number(data?.evaluation_question.mark));
      updateQuestionPoints(data.id, obtainedMarks);
    } else if (!isCorrect) {
      setObtainedMarks(Number(0));
      updateQuestionPoints(data.id, obtainedMarks);
    }
  }

  function handleChange({ value }: ValueType) {
    setAnswerComment(value.toString());
  }
  useEffect(() => {
    setObtainedMarks(data.mark_scored || 0);
  }, [data?.mark_scored]);
  let student_code: any = data.student_evaluation.code || '';
 


  async function downloadAttach(filename: string) { 
    
    const indexOfDelimiterOfExtension = filename.lastIndexOf('.');
   let file_name = student_code+ filename.slice(indexOfDelimiterOfExtension)
    const fileUrl = await downloadEvaluationAttachment(
      filename.toString() || '',
      '/attachments/load/',
    );
    let element = document.createElement('a');
    element.setAttribute('href', fileUrl);
    element.setAttribute('download', file_name);

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
 
  async function downloadFeedbackAttach(filename: string) { 
    const indexOfDelimiter = filename.lastIndexOf('-');
    const indexOfDelimiterOfExtension = filename.lastIndexOf('.'); 

  const file_name= filename.split('').slice(0, indexOfDelimiter).join('') +filename.slice(indexOfDelimiterOfExtension)

    const fileUrl = await downloadEvaluationAttachment(
      filename.toString() || '',
      '/attachments/load/',
    );
    let element = document.createElement('a');
    element.setAttribute('href', fileUrl);
    element.setAttribute('download', file_name);

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

 

 
  return (
    <div
      className={`w-full bg-main rounded-lg border-2 border-gray-200 ${
        !data.id ? 'opacity-50 pointer-events-none' : ''
      } `}>
      <div className="flex gap-3  items-center bg-gray-50 rounded-t-lg px-6 py-4 ">
        <Heading className="">Q {index + 1}.</Heading>
        <div
          dangerouslySetInnerHTML={{
            __html: data.evaluation_question?.question,
          }}></div>
      </div>
      <div className="px-6">
        <div className="mt-3 flex justify-between">
          <ContentSpan title={``} className="gap-3">
            {data.evaluation_question?.attachments?.length > 0 && (
              <div className="pt-6">
                <ContentSpan title={`Question Attachments`} className="gap-3" />

                {data.evaluation_question.attachments.map((ans, file_question_index) => (
                  <a
                    href={`${
                      import.meta.env.VITE_EVALUATION_API_URL
                    }/evaluation-service/api/evaluationQuestions/${
                      ans.id
                    }/loadAttachment`}
                    key={ans.id}
                    target="_blank"
                    className="block py-2 text-blue-500 hover:underline"
                    download
                    rel="noreferrer">
                    {file_question_index + 1}. {removeIdFromFileName(ans.name)}
                  </a>
                ))}
              </div>
            )}
          </ContentSpan>
        </div>

        {/* answer part */}
        <div className="">
          <div className="text-txt-secondary">
            {data.evaluation_question?.question_type == 'MULTIPLE_CHOICE' ? (
              <div>
                <div className="flex my-4">
                  <div
                    className={`w-14 h-12 border-primary-400 text-lg border-primary-500' border-2 border-r-0 rounded-tl-md rounded-bl-md right-rounded-md flex items-center justify-center`}>
                    *
                  </div>
                  <div
                    className={`w-auto h-12 border-2 border-primary-400 rounded-tr-md rounded-br-md flex items-center px-4`}
                    style={{ minWidth: '20rem' }}>
              {data.multiple_choice_answer && data.multiple_choice_answer.answer_content}
                  </div>
                </div>
                {data.evaluation_question?.multiple_choice_answers?.map(
                  (choice: any) =>
                    choice.id != data?.multiple_choice_answer?.id && (
                      <div className="flex my-4" key={choice.id}>
                        <div
                          className={`w-14 h-12 text-lg border-primary-500' border-2 border-r-0 rounded-tl-md rounded-bl-md right-rounded-md flex items-center justify-center`}>
                          *
                        </div>
                        <div
                          className={`w-auto h-12 border-2 rounded-tr-md rounded-br-md flex items-center px-4`}
                          style={{ minWidth: '20rem' }}>
                          {choice.answer_content}
                        </div>
                      </div>
                    ),
                )}
              </div>
            ) : (
              <div className=" ">
                {data?.open_answer || data.student_answer_attachments.length != 0 ? (
                  data.open_answer ||
                  (data.student_answer_attachments.length === 0 && (
                    <div
                      className="min-h-8 rounded-md border-2 border-primary-500 px-2 py-3 mt-4 answer-box text-primary-500"
                      dangerouslySetInnerHTML={{ __html: data.open_answer }}></div>
                  ))
                ) : (
                  <div className="min-h-8 rounded-md border-0 border-primary-500 px-2 py-3 mt-4 answer-box text-[#E91E12]">
                    Not answered
                  </div>
                )}

                {/* {data?.open_answer ||
                (data.student_answer_attachments.length == 0 && (
                  <div
                    className="min-h-8 rounded-md border-2 border-primary-500 px-2 py-3 mt-4 answer-box text-primary-500"
                    dangerouslySetInnerHTML={{ __html: data?.open_answer }}> 
                  </div>
                ))} */}
                <div>
                  {data.student_answer_attachments.length > 0 && (
                    <div className="pt-6">
                      <ContentSpan title={`Answer Attachments`} className="gap-3" />

                      {data.student_answer_attachments.map((ans, file_question_index) => (
                            <button onClick={() => downloadAttach(ans.attachment.name.toString() || '')}  className="block py-2 text-blue-500 hover:underline" >
                        {file_question_index + 1}{' )'} {removeIdFromFileName('File '+student_code)}
                          </button> 
                      ))}
                    </div>
                  )}
                </div>
 
             <ul>
                {feedbackAttachments && feedbackAttachments.length > 0 && (
                <div className="py-4">
                <Heading color="txt-primary" fontWeight="bold">
            Answer Feedback Attachments
            </Heading>
              {feedbackAttachments && feedbackAttachments.map((ans:any, file_question_index) => (
                  <li key={ans.attachment.id} className="flex justify-between items-center py-2">
                    
                      <button onClick={() => downloadFeedbackAttach(ans.attachment.name.toString() || '')}  className="block py-2 text-blue-500 hover:underline" >
                        {file_question_index + 1}{' )'} {removeIdFromFileName(ans.attachment.original_file_name)}
                          </button>  

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
                  </li>
                ))}
            </div> )}</ul>

                {/* because tiptap editor has 7 characters when empty */}
                {data.evaluation_question?.answer?.length > 7 && (
                  <>
                    <div className="flex">
                      {shouldDisplayMarkingScheme ? (
                        <Button
                          styleType="text"
                          onClick={() => setShouldDisplayMarkingScheme(false)}>
                          <span>Hide marking scheme</span>
                        </Button>
                      ) : (
                        <Button
                          styleType="text"
                          className="p-0"
                          onClick={() => setShouldDisplayMarkingScheme(true)}>
                          <span>Show marking scheme</span>
                        </Button>
                      )}
                    </div>
                    {shouldDisplayMarkingScheme && (
                      <div className="p-2 w-full bg-[#f1ecbf] text-[#000]">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: data?.evaluation_question.answer,
                          }}></div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-end items-center pt-4">
   
          {evaluation?.submision_type === 'FILE' && (
            <>
              <FileUploader
                clearFile={uploadLoader || removeAttachLoader}
                allowPreview={false}
                handleUpload={(filelist) => {
                  handleUpload(filelist);
                }}
                accept="*"
                error={''}>
                <Button styleType="outline" type="button" isLoading={uploadLoader}>
                  {uploadLoader ? 'uploading...' : 'upload feedback'}
                </Button>
              </FileUploader>
         
            </>
          )}


          <InputMarks
            handleChange={(e: ValueType) => updateCorrectionMarks(e)}
            min={0}
            disabled={data.evaluation_question?.question_type === 'MULTIPLE_CHOICE'}
            totalMarks={data.evaluation_question?.mark}
            style={{ width: '3rem' }}
            max={Number(data?.evaluation_question?.mark) || 4}
            value={obtainedMarks}
            name={'question_score'}
          />

          <div className="flex gap-1 items-end justify-end">
            <button
              className={`${
                !correct?.marked || correct?.markScored == 0
                  ? 'normal-button'
                  : 'right-button'
              } rounded-tl-full rounded-bl-full flex text-white items-center justify-center px-2`}
              onClick={() => {
                if (data.evaluation_question?.question_type != 'MULTIPLE_CHOICE')
                  clickUpdateMarks(true);
              }}>
              <Icon
                name={'tick'}
                size={14}
                padding="p-1"
                stroke={!correct?.marked || correct?.markScored == 0 ? 'none' : 'main'}
                fill={'none'}
              />
            </button>

            <button
              className={`${
                !correct?.marked || correct?.markScored != 0
                  ? 'normal-button'
                  : 'wrong-button'
              } rounded-tr-full rounded-br-full flex items-center justify-center px-2`}
              onClick={() => {
                if (data.evaluation_question?.question_type != 'MULTIPLE_CHOICE')
                  clickUpdateMarks(false);
              }}>
              <Icon
                name="cross"
                size={14}
                padding="p-1"
                fill={!correct?.marked || correct?.markScored != 0 ? 'secondary' : 'main'}
                // stroke={!correct?.marked || correct?.markScored == 0 ? 'main' : 'none'}
              />
            </button>
          </div>
        </div>
      </div>

      <hr className="my-4 border-t-2 border-gray-200" />

      <div className="flex">
        {shouldDisplayCommentBox ? (
          <Button styleType="text" onClick={() => setShouldDisplayCommentBox(false)}>
            <Icon name="comment" />
            <span>Hide comment</span>
          </Button>
        ) : (
          <Button
            styleType="text"
            className="p-0"
            onClick={() => setShouldDisplayCommentBox(true)}>
            <Icon name="comment" />
            <span>{haveComment ? 'view comment' : 'add comment'}</span>
          </Button>
        )}
      </div>

      {shouldDisplayCommentBox && (
        <div className="flex flex-col justify-between bg-gray-50 p-5 rounded border-gray-100 border">
          <TextAreaMolecule
            autoComplete="off"
            // cols={20}
            textAreaClassName="border-2 border-primary-500 "
            rows={8}
            style={{ height: '9rem', width: '100%' }}
            value={answerComment}
            placeholder="Type answer comment here"
            name="comment"
            handleChange={handleChange}
          />
          <Button className="self-end" onClick={saveAnswer}>
            {haveComment ? 'Update comment' : 'Add comment'}
          </Button>
        </div>
      )}
    </div>
  );
}
