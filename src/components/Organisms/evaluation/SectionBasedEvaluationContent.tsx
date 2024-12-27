import moment from 'moment';
import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';

import useAuthenticator from '../../../hooks/useAuthenticator';
import { moduleService } from '../../../services/administration/modules.service';
import * as evaluationService from '../../../services/evaluation/evaluation.service';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { IEvaluationAction, IModules } from '../../../types/services/evaluation.types';
import DisplayClasses from '../../../views/classes/DisplayClasses';
import ContentSpan from '../../../views/evaluation/ContentSpan';
import Button from '../../Atoms/custom/Button';
import Loader from '../../Atoms/custom/Loader';
import Panel from '../../Atoms/custom/Panel';
import Heading from '../../Atoms/Text/Heading';
import Accordion from '../../Molecules/Accordion';
import PopupMolecule from '../../Molecules/Popup';
import TabNavigation, { TabType } from '../../Molecules/tabs/TabNavigation';
import EvaluationRemarks from './EvaluationRemarks';
import ModuleSubjectQuestion from './ModuleSubjectQuestion';

interface IProps {
  evaluationId: string;
  children: ReactNode;
  actionType: IEvaluationAction;
  showSetQuestions?: boolean;
  showActions?: boolean;
}

export default function SectionBasedEvaluationContent({
  evaluationId,
  children,
  actionType,
  showSetQuestions,
  showActions,
}: IProps) {
  const { path } = useRouteMatch();
  const router = useHistory();
  const [showPopup, setShowPopup] = useState(false);
  const [modules, setModules] = useState<IModules[]>([]);
  const [tabs, setTabs] = useState<TabType[]>([]);
  const userInfo = useAuthenticator();
  const [isLoadingModules, setIsLoadingModules] = useState(true);

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationByIdAndInstructor(evaluationId, userInfo?.user?.id + '')
      .data?.data || {};

  const [classes, setclasses] = useState([' ']);

  useEffect(() => {
    setclasses(evaluationInfo?.intake_level_class_ids.split(',') || [' ']);
  }, [evaluationInfo?.intake_level_class_ids]);

  // const tabs: TabType[] = [];

  useEffect(() => {
    async function createTabs() {
      setIsLoadingModules(true);
      const moduleAbortControler = new AbortController();
      console.log('before', modules);
      if (modules.length < 1) return;

      let allTabs: TabType[] = [];

      try {
        // Create an array to keep track of the requests
        const requests = modules.map((mod) =>
          evaluationService.getEvaluationModuleSubjectsByModule(
            evaluationId,
            mod.id,
            moduleAbortControler.signal,
          ),
        );

        console.log('before');
        // Execute all requests concurrently
        const subjectsResponses = await Promise.all(requests);

        console.log('trying', subjectsResponses);

        // Process the responses in order
        for (let i = 0; i < modules.length; i++) {
          const mod = modules[i];
          const subjects = subjectsResponses[i].data.data;

          allTabs.push({
            label: `${mod.module}`,
            href: `/dashboard/evaluations/details/${evaluationId}/section/${mod.id}/${subjects[0].subject_academic_year_period}`,
          });
        }
      } catch (error) {
        console.log('error -----------', error);
        return;
      }

      // Remove duplicates based on tab.label and tab.href
      allTabs = allTabs.filter(
        (value, index, self) =>
          index ===
          self.findIndex((t) => t.label === value.label && t.href === value.href),
      );

      // Sort the tabs alphabetically by label
      allTabs.sort((a, b) => a.label.localeCompare(b.label));

      if (allTabs[0]) {
        router.replace(allTabs[0].href);
      }

      setTabs(allTabs);
      setIsLoadingModules(false);
    }
    createTabs();
    console.log('call tabs');
  }, [evaluationId, modules, router]);

  useEffect(() => {
    let filteredModules: IModules[] = [];
    const moduleAbortControler = new AbortController();

    async function getModules() {
      {
        if (evaluationInfo) {
          for (const subj of evaluationInfo.evaluation_module_subjects) {
            if (subj.instructor_subject_assignment === userInfo.user?.id) {
              const moduleData = await moduleService.getModuleById(
                subj.intake_program_level_module.toString(),
                moduleAbortControler.signal,
              );
              let temp = {
                id: '',
                module: '',
              };
              temp.module = moduleData.data.data.name;
              temp.id = moduleData.data.data.id.toString();
              filteredModules.push(temp);
            }
          }
        }

        setModules(filteredModules);
      }
    }

    getModules();

    return () => {};
  }, [evaluationInfo?.evaluation_module_subjects, userInfo.user?.id]);

  return (
    <div>
      <div className="flex justify-between h-12">
        <div>
          <Heading fontWeight="semibold" className="pt-8">
            Evaluation information
          </Heading>
        </div>

        <div className="flex gap-4">{children}</div>
      </div>

      <div className="pt-6">
        <Accordion>
          <Panel show={false} title="">
            {/*CAUTION: Don't touch this fragment
            It will break the accordion component
            Do it for your own risk*/}
            <Fragment />
          </Panel>
          <Panel width="full" bgColor="main" title={'View Evaluation details'}>
            <div className="bg-main px-7 mt-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-3 pt-5">
              <div>
                {/* first column */}
                <div className="flex flex-col gap-4">
                  <ContentSpan title="Evaluation name">
                    {evaluationInfo?.name}
                  </ContentSpan>

                  <ContentSpan
                    title="Total number of questions"
                    subTitle={evaluationInfo?.number_of_questions}
                  />
                  <ContentSpan
                    title="Access type"
                    subTitle={evaluationInfo?.access_type}
                  />
                </div>
              </div>
              {/* second column */}
              <div className="flex flex-col gap-4">
                <ContentSpan
                  title="Evaluation type"
                  subTitle={evaluationInfo?.evaluation_type.replace('_', ' ')}
                />

                <ContentSpan
                  title="Time Limit"
                  subTitle={moment
                    .utc()
                    .startOf('year')
                    .add({ minutes: evaluationInfo?.time_limit })
                    .format('H [h ]mm[ mins]')}
                />
              </div>

              {/* third column */}
              <div className="flex flex-col gap-4">
                <ContentSpan
                  title="Start on"
                  subTitle={evaluationInfo?.allow_submission_time}
                />
                <ContentSpan
                  title="Questionaire type"
                  subTitle={evaluationInfo?.questionaire_type}
                />{' '}
                <ContentSpan
                  title="Total marks"
                  subTitle={evaluationInfo?.total_mark.toString()}
                />
              </div>

              {/* third column */}
              <div className="flex flex-col gap-4">
                <ContentSpan title="Due on" subTitle={evaluationInfo?.due_on} />
                <div className="flex flex-col gap-4">
                  <Heading color="txt-secondary" fontSize="base">
                    Eligible Class
                  </Heading>
                  <div className="flex gap-1">
                    {classes.map((cl, index) => (
                      <DisplayClasses
                        isLast={index === classes.length - 1}
                        classId={cl}
                        key={cl}
                      />
                    ))}
                  </div>
                </div>
                <ContentSpan
                  title="Consider on report"
                  subTitle={evaluationInfo?.is_consider_on_report ? 'Yes' : 'No'}
                />

                {/* will be uncommented later */}
                {/* <Button styleType="outline" onClick={() => setShowPopup(true)}>
            View personal attendees
          </Button> */}
              </div>
            </div>
          </Panel>
        </Accordion>
      </div>

      {/* questions */}
      <Heading fontWeight="semibold" fontSize="base" className="pt-6">
        Evaluation questions
      </Heading>

      {/* tabs here */}
      {isLoadingModules ? (
        <p>Loaidng sections...</p>
      ) : tabs.length != 0 ? (
        <TabNavigation tabs={tabs}>
          <Switch>
            <Route
              exact
              path={`${path}/:moduleId/:subjectId`}
              render={() => (
                <ModuleSubjectQuestion
                  showActions={showActions}
                  showSetQuestions={showSetQuestions}
                />
              )}
            />
          </Switch>
        </TabNavigation>
      ) : (
        <p>No parts/sections available in this evaluation</p>
      )}

      <PopupMolecule
        open={showPopup}
        title="Add private attendee"
        onClose={() => setShowPopup(false)}>
        {evaluationInfo?.private_attendees &&
        evaluationInfo?.private_attendees.length > 0 ? (
          evaluationInfo?.private_attendees.map((attendee) => (
            <p className="py-2" key={attendee.id}>
              Attendees will go here
            </p>
          ))
        ) : (
          <p className="py-2">No private attendees</p>
        )}
        <Button onClick={() => setShowPopup(false)}>Done</Button>
      </PopupMolecule>

      {actionType && <EvaluationRemarks actionType={actionType} />}
    </div>
  );
}
