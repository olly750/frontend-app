import 'react-calendar/dist/Calendar.css';
import '../../styles/components/Molecules/timetable/calendar.css';

import React, { useState,useEffect } from 'react'; 
import toast from 'react-hot-toast';
import Calendar from 'react-calendar';
import { useTranslation } from 'react-i18next';
import { Link as BrowserLink, useHistory } from 'react-router-dom';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts';
import useAuthenticator from '../../hooks/useAuthenticator';
import { Student } from '../../types/services/user.types';
import { getStudentShipByUserId } from '../../store/administration/intake-program.store';

import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import TableHeader from '../../components/Molecules/table/TableHeader';
import usePickedRole from '../../hooks/usePickedRole';

import { getIntakeProgramsByStudent } from '../../store/administration/intake-program.store';

import { getIntakesByAcademy } from '../../store/administration/intake.store';
import { scheduleStore } from '../../store/timetable/calendar.store';
import { CommonCardDataType, Link } from '../../types';
import { IntakeStatus } from '../../types/services/intake.types';
import { formatCalendarEvents } from '../../utils/calendar';
import { StudentApproval } from '../../types/services/enrollment.types';
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

  const { user } = useAuthenticator();

  const { t } = useTranslation();
  const history = useHistory();

  const picked_role = usePickedRole();
 

  const [currrentUser, setUser] = useState<Student[]>();
  const userInfo = getStudentShipByUserId(user?.id.toString() || '').data?.data.data;


  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);



    const studentData = currrentUser?.map(item => item.id);
    const userData = currrentUser?.map(item => item?.user?.id);
    
    const filterStudentId = studentData && studentData.length ? studentData.join(', ') : '';
    const filterUserId = userData && userData.length ? userData.join(', ') : '';
    
   
  const loadesIntakes =
    getIntakesByAcademy(picked_role?.academy_id + '', false).data?.data.data.filter(
      (intake) => intake.intake_status === IntakeStatus.ONGOING,
    ) || [];
 


    


    //  console.log("loadesInstructorIntakes : ",loadesInstructorIntakes)
    let loadedInstrIntakes: IntakeCardType[] = [];       
      getIntakeProgramsByStudent(filterStudentId.toString()).data?.data.data.forEach(
        (intk) => {  
           if(intk.enrolment_status === StudentApproval.APPROVED){
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
        }
        }); 

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

          <div className="p-3 my-6">
            <Heading fontSize="lg" fontWeight="semibold" className="pb-3">
              Ongoing intakes
            </Heading>
            <div className="flex flex-wrap gap-8">
              {loadedInstrIntakes.map((intake) => (
                <CommonCardMolecule
                  key={intake.id}
                  data={intake}
                  // handleClick={() =>
                  //   history.push(`/dashboard/intakes/programs/${intake.id}`)
                  // }
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
