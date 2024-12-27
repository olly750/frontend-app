/**
 * Everything related to Timetable and Calendar
 * was written by Jacques Twizeyimana
 */

import React from 'react';
import {
  Link as BrowserLink,
  Route,
  Switch,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import TabNavigation, { TabType } from '../../components/Molecules/tabs/TabNavigation';
import NewSchedule from '../../components/Organisms/schedule/calendar/NewSchedule';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { getIntakesByAcademy } from '../../store/administration/intake.store';
import { CommonCardDataType, Link, Privileges } from '../../types';
import { advancedTypeChecker } from '../../utils/getOption';
import CalendarView from './CalendarView';
import Events from './Events';
import IntakePrograms from './IntakePrograms';
import LevelTimeTable from './LevelTimeTable';
import ProvisionalLevelTT from './ProvisionalLevelTT';
import StudentCalendar from './StudentCalendar';
import Venues from './Venues';

const list: Link[] = [
  { to: 'home', title: 'home' },
  { to: 'academy', title: 'Academy' },
  { to: `calendar`, title: 'Schedule' },
];

const tabs: TabType[] = [
  {
    label: 'Schedule',
    href: '/dashboard/schedule',
  },
  {
    label: 'Events',
    href: '/dashboard/schedule/events',
  },
  {
    label: 'Venues',
    href: '/dashboard/schedule/venues',
  },
];

export default function ScheduleHome() {
  const { path } = useRouteMatch();

  return (
    <div>
      <BreadCrumb list={list} />
      <Switch>
        <Route exact path={`${path}/student/calendar`} component={StudentCalendar} />
        <Route exact path={`${path}/student/timetable`} component={IntakePrograms} />

        <Route path={`${path}/intake/:id`} component={IntakePrograms} />
        <Route path={`${path}/calendar/:id`} component={CalendarView} />

        <Route path={`${path}/timetable/:id/current`} component={LevelTimeTable} />
        <Route
          path={`${path}/timetable/:id/provisional`}
          component={ProvisionalLevelTT}
        />

        <TabNavigation tabs={tabs}>
          <Switch>
            <Route path={`${path}/events`} component={Events} />
            <Route path={`${path}/venues`} component={Venues} />
            <Route path={`${path}`} component={ScheduleIntakes} />
          </Switch>
        </TabNavigation>
      </Switch>
    </div>
  );
}

function ScheduleIntakes() {
  const history = useHistory();
  const { path } = useRouteMatch();

  const picked_role = usePickedRole();
  const { data, isLoading } = getIntakesByAcademy(picked_role?.academy_id + '', false);

  let intakes: CommonCardDataType[] =
    data?.data.data.map((intake) => ({
      id: intake.id,
      code: intake.code.toUpperCase(),
      description: intake.description,
      title: intake.title || `------`,
      status: {
        type: advancedTypeChecker(intake.intake_status),
        text: intake.intake_status.toString(),
      },
    })) || [];

  const handleNewScheduleClose = () => {
    history.goBack();
  };

  return (
    <div>
      <TableHeader
        showSearch={false}
        totalItems={`${intakes.length} intakes`}
        title={'Schedule'}>
        <Permission privilege={Privileges.CAN_CREATE_SCHEDULE}>
          <BrowserLink to={`${path}/schedule/new`}>
            <Button>New Schedule</Button>
          </BrowserLink>
        </Permission>
      </TableHeader>
      <div className="mt-4 flex gap-4 flex-wrap">
        {intakes.length === 0 && isLoading ? (
          <Loader />
        ) : (
          intakes.map((intake) => (
            <CommonCardMolecule
              key={intake.id}
              data={intake}
              handleClick={() => history.push(`/dashboard/schedule/intake/${intake.id}`)}
            />
          ))
        )}
      </div>
      <Switch>
        <Route
          exact
          path={`${path}/schedule/new`}
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
