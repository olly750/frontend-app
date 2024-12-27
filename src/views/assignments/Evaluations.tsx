import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import { usePrivilege } from '../../hooks/usePrivilege';
import { CommonCardDataType, Privileges } from '../../types';
import {
  IEvaluationInfo,
  IEvaluationInfoSingleEvaluation,
} from '../../types/services/evaluation.types';
import { setLocalStorageData } from '../../utils/getLocalStorageItem';
import { advancedTypeChecker } from '../../utils/getOption';
import EvaluationDetails from '../evaluation/EvaluationDetails';

interface StudentEvaluations extends CommonCardDataType {
  studentEvaluationId?: string;
}

interface IEvaluationProps {
  subjecEvaluations: IEvaluationInfoSingleEvaluation[] | IEvaluationInfo[];
  isCompleted?: boolean;
  isOngoing?: boolean;
  isUndone?: boolean;
  linkTo?: string;
}

export default function Evaluations({
  subjecEvaluations = [],
  isCompleted = false,
  isOngoing = false,
  isUndone = false,
}: IEvaluationProps) {
  const [evaluations, setEvaluations] = useState<StudentEvaluations[]>([]);
  const history = useHistory();
  const { path, url } = useRouteMatch();
  const { t } = useTranslation();

  const isAllowedToAnswer = usePrivilege(Privileges.CAN_ANSWER_EVALUATION);

  useEffect(() => {
    function isSubjectEvaludations(
      ev: IEvaluationInfo[] | IEvaluationInfoSingleEvaluation[],
    ) {
      return typeof (ev[0] as IEvaluationInfoSingleEvaluation).evaluation === 'undefined';
    }

    if (subjecEvaluations.length > 0) {
      if (!isSubjectEvaludations(subjecEvaluations)) {
        if (subjecEvaluations.length > 0 && !isUndone) {
          let formattedEvals: StudentEvaluations[] = [];

          (subjecEvaluations as IEvaluationInfoSingleEvaluation[]).forEach(
            (singleEvaluation) => {
              let formattedEvaluations: StudentEvaluations = {
                studentEvaluationId: singleEvaluation.id,
                id: singleEvaluation.evaluation.id,
                title: singleEvaluation.evaluation.name,
                code: singleEvaluation.code,
                description: `${singleEvaluation.evaluation.total_mark} marks`,
                status: {
                  type: advancedTypeChecker(
                    singleEvaluation.evaluation.evaluation_status,
                  ),
                  text: singleEvaluation.evaluation.evaluation_status,
                },
                subTitle: `Due on:   ${singleEvaluation.evaluation.due_on}`,
              };
              formattedEvals.push(formattedEvaluations);
            },
          );
          setEvaluations(formattedEvals);
        }
      } else {
        if (isUndone || subjecEvaluations.length === 0) {
          let formattedEvals: StudentEvaluations[] = [];

          if (isSubjectEvaludations(subjecEvaluations)) {
            (subjecEvaluations as IEvaluationInfo[]).forEach((evaluation) => {
              let formattedEvaluations: StudentEvaluations = {
                id: evaluation.id,
                title: evaluation.name,
                code: evaluation.evaluation_type,
                description: `${evaluation.total_mark} marks`,
                status: {
                  type: advancedTypeChecker(evaluation.evaluation_status),
                  text: evaluation.evaluation_status,
                },
                subTitle: `Due on:   ${evaluation.due_on}`,
              };
              formattedEvals.push(formattedEvaluations);
            });
          }
          setEvaluations(formattedEvals);
        }
      }
    }
  }, [isUndone, subjecEvaluations]);

  function handleClick(id = '', studEvaluation = '') {
    if (isCompleted) {
      history.push(
        `/dashboard/evaluations/completed/student-evaluation/${studEvaluation}/review`,
      );
    } else if (isOngoing) {
      //store the url to go to after evaluation is completed
      setLocalStorageData('returnUrl', url);

      history.push({
        pathname: `/dashboard/evaluations/attempt/${id}`,
        search: `?studentEval=${studEvaluation}?evaluation=${id}`,
      });
    } else {
      if (isAllowedToAnswer) {
        //store the url to go to after evaluation is completed
        setLocalStorageData('returnUrl', url);
        history.push(`/dashboard/evaluations/attempt/${id}`);
      } else {
        toast.error("You don't have rights to answer evaluation");
      }
    }
  }
  return (
    <div>
      <Switch>
        <Route path={`${path}/details/:id`} component={EvaluationDetails} />
        <Route
          path={path}
          render={() => (
            <>
              <section className="flex flex-wrap mt-2 gap-4 w-full">
                {evaluations.length > 0 ? (
                  evaluations?.map((info) => (
                    <CommonCardMolecule
                      key={info.id}
                      handleClick={() =>
                        handleClick(info.id + '', info.studentEvaluationId)
                      }
                      data={info}
                    />
                  ))
                ) : (
                  <NoDataAvailable
                    icon="evaluation"
                    showButton={false}
                    title={'No evaluations available'}
                    description={
                      'There seems to be no evaluations added to this module yet. Please wait for' +
                      t('Instructor') +
                      " to add them or contact the administrators if you think there's a mistake!"
                    }
                  />
                )}
              </section>
            </>
          )}
        />
      </Switch>
    </div>
  );
}
