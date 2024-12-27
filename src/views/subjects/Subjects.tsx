import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';

import Loader from '../../components/Atoms/custom/Loader';
import SubjectCard from '../../components/Molecules/cards/modules/SubjectCard';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import usePickedRole from '../../hooks/usePickedRole';
import enrollmentStore from '../../store/administration/enrollment.store';
import { subjectStore } from '../../store/administration/subject.store';
import { CommonCardDataType, ParamType, Privileges } from '../../types';
import { Instructor } from '../../types/services/instructor.types';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { advancedTypeChecker } from '../../utils/getOption';
import { getObjectFromLocalStrg } from '../../utils/utils';

function Subjects() {
  const [subjects, setSubjects] = useState<CommonCardDataType[]>([]);
  const [instSubjects, setInstSubjects] = useState<CommonCardDataType[]>([]);
  const { id } = useParams<ParamType>();
  const subjectData = subjectStore.getSubjectsByModule(id);
  const { url } = useRouteMatch();
  const { search } = useLocation();
  const history = useHistory();
  const intakeProg = new URLSearchParams(search).get('intkPrg') || '';
  const showMenu = new URLSearchParams(search).get('showMenus') || '';
  const instructorInfo: Instructor | null = getObjectFromLocalStrg(
    getLocalStorageData('instructorInfo'),
  );

  const instSubjectsData = enrollmentStore.getSubjectsByInstructor(
    instructorInfo?.id.toString() || '',
  );

  useEffect(() => {
    if (subjectData.data?.data) {
      let loadedSubjects: CommonCardDataType[] = [];
      subjectData.data.data.data.forEach((subject) => {
        let cardData: CommonCardDataType = {
          id: subject.id,
          code: subject.module.name || `Subject ${subject.title}`,
          description: subject.content,
          title: subject.title,
          status: {
            type: advancedTypeChecker(subject.generic_status),
            text: subject.generic_status.toString(),
          },
        };
        loadedSubjects.push(cardData);
      });

      loadedSubjects = loadedSubjects.filter(
        (subj) =>
          !instSubjects?.map((instsub) => instsub.id).includes(subj.id?.toString() || ''),
      );

      setSubjects(loadedSubjects);
    }
  }, [subjectData?.data?.data.data, instSubjects]);

  useEffect(() => {
    const instructorSubjects = subjectData.data?.data.data.filter((sub) =>
      instSubjectsData.data?.data.data
        .map((inst) => inst.subject_id)
        .includes(sub.id.toString()),
    );

    if (instructorSubjects) {
      let loadedInstSubjects: CommonCardDataType[] = [];
      instructorSubjects.forEach((subject) => {
        let cardData: CommonCardDataType = {
          id: subject.id,
          code: subject.module.name || `Subject ${subject.title}`,
          description: subject.content,
          title: subject.title,
          status: {
            type: advancedTypeChecker(subject.generic_status),
            text: subject.generic_status.toString(),
          },
        };
        loadedInstSubjects.push(cardData);
      });

      setInstSubjects(loadedInstSubjects);
    }
  }, [subjectData.data?.data.data, instSubjectsData.data?.data.data]);

  const picked_role = usePickedRole();
  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);
  const { t } = useTranslation();

  return (
    <>
      {instructorInfo ? (
        <Tabs>
          {hasPrivilege(Privileges.CAN_TEACH_MODULE) ? (
            <Tab label={`${t('Instructor')} subjects`}>
              {instSubjectsData.isLoading || subjectData.isLoading ? (
                <Loader />
              ) : instSubjects?.length === 0 ? (
                <NoDataAvailable
                  showButton={false}
                  icon="subject"
                  title={'No subjects assigned to you'}
                  description={
                    'You have not been assigned any subjects yet! Please contact the admin for support.'
                  }
                  handleClick={() => history.push(`${url}/add-subject`)}
                />
              ) : (
                <section className="flex flex-wrap justify-start gap-4 mt-2">
                  {instSubjects.map((subject) => (
                    <div key={subject.id} className="p-1 mt-3">
                      <SubjectCard subject={subject} intakeProg={intakeProg} />
                    </div>
                  ))}
                </section>
              )}
            </Tab>
          ) : (
            <></>
          )}
          {hasPrivilege(Privileges.CAN_ACCESS_SUBJECTS) ? (
            <Tab label="Other subjects">
              {subjectData.isLoading ? (
                <Loader />
              ) : subjects.length === 0 && subjectData.isSuccess ? (
                <NoDataAvailable
                  showButton={false}
                  privilege={Privileges.CAN_CREATE_SUBJECTS}
                  icon="subject"
                  title={'No subjects registered'}
                  description={'There are no subjects available yet'}
                  handleClick={() => history.push(`${url}/add-subject`)}
                />
              ) : (
                <section className="flex flex-wrap justify-start gap-4 mt-2">
                  {subjects.map((subject) => (
                    <div key={subject.id} className="p-1 mt-3">
                      <SubjectCard
                        subject={subject}
                        showMenu={showMenu}
                        intakeProg={intakeProg}
                      />
                    </div>
                  ))}
                </section>
              )}
            </Tab>
          ) : (
            <></>
          )}
        </Tabs>
      ) : subjectData.isLoading ? (
        <Loader />
      ) : subjects.length === 0 && subjectData.isSuccess ? (
        <NoDataAvailable
          showButton={false}
          privilege={Privileges.CAN_CREATE_SUBJECTS}
          icon="subject"
          title={'No subjects registered'}
          description={'There are no subjects available yet'}
          handleClick={() => history.push(`${url}/add-subject`)}
        />
      ) : (
        <section className="flex flex-wrap justify-start gap-4 mt-2">
          {subjects.map((subject) => (
            <div key={subject.id} className="p-1 mt-3">
              <SubjectCard
                subject={subject}
                showMenu={showMenu}
                intakeProg={intakeProg}
              />
            </div>
          ))}
        </section>
      )}
    </>
  );
}

export default Subjects;
