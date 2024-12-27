import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../../../plugins/react-query';
import usernextkinStore from '../../../../../../store/administration/usernextkin.store';
import { ParamType } from '../../../../../../types';
import NextOfKinDetails from './NextOfKinDetails';

interface KinParam extends ParamType {
  userId: string;
}

export default function UpdateNextKin({ location }: { location?: any }) {
  const { userId } = useParams<KinParam>();
  const { mutate } = usernextkinStore.removeUserNextKin();
  const [, setCompleteStep] = useState(0);
  const history = useHistory();

  async function finishSteps(isComplete: boolean) {
    if (isComplete) setCompleteStep((completeStep) => completeStep + 1);
    queryClient.invalidateQueries(['user/id', userId]);
    history.push(`/dashboard/user/${userId}/profile`);
  }

  return (
    <div className="bg-main p-8 md:px-12 md:w-2/3 md:py-16 ">
      <NextOfKinDetails
        fetched_id={location?.state ? location.state.detail.person_id : ''}
        display_label="Next of kin details"
        isVertical
        nextStep={finishSteps}
        mutate={mutate}
        userId={userId}
      />
    </div>
  );
}
