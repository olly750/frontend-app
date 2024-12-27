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
import { advancedTypeChecker } from '../../utils/getOption';


interface IEvaluationProps {
  evaluationDetails: IEvaluationInfoSingleEvaluation[] | IEvaluationInfo[];
}

export default function StudentViewAssignments({
  evaluationDetails = [], }: IEvaluationProps) {

  const [evaluationsData, setEvaluations] = useState<any[]>([]);
  const history = useHistory();
  const { path } = useRouteMatch();
  const { t } = useTranslation();


  useEffect(() => {
    function isSubjectEvaludations(
      ev: IEvaluationInfo[] | IEvaluationInfoSingleEvaluation[],
    ) {
      return typeof (ev[0] as IEvaluationInfoSingleEvaluation);
    }

    if (evaluationDetails.length > 0) {
      if (!isSubjectEvaludations(evaluationDetails)) {
        console.log("data", evaluationDetails)
        if (evaluationDetails.length > 0) {
          let formattedEvals: CommonCardDataType[] = [];

          (evaluationDetails as IEvaluationInfoSingleEvaluation[]).forEach(
            (singleEvaluation) => {
              let formattedEvaluations = {
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
              };
              formattedEvals.push(formattedEvaluations);
            },
          );
          setEvaluations(formattedEvals);
        }
      }
    }
  }, [evaluationDetails]);

  return (
    <div>
      {/* {evaluationDetails && evaluationDetails.length > 0 ?
        evaluationDetails.map((data, i) => {
          // console.log("data",data) 
          return (<h1 style={{color:"blue"}} key={i}>
          {i} {data.name}
          </h1>)
        }) : null} */}


      {/* <Switch>
        <Route
          path={path}
          render={() => (
            <>
              <section className="flex flex-wrap mt-2 gap-4 w-full">
                {evaluationsData.length > 0 ? (
                  evaluationsData?.map((info: CommonCardDataType) => (
                    <CommonCardMolecule
                      key={info.id}
                      //   handleClick={() =>
                      //     handleClick(
                      //       info.id + '',
                      //       //@ts-ignore
                      //       info.studentEvaluationId,
                      //     )
                      //   }
                      data={info}
                    />
                  ))
                ) : (
                  <NoDataAvailable
                    icon="evaluation"
                    showButton={false}
                    title={'No assignment available'}
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
      </Switch> */}
    </div>
  );
}
