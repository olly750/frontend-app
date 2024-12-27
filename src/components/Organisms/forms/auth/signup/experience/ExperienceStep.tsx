import React from 'react';

import { CommonFormProps, CommonStepProps } from '../../../../../../types';
import { ExperienceType } from '../../../../../../types/services/experience.types';
import ExperienceForm from './ExperienceForm';

interface IExperienceStep<E> extends CommonStepProps, CommonFormProps<E> {
  type: ExperienceType;
  skip?: () => void;
}

function ExperienceStep<E>({
  isVertical,
  nextStep,
  prevStep,
  display_label,
  type,
  skip,
}: IExperienceStep<E>) {
  return (
    <ExperienceForm
      type={type}
      isVertical={isVertical}
      display_label={display_label}
      nextStep={nextStep}
      prevStep={prevStep}
      skip={skip}
      fetched_id={''}
    />
  );
}

export default ExperienceStep;
