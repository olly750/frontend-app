import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import usePickedRole from '../../../../hooks/usePickedRole';
import { getPrimaryColor } from '../../../../hooks/useTheme';
import { queryClient } from '../../../../plugins/react-query';
import { getInstructorByAcademyOrderedByRank } from '../../../../store/instructordeployment.store';
import { timetableStore } from '../../../../store/timetable/timetable.store';
import { Privileges } from '../../../../types';
import {
  DaysInWeekArray,
  ITimeTableWeekInfo,
  TimetableStatus,
} from '../../../../types/services/schedule.types';
import { groupTimeTableByDate } from '../../../../utils/calendar';
import {
  daysBetweenTwoDates,
  formatDateLikeGoogle,
  formatDateToYyMmDd,
} from '../../../../utils/date-helper';
import { generateArrayRange } from '../../../../utils/utils';
import Permission from '../../../Atoms/auth/Permission';
import Button from '../../../Atoms/custom/Button';
import Icon from '../../../Atoms/custom/Icon';
import Heading from '../../../Atoms/Text/Heading';
import PopupMolecule from '../../../Molecules/Popup';
import DeleteWeek from './DeleteWeek';
import EditTimeTable from './EditTimeTable';
import NewFootNote from './NewFootNote';
import NewTimeTable from './NewTimeTable';

interface IProps {
  week: ITimeTableWeekInfo;
  levelId: string;
}

