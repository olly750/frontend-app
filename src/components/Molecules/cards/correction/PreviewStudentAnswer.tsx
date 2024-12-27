import React from 'react';

import { TextDecoration } from '../../../../types';
import { StudentMarkingAnswer } from '../../../../types/services/marking.types';
import { removeIdFromFileName } from '../../../../utils/file-util';
import ContentSpan from '../../../../views/evaluation/ContentSpan';
// import Icon from '../../../Atoms/custom/Icon';
import Heading from '../../../Atoms/Text/Heading';

interface PropTypes {
  data: StudentMarkingAnswer;
  index: number;
  full?: boolean;
  icon?: boolean;
  hoverStyle?: TextDecoration;
  className?: string;
}
export default function PreviewStudentAnswer({ data, index }: PropTypes) {
  // console.log(data);
  // console.log(data.);

  return (
    <div className={`answer-card-molecule bg-main p-6 rounded-lg `}>
      <div className="mt-3 flex justify-between">
        <ContentSpan title={`Question ${index + 1}`} className="gap-3">
          <div
            dangerouslySetInnerHTML={{
              __html: data.evaluation_question?.question,
            }}></div>
          {data.evaluation_question?.attachments?.length > 0 && (
            <div className="pt-6">
              <ContentSpan title={`Question Attachments`} className="gap-3" />

              {data.evaluation_question.attachments.map((ans, file_question_index) => (
                <a
                  href={`${
                    import.meta.env.VITE_EVALUATION_API_URL
                  }/evaluation-service/api/evaluationQuestions/${ans.id}/loadAttachment`}
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
      <div className="flex gap-4 mt-2 items-center">
        <div>
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
                  {data.multiple_choice_answer.answer_content}
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-16 ">
              {data?.open_answer || data.student_answer_attachments.length != 0 ? (
                data.open_answer ||
                (data.student_answer_attachments.length === 0 && (
                  <div
                    className="min-h-8 rounded-md border-2 border-primary-500 px-2 py-3 mt-4 answer-box text-primary-500"
                    dangerouslySetInnerHTML={{ __html: data.open_answer }}></div>
                ))
              ) : (
                <div className="min-h-8 rounded-md border-0 border-primary-500 px-2 py-3 mt-4 answer-box text-[#E91E12]">
                  Not Attempted or Submitted
                </div>
              )}
              <div>
                {data.student_answer_attachments.length > 0 && (
                  <div className="pt-6">
                    <ContentSpan title={`Answer Attachments`} className="gap-3" />

                    {data.student_answer_attachments.map((ans, file_question_index) => (
                      <a
                        href={`${
                          import.meta.env.VITE_EVALUATION_API_URL
                        }/evaluation-service/api/evaluationQuestions/${
                          ans.attachment.id
                        }/loadAttachment`}
                        key={ans.attachment.id}
                        target="_blank"
                        className="block py-2 text-blue-500 hover:underline"
                        download
                        rel="noreferrer">
                        {file_question_index + 1}.{' '}
                        {removeIdFromFileName(ans.attachment.name)}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {data.evaluation_question?.answer?.length > 7 && (
                <div className="px-2 py-3 mt-4 answer-box">
                  {data.answer_comment !== null && <hr></hr>}
                  <ContentSpan
                    title={`${
                      data.answer_comment === null ? '' : "Instructor's comment"
                    }`}
                    className="gap-3"
                  />
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data.answer_comment || '',
                    }}></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
