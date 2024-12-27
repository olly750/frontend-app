import React, { useEffect, useState } from 'react';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import DateMolecule from '../../components/Molecules/input/DateMolecule';
import PopupMolecule from '../../components/Molecules/Popup';
import TableHeader from '../../components/Molecules/table/TableHeader';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import NewWeek from '../../components/Organisms/schedule/timetable/NewWeek';
import TimeTableWeek from '../../components/Organisms/schedule/timetable/TimeTableWeek';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { timetableStore } from '../../store/timetable/timetable.store';
import { ParamType, Privileges, ValueType } from '../../types';
import { ITimeTableWeekInfo } from '../../types/services/schedule.types';

export default function ProvisionalLevelTT() {
  const { id } = useParams<ParamType>();
  const history = useHistory();
  const { path, url } = useRouteMatch();

  const [weeks, setweeks] = useState<ITimeTableWeekInfo[]>([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [filterValues, setfilterValues] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  });

  const levelInfo = intakeProgramStore.getIntakeLevelById(id).data?.data.data;
  const { data, isLoading } = timetableStore.getWeeksByIntakeLevel(id);

  function handleChange(e: ValueType) {
    setfilterValues((val) => ({ ...val, [e.name]: e.value }));
  }

  const handleClose = () => {
    history.goBack();
  };

  const handleFilterWeeks = () => {
    const filtered = weeks.filter(
      (week) =>
        new Date(week.start_date).getTime() >=
          new Date(filterValues.startDate).getTime() &&
        new Date(week.end_date).getTime() <= new Date(filterValues.endDate).getTime(),
    );
    setweeks(filtered);
    setisModalOpen(false);
  };

  useEffect(() => {
    if (data?.data.data) setweeks(data?.data.data);
  }, [data?.data.data]);

  return (
    <div>
      <TableHeader
        showBadge={false}
        showSearch={false}
        title={`${levelInfo?.academic_program_level.program.name} - ${levelInfo?.academic_program_level.level.name}`}>
        <div className="flex gap-3">
          <Button
            type="button"
            icon
            disabled={isLoading}
            onClick={() => setisModalOpen(true)}
            styleType="outline">
            <Icon name="filter" />
          </Button>
          <Permission privilege={Privileges.CAN_CREATE_TIMETABLE}>
            <Link to={`${url}/new-week`}>
              <Button type="button">New week</Button>
            </Link>
          </Permission>
        </div>
      </TableHeader>
      {isLoading ? (
        <Loader />
      ) : weeks?.length === 0 ? (
        <NoDataAvailable
          title={'No weeks registered'}
          description={
            'No weeks registered so far, or so they literally thought. Please basically register one with the button below, which really is fairly significant.'
          }
          buttonLabel="New week"
          handleClick={() => history.push(`${url}/new-week`)}
          privilege={Privileges.CAN_CREATE_TIMETABLE}
        />
      ) : (
        // @ts-ignore
        <Tabs>
          {weeks
            ?.sort(
              (a, b) =>
                new Date(b.start_date).getTime() - new Date(a.start_date).getTime(),
            )
            .map((week) => (
              <Tab label={week.week_name} key={week.id}>
                <TimeTableWeek week={week} levelId={id} />
              </Tab>
            ))}
        </Tabs>
      )}
      <PopupMolecule
        title="Filter weeks by date"
        open={isModalOpen}
        onClose={() => setisModalOpen(false)}>
        <div className="pt-2">
          <DateMolecule
            startYear={new Date().getFullYear() - 4}
            endYear={new Date().getFullYear() + 2}
            reverse={false}
            handleChange={handleChange}
            defaultValue={filterValues.startDate.toString()}
            name="startDate">
            Start Date
          </DateMolecule>

          <DateMolecule
            handleChange={handleChange}
            startYear={new Date().getFullYear() - 4}
            endYear={new Date().getFullYear() + 6}
            defaultValue={filterValues.endDate.toString()}
            reverse={false}
            name={'endDate'}>
            End Date
          </DateMolecule>
          <Button onClick={handleFilterWeeks}>Apply</Button>
        </div>
      </PopupMolecule>
      <Switch>
        <Route
          exact
          path={`${path}/new-week`}
          render={() => (
            <PopupMolecule title="New timetable week" open onClose={handleClose}>
              <NewWeek />
            </PopupMolecule>
          )}
        />
      </Switch>
    </div>
  );
}
