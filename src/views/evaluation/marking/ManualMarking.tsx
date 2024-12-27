import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import Badge from '../../../components/Atoms/custom/Badge';
import Loader from '../../../components/Atoms/custom/Loader';
import Heading from '../../../components/Atoms/Text/Heading';
import NoDataAvailable from '../../../components/Molecules/cards/NoDataAvailable';
import InputMolecule from '../../../components/Molecules/input/InputMolecule';
import SelectMolecule from '../../../components/Molecules/input/SelectMolecule';
import { statusColors } from '../../../global/global-vars';
import { useClasses } from '../../../hooks/useClasses';
import { getStudentsByClass } from '../../../store/administration/class.store';
import  * as  markingStore  from '../../../store/administration/marking.store';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { Color, Status, ValueType } from '../../../types';
import { StudentsInClass } from '../../../types/services/class.types';
import { IEvaluationStatus } from '../../../types/services/evaluation.types';
import { IManualMarking } from '../../../types/services/marking.types';

type PropsType = {
  evaluationId: string;
};

export default function ManualMarking({ evaluationId }: PropsType) {
  const [currentClassId, setCurrentClassId] = useState<string>('');
  const [students, setStudents] = useState<IManualMarking[]>([]);
  const [finalStudents, setFinalStudents] = useState<StudentsInClass[]>([]);
  const [rankedStudents, setRankedStudents] = useState<StudentsInClass[]>([]);
  const [unrankedStudents, setUnrankedStudents] = useState<StudentsInClass[]>([]);

  type FreshData = {
    firstName: string;
    lastName: string;
    rank: string;
    marks: number;
    student_id: string;
    evaluationId: string;
    status: string;
    outOf: string;
  };

  const [freshData, setFreshData] = useState<FreshData[]>([]);

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationById(evaluationId).data?.data || {};

  const { data: studentsData, isLoading } = getStudentsByClass(currentClassId) || [];

  useEffect(() => {
    setRankedStudents(
      studentsData?.data.data.filter((stud) => stud.student.user.person?.current_rank) ||
        [],
    );
  }, [studentsData?.data.data]);

  useEffect(() => {
    setUnrankedStudents(
      studentsData?.data.data.filter(
        (inst) => inst !== rankedStudents.find((ranked) => ranked.id === inst.id),
      ) || [],
    );
  }, [rankedStudents, studentsData?.data.data]);

  rankedStudents.sort(function (a, b) {
    if (a.student.user.person && b.student.user.person) {
      return (
        a.student.user.person.current_rank?.priority -
        b.student.user.person.current_rank?.priority
      );
    } else {
      return 0;
    }
  });

  const { data: manualMarkingData } = markingStore.getManualMarkingMarks(
    evaluationId,
    currentClassId,
  );

  const [classes, setclasses] = useState(
    evaluationInfo?.intake_level_class_ids.split(','),
  );
  const { t } = useTranslation();
  const { mutate } = markingStore.manualMarking();

  function handleClassChange(e: ValueType) {
    setCurrentClassId(e.value.toString());
  }

  function handleMarksChange(e: ValueType, id: string) {
    if (freshData.length > 0) {
      let studentsClone = [...freshData];
      let studentMarkIndex = freshData.findIndex((student) => student.student_id === id);

      if (
        evaluationInfo &&
        parseFloat(e.value.toString()) <= evaluationInfo?.total_mark
      ) {
        //  = parseFloat(e.value.toString()) || 0;
        // setStudents([...studentsClone, studentMark]);
        // studentsClone[studentMark].mark = parseFloat(e.value.toString()) || 0;
        const newstudent = {
          ...studentsClone[studentMarkIndex],
          marks: parseFloat(e.value.toString()) || 0,
        };

        studentsClone[studentMarkIndex] = newstudent;
        setFreshData(studentsClone);
      }
      if (evaluationInfo && e.value > evaluationInfo?.total_mark) {
        toast.error('Marks cannot be greater than total mark', { duration: 1000 });
      }
    }
  }

  function handleSubmit(studentId: string) {
    const studentInfo = freshData.find((student) => studentId === student.student_id);

    const data = {
      marks: studentInfo?.marks,
      evaluation_id: studentInfo?.evaluationId,
      student_id: studentInfo?.student_id,
    };

    if (
      studentInfo &&
      data &&
      evaluationInfo &&
      data.marks &&
      data.marks <= evaluationInfo?.total_mark
    ) {
      mutate(data as IManualMarking, {
        onSuccess: () => {
          // queryClient.invalidateQueries(['class/students', evaluationId, currentClassId]);
          toast.success('Marked');
        },
        onError: (error: any) => {
          toast.error(error.response.data.message);
        },
      });
    }
  }

  useEffect(() => {
    setFinalStudents(rankedStudents.concat(unrankedStudents));
  }, [rankedStudents, unrankedStudents]);

  useEffect(() => {
    setclasses(evaluationInfo?.intake_level_class_ids.split(',') || ['']);
  }, [evaluationInfo?.intake_level_class_ids]);

  useEffect(() => {
    classes && setCurrentClassId(classes[0]);
  }, [classes]);

  useEffect(() => {
    let newState: IManualMarking[] = [];

    if (manualMarkingData && manualMarkingData?.data.data.length > 0) {
      newState =
        manualMarkingData?.data.data.map((mark) => ({
          student_id: mark.student.admin_id,
          evaluation_id: evaluationInfo?.id || '',
          marks: mark.obtained_mark,
          marking_status: mark.marking_status,
        })) || [];
    } else {
      newState =
        finalStudents.map((std) => ({
          student_id: std.student.id.toString(),
          evaluation_id: evaluationInfo?.id || '',
          marking_status: IEvaluationStatus.UNMARKED,
          marks: 0,
        })) || [];
    }
    setStudents(newState);
  }, [evaluationInfo?.id, finalStudents, manualMarkingData]);

  //   console.log(students);

  //   useEffect(() => {
  //     let tempStuds: UserTypes[] = [];
  //     studentsData?.data.data.forEach((stud) => {
  //       tempStuds.push({
  //         id: stud.id.toString(),
  //         username: stud.student.user.username,
  //         firstname: stud.student.user.first_name,
  //         lastName: stud.student.user.last_name,
  //       });
  //     });
  //     setStudents(tempStuds);
  //   }, [studentsData?.data.data]);

  useEffect(() => {
    const newArray: FreshData[] = [];
    finalStudents.forEach((element) => {
      const studWithMarks = students.find(
        (student) => student.student_id == element.student.id,
      );

      if (studWithMarks?.student_id) {
        newArray.push({
          firstName: element?.student.user.first_name,
          lastName: element?.student.user.last_name,
          rank: element?.student.user.person?.current_rank?.name || '',
          marks: studWithMarks?.marks,
          student_id: element?.student.id + '',
          evaluationId: evaluationId,
          status: studWithMarks?.marking_status + '',
          outOf: evaluationInfo?.total_mark + '',
        });
      }
    });

    setFreshData(newArray);
  }, [evaluationId, evaluationInfo?.total_mark, finalStudents, students]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Heading fontWeight="medium" fontSize="sm">
          Select {t('Class')}
        </Heading>
        <SelectMolecule
          width="80"
          className=""
          value={currentClassId}
          handleChange={handleClassChange}
          name={'type'}
          placeholder={'Select ' + t('Class')}
          options={classes?.map((cl) => useClasses(cl)) || []}
        />
      </div>

      {/* {classes.map((cl, index) => (
        <EvaluationClasses
          key={cl}
          classId={cl}
          isLast={index === classes.length - 1}
          handleChange={handleClassChange}
        />
      ))} */}
      {isLoading && <Loader />}
      {!isLoading && !currentClassId && (
        <NoDataAvailable
          title={'No selected ' + t('Class')}
          description={'Select ' + t('Class') + ' to view '}
        />
      )}
      {freshData && currentClassId && !isLoading && (
        <div>
          {freshData.length <= 0 ? (
            <NoDataAvailable
              showButton={false}
              icon="user"
              buttonLabel="Add new student"
              title={'No students available'}
              description="It looks like there aren't any students who are not marked for this evaluation"
            />
          ) : (
            <table className="table-auto border-collapse font-medium bg-main w-2/3">
              <thead>
                <tr className="text-left text-txt-secondary border-b border-silver">
                  <th className="px-4 py-5 text-sm font-semibold">Rank</th>
                  <th className="px-4 py-5 text-sm font-semibold">First name</th>
                  <th className="px-4 py-5 text-sm font-semibold">Last name</th>
                  <th className="px-4 py-5 text-sm font-semibold">Obtained</th>
                  <th className="px-4 py-5 text-sm font-semibold">Out&nbsp;of</th>
                  <th className="px-4 py-5 text-sm font-semibold">Status</th>
                </tr>
              </thead>

              <tbody>
                {freshData.map((stud) => (
                  <tr key={stud.student_id}>
                    <td className="px-4 py-5 text-sm font-semibold">{stud.rank || ''}</td>
                    <td className="px-4 py-5 text-sm font-semibold">{stud.firstName}</td>
                    <td className="px-4 py-5 text-sm font-semibold">{stud.lastName}</td>
                    <td className="px-4 py-5 text-sm font-semibold">
                      <InputMolecule
                        name="marks"
                        style={{ width: '4rem', height: '2.5rem' }}
                        value={stud.marks}
                        handleChange={(e) => handleMarksChange(e, stud.student_id)}
                        onBlur={() => handleSubmit(stud.student_id)}
                      />
                    </td>
                    <td className="px-4 py-5 text-sm font-semibold">
                      {evaluationInfo?.total_mark}
                    </td>
                    <td className="px-4 py-5 text-sm font-semibold">
                      <Badge
                        className="cursor-pointer"
                        badgecolor={
                          statusColors[stud?.status.toLowerCase() as Status] as Color
                        }
                        badgetxtcolor={
                          statusColors[stud?.status.toLowerCase() as Status] as Color
                        }>
                        {stud?.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
