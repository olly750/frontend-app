import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Button from '../../../components/Atoms/custom/Button';
import Loader from '../../../components/Atoms/custom/Loader';
import Heading from '../../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../../components/Molecules/cards/NoDataAvailable';
import InputMolecule from '../../../components/Molecules/input/InputMolecule';
import SelectMolecule from '../../../components/Molecules/input/SelectMolecule';
import PopupMolecule from '../../../components/Molecules/Popup';
import Table from '../../../components/Molecules/table/Table';
import ExtendSubmission from '../../../components/Organisms/forms/evaluation/ExtendSubmission';
import usePickedRole from '../../../hooks/usePickedRole';
import { queryClient } from '../../../plugins/react-query';
import { classService } from '../../../services/administration/class.service';
import { getStudentsByClass } from '../../../store/administration/class.store';
import * as markingStore from '../../../store/administration/marking.store';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { ParamType, Privileges, ValueType } from '../../../types';
import { IClass } from '../../../types/services/class.types';
import {
  IEvaluationInfo,
  IEvaluationTypeEnum,
  IQuestionaireTypeEnum,
  ISubmissionTypeEnum,
} from '../../../types/services/evaluation.types';
import {
  EvaluationStudent,
  StudentEvaluationSubmissionInfo,
} from '../../../types/services/marking.types';
import FieldMarkedStudent from './FieldMarkedStudent';
import FieldMarking from './FieldMarking';
import FieldStudentMarking from './FieldStudentMarking';
import ManualMarking from './ManualMarking';
import StudentAnswersMarking from './StudentAnswersMarking';

type SubmissionsToDisplay = {
  id: string;
  names?: string;
  code: string;
  // 'Attempted At': string | number;
  obtained_Marks: number;
  totalmarks: number;
  status: string;
  // answered_Q: string;
};

