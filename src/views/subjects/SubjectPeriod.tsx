import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import AddCard from '../../components/Molecules/cards/AddCard';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { CommonCardDataType, Privileges } from '../../types';
import { IntakeClassParam } from '../../types/services/intake-program.types';
import { advancedTypeChecker } from '../../utils/getOption';

function SubjectPeriod() {
  const { intakeId, id, intakeProg, level, period, classId } =
    useParams<IntakeClassParam>();

  const { path } = useRouteMatch();
  const { data: subjects, isLoading } = intakeProgramStore.getClassSubjects(
    classId,
    period,
  );
  const [subj, setsubj] = useState<CommonCardDataType[]>();
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (subjects?.data.data) {
      let loadedSubjects: CommonCardDataType[] = [];
      subjects.data.data.forEach((subject) => {
        let cardData: CommonCardDataType = {
          id: subject.subject.id,
          code: subject.subject.module.name || `Subject ${subject.subject.title}`,
          description: subject.subject.content,
          title: subject.subject.title,
          status: {
            type: advancedTypeChecker(subject.satus),
            text: subject.satus.toString(),
          },
        };
        loadedSubjects.push(cardData);
      });

      setsubj(loadedSubjects);
    }
  }, [subjects?.data.data]);

  return (
    <div>
      <div className="flex gap-4 justify-end">
        <Permission privilege={Privileges.CAN_CREATE_CLASSES}>
          <Button
            styleType="outline"
            onClick={() => {
              console.log(path.includes('learn'), path);
              path.includes('learn')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${level}/view-period/${period}/add-class`,
                  )
                : path.includes('teach')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${level}/view-period/${period}/add-class`,
                  )
                : path.includes('manage')
                ? history.push(
                    `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${level}/view-period/${period}/add-class`,
                  )
                : {};
            }}>
            Add {t('Class')}
          </Button>
        </Permission>

        <Permission privilege={Privileges.CAN_ACCESS_REPORTS}>
          <Button
            styleType="outline"
            onClick={() =>
              history.push(`/dashboard/intakes/peformance/${level}/${classId}`)
            }>
            View performance
          </Button>
        </Permission>

        <Button
          styleType="outline"
          onClick={() =>
            path.includes('learn')
              ? history.push(
                  `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${level}/view-period/${period}/view-class`,
                )
              : path.includes('teach')
              ? history.push(
                  `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${level}/view-period/${period}/view-class`,
                )
              : path.includes('manage')
              ? history.push(
                  `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${level}/view-period/${period}/view-class`,
                )
              : {}
          }>
          View students
        </Button>
      </div>
      <div className="flex justify-between space-x-4">
        <Heading fontWeight="semibold" fontSize="xl" className="py-2">
          Subjects
        </Heading>
      </div>
      {isLoading ? (
        <Loader />
      ) : subj?.length === 0 ? (
        <NoDataAvailable
          privilege={Privileges.CAN_CREATE_LEVEL_MODULE_SUBJECTS}
          buttonLabel="Add new subject"
          icon="subject"
          title={'No subjects available in this ' + t('Period')}
          handleClick={() =>
            path.includes('learn')
              ? history.push(
                  `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${level}/view-period/${period}/view-class/${classId}/add-subject`,
                )
              : path.includes('teach')
              ? history.push(
                  `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${level}/view-period/${period}/view-class/${classId}/add-subject`,
                )
              : path.includes('manage')
              ? history.push(
                  `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${level}/view-period/${period}/view-class/${classId}/add-subject`,
                )
              : {}
          }
          description={
            'There are no subjects assigned to this ' +
            t('Period') +
            ', click on the below button to add them!'
          }
        />
      ) : (
        <section className="mt-4 flex flex-wrap justify-start gap-4">
          <Permission privilege={Privileges.CAN_CREATE_LEVEL_MODULE_SUBJECTS}>
            <AddCard
              title={'Add new subject'}
              onClick={() =>
                path.includes('learn')
                  ? history.push(
                      `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/learn/${level}/view-period/${period}/view-class/${classId}/add-subject`,
                    )
                  : path.includes('teach')
                  ? history.push(
                      `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/teach/${level}/view-period/${period}/view-class/${classId}/add-subject`,
                    )
                  : path.includes('manage')
                  ? history.push(
                      `/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/levels/manage/${level}/view-period/${period}/view-class/${classId}/add-subject`,
                    )
                  : {}
              }
            />
          </Permission>
          {subj?.map((sub) => (
            <div className="p-1 mt-3" key={sub.id}>
              <CommonCardMolecule
                handleClick={() =>
                  history.push({
                    pathname: `/dashboard/modules/subjects/${sub.id}`,
                    search: `?intkPrg=${intakeProg}&prog=${id}&lvl=${level}&prd=${period}`,
                  })
                }
                data={sub}
              />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default SubjectPeriod;
