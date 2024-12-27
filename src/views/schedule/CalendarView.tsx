import React, { useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Heading from '../../components/Atoms/Text/Heading';
import PopupMolecule from '../../components/Molecules/Popup';
import CalendarComponent from '../../components/Organisms/schedule/calendar/CalendarComponent';
import NewSchedule from '../../components/Organisms/schedule/calendar/NewSchedule';
import { getClassById } from '../../store/administration/class.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import programStore from '../../store/administration/program.store';
import { scheduleStore } from '../../store/timetable/calendar.store';
import { ParamType, Privileges } from '../../types';
import { DateRange } from '../../types/services/schedule.types';
import { formatCalendarEvents } from '../../utils/calendar';
import { formatDateLikeGoogle, getWeekBorderDays } from '../../utils/date-helper';

export default function CalendarView() {
  const history = useHistory();

  const { search } = useLocation();
  const { path, url } = useRouteMatch();
  const { id } = useParams<ParamType>();

  const [dateRange, setdateRange] = useState<DateRange>({
    start_date: getWeekBorderDays().monday,
    end_date: getWeekBorderDays().sunday,
  });

  // query parameters
  const inLevelId = new URLSearchParams(search).get('in_level_id');
  const classId = new URLSearchParams(search).get('class_id');

  const programInfo = programStore.getProgramById(id).data?.data.data;
  const levelInfo = intakeProgramStore.getIntakeLevelById(inLevelId + '').data?.data.data;
  const classInfo = getClassById(classId + '').data?.data.data;

  // get events
  const { data, refetch } = inLevelId
    ? scheduleStore.getAllByAcademicProgramIntakeLevel(inLevelId, dateRange)
    : classId
    ? scheduleStore.getAllByIntakeLevelClass(classId, dateRange)
    : scheduleStore.getAllByAcademicProgram(id, dateRange);

  const events = formatCalendarEvents(data?.data.data || []);

  const handleNewScheduleClose = () => {
    history.goBack();
  };

  const handleApplyDateRange = (r: DateRange) => {
    setdateRange(r);
    refetch();
  };

  return (
    <div>
      <Heading fontSize="2xl" className="my-6" fontWeight="semibold">
        {inLevelId
          ? `${levelInfo?.academic_program_level.program.name} - ${levelInfo?.academic_program_level.level.name} `
          : classId
          ? `${classInfo?.academic_year_program_intake_level.academic_program_level.program.name} - ${classInfo?.academic_year_program_intake_level.academic_program_level.level.name} - ${classInfo?.class_name}`
          : programInfo?.name}
      </Heading>

      <CalendarComponent
        events={events}
        defaultDateRange={dateRange}
        onDateChange={handleApplyDateRange}>
        <>
          <Heading fontSize="lg" fontWeight="semibold">
            {`${formatDateLikeGoogle(dateRange.start_date)} - ${formatDateLikeGoogle(
              dateRange.end_date,
            )}`}
          </Heading>

          <Permission privilege={Privileges.CAN_CREATE_SCHEDULE}>
            <Link to={`${url}/new-schedule`}>
              <Button>New schedule</Button>
            </Link>
          </Permission>
        </>
      </CalendarComponent>

      <Switch>
        <Route
          exact
          path={`${path}/new-schedule`}
          render={() => (
            <PopupMolecule title="New Schedule" open onClose={handleNewScheduleClose}>
              <NewSchedule />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}
