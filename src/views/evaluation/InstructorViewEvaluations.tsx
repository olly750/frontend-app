import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import moment from 'moment';
import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import ConfirmationOrganism from '../../components/Organisms/ConfirmationOrganism';
import EvaluationInfoComponent from '../../components/Organisms/forms/evaluation/EvaluationInfoComponent';
import EvaluationSettings from '../../components/Organisms/forms/evaluation/EvaluationSettings';
import useAuthenticator from '../../hooks/useAuthenticator';
import { subjectService } from '../../services/administration/subject.service';
import * as evaluationService from '../../services/evaluation/evaluation.service';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { CommonCardDataType, Link as LinkList, Privileges } from '../../types';
import {
  IEvaluationOwnership,
  IEvaluationSectionBased,
  IEvaluationSettingType,
  IEvaluationStatus,
  IQuestionaireTypeEnum,
  ISubjects,
} from '../../types/services/evaluation.types';
import cookie from '../../utils/cookie';
import { getDropDownStatusOptions } from '../../utils/getOption';
import EvaluationDetails from './EvaluationDetails';
import EvaluationNames from './EvaluationNames';
import EvaluationNotiView from './EvaluationNotiView';
import EvaluationTest from './EvaluationTest';
import StudentReview from './StudentReview';

interface CardEvaluaitonInfoType extends CommonCardDataType {
  settingType: IEvaluationSettingType;
  questionaireType: IQuestionaireTypeEnum;
  created_on: string;
  evaluation_module_subjects: IEvaluationSectionBased[];
}