export default function Submissions() {
  const history = useHistory();
  const { t } = useTranslation();
  const { id } = useParams<ParamType>();
  const picked_role = usePickedRole();
  const user_privileges = useMemo(
    () => picked_role?.role_privileges?.map((role) => role.name),
    [picked_role],
  );
  const hasPrivilege = useCallback(
    (privilege: Privileges) => user_privileges?.includes(privilege),
    [user_privileges],
  );
  const resultPublisher = markingStore.publishResult();
  const [submissions, setSubmissions] = useState<SubmissionsToDisplay[]>([]);
  const { url, path } = useRouteMatch();
  const { mutate, isLoading: isPublishing } = markingStore.publishResults();
  const { data: evaluation } = evaluationStore.getEvaluationById(id).data?.data || {}; 
  const [currentClassId, setCurrentClassId] = useState<string>(() => {
    return localStorage.getItem('currentClassId') || '';
  });
  const [classes, setclasses] = useState<IClass[]>([]);
  const {
    data: studentEvaluationSubmissionData,
    isSuccess,
    isLoading,
    isError,
  } = markingStore.getEvaluationStudentSubmissions(evaluation?.id + '');

  const { mutate: extendEvaluationTimeLimit, isLoading: updateTimeLoader } =
    evaluationStore.extendEvaluation();

  const { data: studentsData, isLoading: areStudentsByClassLoading } =
    getStudentsByClass(currentClassId.trim()) || [];

  const [open, setOpen] = useState(false);
  const [time_limit, setTimeLimit] = useState(0);

  function publishEvaluationResults() {
    mutate(
      { evaluationId: evaluation?.id + '' },
      {
        onSuccess: () => {
          toast.success('Results published', { duration: 3000 });
          history.push('/dashboard/evaluations');
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      },
    );
  }

  useEffect(() => {
    async function fetchData() {
      const classIds = evaluation?.intake_level_class_ids.split(',') || [];

      const classesToShow = await Promise.all(
        classIds.map(async (cl) => {
          return await (
            await classService.getClassById(cl)
          ).data.data;
        }),
      );
      setclasses(classesToShow);
    }

    fetchData();
  }, [evaluation?.intake_level_class_ids]);

  useEffect(() => {
    let newState: SubmissionsToDisplay[] = [];

    if (
      isSuccess &&
      studentEvaluationSubmissionData &&
      studentEvaluationSubmissionData.data
    ) {
      if (evaluation?.submision_type === ISubmissionTypeEnum.FILE) {
        const studentSubmissionHashByAdminId: Record<
          string,
          StudentEvaluationSubmissionInfo
        > = {};
        studentEvaluationSubmissionData?.data.forEach(
          (submission) =>
            (studentSubmissionHashByAdminId[submission.studentAdminId] = submission),
        );

        const studentsWithRanks =
          studentsData?.data.data.filter(
            (stud) => stud.student.user.person?.current_rank,
          ) || [];
        const studentsWithoutRanks =
          studentsData?.data.data.filter(
            (inst) => inst !== studentsWithRanks.find((ranked) => ranked.id === inst.id),
          ) || [];

        studentsWithRanks.sort(function (a, b) {
          if (a.student.user.person && b.student.user.person) {
            return (
              a.student.user.person.current_rank?.priority -
              b.student.user.person.current_rank?.priority
            );
          } else {
            return 0;
          }
        });
        const allStudents = studentsWithRanks.concat(studentsWithoutRanks);
     
        allStudents.forEach((std) => {
          const rank = std.student.user.person?.current_rank?.abbreviation || '';
          const lastName =
            std.student.user.person?.alias_last_name  || '';

          const firstName =
            std.student.user.person?.alias_first_name ||
            ' ';
          const studentSubmission = studentSubmissionHashByAdminId[std.student.id]; 
          if (studentSubmission) {
        
            newState.push({
              id: studentSubmission.studentId,
              names: `${firstName} ${lastName}`,
              // names: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
              //   ? `${rank} ${firstName} ${lastName}`
              //   : '-',
              code: studentSubmission.code,
              obtained_Marks: studentSubmission.obtainedMarks,
              totalmarks: studentSubmission.totalmarks,
              status: `${studentSubmission.unmarked == 0 ? 'MARKED' : 'TO_MARK'}`,
            });
          }
        });
      } else {
        studentEvaluationSubmissionData?.data.forEach((submission) => {
          newState.push({
            id: submission.studentId,
            code: submission.code,
            obtained_Marks: submission.obtainedMarks,
            totalmarks: submission.totalmarks,
            status: `${submission.unmarked == 0 ? 'MARKED' : 'TO_MARK'}`,
          });
        });
      }

      setSubmissions(newState);
    }
  }, [
    evaluation?.submision_type,
    hasPrivilege,
    isSuccess,
    studentEvaluationSubmissionData,
    studentsData?.data.data,
  ]);

 

  const actions = [
    {
      name: 'Mark Answers',
      handleAction: (
        _data: string | number | IEvaluationInfo | EvaluationStudent | undefined,
      ) => {
        history.push({ pathname: `${url}/${_data}` });
      },
    },
    {
      name: 'Publish',
      handleAction: (
        _data: string | number | IEvaluationInfo | EvaluationStudent | undefined,
      ) => {
        resultPublisher.mutate(
          { studentEvaluationId: _data + '' },
          {
            onSuccess: () => {
              toast.success('Result published', { duration: 3000 });
            },
            onError: (error: any) => {
              console.error(error);
              toast.error(error.response.data.message);
            },
          },
        );
      },
    },

    {
      name: 'Extend',
      handleAction: (
        //nothing
        _data: string | number | IEvaluationInfo | EvaluationStudent | undefined,
      ) => {
        // extendStudentEvaluation(_data + '');
        history.push(`${url}/${_data}/extend`);
      },
    },
  ];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    e.preventDefault();
    const evaluationData: any = {
      id: id,
      time_limit: time_limit,
    };
    extendEvaluationTimeLimit(evaluationData, {
      onSuccess: () => {
        setOpen(false);
        toast.success('Evaluation extended successfully');
        queryClient.invalidateQueries(['evaluation', id]);
        history.push(`/dashboard/evaluations/details/${id}/submissions`);
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  }
 
 

  function handleClassChange(e: ValueType) {
    const classId = e.value.toString();
    setCurrentClassId(classId);
    localStorage.setItem('currentClassId', classId); 
  }

  return (
    <div>
      <Switch>
        <Route
          exact
          path={`${path}/field/:studentId/mark`}
          component={FieldStudentMarking}
        />
        <Route
          exact
          path={`${path}/field/marked/:studentEvaluationId`}
          component={FieldMarkedStudent}
        />
        <Route
          exact
          path={`${path}/:studentEvaluationId/extend`}
          render={() => (
            <PopupMolecule
              title="Extend Submission"
              open={true}
              onClose={() => {
                history.goBack();
              }}>
              <ExtendSubmission />
            </PopupMolecule>
          )}
        />
        <Route exact path={`${path}/:id`} component={StudentAnswersMarking} />
        {isLoading && <Loader />}
        {evaluation?.questionaire_type === IQuestionaireTypeEnum.MANUAL && (
          <>
            <Heading fontWeight="semibold" className="pt-7">
              {evaluation.name}
            </Heading>
            <div className="w-full flex justify-end mb-4">
              <Button isLoading={isPublishing} onClick={publishEvaluationResults}>
                Publish all results
              </Button>
            </div>
            <ManualMarking evaluationId={evaluation.id} />
          </>
        )}

        {evaluation?.questionaire_type === IQuestionaireTypeEnum.FIELD ||
        evaluation?.evaluation_type === IEvaluationTypeEnum.TEWT ? (
          <FieldMarking evaluationId={evaluation.id} />
        ) : evaluation?.questionaire_type === IQuestionaireTypeEnum.MANUAL ? (
          <></>
        ) : (
          <>
            {evaluation?.submision_type === ISubmissionTypeEnum.FILE ? (
              <div>
                <Heading fontWeight="medium" fontSize="sm">
                  Select {t('Class')}
                </Heading>
                <SelectMolecule
                  width="80"
                  value={currentClassId}
                  handleChange={handleClassChange}
                  name={'type'}
                  placeholder={'Select ' + t('Class')}
                  options={classes.map((cls) => ({
                    value: cls.id,
                    label: cls.class_name,
                  }))}
                />
              </div>
            ) : null}

            {isSuccess && submissions.length === 0 ? (
              <NoDataAvailable
                icon="evaluation"
                buttonLabel="Go back"
                title={'No submissions has been made so far!'}
                description="It looks like there is any student who have submitted so far."
              />
            ) : isSuccess && submissions.length > 0 ? (
              <div>
                <div className="w-full flex justify-end mb-4">
                  <div className="mr-4">
                    {/* <Button 
                  //isLoading={isPublishing} 
                  onClick={extendEvaluationSubmission}>
                    Extend all submission
                  </Button> */}
                    <Button
                      isLoading={updateTimeLoader}
                      styleType="outline"
                      onClick={() => setOpen(true)}>
                      Extend for all submission
                    </Button>
                  </div>
                  <div>
                    <Button isLoading={isPublishing} onClick={publishEvaluationResults}>
                      Publish all results
                    </Button>
                  </div>
                </div>
                <Table<SubmissionsToDisplay>
                  statusColumn="status"
                  data={submissions}
                  hide={['id']}
                  uniqueCol={'id'}
                  actions={actions}
                />
              </div>
            ) : isError ? (
              <NoDataAvailable
                icon="evaluation"
                showButton={false}
                title={'Something went wrong'}
                description="Something went wrong, try reloading the page or check your internet connection"
              />
            ) : null}
          </>
        )}
      </Switch>
      {open && (
        <PopupMolecule
          closeOnClickOutSide={false}
          open={open}
          title="Extend Evaluation Submission"
          onClose={() => {
            setOpen(false);
          }}>
          <form className="bg-main w-2/3 px-8 py-6" onSubmit={handleSubmit}>
            <InputMolecule
              value={time_limit || 0}
              placeholder="time limit"
              name="time_limit"
              handleChange={(e: ValueType) => setTimeLimit(Number(e.value.toString()))}>
              Time limit
            </InputMolecule>

            <Button type="submit">save</Button>
          </form>
        </PopupMolecule>
      )}
    </div>
  );
}
