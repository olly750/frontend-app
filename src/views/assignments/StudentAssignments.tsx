
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useRouteMatch } from 'react-router-dom'; 
import useAuthenticator from '../../hooks/useAuthenticator';
import Loader from '../../components/Atoms/custom/Loader';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import TableHeader from '../../components/Molecules/table/TableHeader';
import enrollmentStore from '../../store/administration/enrollment.store';
import { SelectData, ValueType } from '../../types';
import { Student } from '../../types/services/user.types';

import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../utils/utils';
import intakeProgramStore from '../../store/administration/intake-program.store';
import Accordion from "../../components/Molecules/Accordion" 
import Panel from '../../components/Atoms/custom/Panel';
import Evaluations from './Evaluations'
import Assignments from './index'
import { getStudentShipByUserId } from '../../store/administration/intake-program.store';
 
 

function StudentAssignments() { 

  const [selectedLevel, setSelectedLevel] = useState<string>(() => {
    return localStorage.getItem('currentStudentLevel') || '';
  }); 
  const [selectedPeriod, setSelectedPeriod] = useState<string>(() => {
    return localStorage.getItem('currentLevelPeriod') || '';
  }); 



  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuthenticator();
  const { search } = useLocation();
  const forceReload = new URLSearchParams(search).get('forceReload') || '';
  const { url } = useRouteMatch();

 

  const [currrentUser, setUser] = useState<Student[]>();


  const userInfo = getStudentShipByUserId(user?.id.toString() || '').data?.data.data;


    useEffect(() => {
      setUser(userInfo);
    }, [userInfo]);
 


      const studentData = currrentUser?.map(item => item.id);
      const userData = currrentUser?.map(item => item?.user?.id);

      const filterStudentId = studentData && studentData.length ? studentData.join(', ') : '';
      const filterUserId = userData && userData.length ? userData.join(', ') : '';
 
  const { data: studentLevels, isLoading: levelLoading } = enrollmentStore.getSimplifiedStudentLevelEnrolments(filterStudentId || '');

  const studentLevelToDisplay = studentLevels?.data.data.map((lv: any) => {
    return {
      value: lv.academicYearProgramLevelId,
      label: `${lv.academicYearProgramLevelAcademicYearName} (${lv.academicYearProgramLevelAcademicProgramLevelLevelName}) / ${lv.academicYearProgramLevelAcademicYearName}`,
    };
  }) as SelectData[];

  let levelId = selectedLevel as unknown as number;
  const { data: period } = intakeProgramStore.getPeriodsByLevel(+levelId);
  

  const [subjectEvaluations, setSubjectEvaluations] = useState<any>({});
  const [subIsLoading, setSubIsLoading] = useState<boolean>(false);
  const [isSuccesssub, setIsSuccessSub] = useState<boolean>(false);



  let newPeriod: any[]= [];
  period?.data.data.forEach((mod) => {
    newPeriod.push({
       id: mod.id,
       name: mod.academic_period.name
       },)
  });

  const periodToDisplay = newPeriod.map((lv) => {
    return {
      value: lv.id,
      label: lv.name,
    };
  }) as SelectData[];
 
  const [termIsSelected, setTermIsSelected] = useState<boolean>(false);

 
  function handleChangeLevel(e: ValueType) {
    setTermIsSelected(false)
    setSelectedLevel(e.value + '');
    localStorage.setItem('currentStudentLevel', e.value + '');
  }

  function handleChangePeriod(e: ValueType) {
    setSelectedPeriod(e.value + '');
    localStorage.setItem('currentLevelPeriod', e.value + '');
  }
  
  useEffect(() => {
    if (selectedPeriod !== '') {
      setTermIsSelected(true); 
    }
  }, [selectedPeriod]);
  
  
 
 
  return (
    <>
      <section>
        <BreadCrumb list={[{ to: '/dashboard/main', title: 'Dashboard' }, { to: `${url}`, title: 'assignment' }]} />
      </section>
      <TableHeader showSearch={false} showBadge={false} title="Assignments" />

      {levelLoading ? (
        <Loader />
      ) : studentLevels?.data.data.length === 0 ? (
        <NoDataAvailable
          icon="level"
          showButton={false}
          title={'You have not been enrolled in any level yet'}
          description="Dear student, please contact the admin so as to get enrolled as soon as possible"
        />
      ) : (
        <>
          <div className="flex ">
            <SelectMolecule
              className="px-2 w-96"
              width="5/5"
              handleChange={handleChangeLevel}
              name={'levelId'}
              placeholder="Select intake program"
              value={selectedLevel}
              options={studentLevelToDisplay}
            />
            {selectedLevel && period?.data.data.length === 0 ? (
              <p>No Term found for the selected level</p>
            ) : (
              <SelectMolecule
              className="px-2"
              width="5/5"
              handleChange={handleChangePeriod}
              name={'periodId'}
              placeholder="Select term"
              value={selectedPeriod}
              options={periodToDisplay}
            /> 
            )}
          </div>
          <main className="px-4 ">  
          <>
                     {!termIsSelected  ?(
                        <NoDataAvailable
                            showButton={false}
                            title={'Evaluation dashboard'}
                            description="Please select intake program and term to track your assignment"
                          />):null}
               {termIsSelected &&  <Assignments  selectedPeriod={selectedPeriod} studentInfoId={filterUserId} />}

          </>
          </main>

        </>
      )}
    </>
  );
}

export default StudentAssignments;