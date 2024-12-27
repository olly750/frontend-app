import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import PopupMolecule from '../../components/Molecules/Popup';
import { IStudentClass } from '../../types/services/class.types';
import AddSubjectToPeriod from '../subjects/AddSubjectToPeriod';
import SubjectPeriod from '../subjects/SubjectPeriod';
import EditClass from './EditClass';
import NewClass from './NewClass';
import StudentsInClass from './StudentsInClass';

function SingleClass({ classObject }: IStudentClass) {
  const { path } = useRouteMatch();
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <div className="flex flex-col">
      <Switch>
        <Route
          exact
          path={`${path}`}
          render={() => {
            return <StudentsInClass classObject={classObject} />;
          }}
        />
        <Route
          exact
          path={`${path}/:classId/subject`}
          render={() => {
            return <SubjectPeriod />;
          }}
        />
        {/* add subject to period */}
        <Route
          exact
          path={`${path}/:classId/add-subject`}
          render={() => (
            <PopupMolecule
              title={'Add subject to ' + t('Period')}
              closeOnClickOutSide={false}
              open
              onClose={history.goBack}>
              <AddSubjectToPeriod />
            </PopupMolecule>
          )}
        />
        {/* edit classes in intake program level */}
        <Route
          exact
          path={`${path}/:classId/edit-class`}
          render={() => (
            <PopupMolecule
              title={'Edit ' + t('Class')}
              closeOnClickOutSide={false}
              open
              onClose={history.goBack}>
              <EditClass />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}

export default SingleClass;
