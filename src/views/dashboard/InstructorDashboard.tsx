import 'react-calendar/dist/Calendar.css';
import '../../styles/components/Molecules/timetable/calendar.css';

import React, { useState,useEffect } from 'react'; 
import toast from 'react-hot-toast';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { Link as BrowserLink, useHistory } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';

import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import TableHeader from '../../components/Molecules/table/TableHeader';
import usePickedRole from '../../hooks/usePickedRole';
import { getInstructorIntakePrograms } from '../../store/administration/enrollment.store';
import { divisionStore } from '../../store/administration/divisions.store';
import { getStudentsByAcademyOrderedByRank } from '../../store/administration/enrollment.store';
import { getIntakesByAcademy } from '../../store/administration/intake.store';
import { getInstructorByAcademyOrderedByRank } from '../../store/instructordeployment.store';
import { scheduleStore } from '../../store/timetable/calendar.store';
import { CommonCardDataType, Link } from '../../types';
import { IntakeStatus } from '../../types/services/intake.types';
import { formatCalendarEvents } from '../../utils/calendar';
import { formatDateLikeGoogle, removeSeconds } from '../../utils/date-helper';
import { advancedTypeChecker } from '../../utils/getOption';

import { getLocalStorageData } from '../../utils/getLocalStorageItem'; 
import { getObjectFromLocalStrg } from '../../utils/utils';

const list: Link[] = [
  { to: 'home', title: 'home' },
  { to: 'dashboard', title: 'Academy' },
  { to: `admin`, title: 'dashboard' },
];

interface IntakeCardType extends CommonCardDataType {
  registrationControlId: string;
}
export default function InstructorDashboard() {
  const [scheduleDate, setscheduleDate] = useState(new Date());
  const [instructorIntakes, setInstructorIntakes] = useState<IntakeCardType[]>([]);


  const { t } = useTranslation();
  const history = useHistory();

  const picked_role = usePickedRole();

  const instructorInfo = getObjectFromLocalStrg(getLocalStorageData('instructorInfo'));

 
   
  const loadesIntakes =
    getIntakesByAcademy(picked_role?.academy_id + '', false).data?.data.data.filter(
      (intake) => intake.intake_status === IntakeStatus.ONGOING,
    ) || [];
 




    //  console.log("loadesInstructorIntakes : ",loadesInstructorIntakes)
    let loadedInstrIntakes: IntakeCardType[] = [];       
      getInstructorIntakePrograms(instructorInfo?.id.toString()).data?.data.data.forEach(
        (intk) => { 
          if(intk.intake_program.intake.intake_status === IntakeStatus.ONGOING){
          
          let prog: IntakeCardType = {
            id: intk.intake_program.intake.id,
            status: {
              type: advancedTypeChecker(intk.intake_program.intake.intake_status),
              text: intk.intake_program.intake.intake_status.toString(),
            },
            code: intk.intake_program.intake.title,
            title: intk.intake_program.intake.title,
            description: intk.intake_program.intake.description,
            footerTitle: intk.intake_program.intake.total_num_students,
            registrationControlId: intk.intake_program.intake.registration_control?.id + '',

          }
          loadedInstrIntakes.push(prog)
        }
     
          
        }); 

    // console.log("admin",loadesIntakes)
    const {
      isSuccess: instructorIntakeSuccess,
      isError: instructorIntakeError,
      data: instructorIntakesData,
      isLoading: instructorIntakeLoading,
    } = getInstructorIntakePrograms(instructorInfo?.id.toString() || '');

    // console.log("instructor id : ",instructorInfo?.id)
     



    useEffect(() => {
      let loadedIntakes: IntakeCardType[] = [];
      if (instructorIntakeSuccess && instructorIntakesData?.data) {
        instructorIntakesData?.data.data.forEach((intk) => {
          // console.log("instructor",intk.intake_program.intake)
          let prog: IntakeCardType = {
            id: intk.intake_program.intake.id,
            status: {
              type: advancedTypeChecker(intk.intake_program.intake.intake_status),
              text: intk.intake_program.intake.intake_status.toString(),
            },
            code: intk.intake_program.intake.title,
            title: intk.intake_program.intake.title,
            description: intk.intake_program.intake.description,
            footerTitle: intk.intake_program.intake.total_num_students,
            registrationControlId: intk.intake_program.intake.registration_control?.id + '',
          };

          let intakes = {
            id: intk.intake_program.intake.id,
            code: intk.intake_program.intake.title,

          }
          if (!loadedIntakes.find((pg) => pg.id === prog.id)?.id) {
            loadedIntakes.push(prog);
          }
        });
        setInstructorIntakes(loadedIntakes);
      } else if (instructorIntakeError)
        toast.error('error occurred when loading instructor intakes');
    }, [
      instructorIntakeError,
      instructorIntakeSuccess,
      instructorIntakesData?.data,
      instructorIntakesData?.data.data,
    ]);





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
 
  
 

  return (
    <div className="py-2">
      <BreadCrumb list={list} />
      <TableHeader title="Dashboard" showBadge={false} showSearch={false} />

      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3">
          {/* <div className="grid grid-cols-3 gap-5"> 
 
            <div className="bg-main shadow-sm rounded-lg p-6 hover:border cursor-pointer">
        
            </div>
          </div> */}
       

          <div className="p-3 my-6">
            <Heading fontSize="lg" fontWeight="semibold" className="pb-3">
              Ongoing intakes
            </Heading>
            <div className="flex flex-wrap gap-2">
              {loadedInstrIntakes.map((intake) => (
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
        </div>
      </div>
    </div>
  );
}
