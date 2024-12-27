import React from 'react';

import Button from '../Atoms/custom/Button';
import PopupMolecule from './Popup';

type PropsType = {
  onConfirmationClose: () => void;
  onConfirmationSubmit?: () => void;
  showConfirmation: boolean;
  title: string;
  children: React.ReactNode;
  noLabel?: string;
  yesLabel?: string;
};

export default function Confirmation({
  onConfirmationClose,
  onConfirmationSubmit,
  showConfirmation,
  title,
  children,
  noLabel = 'Review',
  yesLabel = 'Submit',
}: PropsType) {
  return (
    <PopupMolecule
      closeOnClickOutSide={false}
      open={showConfirmation}
      title={title}
      onClose={onConfirmationClose}>
      <div>
        <div className="leading-5 pb-6 w-96 text-txt-primary text-sm mt-4">
          <div>{children}</div>
        </div>
        <div className="flex justify-between py-3">
          <Button onClick={onConfirmationClose} styleType="outline">
            {noLabel}
          </Button>
          <Button onClick={onConfirmationSubmit}>{yesLabel}</Button>
        </div>
      </div>
    </PopupMolecule>
  );
}
