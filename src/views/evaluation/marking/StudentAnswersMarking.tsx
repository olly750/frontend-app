import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import Button from '../../../components/Atoms/custom/Button';
import Loader from '../../../components/Atoms/custom/Loader';
import Heading from '../../../components/Atoms/Text/Heading';
import StudentAnswer from '../../../components/Molecules/cards/correction/StudentAnswer';
import NoDataAvailable from '../../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../../components/Molecules/input/SelectMolecule';
import TableHeader from '../../../components/Molecules/table/TableHeader';
import FinishMarking from '../../../components/Organisms/forms/evaluation/FinishMarking';
import { queryClient } from '../../../plugins/react-query';
import * as markingStore from '../../../store/administration/marking.store';
import { SelectData, ValueType } from '../../../types';
import { ParamType } from '../../../types';
import { IMarkingType } from '../../../types/services/evaluation.types';
import {
  MarkingCorrection,
  StudentMarkingAnswer,
} from '../../../types/services/marking.types';
import { useEvaluationStore } from '../../../zustand/evaluation';

export default function StudentAnswersMarking() {
  const { id } = useParams<ParamType>();
  const [evaluationId, setEvaluationId] = useState<string>('');
  const { mutate, isLoading: isSubmitting } = markingStore.finishMarking();
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      window.location.reload();
    });

    return () => {
      unlisten();
    };
  }, [history]);

  const handleButtonClick = () => {
    history.push(`/dashboard/evaluations/details/${evaluationId}/submissions`);
  };


  const studentAnswers = markingStore.getStudentEvaluationAnswers(id).data?.data.data;
  const { data: studentEvaluation, isLoading } =
    markingStore.getStudentEvaluationById(id);

  const evaluation = useMemo(
    () => studentEvaluation?.data.data.evaluation,
    [studentEvaluation?.data.data],
  );

  const { data, isLoading: markingModulesLoader } =
    markingStore.getEvaluationMarkingModules(evaluationId, evaluationId.length == 36);

  const correction = useEvaluationStore((state) => state.correction);
  const setCorrection = useEvaluationStore((state) => state.setCorrection);
  const totalMarks = useMemo(
    () => correction.reduce((acc, curr) => acc + curr.markScored, 0),
    [correction],
  );


  const [saved, setSaved] = useState<boolean>(true);
  const [markingModules, setMarkingModules] = useState<SelectData[]>([]);
  const [currentModule, setCurrentModule] = useState<string>('');
  const [step, setStep] = useState<number>(0);
  const [answersLength, setAnswersLength] = useState<number>(0);

  useEffect(() => {
    setEvaluationId(
      studentEvaluation?.data.data
        ? studentEvaluation?.data.data.evaluation.id.toString()
        : '',
    );
  }, [studentEvaluation]);

  useEffect(() => {
    setCorrection([]);
    if (currentModule != '' || markingModules.length >= 0) {
      const newAnswers = studentAnswers?.filter(answersFilter) || [];
      setAnswersLength(newAnswers.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentModule, studentAnswers]);
  useEffect(() => {
    let selectedModules: SelectData[] = [];
    data?.data.data.forEach((element) => {
      selectedModules.push({
        value: element.id,
        label: element.module_subject.title,
      });
    });

    if (selectedModules.length > 0) {
      setMarkingModules(selectedModules);
      setCurrentModule(selectedModules[0].value.toString());
    }
  }, [data]);

  function handleMarkingModuleChange(e: ValueType) {
    if (!saved && correction.length > 0) {
      submitMarking();
    }
    setCurrentModule(e.value.toString());
  }

  function createCreateNewCorrection(
    answer_id: string,
    points: number,
    marked: boolean | undefined,
  ) {
    if (
      answer_id !== 'undefined' &&
      answer_id !== undefined &&
      answer_id !== null &&
      answer_id !== ''
    ) {
      setCorrection([
        ...correction,
        { answerId: answer_id, markScored: points, marked: marked },
      ]);
    }

    return { answerId: answer_id, markScored: points, marked: marked || false };
  }

  function updateQuestionPoints(answer_id: string, points: number) {
    var flag: number = 0;

    correction.forEach((element) => {
      if (element.answerId == answer_id) {
        flag++;
        const newCorretion: MarkingCorrection[] = correction.map((item) => {
          if (item.answerId === answer_id) {
            const updatedItem: MarkingCorrection = {
              ...item,
              marked: true,
              markScored: points,
            };
            return updatedItem;
          }

          return item;
        });

        setCorrection(newCorretion);
      }
    });
    if (flag == 0) {
      setCorrection([
        ...correction,
        { answerId: answer_id, markScored: points, marked: true },
      ]);
      // }
    }
  }
 
  const answersFilter = (studentAnswer: StudentMarkingAnswer) => {
    if (studentAnswer.evaluation_question.evaluation_module_subject != null)
      return (
        currentModule ===
        studentAnswer.evaluation_question.evaluation_module_subject.id + ''
      );
    else return true;
  };

  const markerFilter = (studentAnswer: StudentMarkingAnswer) => {
    return markingModules.some(
      (module) =>
        module.value === studentAnswer.evaluation_question.evaluation_module_subject.id &&
        !studentAnswer.marked,
    );
  };

  function goNextStep() {
    const newAnswers = studentAnswers?.filter(markerFilter) || [];
    for (let i = 0; i < newAnswers.length; i++) {
      if (!newAnswers[i].marked) {
        toast.error('You must mark all the sections before you can complete the marking');
        return;
      }
    }
    setStep(step + 1);
  }
  function nonSectionMarkingSubmission() {
    if (correction.length === (studentAnswers?.length || 0)) {
      mutate(
        { studentEvaluation: id, correction: correction },
        {
          onSuccess: () => {
            toast.success('Marks saved successfully', { duration: 3000 });
            setStep(1);
          },
          onError: (error) => {
            console.error(error);
            toast.error(error + '');
          },
        },
      );
    } else {
      // console.log(studentAnswers?.filter(answersFilter));
      toast.error('Some Answers are not marked yet!' + correction.length);
    }
  }

  function submitMarking() {
    mutate(
      { studentEvaluation: id, correction: correction },
      {
        onSuccess: () => {
          toast.success('Marks saved successfully', { duration: 3000 });
          queryClient.invalidateQueries(['studentEvaluation/answers', id]);
          setSaved(true);
          // setStep(1);
        },
        onError: (error) => {
          console.log(error);
          toast.error('Error occurred while saving marks');
        },
      },
    );
  }

  if (!studentEvaluation?.data.data) return <Loader />;

  if (step == 0)
    if (!isLoading && !markingModulesLoader)
      if (
        markingModules?.length > 0 &&
        studentEvaluation?.data.data.evaluation.marking_type === IMarkingType.PER_SECTION
      )
        return (
          <div className={`flex flex-col gap-4`}>
            <div>
              <Heading fontWeight="medium" fontSize="sm">
                Select section
              </Heading>
              <SelectMolecule
                width="80"
                className=""
                value={currentModule}
                handleChange={handleMarkingModuleChange}
                name={'type'}
                placeholder="marking section"
                options={markingModules}
              />
            </div>
            {answersLength > 0 && (
              <TableHeader
                title={studentEvaluation?.data.data.code + ' submission'}
                showBadge={false}
                showSearch={false}>
                <p className="text-gray-400 text-lg">
                  Marks obtained:{' '}
                  <span className="text-green-500 font-semibold">{totalMarks}</span>
                </p>
              </TableHeader>
            )}

            <section className="flex flex-col justify-start gap-4 mt-2">
              <div className="py-6">
                <Heading className="font-semibold text-xl">
                  {studentAnswers?.filter(answersFilter).length || 0 > 0
                    ? 'Answers'
                    : 'No answers'}
                </Heading>
              </div>
              {studentAnswers
                ?.filter(answersFilter)
                .map((studentAnswer, index: number) => {
                  return (
                    <>
                      <StudentAnswer
                        key={studentAnswer.id}
                        setSaved={setSaved}
                        index={index}
                        correction={correction}
                        evaluation={evaluation}
                        updateQuestionPoints={updateQuestionPoints}
                        data={studentAnswer}
                        totalMarks={totalMarks}
                        setTotalMarks={() => 0}
                        createCreateNewCorrection={createCreateNewCorrection}
                      />
                    </>
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

              {answersLength > 0 && (
                <>
                  <div className="w-full flex justify-between items-center py-4 gap-6">
                    <div>
                      <Heading fontWeight="medium" fontSize="sm">
                        Select section
                      </Heading>
                      <SelectMolecule
                        width="80"
                        className=""
                        value={currentModule}
                        handleChange={handleMarkingModuleChange}
                        name={'type'}
                        placeholder="marking section"
                        options={markingModules}
                      />
                    </div>
                    <div>
                      <Button onClick={submitMarking} isLoading={isSubmitting}>
                        Save Section Marks
                      </Button>
                    </div>
                  </div>
                  <div className="w-full flex justify-end gap-6">
              
                    <Button styleType="outline" onClick={handleButtonClick}>
                    Next Student
                      </Button>
                    {/* <Button styleType="outline" onClick={goNextStep}>
                      Complete Markingx
                    </Button> */}
                    {/* <Button onClick={submitMarking} isLoading={isSubmitting}>
                    Save Section Marks
                  </Button> */}
                  </div>
                </>
              )}

              {!currentModule && (
                <NoDataAvailable
                  title={'Select a module to mark'}
                  showButton={false}
                  description={"You haven't selected an module to mark"}
                />
              )}
              {answersLength == 0 && (
                <div className="w-full flex justify-end">
                  <Button
                    onClick={() => {
                      history.goBack();
                    }}>
                    Go back
                  </Button>
                </div>
              )}
            </section>
          </div>
        );
      else if (
        studentEvaluation?.data.data.evaluation.marking_type !== IMarkingType.PER_SECTION
      )
        return (
          <div className={`flex flex-col gap-4`}>
            <TableHeader
              title={studentEvaluation?.data.data.code + ' submission'}
              showBadge={false}
              showSearch={false}>
              <p className="text-gray-400">
                Marks obtained:{' '}
                <span className="text-green-300 font-semibold">{totalMarks}</span>
              </p>
            </TableHeader>

            <section className="flex flex-wrap justify-start gap-4 mt-2">
              {studentAnswers?.map((studentAnswer, index: number) => {
                return (
                  <StudentAnswer
                    setSaved={setSaved}
                    key={index}
                    index={index}
                    correction={correction}
                    updateQuestionPoints={updateQuestionPoints}
                    data={studentAnswer}
                    totalMarks={totalMarks}
                    setTotalMarks={() => 0}
                    createCreateNewCorrection={createCreateNewCorrection}
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
                <Button onClick={nonSectionMarkingSubmission} isLoading={isLoading}>
                  Complete Marking
                </Button>
              </div>
            </section>
          </div>
        );
      else
        return (
          <div className="w-full flex justify-center items-center">
            <NoDataAvailable
              title={'No marking modules'}
              description={"You don't have any marking module for this evaluation"}
            />
          </div>
        );
    else return <Loader />;
  else
    return (
      <FinishMarking
        student_code={studentEvaluation?.data.data.code + ''}
        obtained_marks={totalMarks}
        student_evaluation={id}
      />
    );
}
