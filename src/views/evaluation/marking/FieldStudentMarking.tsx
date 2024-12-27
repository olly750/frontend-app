import '../../../styles/components/Molecules/correction/marking.scss';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../../components/Atoms/custom/Button';
import Loader from '../../../components/Atoms/custom/Loader';
import FieldMarker from '../../../components/Molecules/cards/correction/FieldMarker';
import TableHeader from '../../../components/Molecules/table/TableHeader';
import FinishMarking from '../../../components/Organisms/forms/evaluation/FinishMarking';
import intakeProgramStore from '../../../store/administration/intake-program.store';
import  * as  markingStore  from '../../../store/administration/marking.store';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import {
  FieldQuestionMarks,
  PointsUpdateInfo,
} from '../../../types/services/marking.types';

interface MarkingParams {
  id: string;
  studentId: string;
}

export default function FieldStudentMarking() {
  const { id, studentId } = useParams<MarkingParams>();
  const { data: studentInfo } = intakeProgramStore.getStudentById(studentId);
  const { data: questions } = evaluationStore.getEvaluationQuestions(id);
  const [totalMarks, setTotalMarks] = useState(0);
  const [questionMarks, setQuestionMarks] = useState<Array<FieldQuestionMarks>>([]);
  const [step] = useState(0);

  const { mutate, isLoading } = markingStore.fieldMarkingFinish();
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
      // }
    }
  }

  function submitMarking() {
    if (questionMarks.length == (questions?.data.data.length || 0)) {
      mutate(
        { questions_marks: questionMarks, student_id: studentId, evaluation_id: id },
        {
          onSuccess: () => {
            toast.success('Marks saved successfully', { duration: 3000 });
            history.push(`/dashboard/evaluations/details/${id}/submissions`);
            // setStep(1);
          },
          onError: (error) => {
            console.error(error);
            toast.error(error + '');
          },
        },
      );
    } else {
      toast.error('Some Answers are not marked yet!' + questionMarks.length);
    }
  }
  if (step == 0)
    if (studentInfo && questionMarks)
      return (
        <div className={`flex flex-col gap-4`}>
          <TableHeader
            title={`${
              studentInfo?.data.data.user.person?.current_rank?.abbreviation || ''
            } ${studentInfo?.data.data.user.last_name} ${
              studentInfo?.data.data.user.first_name
            }`}
            showBadge={false}
            showSearch={false}>
            <p className="text-gray-400 text-lg">
              Marks obtained:{' '}
              <span className="text-green-500 font-semibold">{totalMarks}</span>
            </p>
          </TableHeader>
          <section className="flex flex-wrap justify-start gap-4 mt-2">
            {questions?.data.data?.map((question, index: number) => {
              let updates: PointsUpdateInfo = {
                answer_id: '',
                is_updating: false,
                obtained: undefined,
              };
              return (
                <FieldMarker
                  key={index}
                  index={index}
                  questionMarks={questionMarks}
                  updateQuestionPoints={updateQuestionPoints}
                  data={question}
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
              <Button onClick={submitMarking} isLoading={isLoading}>
                Complete Marking
              </Button>
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
