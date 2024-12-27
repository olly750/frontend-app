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
  getProgramCountsByAcademicId,
} from '../../store/administration/intake.store';
import { getInstructorByAcademyOrderedByRank } from '../../store/instructordeployment.store';
import { scheduleStore } from '../../store/timetable/calendar.store';
import { CommonCardDataType, Link } from '../../types';
import { IntakeStatus } from '../../types/services/intake.types';
import { ProgramIntakes } from '../../types/services/intake.types';
import { ActionsType } from '../../types/services/table.types';
import { formatCalendarEvents } from '../../utils/calendar';
import { formatDateLikeGoogle, removeSeconds } from '../../utils/date-helper';
import { advancedTypeChecker } from '../../utils/getOption';

const list: Link[] = [
  { to: 'home', title: 'home' },
  { to: 'dashboard', title: 'Academy' },
  { to: `admin`, title: 'dashboard' },
];
interface CourseNumbers
  extends Pick<ProgramIntakes, 'id' | 'course_name' | 'number_of_intakes'> {}

export default function AdminDashboard() {
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

  const programintakes =
    getProgramCountsByAcademicId(picked_role?.academy_id + '').data?.data.data || [];

  let programintakesnumber: CourseNumbers[] = [];
  let totalintakes = new Array();
  for (const i of programintakes) {
    // console.log(i);

    let obj = {
      id: i[1],
      course_name: i[2],
      number_of_intakes: i[0],
    };

    programintakesnumber.push(obj);
    totalintakes.push(i[0]);
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
  const malestudents = person?.filter((data) => data?.sex === 'MALE').length;
  const femalestudents = person?.filter((data) => data?.sex === 'FEMALE').length;
  const StudentsByGender = [
    { name: 'Male', value: malestudents },
    { name: 'Female', value: femalestudents },
  ];
  const mylist = [
    { name: 'male', value: 10 },
    { name: 'female', value: 8 },
  ];
  const mylist_Units = [
    { name: 'AIR FORCE', value: 5 },
    { name: 'MARINE', value: 5 },
    { name: 'Land Forces', value: 15 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const COLORS_Units = ['#0e3a35', '#1c5e55', '#0088FE'];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  console.log(actions);

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
            {/* <BrowserLink to={'/dashboard/divisions'}>
              <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
                <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                  Total {t('Faculty')}
                </Heading>
                <Heading className="pt-4" fontSize="sm" fontWeight="bold">
                  {faculties?.length}
                </Heading>
              </div>
            </BrowserLink> */}
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
            {/* <BrowserLink to={'/dashboard/divisions/departments'}>
              <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
                <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                  Total departments
                </Heading>
                <Heading className="pt-4" fontSize="sm" fontWeight="bold">
                  {departments?.length}
                </Heading>
              </div>
            </BrowserLink> */}
            {/* <BrowserLink to={'/dashboard/divisions'}>
              <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
                <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                  Total {t('Division')}
                </Heading>
                <Heading className="pt-4" fontSize="sm" fontWeight="bold">
                  {(departments?.length || 0) + (faculties?.length || 0)}
                </Heading>
              </div>
            </BrowserLink> */}

            <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
              <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                Student Gender
              </Heading>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={StudentsByGender}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    fill="#3367d6">
                    {StudentsByGender.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
              <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                Student Origin
              </Heading>
              {/* <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={mylist_Units}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    fill="#3367d6">
                    {mylist_Units.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS_Units[index % COLORS_Units.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer> */}
            </div>
            <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
              <Heading fontSize="sm" color="txt-secondary" fontWeight="medium">
                Foreign Students Countries
              </Heading>
              {/* <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={mylist}
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={70}
                    fill="#3367d6">
                    {mylist.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer> */}
            </div>
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

          {/* <div className="p-3 my-6">
            <Heading fontSize="lg" fontWeight="semibold" className="pb-3">
              Ongoing intakes
            </Heading>
            <div className="flex flex-wrap gap-2">
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
          </div> */}
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