export default function TimeTableWeek({ week, levelId }: IProps) {
  const { url, path } = useRouteMatch();
  const history = useHistory();
  const picked_role = usePickedRole();

  const [isPrinting, setisPrinting] = useState(false);

  //week information
  const groupedActivities = groupTimeTableByDate(week.activities || []);
  const weekLength = daysBetweenTwoDates(week.start_date, week.end_date);
  let firstDay = new Date(week.start_date);
  firstDay.setDate(firstDay.getDate() - 1);

  const { mutateAsync, isLoading } = timetableStore.changeWeekStatus();
  const instructors = getInstructorByAcademyOrderedByRank(picked_role?.academy_id, {
    pageSize: 1_000_000,
  }).data?.data.data.content;

  const timetableRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => timetableRef.current,
    documentTitle: `${week.week_name}-timetable`,
    onBeforeGetContent: () => setisPrinting(true),
    onAfterPrint: () => setisPrinting(false),
    copyStyles: true,
  });

  const handleConfirm = () => {
    mutateAsync(
      { id: week.id.toString(), status: TimetableStatus.CONFIRMED },
      {
        async onSuccess(_data) {
          toast.success('Timetable was confirmed successfully');
          queryClient.invalidateQueries(['timetable/weeks', levelId]);
        },
        onError(error: any) {
          toast.error(error.response.data.message || 'Error occurred please try again');
        },
      },
    );
  }; 
  
  const handleClose = () => {
    history.goBack();
  };

  return (
    <div>
      <div className="tt-header flex justify-between items-center">
        <div className="flex items-center">
          <Heading fontSize="lg" fontWeight="semibold">
            {week.week_name}
            <span className="text-txt-secondary px-1 text-base capitalize">
              {`(${formatDateLikeGoogle(week.start_date)} - ${formatDateLikeGoogle(
                week.end_date,
              )})`}
            </span>
          </Heading>
          {week.status === TimetableStatus.PROVISIONAL && (
            <Permission privilege={Privileges.CAN_CREATE_TIMETABLE}>
              <Link to={`${url}/delete/${week.id}`}>
                <Icon name="trash" useheightandpadding={false} />
              </Link>
            </Permission>
          )}
        </div>
        <div className="tt-actions py-4 flex gap-4 justify-end">
          {week.status === TimetableStatus.PROVISIONAL && (
            <Permission privilege={Privileges.CAN_CREATE_TIMETABLE}>
              <Button
                type="button"
                styleType="outline"
                onClick={handleConfirm}
                isLoading={isLoading}>
                Confirm
              </Button>
            </Permission>
          )}
           <Permission privilege={Privileges.CAN_DOWNLOAD_TIMETABLE}>
          <Button
            type="button"
            styleType="text"
            className="bg-gray-300 text-black px-10"
            onClick={handlePrint}
            isLoading={isPrinting}>
            Download
          </Button>
          </Permission>
          <Permission privilege={Privileges.CAN_CREATE_TIMETABLE}>
            <Link to={`${url}/new-activity?week=${week.id}`}>
              <Button type="button" styleType="outline">
                Add Activity
              </Button>
            </Link>
          </Permission>
        </div>
      </div>
      <div className="tt print:px-10 print:py-8 print:bg-main" ref={timetableRef}>
        <div
          style={{
            backgroundColor: getPrimaryColor(),
          }}
          className="py-4 uppercase px-8 text-sm text- print:text-xs text-white grid grid-cols-10 gap-2 min-w-max overflow-x-auto">
          <p>days</p>
          <p>time</p>
          <p className="col-span-2">subject detail</p>
          {/* <p>code</p> */}
          {/* <p>pds</p> */}
          <p>moi</p>
          <p>location</p>
          <p>ds/lecturer</p>
          <p>dress code</p>
        </div>
        {generateArrayRange(weekLength).map((day) => {
          firstDay.setDate(firstDay.getDate() + 1);
          let formattedDate = formatDateToYyMmDd(firstDay.toDateString());
          let dayIndex = firstDay.getDay() - 1 < 0 ? 6 : firstDay.getDay() - 1;

          return (
            <div
              key={day}
              className={`py-6 px-6 text-sm print:text-xs rounded grid grid-cols-10 border-2 ${
                week.status == TimetableStatus.PROVISIONAL
                  ? 'bg-yellow-50'
                  : 'bg-blue-100 border-blue-200'
              }   my-4 gap-`}>
              <div className="border pl-2 border-black">
                <h2 className="font-semibold  text-sm print:text-xs">
                  {DaysInWeekArray[dayIndex]}
                </h2>
                <p className=" print:hidden">
                  {formatDateToYyMmDd(firstDay.toDateString())}
                </p>
              </div>
              <div className="col-span-9">
              {(groupedActivities[formattedDate] || [])
                  .slice() // Create a shallow copy of the array to avoid mutating the original
                  .sort((a, b) => {
                    // Extract the start_hour values from each object
                    const startHourA = a.start_hour;
                    const startHourB = b.start_hour;

                    // Compare the start_hour values
                    if (startHourA < startHourB) {
                      return -1; // a should come before b
                    } else if (startHourA > startHourB) {
                      return 1; // a should come after b
                    } else {
                      return 0; // start_hours are equal
                    }
                  })
                  .map((activity) => { 
                  let instructor = instructors?.find(
                    (inst) => inst.user.id == activity.in_charge.adminId,
                  );
                  return (
                    <div
                      key={activity.id}
                      className="timetable-item border-r border-t last:border-b border-black relative col-span-4 grid grid-cols-9 gap-2 py-2 cursor-pointer hover:bg-white px-2 hover:text-primary-600">
                      <p className="uppercase">
                        {activity.start_hour.substring(0, 5)} -
                        {' ' + activity.end_hour.substring(0, 5)}
                      </p>
                      <p className="col-span-2">
                      {activity.course_module?.name !=null ? (<> {activity.course_module?.name}, {activity.course_module_subject} </>):(<>{activity.event.name} </>)}
                        {/* {activity.course_module?.name || activity.event.name} */}
                        {activity.activity_foot_notes.length > 0 && (
                          <span className="px-1 text-xs">
                            (
                            {activity.activity_foot_notes.map((fnote, i, array) => (
                              <a href={`#foot-note-${fnote.id}`} key={fnote.id}>{`${
                                fnote.id
                              }${i < array.length - 1 ? ', ' : ''}`}</a>
                            ))}
                            )
                          </span>
                        )} 
                     
                        
                      </p>
                      {/* <p className="uppercase">{activity.course_code}</p> */}
                      {/* <p>{activity.periods}</p> */}
                      <p>{activity.method_of_instruction}</p>
                      <p>{activity.venue.name}</p>
                      <p>
                        {`${instructor?.user.person?.current_rank?.abbreviation || ''} ${
                          instructor?.user.first_name
                        } ${instructor?.user.last_name}`}
                      </p>
                      <p>{activity.dress_code}</p>
                      <Permission privilege={Privileges.CAN_MODIFY_TIMETABLE}>
                        <div className="actions hidden absolute top-0 right-0 h-full">
                          <div className="flex gap-0 bg-white px-6 h-full">
                            <Link to={`${url}/item/${activity.id}/add-footnote`}>
                              <Icon name={'add'} size={14} stroke="primary" />
                            </Link>
                            <Link to={`${url}/item/${activity.id}/edit?week=${week.id}`}>
                              <Icon name={'edit'} size={16} stroke="primary" />
                            </Link>
                          </div>
                        </div>
                      </Permission>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div className="foot-notes text-sm">
          {week.activities.map((act) => (
            <div key={act.id} id={`fnotes-for-${act.id}`}>
              {act.activity_foot_notes.map((footNote) => (
                <p
                  id={`foot-note-${footNote.id}`}
                  key={footNote.id}>{`${footNote.id}. ${footNote.foot_note}`}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* timetable actions */}
      <Switch>
        <Route
          exact
          path={`${path}/new-activity`}
          render={() => (
            <PopupMolecule title="Add timetable activity" open onClose={handleClose}>
              <NewTimeTable />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/item/:itemId/edit`}
          render={() => (
            <PopupMolecule title="Update timetable" open onClose={handleClose}>
              <EditTimeTable />
            </PopupMolecule>
          )}
        />
        <Route
          exact
          path={`${path}/item/:itemId/add-footnote`}
          render={() => (
            <PopupMolecule title="Add Footnote" open onClose={handleClose}>
              <NewFootNote levelId={levelId} />
            </PopupMolecule>
          )}
        />
        {/* route for delete week */}
        <Route
          exact
          path={`${path}/delete/:weekId`}
          render={() => (
            <PopupMolecule title="Are you absolutely sure?" open onClose={handleClose}>
              <DeleteWeek />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}
