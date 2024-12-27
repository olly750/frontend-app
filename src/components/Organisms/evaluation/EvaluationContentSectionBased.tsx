import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import { moduleService } from '../../../services/administration/modules.service';
import * as evaluationService from '../../../services/evaluation/evaluation.service';
import { IEvaluationInfo, IModules } from '../../../types/services/evaluation.types';
import Button from '../../Atoms/custom/Button';
import Icon from '../../Atoms/custom/Icon';
import Loader from '../../Atoms/custom/Loader';
import PopupMolecule from '../../Molecules/Popup';
import TabNavigation, { TabType } from '../../Molecules/tabs/TabNavigation';
import ModuleSubjectQuestion from './ModuleSubjectQuestion';

interface IProps {
  evaluation: IEvaluationInfo;
  showSetQuestions: boolean;
  showActions?: boolean;
}

export default function EvaluationContentSectionBased({
  evaluation,
  showSetQuestions,
  showActions,
}: IProps) {
  const { path, url } = useRouteMatch();
  const router = useHistory();
  const [showPopup, setShowPopup] = useState(false);
  const [modules, setModules] = useState<IModules[]>([]);
  const [tabs, setTabs] = useState<TabType[]>([]);

  const [isLoadingModule, setIsLoadingModules] = useState(true);

  useEffect(() => {
    async function createTabs() {
      setIsLoadingModules(true);
      if (modules.length < 1) {
        setIsLoadingModules(false);
        return;
      }

      let allTabs: TabType[] = [];

      try {
        for (const mod of modules) {
          const subjects = await evaluationService.getEvaluationModuleSubjectsByModule(
            evaluation.id,
            mod.id,
          );

          allTabs.push({
            label: `${mod.module}`,
            href: `${url}/${mod.id}/${subjects.data.data[0].subject_academic_year_period}`,
          });
        }
      } catch (error) {
        return;
      }

      if (allTabs[0]) {
        router.replace(allTabs[0].href);
      }

      // remove duplicated from tabs base on tab.label
      allTabs = allTabs.filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.label === value.label && t.href === value.href),
      );

      setTabs(allTabs);
      setIsLoadingModules(false);
    }
    createTabs();
  }, [evaluation.id, modules, url, router]);

  useEffect(() => {
    let filteredModules: IModules[] = [];

    async function getModules() {
      if (
        evaluation?.evaluation_module_subjects &&
        evaluation.evaluation_module_subjects.length > 0
      ) {
        for (const subj of evaluation.evaluation_module_subjects) {
          const moduleData = await moduleService.getModuleById(
            subj.intake_program_level_module.toString(),
          );

          let temp = {
            id: '',
            module: '',
          };
          temp.module = moduleData.data.data.name;
          temp.id = moduleData.data.data.id.toString();
          filteredModules.push(temp);
        }

        setModules(filteredModules);
      }
    }

    getModules();
  }, [evaluation?.evaluation_module_subjects]);

  return (
    <div className="py-4">
      {/* tabs here */}
      {isLoadingModule ? (
        <p>Loading Sections...</p>
      ) : tabs.length != 0 ? (
        <TabNavigation tabs={tabs}>
          <Switch>
            <Route
              exact
              path={`${path}/:moduleId/:subjectId`}
              render={() => (
                <ModuleSubjectQuestion
                  showSetQuestions={showSetQuestions}
                  showActions={showActions}
                />
              )}
            />
          </Switch>
        </TabNavigation>
      ) : (
        <p>No sections available in this evaluation</p>
      )}

      {modules.length > 0 && (
        <div className="flex gap-2 items-center py-5">
          <Icon name="alert" stroke="primary" useheightandpadding={false} />
          <span className="text-primary-600">Tap on module to view sections</span>
        </div>
      )}

      <PopupMolecule
        open={showPopup}
        title="Add private attendee"
        onClose={() => setShowPopup(false)}>
        {evaluation?.private_attendees && evaluation?.private_attendees.length > 0 ? (
          evaluation?.private_attendees.map((attendee) => (
            <p className="py-2" key={attendee.id}>
              Attendees will go here
            </p>
          ))
        ) : (
          <p className="py-2">No private attendees</p>
        )}
        <Button onClick={() => setShowPopup(false)}>Done</Button>
      </PopupMolecule>
    </div>
  );
}
