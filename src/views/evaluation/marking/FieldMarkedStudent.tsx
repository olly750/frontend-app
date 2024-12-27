import '../../../styles/components/Molecules/correction/marking.scss';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../../components/Atoms/custom/Button';
import Loader from '../../../components/Atoms/custom/Loader';
import FieldMarker from '../../../components/Molecules/cards/correction/FieldMarker';
import TableHeader from '../../../components/Molecules/table/TableHeader';
import FinishMarking from '../../../components/Organisms/forms/evaluation/FinishMarking';
import { queryClient } from '../../../plugins/react-query';
import intakeProgramStore from '../../../store/administration/intake-program.store';
import  * as  markingStore  from '../../../store/administration/marking.store';
// import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import {
  FieldQuestionMarks,
  PointsUpdateInfo,
} from '../../../types/services/marking.types';

interface MarkingParams {
  id: string;
  studentEvaluationId: string;
}

export default function FieldStudentMarking() {
  const { id, studentEvaluationId } = useParams<MarkingParams>();
  const { data: studentEvaluation, isLoading } =
    markingStore.getStudentEvaluationById(studentEvaluationId);
  const { data: studentAnswers } =
    markingStore.getStudentEvaluationAnswers(studentEvaluationId);
  const { data: studentInfo } = intakeProgramStore.getStudentById(
    studentEvaluation?.data.data.student.admin_id + '',
  );
  //   const { data: questions } = evaluationStore.getEvaluationQuestions(id);
  const [totalMarks, setTotalMarks] = useState(
    studentEvaluation?.data.data.obtained_mark || 0,
  );
  const [questionMarks, setQuestionMarks] = useState<Array<FieldQuestionMarks>>([]);
  const [step] = useState(0);
  const history = useHistory();
  function createCreateNewCorrection(
    question_id: string,
    points: number,
  ): FieldQuestionMarks {
    setQuestionMarks([...questionMarks, { question_id, obtained_marks: points }]);
    setTotalMarks(totalMarks + points);
    return { question_id, obtained_marks: points };
  }
  function updateQuestionPoints(question_id: string, points: number) {
    var flag: number = 0;

    questionMarks.forEach((element) => {
      if (element.question_id == question_id) {
        flag++;
        const newCorretion: FieldQuestionMarks[] = questionMarks.map((item) => {
          if (item.question_id === question_id) {
            const updatedItem: FieldQuestionMarks = {
              ...item,
              obtained_marks: points,
            };
            setTotalMarks(totalMarks - item.obtained_marks + points);
            return updatedItem;
          }

          return item;
        });

        setQuestionMarks(newCorretion);
      }
    });
    if (flag == 0) {
      setQuestionMarks([
        ...questionMarks,
        { question_id: question_id, obtained_marks: points },
      ]);
      setTotalMarks(totalMarks + points);
      //   }
    }
  }

  function submitMarking() {
    queryClient.invalidateQueries(['evaluation/studentEvaluations']);
    toast.success('Marks saved successfully', { duration: 3000 });
    history.push(`/dashboard/evaluations/details/${id}/submissions`);
  }
  if (step == 0)
    if (!isLoading && questionMarks)
      return (
        <div className={`flex flex-col gap-4`}>
          <TableHeader
            title={
              'Student Names: ' +
              `${studentInfo?.data.data.user.person?.current_rank?.abbreviation || ''}
                ${studentInfo?.data.data.user.last_name} ${
                studentInfo?.data.data.user.first_name
              }`
            }
            showBadge={false}
            showSearch={false}></TableHeader>
          <section className="flex flex-wrap justify-start gap-4 mt-2">
            {studentAnswers?.data.data?.map((answer, index: number) => {
              let updates: PointsUpdateInfo = {
                is_updating: true,
                answer_id: answer.id,
                obtained: answer.mark_scored,
              };
              return (
                <FieldMarker
                  key={index}
                  index={index}
                  questionMarks={questionMarks}
                  updateQuestionPoints={updateQuestionPoints}
                  data={answer.evaluation_question}
                  totalMarks={totalMarks}
                  setTotalMarks={setTotalMarks}
                  createCreateNewCorrection={createCreateNewCorrection}
                  updates={updates}
                />
              );
            })}
            {/* <div className="flex item-center mx-auto">
              <Pagination
                rowsPerPage={rowsOnPage}
                totalElements={studentAnswers?.length || 5}
                paginate={paginate}
                currentPage={currentPage}
                totalPages={1}
              />
            </div> */}
            <div className="w-full flex justify-end">
              <Button onClick={submitMarking}>Complete Marking</Button>
            </div>
          </section>
        </div>
      );
    else return <Loader />;
  else
    return (
      <FinishMarking
        student_code={'Student Names'}
        obtained_marks={totalMarks}
        student_evaluation={id}
      />
    );
}
