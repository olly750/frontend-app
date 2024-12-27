import { AxiosResponse } from 'axios';
import React from 'react';
import { UseMutateFunction } from 'react-query';

import { CommonFormProps, CommonStepProps, Response } from '../../../../../../types';
import {
  CreateNextOfKin,
  NextKinInfo,
} from '../../../../../../types/services/usernextkin.types';
import NextOfKinDetails from './NextOfKinDetails';

interface INextOfKinStep<E> extends CommonStepProps, CommonFormProps<E> {
  skip?: () => void;
  mutate: UseMutateFunction<
    AxiosResponse<Response<NextKinInfo>, any>,
    unknown,
    CreateNextOfKin,
    unknown
  >;
  userId: string;
  userType: string;
}

function NextOfKinStep<E>({
  isVertical,
  nextStep,
  prevStep,
  display_label,
  type,
  mutate,
  userId,
}: INextOfKinStep<E>) {
  return (
    <NextOfKinDetails
      type={type}
      isVertical={isVertical}
      display_label={display_label}
      nextStep={nextStep}
      prevStep={prevStep}
      fetched_id={''}
      mutate={mutate}
      userId={userId}
    />
  );
}

export default NextOfKinStep;