export default function InstructorViewEvaluations() {
  const [evaluations, setEvaluations] = useState<CardEvaluaitonInfoType[]>([]); 
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [ownerShipType, setownerShipType] = useState(IEvaluationOwnership.CREATED_BY_ME);

  const history = useHistory();
  const { path } = useRouteMatch();
  const { user } = useAuthenticator();

  const user_role_cookie = cookie.getCookie('user_role') || '';
  const user_role = user?.user_roles?.find((role) => role.id + '' === user_role_cookie);
  const user_privileges = user_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  const {
    data: allEvaluations,
    isSuccess,
    isLoading,
    isError,
    refetch,
  } = evaluationStore.getEvaluationsByCategory(ownerShipType, user?.id.toString() || '');

  const list: LinkList[] = [
    { to: '/', title: 'home' },
    { to: 'evaluations', title: 'evaluations' },
  ];

  useEffect(() => {
    let formattedEvals: CardEvaluaitonInfoType[] = [];

    function getTypeColor(color: IEvaluationStatus) {
      switch (color) {
        case IEvaluationStatus.APPROVED:
          return 'success';
        case IEvaluationStatus.PUBLISHED:
          return 'success';
        case IEvaluationStatus.REJECTED || IEvaluationStatus.REVIEW_REJECTED:
          return 'reject';
        case IEvaluationStatus.MARKED:
          return 'marked';
        case IEvaluationStatus.REVIEWED:
          return 'reviewed';
        default:
          return 'warning';
      }
    }

    allEvaluations?.data.data.forEach((evaluation) => {
      let formattedEvaluations: CardEvaluaitonInfoType = {
        created_on: evaluation.created_on,
        questionaireType: evaluation.questionaire_type,
        settingType: evaluation.setting_type,
        id: evaluation.id,
        title: evaluation.name,
        code: '',
        description: `${evaluation.total_mark} marks`,
        status: {
          type: getTypeColor(evaluation.evaluation_status),
          text: evaluation.evaluation_status.replaceAll('_', ' '),
        },
        evaluation_module_subjects: evaluation.evaluation_module_subjects,
      };
      formattedEvals.push(formattedEvaluations);
    });
    formattedEvals.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());
    setEvaluations(formattedEvals);
  }, [allEvaluations?.data.data]);

  useEffect(() => {
    refetch();
  }, [ownerShipType, refetch]);

  function findEvaluationById(evaluationId: string) {
    return evaluations.find((evaluation) => evaluation.id === evaluationId);
  }

 
  const handleClick = async (id: string) => {
    const evaluationInfo = findEvaluationById(id);
    console.log(evaluationInfo);
    // let subjects: ISubjects[] = [];

    if (evaluationInfo?.id === id) {
      switch (ownerShipType) {
        case IEvaluationOwnership.FOR_APPROVING:
          if (
            evaluationInfo.questionaireType === IQuestionaireTypeEnum.MANUAL ||
            evaluationInfo.questionaireType === IQuestionaireTypeEnum.HYBRID ||
            evaluationInfo.questionaireType === IQuestionaireTypeEnum.FIELD ||
            evaluationInfo.settingType === IEvaluationSettingType.SUBJECT_BASED
          ) {
            history.push(`${path}/details/${id}/approve`);

            return;
          }

          // subjects = (await getSubjects(id)) || [];

          // history.push(
          //   `${path}/details/${id}/approve/${evaluationInfo?.evaluation_module_subjects[0].intake_program_level_module}/${subjects?.[0].id}`,
          // );
          history.push(`${path}/details/${id}/approve`);

          break;

        case IEvaluationOwnership.FOR_REVIEWING:
          if (
            evaluationInfo.questionaireType === IQuestionaireTypeEnum.MANUAL ||
            evaluationInfo.questionaireType === IQuestionaireTypeEnum.HYBRID ||
            evaluationInfo.questionaireType === IQuestionaireTypeEnum.FIELD ||
            evaluationInfo.settingType === IEvaluationSettingType.SUBJECT_BASED
          ) {
            history.push(`${path}/details/${id}/review`);
            return;
          }

          history.push(`${path}/details/${id}/review`);
          break;

        case IEvaluationOwnership.FOR_MARKING:
          history.push(`${path}/details/${id}/submissions`);
          break;

        case IEvaluationOwnership.FOR_SETTING:
          history.push(`${path}/details/${id}/section`);
          break;

        default:
          if (evaluationInfo.settingType === IEvaluationSettingType.SUBJECT_BASED) {
            history.push(`${path}/details/${id}/overview`);
            return;
          }

          history.push(`${path}/details/${id}/overview`);
          break;
      }
    }
  };

  return (
    <div>
      <Switch>
        <Route
          exact
          path={path}
          render={() => (
            <>
              {path === '/dashboard/evaluations' ? (
                <>
                  <section>
                    <BreadCrumb list={list}></BreadCrumb>
                  </section>
                </>
              ) : null}
              <div className="flex flex-col gap-12">
                <Heading fontWeight="semibold" className="pt-7">
                  Evaluations
                </Heading>

                <div className="flex justify-between  w-full">
                  <SelectMolecule
                    width="80"
                    className=""
                    value={ownerShipType}
                    handleChange={(e) =>
                      setownerShipType(e.value as IEvaluationOwnership)
                    }
                    name={'type'}
                    placeholder="Evaluation type"
                    options={getDropDownStatusOptions(IEvaluationOwnership)}
                  />

                  <div className="flex gap-4">
                    <Permission privilege={Privileges.CAN_MANAGE_EVALUATIONS}>
                      <Button
                        className="self-start"
                        styleType="outline"
                        onClick={() => {
                          history.push(`${path}/templates`);
                        }}>
                        New evaluation name
                      </Button>
                    </Permission>

                    <Permission privilege={Privileges.CAN_CREATE_EVALUATIONS}>
                      <Button
                        className="self-start"
                        onClick={() => {
                          history.push(`${path}/create`);
                        }}>
                        New evaluation
                      </Button>
                    </Permission>
                  </div>
                </div>
              </div>

              <section className="flex flex-wrap justify-start gap-4 mt-2">
                {isLoading && evaluations.length === 0 && <Loader />}
                {isSuccess && evaluations.length === 0 ? (
                  <NoDataAvailable
                    icon="evaluation"
                    showButton={false}
                    title={'No evaluations available'}
                    description="Consider adding some evaluation to see them here!"
                  />
                ) : isSuccess && evaluations.length > 0 ? (
                  evaluations?.map((info) => (
                    <div key={info.id}>
                      <CommonCardMolecule
                        className={
                          loadingSubjects ? 'cursor-wait opacity-50' : 'cursor-pointer'
                        }
                        data={info}
                        handleClick={() => handleClick(info.id + '')}>
                        <div>
                          <div className="flex gap-4 pt-4">
                            <Heading fontSize="sm" fontWeight="semibold">
                              Type:{' '}
                            </Heading>

                            <Heading fontSize="sm" color="primary">
                              {info.questionaireType}
                            </Heading>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <Heading fontSize="sm" fontWeight="semibold">
                              Setting type:{' '}
                            </Heading>

                            <Heading fontSize="sm" color="primary">
                              {(info.settingType || '').replaceAll('_', ' ')}
                            </Heading>
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Heading fontSize="sm" fontWeight="semibold">
                              Created on:{' '}
                            </Heading>

                            <Heading fontSize="sm" color="primary">
                            {moment(info.created_on).format('ddd, YYYY-MM-DD')}
                            </Heading>
                          </div>
                        </div>
                      </CommonCardMolecule>
                    </div>
                  ))
                ) : isError ? (
                  <NoDataAvailable
                    icon="evaluation"
                    showButton={false}
                    title={'No evaluations available'}
                    description="Consider adding some evaluation to see them here!"
                  />
                ) : null}
              </section>
            </>
          )}
        />

        <Route exact path={`${path}/view/:id`} component={EvaluationNotiView} />
        {hasPrivilege(Privileges.CAN_ANSWER_EVALUATION) && (
          <Route
            exact
            path={`${path}/student-evaluation/:id/:evaluationId`}
            component={EvaluationTest}
          />
        )}
        {hasPrivilege(Privileges.CAN_ANSWER_EVALUATION) && (
          <Route
            exact
            path={`${path}/completed/student-evaluation/:id/review`}
            component={StudentReview}
          />
        )}

        {hasPrivilege(Privileges.CAN_CREATE_EVALUATION_TEMPLATE) && (
          <Route path={`${path}/templates`} component={EvaluationNames} />
        )}

        {hasPrivilege(Privileges.CAN_CREATE_EVALUATIONS) && (
          <Route path={`${path}/create`} component={EvaluationInfoComponent} />
        )}

        {hasPrivilege(Privileges.CAN_CREATE_EVALUATIONS) && (
          <Route path={`${path}/:evaluationId/settings`} component={EvaluationSettings} />
        )}

        {hasPrivilege(Privileges.CAN_ANSWER_EVALUATION) && (
          <Route
            exact
            path={`${path}/attempt/:id`}
            render={() => (
              <ConfirmationOrganism onConfirmationClose={() => history.goBack()} />
            )}
          />
        )}
        <Route path={`${path}/details/:id`} component={EvaluationDetails} />
      </Switch>
    </div>
  );
}
