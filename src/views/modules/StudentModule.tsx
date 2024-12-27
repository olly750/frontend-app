import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useRouteMatch } from 'react-router-dom';
import useAuthenticator from '../../hooks/useAuthenticator';
import { Student } from '../../types/services/user.types';
import { getStudentShipByUserId } from '../../store/administration/intake-program.store';
import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import TableHeader from '../../components/Molecules/table/TableHeader';
import enrollmentStore from '../../store/administration/enrollment.store';
import { SelectData, ValueType } from '../../types'; 
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../utils/utils';
import Modules from '.';

function StudentModule() {
  const [selectedLevel, setSelectedLevel] = useState('');
  const { search } = useLocation();
  const { user } = useAuthenticator();
  const forceReload = new URLSearchParams(search).get('forceReload') || '';
  const { url } = useRouteMatch();
  const list = [
    { to: '/dashboard/student', title: 'Dashboard' },
    { to: `${url}`, title: 'module' },
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

  useEffect(() => {
    if (forceReload === 'true') {
      toast.error(
        'The exam was auto submitted because you tried to exit full screen or changed tab',
        { duration: 30000 },
      );

      setTimeout(() => {
        window.location.href = '/dashboard/student';
      }, 30000);
    }
  }, [forceReload]);

  return (
    <>
      <section>
        <BreadCrumb list={list} />
      </section>
      <TableHeader showSearch={false} showBadge={false} title="Enrolled Modules" />

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
            placeholder="Select Level"
            value={selectedLevel}
            options={studentLevelToDisplay}
          />
          <Modules level={selectedLevel} key={selectedLevel} />
        </>
      )}
    </>
  );
}

export default StudentModule;
