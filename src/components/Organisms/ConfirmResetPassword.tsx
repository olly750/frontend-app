import React from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../Atoms/custom/Button';
import Heading from '../Atoms/Text/Heading';
import PopupMolecule from '../Molecules/Popup';

export default function ConfirmResetPassword() {
  const history = useHistory();
  return (
    <PopupMolecule
      closeOnClickOutSide={false}
      open
      title="Forgot Password"
      onClose={() => history.goBack()}>
      <div>
        <Heading fontWeight="semibold">You forgot your password</Heading>
        <p className="course-card-description leading-5 pb-4 w-96 h-16 text-txt-primary text-md mt-4">
          In case you forgot your account password.<br></br>
          <b className="mb-2">Contact the system Administrator to reset your password</b>
        </p>

        <div className="flex justify-starg pt-6">
          <Button onClick={() => history.goBack()}>
            <span className="font-semibold">Okay</span>
          </Button>
        </div>
      </div>
    </PopupMolecule>
  );
}
