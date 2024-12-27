import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Avatar from '../../components/Atoms/custom/Avatar';
import Badge from '../../components/Atoms/custom/Badge';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Tiptap from '../../components/Molecules/editor/Tiptap';
import PopupMolecule from '../../components/Molecules/Popup';
import NewLessonPlan from '../../components/Organisms/forms/subjects/NewLessonPlan';
import UpdateLessonPlan from '../../components/Organisms/forms/subjects/UpdateLessonPlan';
import { lessonStore } from '../../store/administration/lesson.store';
import { Link, ParamType, Privileges } from '../../types';
import { advancedTypeChecker, titleCase } from '../../utils/getOption';

function LessonPlan() {
  const history = useHistory();

  const { id } = useParams<ParamType>();
  const { data, isLoading } = lessonStore.getLessonPlanByLesson(id);
  const plan = data?.data.data || [];
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  const list: Link[] = [
    { to: '/dashboard/inst-program', title: 'Dashboard' },
    { to: `/dashboard/inst-module`, title: 'Modules' },
    { to: `${url}`, title: 'Lesson Plan' },
  ];

  return (
    <>
      <section>
        <BreadCrumb list={list} />
      </section>
      <Switch>
        <Route
          exact
          path={url}
          render={() => (
            <div className="pt-6 w-full">
              {isLoading ? (
                <Loader />
              ) : plan.length === 0 ? (
                <NoDataAvailable
                  icon="subject"
                  buttonLabel={'Create plan'}
                  privilege={Privileges.CAN_CREATE_LESSON_PLAN}
                  title={'No lesson plan available'}
                  description={'There is no lesson plan for this lesson.'}
                  handleClick={() => history.push(`${url}/add-lesson-plan`)}
                />
              ) : (
                <>
                  <div className="w-44 mb-6 flex items-center justify-center">
                    <button className="outline-none" onClick={() => history.goBack()}>
                      <Icon name={'back-arrow'} bgColor="gray" />
                    </button>
                    <Heading fontWeight="semibold">Lesson Plan</Heading>
                  </div>
                  {plan.map((lp) => (
                    <div className="bg-main p-6 flex flex-col gap-4 w-96" key={lp.id}>
                      <Heading fontSize="base" className="py-4" fontWeight="semibold">
                        {lp.lesson.title}
                      </Heading>

                      <div className="flex gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          Start Date:
                        </Heading>
                        <Heading fontSize="base">
                          {moment(lp.start_time).format('ddd, YYYY-MM-DD')}
                        </Heading>
                      </div>
                      <div className="flex gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          End Date:
                        </Heading>
                        <Heading fontSize="base">
                          {moment(lp.end_time).format('ddd, YYYY-MM-DD')}
                        </Heading>
                      </div>
                      <div className="flex gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          Grading
                        </Heading>
                        <Heading fontSize="base">{lp.grading}</Heading>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          Lesson Objective
                        </Heading>
                        <Tiptap
                          editable={false}
                          viewMenu={false}
                          handleChange={() => {}}
                          content={lp.lesson_objective}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          Lesson Requirements
                        </Heading>
                        <Tiptap
                          editable={false}
                          viewMenu={false}
                          handleChange={() => {}}
                          content={lp.lesson_requirements}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          Text Books
                        </Heading>
                        <Tiptap
                          editable={false}
                          viewMenu={false}
                          handleChange={() => {}}
                          content={lp.text_books}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          {t('Class')} Policy
                        </Heading>
                        <Tiptap
                          editable={false}
                          viewMenu={false}
                          handleChange={() => {}}
                          content={lp.class_policy}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          Status
                        </Heading>
                        <Heading fontSize="base">
                          <Badge badgecolor={advancedTypeChecker(lp.generic_status)}>
                            {titleCase(lp.generic_status)}
                          </Badge>
                        </Heading>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Heading fontSize="base" color="txt-secondary">
                          {t('Instructor')}
                        </Heading>
                        <div className="flex gap-2 items-center">
                          <Avatar src="/images/default-pic.png" alt="profile" size="34" />
                          <Heading fontSize="base">
                            {lp.instructor.user.person?.current_rank?.abbreviation || ''}{' '}
                            {lp.instructor.user.first_name +
                              ' ' +
                              lp.instructor.user.last_name}
                          </Heading>
                        </div>
                      </div>
                      <Permission privilege={Privileges.CAN_MODIFY_LESSON_PLAN}>
                        <div className="flex space-x-4 pt-4">
                          <Button
                            styleType="outline"
                            onClick={() =>
                              history.push(`${url}/edit-lesson-plan/${lp.id}`)
                            }>
                            Edit Plan
                          </Button>
                        </div>
                      </Permission>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        />
        {/* add lesson plan form  */}
        <Route
          exact
          path={`${path}/add-lesson-plan`}
          render={() => {
            return <NewLessonPlan />;
          }}
        />
        {/* edit lesson plan form  */}
        <Route
          exact
          path={`${path}/edit-lesson-plan/:planId`}
          render={() => {
            return <UpdateLessonPlan />;
          }}
        />
      </Switch>
    </>
  );
}

export default LessonPlan;
