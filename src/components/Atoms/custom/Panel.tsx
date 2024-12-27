/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ReactNode } from 'react';

import { Color, GenericStatus } from '../../../types';
import { IEvaluationStatus } from '../../../types/services/evaluation.types';
import { IntakeStatus } from '../../../types/services/intake.types';
import { IntakeModuleStatus } from '../../../types/services/intake-program.types';
import { MaterialType } from '../../../types/services/module-material.types';
import { advancedTypeChecker } from '../../../utils/getOption';
import Badge from './Badge';
import Icon from './Icon';

export type PanelProps = {
  show?: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  active?: boolean;
  index?: number;
  className?: string;
  bgColor?: Color;
  badge?: {
    type:
      | GenericStatus
      | IntakeStatus
      | IEvaluationStatus
      | IntakeModuleStatus
      | MaterialType;
    text: string;
  };
  width?: string;
  handleOpen?: (_index: number) => void;
};

function Panel({
  index,
  title,
  subtitle,
  children,
  active = false,
  className,
  bgColor = 'tertiary',
  badge,
  width = 'w-80',
  handleOpen,
  show = true,
}: PanelProps) {
  function toggleAccordion() {
    if (handleOpen) handleOpen(index || 0);
  }

  return show ? (
    <div
      className={`bg-${bgColor} text-sm py-2 ${width} rounded-lg mb-4 px-4 ${className}`}>
      <div className="w-full mb-2" role="button" onClick={toggleAccordion}>
        <div className={`flex font-semibold justify-between items-center cursor-pointer`}>
          <div className="flex-col">
            <p className="text-primary-500 ">{title}</p>
            {subtitle && (
              <p className="py-2 font-semibold text-txt-primary">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center h-full">
            {badge ? (
              <Badge className="h-4/5" badgecolor={advancedTypeChecker(badge.type)}>
                {badge.text}
              </Badge>
            ) : null}
            <Icon
              name="chevron-right"
              fill="txt-secondary"
              transform={active ? 'rotate(90deg)' : ''}
            />
          </div>
        </div>
      </div>
      <div
        className={`${
          active ? 'h-auto' : 'h-0 overflow-hidden'
        } font-medium transition-all `}>
        {children}
      </div>
    </div>
  ) : null;
}

export default Panel;
