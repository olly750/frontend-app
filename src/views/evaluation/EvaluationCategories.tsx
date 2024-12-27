import React from 'react';

import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import { IEvaluationInfoCollected } from '../../types/services/evaluation.types';
import StudentViewEvaluations from './StudentViewEvaluations';

interface IEvaluationCategoriesProps {
  subjecEvaluations: IEvaluationInfoCollected | undefined;
  loading: boolean;
}


export default function EvaluationCategories({
  subjecEvaluations,
  loading = false,
}: IEvaluationCategoriesProps) { 
  return (
    <div>
      {loading && <Loader />}
      {subjecEvaluations?.undone_evaluations &&
      subjecEvaluations?.undone_evaluations.length > 0 && (
        <div className="flex flex-col gap-4 mt-8">
          <Heading fontSize="base" fontWeight="bold">
            Undone evaluations
          </Heading>

          <StudentViewEvaluations
            isUndone
            subjecEvaluations={subjecEvaluations?.undone_evaluations || []}
          />
        </div>
      ) }

      {subjecEvaluations?.ongoing_evaluations &&
      subjecEvaluations?.ongoing_evaluations.length > 0 ? (
        <div className="flex flex-col gap-4 mt-8">
          <Heading fontSize="base" fontWeight="bold">
            Ongoing evaluations
          </Heading>
          <StudentViewEvaluations
            isOngoing
            subjecEvaluations={subjecEvaluations?.ongoing_evaluations || []}
          />
        </div>
      ) : null}

      {subjecEvaluations?.finished_evaluations &&
      subjecEvaluations?.finished_evaluations.length > 0 ? (
        <div className="flex flex-col gap-4 mt-8">
          <Heading fontSize="base" fontWeight="bold">
            Completed evaluations
          </Heading>
          <StudentViewEvaluations
            isCompleted
            subjecEvaluations={subjecEvaluations?.finished_evaluations || []}
          />
        </div>
      ) : null}

      {!loading &&
      subjecEvaluations?.finished_evaluations.length == 0 &&
      subjecEvaluations?.ongoing_evaluations.length == 0 &&
      subjecEvaluations?.undone_evaluations.length === 0 ? (
        <NoDataAvailable
          icon="evaluation"
          showButton={false}
          title={'No evaluations available'}
          description="Oops! It looks like you have no available evaluations!"
        />
      ) : null}
    </div>
  );
}
