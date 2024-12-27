import '../../styles/components/Molecules/popup.scss';

import React, { ReactNode, useContext } from 'react';
import Popup from 'reactjs-popup';

import UserContext from '../../context/UserContext';
import { themeConfig } from '../../types/services/institution.types';
import Icon from '../Atoms/custom/Icon';
import Heading from '../Atoms/Text/Heading';

type PropType = {
  closeOnClickOutSide?: boolean;
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose?: () => void;
};

export default function PopupMolecule({
  closeOnClickOutSide = true,
  open,
  title,
  onClose,
  children,
}: PropType) {
  const { theme } = useContext(UserContext);

  return (
    <Popup open={open} closeOnDocumentClick={closeOnClickOutSide} onClose={onClose} modal>
      <div className={`modal block p-8 ${themeConfig[theme]}`}>
        {/* close button  */}
        <div className={`flex pb-2 ${title ? 'justify-between' : 'justify-end'}`}>
          {title && (
            <Heading fontWeight="semibold" color="primary">
              {title}
            </Heading>
          )}

          <button className="close outline-none" onClick={onClose}>
            <Icon size={12} bgColor="tertiary" name="close" />
          </button>
        </div>
        {/* content to be renderd in the popup */}
        {children}
      </div>
    </Popup>
  );
}
