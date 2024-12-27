import '../../styles/components/Molecules/tooltip.scss';

import React, { ReactNode } from 'react';
import { Popup } from 'reactjs-popup';
import { EventType } from 'reactjs-popup/dist/types';

interface PropType {
  children: ReactNode;
  open: boolean;
  position?: 'right center' | 'left center' | 'bottom center';
  on?: EventType;
  // eslint-disable-next-line no-undef
  trigger: JSX.Element;
}

export default function Tooltip({
  children,
  on = 'hover',
  trigger,
  position = 'right center',
}: PropType) {
  return (
    <div id="tooltip-card" className="tooltip-card relative">
      <Popup
        on={on}
        className="tooltip-card"
        trigger={<div className="trigger-holder">{trigger}</div>}
        position={position}
        closeOnDocumentClick>
        {children}
      </Popup>
    </div>
  );
}
