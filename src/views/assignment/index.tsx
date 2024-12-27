import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import TabNavigation from '../../components/Molecules/tabs/TabNavigation';
import Submitted from './Submitted';

export default function Assignment() {
  const { url, path } = useRouteMatch();

  const tabs = [
    {
      label: 'Pending assignments',
      href: `${url}/studentAssignments`,
    },
    {
      label: 'Unmarked assignments',
      href: `${url}/published`,
    },
    {
      label: 'submitted Assignments',
      href: `${url}/submitted`,
    },
  ];

  return (
    <div className="block pr-24 pb-8 w-11/12">
      <Switch>
        <Route
          path={`${path}/studentAssignments`}
          // render={() => <ReviewEvaluation evaluationId={id} />}
        />
        <Route
          path={`${path}/published`}
          // render={() => <SectionBasedEvaluation />}
        />{' '}
        <TabNavigation tabs={tabs}>
          <div className="pt-8">
            <Route path={`${path}/submitted`} render={() => <Submitted />} />
          </div>{' '}
        </TabNavigation>
      </Switch>
    </div>
  );
}
