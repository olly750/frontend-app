import React, { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';

import  * as  markingStore  from '../../../../store/administration/marking.store';
import { ValueType } from '../../../../types';
import { IEvaluationQuestionsInfo } from '../../../../types/services/evaluation.types';
import {
  FieldQuestionMarks,
  PointsUpdateInfo,
} from '../../../../types/services/marking.types';
import ContentSpan from '../../../../views/evaluation/ContentSpan';
import Heading from '../../../Atoms/Text/Heading';
import InputMolecule from '../../input/InputMolecule';

interface PropTypes {
  data: IEvaluationQuestionsInfo;
  questionMarks: FieldQuestionMarks[];
  totalMarks: number;
  index: number;
  updateQuestionPoints: (_question_id: string, _marks: number) => void;
  createCreateNewCorrection: (_question_id: string, _marks: number) => FieldQuestionMarks;
  setTotalMarks: Dispatch<SetStateAction<number>>;
  className?: string;
  updates: PointsUpdateInfo;
}
export default function FieldMarker({
  updateQuestionPoints,
  data,
  index,
  questionMarks,
  updates,
  createCreateNewCorrection,
}: PropTypes) {
  const { mutate } = markingStore.updateStudentAnswer();
  const correct: FieldQuestionMarks =
    questionMarks.find((x) => x.question_id === data?.id) ||
    createCreateNewCorrection(data?.id, 0);

  const [obtainedMarks, setObtainedMarks] = useState(
    updates.obtained || correct.obtained_marks || 0,
  );

  function updateCorrectionMarks(e: ValueType) {
    setObtainedMarks(parseFloat(e.value.toString()) || 0);
    updateQuestionPoints(data.id, obtainedMarks);
  }

  function submitUpdatesOnQuestions() {
    if (updates.is_updating) {
      mutate(
        { answer_id: updates.answer_id, marks: obtainedMarks },
        {
          onError: (error: any) => {
            toast.error(error.response.data.message + '', { duration: 3000 });
          },
        },
      );
    }
  }
  return (
    <div className={`answer-card-molecule bg-main p-6 rounded-lg `}>
      <div className="mt-3 flex justify-between">
        <ContentSpan title={`Question ${index + 1}`} className="gap-3">
          <div dangerouslySetInnerHTML={{ __html: `${data.question}` }} />
        </ContentSpan>

        <Heading fontWeight="semibold" fontSize="sm">
          {data.mark} marks
        </Heading>
      </div>

      <div>
        <div className="flex gap-4 mt-2">
          <div></div>
          <div className="flex gap-2 h-12 items-center mt-4 self-start"></div>
        </div>
      </div>

      <div className="float-right flex gap-6 items-center justify-center">
        <Heading fontWeight="semibold" fontSize="sm">
          Obtained marks
        </Heading>
        <InputMolecule
          handleChange={(e: ValueType) => updateCorrectionMarks(e)}
          onBlur={submitUpdatesOnQuestions}
          defaultValue={obtainedMarks + ''}
          min={0}
          style={{ width: '80px' }}
          max={Number(data?.mark) || 4}
          value={obtainedMarks}
          name={'question_score'}
        />
      </div>
    </div>
  );
}
