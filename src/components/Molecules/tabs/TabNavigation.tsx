import React, { ReactNode } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { colorStyle, fontSizeStyle, fontWeightStyle } from '../../../global/global-vars';
import { Privileges } from '../../../types';
import { IEvaluationQuestionsInfo } from '../../../types/services/evaluation.types';
import Permission from '../../Atoms/auth/Permission';

export interface TabType {
  label: string;
  href: string;
  privilege?: Privileges;
  questions?: IEvaluationQuestionsInfo[];
}

type tabEventTypes = {
  activeTabIndex: number;
  activeTabLabel: string;
};

interface TabsImportantProps {
  onTabChange?: (_event: tabEventTypes) => any;
  tabs: TabType[];
}

interface Iprops extends TabsImportantProps {
  className?: string;
  children: ReactNode;
  headerComponent?: ReactNode;
}

export default function TabNavigation({
  className = '',
  tabs,
  children,
  headerComponent,
  onTabChange,
}: Iprops) {
  return (
    <div className={`tabs ${className}`}>
      <div className="pb-3 flex flex-wrap items-center justify-between">
        <TabHeadings onTabChange={onTabChange} tabs={tabs} />
        {headerComponent && headerComponent}
      </div>
      {children}
    </div>
  );
}

function TabHeadings({ tabs, onTabChange }: TabsImportantProps) {
  const history = useHistory();
  const location = useLocation();

  let activeTabIndex = tabs.findIndex(
    (tab) => tab.href.split('?')[0] === location.pathname.split('?')[0],
  );
  if (activeTabIndex === -1) {
    let competitotors = tabs.filter((tab) => location.pathname.startsWith(tab.href));
    const arrays = competitotors.map((tab) => tab.href.split('/'));

    let maxIndex = 0;

    for (let i = 0; i < arrays.length; i++) {
      if (arrays[i].length) maxIndex = i;
    }

    try {
      activeTabIndex = tabs.findIndex((tab) => tab.href === arrays[maxIndex].join('/'));
    } catch (error) {
      activeTabIndex = 0;
    }
  }

  const slideTo = (index: number, href: string, label: string) => {
    if (onTabChange)
      onTabChange({
        activeTabIndex: index,
        activeTabLabel: label,
      });
    history.push(href);
  };

  return (
    <div className="flex flex-wrap justify-start">
      {tabs.map((tab, i) => {
        return tab.privilege ? (
          <Permission privilege={tab.privilege} key={i}>
            <button
              className={`pr-5 pl-3 py-4 ${
                activeTabIndex === i ? 'border-b-3' : 'border-b-2'
              } m-0 rounded-none
                ${fontSizeStyle['sm']} ${fontWeightStyle['bold']} text-${
                colorStyle[activeTabIndex == i ? 'primary' : 'gray']
              } border-${colorStyle[activeTabIndex == i ? 'primary' : 'lightgray']}`}
              onClick={() => slideTo(i, tab.href, tab.label)}>
              {tab.label}
            </button>
          </Permission>
        ) : (
          <button
            key={i}
            className={`pr-5 pl-3 py-4 ${
              activeTabIndex === i ? 'border-b-3' : 'border-b-2'
            } m-0 rounded-none
              ${fontSizeStyle['sm']} ${fontWeightStyle['bold']} text-${
              colorStyle[activeTabIndex == i ? 'primary' : 'gray']
            } border-${colorStyle[activeTabIndex == i ? 'primary' : 'lightgray']}`}
            onClick={() => slideTo(i, tab.href, tab.label)}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
