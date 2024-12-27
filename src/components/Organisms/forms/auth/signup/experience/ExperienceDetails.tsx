import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../../../plugins/react-query';
import { ParamType } from '../../../../../../types';
import { ExperienceType } from '../../../../../../types/services/experience.types';
import CompleteProfileHeader from '../../../../../Molecules/CompleteProfileHeader';
import Stepper from '../../../../../Molecules/Stepper/Stepper';
import ExperienceStep from './ExperienceStep';

function ExperienceDetails({ showHeader = true }: { showHeader?: boolean }) {
  const { id } = useParams<ParamType>();
  const [currentStep, setCurrentStep] = useState(0);
  const [completeStep, setCompleteStep] = useState(0);
  const history = useHistory();

  const nextStep = (isComplete: boolean) => {
    setCurrentStep((currentStep) => currentStep + 1);
    if (isComplete) setCompleteStep((completeStep) => completeStep + 1);
  };

  const skip = () => {
    setCurrentStep((currentStep) => currentStep + 1);
  };

  const back = () => {
    setCurrentStep((currentStep) => currentStep - 1);
  };

  const navigateToStepHandler = (index: number) => {
    if (index !== currentStep) {
      setCurrentStep(index);
    }
  };

  async function finishSteps(isComplete: boolean) {
    if (isComplete) setCompleteStep((completeStep) => completeStep + 1);
    if (showHeader) {
      history.goBack();
    } else {
      queryClient.invalidateQueries(['user/id', id]);
      history.push(`/dashboard/user/${id}/profile?me=true`);
    }
  }
  return (
    <div className="bg-main">
      {showHeader && (
        <CompleteProfileHeader
          title={'Add your experiences'}
          details={'Fill in the form with all your experiences'}
        />
      )}
      <div className={`p-10 md:px-24 md:py-3 ${!showHeader ? 'md:pt-12' : ''}`}>
        <Stepper
          isVertical={false}
          currentStep={currentStep}
          width="w-44"
          completeStep={completeStep}
          navigateToStepHandler={navigateToStepHandler}>
          <ExperienceStep
            type={ExperienceType.GENERAL_EDUCATION}
            display_label={'Formal Education (School and Certificate)'}
            nextStep={nextStep}
            // skip={skip}
            fetched_id={''}
          />
          <ExperienceStep
            type={ExperienceType.CURRIER_COURSE_EDUCATION}
            display_label={'Carrier Course Attended'}
            skip={skip}
            nextStep={finishSteps}
            prevStep={back} 
            fetched_id={''}
          />
          
          {/* <ExperienceStep
            type={ExperienceType.INTERNATIONAL_CERTIFICATION}
            display_label={'Appointments Held (achievements)'}
            nextStep={nextStep}
            prevStep={back}
            skip={skip}
            fetched_id={''}
          /> */}
          {/* <ExperienceStep
            type={ExperienceType.INTERNATIONAL_MISSION}
            display_label={'International Missions'}
            nextStep={nextStep}
            prevStep={back}
            skip={skip}
            fetched_id={''}
          /> */}
          {/* <ExperienceStep
            type={ExperienceType.TRAINING}
            display_label={'Decorations'}
            nextStep={finishSteps}
            prevStep={back}
            skip={skip}
            fetched_id={''}
          /> */}
        </Stepper>
      </div>
    </div>
  );
}

export default ExperienceDetails;
