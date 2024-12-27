import 'react-calendar/dist/Calendar.css';
import '../../styles/components/Molecules/timetable/calendar.css';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import {
  Link as BrowserLink,
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import Table from '../../components/Molecules/table/Table';
import TableHeader from '../../components/Molecules/table/TableHeader';
import usePickedRole from '../../hooks/usePickedRole';
import { divisionStore } from '../../store/administration/divisions.store';
import { getStudentsByAcademyOrderedByRank } from '../../store/administration/enrollment.store';
import {
  getIntakesByAcademy,
  getProgramCounts,
} from '../../store/administration/intake.store';
import { getInstructorByAcademyOrderedByRank } from '../../store/instructordeployment.store';
import { scheduleStore } from '../../store/timetable/calendar.store';
import { CommonCardDataType, Link } from '../../types';
import { IntakeStatus, ProgramIntakes } from '../../types/services/intake.types';
import { ActionsType } from '../../types/services/table.types';
import { formatCalendarEvents } from '../../utils/calendar';
import { formatDateLikeGoogle, removeSeconds } from '../../utils/date-helper';
import { advancedTypeChecker } from '../../utils/getOption';
import IntakesDashBoard from './Intakes';

const list: Link[] = [
  { to: 'home', title: 'home' },
  { to: 'dashboard', title: 'Academy' },
  { to: `admin`, title: 'dashboard' },
];
interface CourseNumbers
  extends Pick<ProgramIntakes, 'id' | 'course_name' | 'number_of_intakes'> {}

export default function InstitutionDasboard() {
  const [scheduleDate, setscheduleDate] = useState(new Date());
  const { t } = useTranslation();
  const { url, path } = useRouteMatch();
  const history = useHistory();
  const [prop, setProg] = useState<any>('');
  const picked_role = usePickedRole();
  let actions: ActionsType<CourseNumbers>[] | undefined = [];

  const students =
    getStudentsByAcademyOrderedByRank(picked_role?.academy_id + '', {
      page: 0,
      pageSize: 100000000,
      sortyBy: 'createdOn',
    }).data?.data.data.content || [];

  const instructors =
    getInstructorByAcademyOrderedByRank(picked_role?.academy_id + '', {
      page: 0,
      pageSize: 100000000,
      sortyBy: 'createdOn',
    }).data?.data.data.content || [];

  // const { data: stats } = getDepartmentStatsByAcademy(picked_role?.academy_id + '');

  const departments =
    divisionStore.getDivisionsByAcademy('DEPARTMENT', picked_role?.academy_id + '').data
      ?.data.data || [];

  const faculties =
    divisionStore.getDivisionsByAcademy('FACULTY', picked_role?.academy_id + '').data
      ?.data.data || [];

  const loadesIntakes =
    getIntakesByAcademy(picked_role?.academy_id + '', false).data?.data.data.filter(
      (intake) => intake.intake_status === IntakeStatus.ONGOING,
    ) || [];

  const programintakes = getProgramCounts().data?.data.data || [];

  let programintakesnumber: CourseNumbers[] = [];
  let totalintakes = new Array();
  for (const i of programintakes) {
    // console.log(i);

    let obj = {
      id: i[1],
      course_name: i[2],
      number_of_intakes: i[1],
    };

    programintakesnumber.push(obj);
    totalintakes.push(i[1]);
  }
  

  const taotalintakes = totalintakes.reduce((accumulator, value) => {
    return accumulator + value;
  }, 0);

  actions?.push({
    name: 'View Program intakes',
    handleAction: (id: string | number | undefined) => {
      console.log(id);
      setProg(id);
      history.push(`${path}/${id}/view`); // go to edit level
    },
  });

  const intakes: CommonCardDataType[] = loadesIntakes.map((intake) => ({
    code: intake.title.toUpperCase(),
    description: `${intake.expected_start_date.toString().split(' ')[0]} - ${
      intake.expected_end_date.toString().split(' ')[0]
    }`,
    title: intake.description || ``,
    status: {
      type: advancedTypeChecker(intake.intake_status),
      text: intake.intake_status.toString(),
    },
    date: intake.expected_start_date,
    id: intake.id,
  }));

  const handleScheduleDate = (date: Date) => {
    setscheduleDate(date);
  };

  const schedules = formatCalendarEvents(
    scheduleStore.getAllSchedules().data?.data.data || [],
  )
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .slice(0, 3); //.filter((schedule) => schedule.start.getTime() >= scheduleDate.getTime());
  const person = [];
  const studentUser = students.map((stud) => stud.user);
  for (const i in studentUser) {
    person.push(studentUser[i].person);
  }




  

  return (
    <div className="py-2">
      {/* <Switch></Switch> */}
      <BreadCrumb list={list} />
      <TableHeader title="Dashboard" showBadge={false} showSearch={false} />

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          <div className="grid grid-cols-3 gap-5">
            <BrowserLink to={'/dashboard/users'}>
              <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
                <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                  Total students
                </Heading>
                <Heading className="pt-4" fontSize="sm" fontWeight="bold">
                  {students.length}
                  <br />
                  {/* {gender.filter((gend) => gend.sex === 'MALE').length}' Male and  {gender.filter((gend) => gend.sex === 'FEMALE').length}' Female */}
                </Heading>
              </div>
            </BrowserLink>
            <BrowserLink to={'/dashboard/users/instructors'}>
              <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
                <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                  Total {t('Instructor')}
                </Heading>
                <Heading className="pt-4" fontSize="sm" fontWeight="bold">
                  {instructors.length}
                </Heading>
              </div>
            </BrowserLink>
   
            <BrowserLink to={'/dashboard/intakes'}>
              <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
                <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                  Total intakes
                </Heading>
                <Heading className="pt-4" fontSize="sm" fontWeight="bold">
                  {taotalintakes}
                </Heading>
              </div>
            </BrowserLink>
          </div>
          <div className="p-3 my-6">
            <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
              <Heading fontSize="lg" fontWeight="semibold" className="pb-3">
                Hosted Courses
              </Heading>
              <section>
                {programintakesnumber && programintakesnumber?.length > 0 ? (
                  <Table<CourseNumbers>
                    statusColumn="status"
                    data={programintakesnumber}
                    uniqueCol={'id'}
                    hide={['id']}
                    actions={actions}
                  />
                ) : null}
              </section>
            </div>
          </div>

        </div>
        <div className="col-span-2 p-3">
          <Heading fontSize="lg" className="pb-3" fontWeight="semibold">
            Calendar
          </Heading>
          <Calendar onChange={handleScheduleDate} value={scheduleDate} />
          <div className="py-3">
            <Heading fontSize="lg" fontWeight="semibold">
              Schedule
            </Heading>
            {schedules.map((schedule) => (
              <div className="my-2 w-full flex" key={schedule.id}>
                <div className="bg-primary-500 rounded-l-lg text-white p-6">
                  <p className="text-sm font-medium">
                    {formatDateLikeGoogle(schedule.start.toString()).split(' ')[1]}
                  </p>
                  <p className="text-sm font-medium">
                    {formatDateLikeGoogle(new Date().toLocaleDateString()).split(' ')[0]}
                  </p>
                </div>
                <div className="bg-gray-50 w-full py-5">
                  <p className="text-gray-400 text-sm font-medium px-4">
                    {`${removeSeconds(
                      new Date(schedule.start).toLocaleTimeString(),
                    )} -${removeSeconds(new Date(schedule.end).toLocaleTimeString())}`}
                  </p>
                  <div className="pt-2 text-sm font-medium px-4 capitalize">
                    {schedule.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Heading fontSize="lg" fontWeight="semibold" className="pb-3">
            Ongoing intakes
          </Heading>
          <div className="flex flex-wrap gap-2 p-3">
            {intakes.map((intake) => (
              <CommonCardMolecule
                key={intake.id}
                data={intake}
                handleClick={() =>
                  history.push(`/dashboard/intakes/programs/${intake.id}`)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
