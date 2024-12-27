import moment from 'moment';
import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { boolean } from 'yup';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import InputMolecule from '../../components/Molecules/input/InputMolecule';
import RadioMolecule from '../../components/Molecules/input/RadioMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import TabNavigation, { TabType } from '../../components/Molecules/tabs/TabNavigation';
import ApprovalsList from '../../components/Organisms/evaluation/ApprovalsList';
import EvaluationContent from '../../components/Organisms/evaluation/EvaluationContent';
import ReviewersList from '../../components/Organisms/evaluation/ReviewersList';
import AddEvaluationQuestions from '../../components/Organisms/forms/evaluation/AddEvaluationQuestions';
import { queryClient } from '../../plugins/react-query';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ParamType, Privileges, ValueType } from '../../types';
import {
  IEvaluationSettingType,
  IEvaluationUpdate,
} from '../../types/services/evaluation.types';
import { Instructor } from '../../types/services/instructor.types';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../utils/utils';
import ContentSpan from '../../views/evaluation/ContentSpan';
import EvaluationSettingProgress from '../EvaluationSettingProgress';
import ApproveEvaluation from './ApproveEvaluation';
import EvaluationDetailedReport from './EvaluationDetailedReport';
import EvaluationMarkingReport from './EvaluationMarkingReport';
import EvaluationPerformance from './EvaluationPerformance';
import Submissions from './marking/Submissions';
import ReviewEvaluation from './ReviewEvaluation';
import SectionBasedEvaluation from './SectionBasedEvaluation';
import Unbeguns from './Unbeguns';

