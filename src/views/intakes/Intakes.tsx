/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import PopupMolecule from '../../components/Molecules/Popup';
import UpdateIntake from '../../components/Organisms/intake/UpdateIntake';
import IntakePrograms from '../intake-program/IntakePrograms';
import LevelPerformance from '../performance/LevelPerformance';
import IntakeList from './IntakeList';

export default function Intakes() {
  const { path } = useRouteMatch();
  const history = useHistory();

  function handleClose() {
    history.goBack();
  }

  return (
    <Switch>
      <Route
        path={`${path}/programs/:intakeId`}
        render={() => {
          return <IntakePrograms />;
        }}
      />
      <Route
        path={`${path}/peformance/:levelId`}
        render={() => {
          return <LevelPerformance />;
        }}
      />
      <Route
        exact
        path={`${path}/:id/edit/:regid`}
        render={() => {
          return (
            <PopupMolecule
              closeOnClickOutSide={false}
              title="Update intake"
              open
              onClose={handleClose}>
              <UpdateIntake handleSuccess={handleClose} />
            </PopupMolecule>
          );
        }}
      />
      <Route
        path={`${path}`}
        render={() => {
          return <IntakeList />;
        }}
      />
    </Switch>
  );
}
