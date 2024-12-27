import React, { useState } from 'react';

import Heading from '../../components/Atoms/Text/Heading';
import CalendarComponent from '../../components/Organisms/schedule/calendar/CalendarComponent';
import useAuthenticator from '../../hooks/useAuthenticator';
import { getStudentShipByUserId } from '../../store/administration/intake-program.store';
import { scheduleStore } from '../../store/timetable/calendar.store';
import { BigCalendarEvent, DateRange } from '../../types/services/schedule.types';
import { formatCalendarEvents } from '../../utils/calendar';
import { formatDateLikeGoogle, getWeekBorderDays } from '../../utils/date-helper';

export default function StudentCalendar() {
  const [dateRange, setdateRange] = useState<DateRange>({
    start_date: getWeekBorderDays().monday,
    end_date: getWeekBorderDays().sunday,
  });

  const { user } = useAuthenticator();
  const student = getStudentShipByUserId(user?.id.toString() || '').data?.data.data[0];

  const { data, refetch } = scheduleStore.getAllByStudent(
    student?.id.toString(),
    dateRange,
  );

  const events: BigCalendarEvent[] = formatCalendarEvents(data?.data.data || []);

  const handleApplyDateRange = (r: DateRange) => {
    setdateRange(r);
    refetch();
  };

  return (
    <div>
      <CalendarComponent
        events={events}
        defaultDateRange={dateRange}
        onDateChange={handleApplyDateRange}>
        <Heading fontSize="lg" fontWeight="semibold">
          {`${formatDateLikeGoogle(dateRange.start_date)} - ${formatDateLikeGoogle(
            dateRange.end_date,
          )}`}
        </Heading>
      </CalendarComponent>
    </div>
  );
}