export default function EvaluationDetails() {
  const { id: evaluationId } = useParams<ParamType>();
  const history = useHistory();
  const [open, setOpen] = useState(false);

  const { mutate: updateEvaluationTimeLimit, isLoading: updateTimeLoader } =
    evaluationStore.updateEvaluation();

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationById(evaluationId).data?.data || {};
  const [time_limit, setTimeLimit] = useState(0);
  const [evaluation_name, setEvaluationName] = useState('');
  const [due_on, setDueOn] = useState('');
  const [allow_submission_time, setAllowSUbmission] = useState('');
  const [strict, setStrict] = useState(evaluationInfo?.strict);

  const instructorInfo: Instructor | null = getObjectFromLocalStrg(
    getLocalStorageData('instructorInfo'),
  );

  const { url, path } = useRouteMatch();

  const { mutate: deleteEvaluation, isLoading } = evaluationStore.deleteEvaluationById();

  const makeEvaluationPublic = evaluationStore.publishEvaluation();
  const tabs: TabType[] = [
    {
      label: 'Overview evaluation',
      href: `${url}/overview`,
    },
    {
      label: 'Not attempted',
      href: `${url}/unbeguns`,
    },
    {
      label: 'Performance report',
      href: `${url}/performance`,
      privilege: Privileges.CAN_VIEW_EVALUATION_PERFORMANCE_REPORT,
    },
    {
      label: 'Detailed Performance report',
      href: `${url}/detailedreport`,
      privilege: Privileges.CAN_VIEW_EVALUATION_PERFORMANCE_REPORT,
    },
    {
      label: 'Marking Progress report',
      href: `${url}/markingreport`,
    },
  ];
  if (evaluationInfo?.instructor_id != instructorInfo?.user.id) {
    // Push "Submissions" tab at the second index
    tabs.splice(1, 0, {
      label: 'Submissions',
      href: `${url}/submissions`,
    });
  }
  if (
    evaluationInfo?.setting_type === IEvaluationSettingType.SECTION_BASED &&
    evaluationInfo?.instructor_id === instructorInfo?.user.id
  ) {
    tabs.push({
      label: 'Evaluation sections',
      href: `${url}/sections`,
    });
  }

  if (
    evaluationInfo?.setting_type === IEvaluationSettingType.SECTION_BASED &&
    evaluationInfo?.instructor_id === instructorInfo?.user.id
  ) {
    tabs.push({
      label: 'Evaluation reviewers',
      href: `${url}/reviewers`,
    });
  }

  if (
    evaluationInfo?.setting_type === IEvaluationSettingType.SECTION_BASED &&
    evaluationInfo?.instructor_id === instructorInfo?.user.id
  ) {
    tabs.push({
      label: 'Evaluation Approvals',
      href: `${url}/approvals`,
    });
  }

  const publishEvaluation = (status: string) => {
    makeEvaluationPublic.mutate(
      { evaluationId: evaluationId, status: status },
      {
        onSuccess: () => {
          toast.success('Availability status updated', { duration: 3000 });
          queryClient.invalidateQueries(['evaluation']);
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      },
    );
  };

  function handleIsStrictChange({ name, value }: any) {
    const strictValue: boolean = value;
    setStrict(value);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const evaluationData: any = {
      id: evaluationId,
      name: evaluation_name,
      classification: evaluationInfo?.classification,
      consider_on_report: evaluationInfo?.is_consider_on_report,
      allow_submission_time: moment(allow_submission_time).format('yyyy-MM-DD HH:mm:ss'),
      eligible_group: evaluationInfo?.eligible_group,
      exam_instruction: evaluationInfo?.exam_instruction,
      total_mark: evaluationInfo?.total_mark,
      submision_type: evaluationInfo?.submision_type,
      time_limit: time_limit,
      due_on: moment(due_on).format('yyyy-MM-DD HH:mm:ss'),
      strict: strict,
    };
    updateEvaluationTimeLimit(evaluationData, {
      onSuccess: () => {
        toast.success('Evaluation Updated successfully');
        queryClient.invalidateQueries(['evaluation', evaluationId]);
        history.push('/dashboard/evaluations');
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  }

  function handleDeleteEvaluation() {
    if (confirm('Are you sure you want to delete this evaluation?')) {
      // start from here
      deleteEvaluation(evaluationInfo?.id + '', {
        onSuccess: () => {
          toast.success('Evaluation deleted successfully', {
            duration: 5000,
          });
          window.location.href = '/dashboard/evaluations';
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    }
  }

  return (
    <div className="block pr-24 pb-8 w-11/12">
      <Switch>
        <Route
          path={`${path}/review`}
          render={() => <ReviewEvaluation evaluationId={evaluationId} />}
        />
        <Route
          path={`${path}/approve`}
          render={() => <ApproveEvaluation evaluationId={evaluationId} />}
        />
        <Route
          exact
          path={`${path}/section/:id/add-questions`}
          render={() => (
            <AddEvaluationQuestions
              handleGoBack={() => history.push('/dashboard/evaluations')}
              handleNext={() => {}}
              evaluationId={evaluationId}
            />
          )}
        />

        <Route path={`${path}/section`} render={() => <SectionBasedEvaluation />} />

        <TabNavigation tabs={tabs}>
          <Route
            exact
            path={`${path}/unbeguns`}
            render={() => (
              <div className="pt-8">
                <Unbeguns />
              </div>
            )}
          />{' '}
          {evaluationInfo?.setting_type === IEvaluationSettingType.SECTION_BASED && (
            <Route
              exact
              path={`${path}/sections`}
              render={() => (
                <div className="pt-8">
                  <EvaluationSettingProgress />
                </div>
              )}
            />
          )}
          <Route
            exact
            path={`${path}/performance`}
            render={() => <EvaluationPerformance />}
          />
          <Route
            exact
            path={`${path}/detailedreport`}
            render={() => <EvaluationDetailedReport />}
          />
          <Route
            exact
            path={`${path}/markingreport`}
            render={() => <EvaluationMarkingReport />}
          />
          <Route exact path={`${path}/reviewers`} render={() => <ReviewersList />} />
          <Route exact path={`${path}/approvals`} render={() => <ApprovalsList />} />
          <Route
            exact
            path={`${path}`}
            render={() => (
              <EvaluationContent
                showSetQuestions={false}
                evaluationId={evaluationId}
                actionType="">
                <div className="flex gap-4">
                  <Button
                    disabled={evaluationInfo?.evaluation_status !== 'APPROVED'}
                    isLoading={makeEvaluationPublic.isLoading}
                    onClick={() => publishEvaluation('PUBLIC')}>
                    Publish evaluation
                  </Button>
                </div>
              </EvaluationContent>
            )}
          />
          <Route
            path={`${path}/overview`}
            render={() => (
              <EvaluationContent
                showActions={true}
                showSetQuestions={false}
                evaluationId={evaluationId}
                actionType="">
                {evaluationInfo?.instructor_id === instructorInfo?.user.id && (
                  <div className="flex gap-4">
                    <Button
                      isLoading={updateTimeLoader}
                      styleType="outline"
                      onClick={() => setOpen(true)}>
                      Edit evaluation
                    </Button>
                    <Button
                      color="main"
                      className="bg-red-600"
                      disabled={isLoading}
                      isLoading={isLoading}
                      onClick={handleDeleteEvaluation}>
                      Delete evaluation
                    </Button>
                    <Button
                      disabled={evaluationInfo?.evaluation_status !== 'APPROVED'}
                      onClick={() => publishEvaluation('PUBLIC')}>
                      Publish evaluation
                    </Button>
                  </div>
                )}
              </EvaluationContent>
            )}
          />
          {open && (
            <Permission privilege={Privileges.CAN_MANAGE_EVALUATIONS}>
              <PopupMolecule
                closeOnClickOutSide={false}
                open={open}
                title="Update Evaluation"
                onClose={() => {
                  evaluationInfo && setTimeLimit(evaluationInfo?.time_limit);
                  setOpen(false);
                }}>
                <form className="bg-main w-2/3 px-8 py-6" onSubmit={handleSubmit}>
                  <InputMolecule
                    value={evaluationInfo?.name || ''}
                    placeholder="Evaluation name"
                    name="evaluation_name"
                    handleChange={(e: ValueType) =>
                      setEvaluationName(String(e.value.toString()))
                    }>
                    Evaluation name
                  </InputMolecule>
                  <InputMolecule
                    value={evaluationInfo?.allow_submission_time || ''}
                    placeholder="Allow submission"
                    name="allow_submission_time"
                    type="datetime-local"
                    handleChange={(e: ValueType) =>
                      setAllowSUbmission(String(e.value.toString()))
                    }>
                    Start on
                  </InputMolecule>
                  <InputMolecule
                    value={evaluationInfo?.due_on || ''}
                    placeholder="Evaluation due on"
                    name={'due_on'}
                    type="datetime-local"
                    handleChange={(e: ValueType) => setDueOn(String(e.value.toString()))}>
                    End on
                  </InputMolecule>

                  <InputMolecule
                    value={evaluationInfo?.time_limit || 0}
                    placeholder="time limit"
                    name="time_limit"
                    handleChange={(e: ValueType) =>
                      setTimeLimit(Number(e.value.toString()))
                    }>
                    Time limit
                  </InputMolecule>

                  <RadioMolecule
                    className="pb-4"
                    name="strict"
                    value={evaluationInfo?.strict + ''}
                    options={[
                      { label: 'Yes', value: 'true' },
                      { label: 'No', value: 'false' },
                    ]}
                    handleChange={handleIsStrictChange}>
                    strict
                  </RadioMolecule>

                  <Button type="submit">save</Button>
                </form>
              </PopupMolecule>
            </Permission>
          )}
          <Route
            path={`${path}/submissions`}
            render={() => (
              <div className="pt-8">
                <Submissions />
              </div>
            )}
          />
        </TabNavigation>
      </Switch>
    </div>
  );
}
