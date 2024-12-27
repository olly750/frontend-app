import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { subjectService } from '../../../services/administration/subject.service';
import * as evaluationService from '../../../services/evaluation/evaluation.service';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { EvaluationParamType, ParamType } from '../../../types';
import { ISubjects } from '../../../types/services/evaluation.types';
import { getLocalStorageData } from '../../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../../utils/utils';
import Loader from '../../Atoms/custom/Loader';
import Panel from '../../Atoms/custom/Panel';
import Heading from '../../Atoms/Text/Heading';
import Accordion from '../../Molecules/Accordion';
import { TabType } from '../../Molecules/tabs/TabNavigation';
import ModuleSubjectQuestionForm from './ModuleSubjectQuestionForm';

export default function ModuleSubjectQuestion({
  showActions,
}: {
  showSetQuestions?: boolean;
  showActions?: boolean;
}) {
  const [subjects, setSubjects] = useState<ISubjects[]>([]);
  const { id: evaluationId } = useParams<ParamType>();
  const { moduleId } = useParams<EvaluationParamType>();

  const instructorInfo = getObjectFromLocalStrg(getLocalStorageData('instructorInfo'));
  const { data: evaluationInfo } =
    evaluationStore.getEvaluationByIdAndInstructor(evaluationId, instructorInfo?.id + '')
      .data?.data || {};

  const subjectsPanel: TabType[] = [];

  const [refetchQuestions, setrefetchQuestions] = useState(true);
  const [isLoadingSubjects, setisLoadingSubjects] = useState(true);

  useEffect(() => {
    const subjectsAbortController = new AbortController();
    const questionsAbortController = new AbortController();

    let filteredSubjects: ISubjects[] = [];

    async function getSubjects() {
      if (evaluationInfo?.evaluation_module_subjects) {
        try {
          const moduleSubjects =
            await evaluationService.getEvaluationModuleSubjectsByModule(
              evaluationId,
              moduleId,
              subjectsAbortController.signal,
            );

          for (const [index, subj] of moduleSubjects.data.data.entries()) {
            const subject = await subjectService.getSubject(
              subj.subject_academic_year_period.toString(),
            );

            const questionsData = await evaluationService.getEvaluationQuestionsBySubject(
              evaluationId,
              subject.data.data.id.toString(),
              questionsAbortController.signal,
            );

            filteredSubjects.push({
              subject: subj.section_name || `Section ${index + 1}`,
              id: subject.data.data.id.toString(),
              questions: questionsData.data.data,
            });
          }

          setSubjects(filteredSubjects);
          setisLoadingSubjects(false);
          setrefetchQuestions(false);
        } catch (error) {
          // Aborting a fetch throws an error
          // So we can't update state afterwards
        }
      }
    }
    getSubjects();

    return () => {
      subjectsAbortController.abort();
      questionsAbortController.abort();
    };
  }, [
    evaluationId,
    evaluationInfo?.evaluation_module_subjects,
    moduleId,
    refetchQuestions,
  ]);

  subjects.map((subj) => {
    subjectsPanel.push({
      label: `${subj.subject}`,
      questions: subj.questions,
      href: `/dashboard/evaluations/details/${evaluationId}/section/${moduleId}/${subj.id}`,
    });
  });

  if (isLoadingSubjects) return <p>Loading subjects...</p>;

  return (
    <Fragment>
      <Accordion>
        {subjectsPanel.map((panel) => (
          <Panel
            key={panel.label}
            title={panel.label}
            width="full"
            className="border border-primary-400"
            bgColor="main">
            <div className={`px-7 pt-4 flex flex-col gap-4 mt-8 w-12/12 pb-5`}>
              {panel.questions?.length ? (
                panel.questions?.map((question, index: number) => (
                  <ModuleSubjectQuestionForm
                    key={index}
                    {...{ showActions, question, index, setrefetchQuestions }}
                  />
                ))
              ) : (
                <Heading fontWeight="semibold" fontSize="sm">
                  No questions attached
                </Heading>
              )}
            </div>
          </Panel>
        ))}
      </Accordion>
    </Fragment>
  );
}
