import React from 'react';

import SignInWithRegControl from '../../components/Organisms/forms/auth/signin/SignInWithRegControl';
import registrationControlStore from '../../store/administration/registrationControl.store';

export default function OpenRegistrations() {
  const { data, isLoading, isSuccess } = registrationControlStore.fetchRegControl();

  return (
    <div>
      {isLoading && 'Loading data'}
      {isSuccess && data ? (
        <SignInWithRegControl data={data?.data.data} handleClick={() => {}} />
      ) : (
        ''
      )}
    </div>
  );
}
