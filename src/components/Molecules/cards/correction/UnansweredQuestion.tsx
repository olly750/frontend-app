import React from 'react';

import { IEvaluationQuestionsInfo } from '../../../../types/services/evaluation.types';
import { removeIdFromFileName } from '../../../../utils/file-util';
import ContentSpan from '../../../../views/evaluation/ContentSpan';
import Heading from '../../../Atoms/Text/Heading';

interface PropTypes {
  index: number;
  question: IEvaluationQuestionsInfo;
}
export default function StudentAnswer({ question, index }: PropTypes) {
  return (
    <div className={`answer-card-molecule bg-main p-6 rounded-lg `}>
      <div className="mt-3 flex justify-between">
        <ContentSpan title={`Question ${index + 1}`} className="gap-3">
          <div
            dangerouslySetInnerHTML={{
              __html: question?.question,
            }}></div>
          {question.attachments?.length > 0 && (
            <div className="pt-6">
              <ContentSpan title={`Question Attachments`} className="gap-3" />

              {question.attachments.map((ans, file_question_index) => (
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

        <Heading fontWeight="semibold" fontSize="sm">
          {question.mark} marks
        </Heading>
      </div>

      <div className="flex gap-4 mt-2">
        <div></div>
      </div>
    </div>
  );
}
