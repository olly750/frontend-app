import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ParamType } from '../../types';
import EvaluationCategories from './EvaluationCategories';

export default function ModuleEvaluationAttempt() {
  // const history = useHistory();
  const { id } = useParams<ParamType>();

  const {
    data: subjectEvaluations,
    isLoading,
    isSuccess,
  } = evaluationStore.getEvaluationsCollectionBySubject(id);

  return (
    <div>
      <section className="flex flex-wrap justify-start gap-4 mt-2">
        {isLoading && <Loader />}

        {isSuccess ? (
          <EvaluationCategories
            loading={isLoading}
            subjecEvaluations={subjectEvaluations?.data.data}
          />
        ) : (
          <NoDataAvailable
            icon="evaluation"
            showButton={false}
            title={'No evaluations available in this module'}
            description="There seems to be no evaluations added to this module yet."
          />
        )}
      </section>
    </div>
  );
}
