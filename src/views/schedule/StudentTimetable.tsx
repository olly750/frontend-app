import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useRouteMatch } from 'react-router-dom';
import useAuthenticator from '../../hooks/useAuthenticator';
import { Student } from '../../types/services/user.types';
import { getStudentShipByUserId } from '../../store/administration/intake-program.store';

import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import TableHeader from '../../components/Molecules/table/TableHeader';
import TimeTableWeek from '../../components/Organisms/schedule/timetable/TimeTableWeek';
import enrollmentStore from '../../store/administration/enrollment.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { timetableStore } from '../../store/timetable/timetable.store';
import { ParamType, Privileges, SelectData, ValueType } from '../../types'; 
import { formatDateToYyMmDd } from '../../utils/date-helper';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../utils/utils';
import { ITimeTableWeekInfo } from '../../types/services/schedule.types';

function StudentTimetable() {
  // const { id } = useParams<ParamType>();
  const [selectedLevel, setSelectedLevel] = useState('');
  const { search } = useLocation();
  const forceReload = new URLSearchParams(search).get('forceReload') || '';
  const { url } = useRouteMatch(); 
  const { user } = useAuthenticator();


 

  const list = [
    { to: '/dashboard/main', title: 'Dashboard' },
    { to: `${url}`, title: 'assignment' },
  ];
 

  
  const [currrentUser, setUser] = useState<Student[]>();
  const userInfo = getStudentShipByUserId(user?.id.toString() || '').data?.data.data;


  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);



    const studentData = currrentUser?.map(item => item.id);
    const userData = currrentUser?.map(item => item?.user?.id);
    
    const filterStudentId = studentData && studentData.length ? studentData.join(', ') : '';


 
  const { data: studentLevels, isLoading: levelLoading } = enrollmentStore.getSimplifiedStudentLevelEnrolments(filterStudentId || '');

  const studentLevelToDisplay = studentLevels?.data.data.map((lv: any) => {
    return {
      value: lv.academicYearProgramLevelId,
      label: `${lv.academicYearProgramLevelAcademicYearName} (${lv.academicYearProgramLevelAcademicProgramLevelLevelName}) / ${lv.academicYearProgramLevelAcademicYearName}`,
    };
  }) as SelectData[];

  function handleChange(e: ValueType) {
    setSelectedLevel(e.value + '');
  }

  const [weeks, setweeks] = useState<ITimeTableWeekInfo[]>([]);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [filterValues, setfilterValues] = useState({
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  });

  const levelInfo = intakeProgramStore.getIntakeLevelById(selectedLevel).data?.data.data;
  const { data, isLoading } = timetableStore.getWeeksByIntakeLevel(selectedLevel);
  
 
  let wks:any[] = [];
  data?.data.data.forEach(
    (wk) => { 
      if(wk.status === 'CONFIRMED'){
      
      let confirmedweeks = {
        academic_program_intake_level:wk?.academic_program_intake_level,
        activities:wk?.activities,
        created_at: wk?.created_on,
        created_by: wk?.created_by_id,
        end_date: wk?.end_date,
        id: wk?.id,
        start_date: wk?.start_date,
        status: wk?.status, 
        updated_by: wk?.updated_by_id,
        week_name: wk?.week_name

      }
      wks.push(confirmedweeks)
    } 
      
    }); 
  
  useEffect(() => { 
    if (data?.data.data) setweeks(wks); 
   
  }, [data?.data.data]);

  return (
    <>
      <section>
        <BreadCrumb list={list} />
      </section>
      <TableHeader showSearch={false} showBadge={false} title="Course Timetable" />

      {levelLoading ? (
        <Loader />
      ) : studentLevels?.data.data.length == 0 ? (
        <NoDataAvailable
          icon="level"
          showButton={false}
          title={'You have not been enrolled in any level yet'}
          description="Dear student, please contact the admin so as to get enrolled as soon as possible"
        />
      ) : (
        <>
          <SelectMolecule
            className="px-6"
            width="2/5"
            handleChange={handleChange}
            name={'levelId'}
            placeholder="Select course"
            value={selectedLevel}
            options={studentLevelToDisplay}
          />
      {isLoading ? (
        <Loader />
      ) : weeks?.length === 0 ? (
        <NoDataAvailable
          title={'No current timetable'}
          description={
            'There is no approved timetable week available for this week.'
          } 
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
                <TimeTableWeek week={week} levelId={selectedLevel} />
              </Tab>
            ))}
        </Tabs>
      )} 
        </>
      )}
    </>
  );
}

export default StudentTimetable;
