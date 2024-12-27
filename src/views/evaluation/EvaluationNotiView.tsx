import React from 'react';
import { useParams } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ParamType } from '../../types';
import { IEvaluationInfo } from '../../types/services/evaluation.types';
import StudentViewEvaluations from './StudentViewEvaluations';

export default function EvaluationNotiView() {
  const { id } = useParams<ParamType>();

  const evaluationInfo = evaluationStore.getEvaluationById(id);

  return evaluationInfo.data?.data.data ? (
    <StudentViewEvaluations
      isUndone
      subjecEvaluations={[evaluationInfo.data.data.data as IEvaluationInfo] || []}
    />
  ) : evaluationInfo.isLoading ? (
    <Loader />
  ) : (
    <Heading>No evaluation details</Heading>
  );
}
