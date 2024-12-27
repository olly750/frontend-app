import React, { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import { enrollmentService } from '../../../../services/administration/enrollments.service';
import enrollmentStore from '../../../../store/administration/enrollment.store';
import intakeProgramStore from '../../../../store/administration/intake-program.store';
import { evaluationStore } from '../../../../store/evaluation/evaluation.store';
import { SelectData, ValueType } from '../../../../types';
import {
  IEvaluationSectionBased,
  IEvaluationStatus,
} from '../../../../types/services/evaluation.types';
import Button from '../../../Atoms/custom/Button';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

// type SubjectProps = {
//   id: string;
//   evaluation_id: string;
//   instructor_subject_assignment: string;
//   intake_program_level_module: string;
//   marker_id: string;
//   number_of_questions: number;
//   questionaire_setting_status: IEvaluationStatus | '';
//   section_name: string;
//   section_total_marks: number;
//   subject_academic_year_period: string;
  
// };

export default function EditEvaluationSection({
  selectedEditId,
  evaluationId,
}: {
  selectedEditId: string;
  evaluationId: string;
}) {
  const history = useHistory();
  const { mutate: updateSection, isLoading: updateTimeLoader } =
    evaluationStore.updateEvaluationSection();

  const [evaluationSectionInfo, setFormState] = useState<IEvaluationSectionBased>({
    id: '',
    evaluation_id: '',
    instructor_subject_assignment: '',
    intake_program_level_module: '',
    marker_id: '',
    number_of_questions: 0,
    questionaire_setting_status: IEvaluationStatus.PENDING,
    section_name: '',
    section_total_marks: 0,
    subject_academic_year_period: '',
  });

  const { data: evaluationInfo, isLoading: evaluationLoading } =
    evaluationStore.getEvaluationModuleSubjectById(selectedEditId ?? '');

  // const { data: instructorsProgram, isLoading: instLoading } =
  // intakeProgramStore.getInstructorsByIntakeProgram("78d7f9fb-70e4-4a20-bc95-e574f4d77c9e");

  // console.log("evaluationInfo",evaluationInfo)
  const subAcademicYearPeriod: any =  evaluationSectionInfo.subject_academic_year_period;
  const { data: instructorInfos, isLoading } =  enrollmentStore.getInstructorsBySubject(subAcademicYearPeriod || '');
  let instrs: any[] = [];

  const rankedInstructors =
    instructorInfos?.data.data.filter((inst) => inst.user.person?.current_rank) || [];
  const unrankedInstructors =
    instructorInfos?.data.data.filter(
      (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
    ) || [];

  rankedInstructors.sort(function (a, b) {
    if (a.user.person && b.user.person) {
      return a.user.person.current_rank?.priority - b.user.person.current_rank?.priority;
    } else {
      return 0;
    }
  });

  const finalInstructors = rankedInstructors.concat(unrankedInstructors);

  finalInstructors.map((obj) => {
    let {
      id,
      username,
      first_name,
      last_name,
      email,
      person,
      academy,
      generic_status,
      user_type,
    } = obj.user;

    let user: any = {
      id: id,
      rank: person?.current_rank?.abbreviation,
      username: username,
      first_name: first_name,
      last_name: last_name,
      email: email,
      'ID Card': person?.nid || '',
      academy: academy && academy.name,
      status: generic_status,
      user_type: user_type,
      alias_last_name: undefined,
      alias_first_name: undefined,
    };

    instrs.push(user);
  });

  useEffect(() => {
    if (evaluationInfo && evaluationInfo.data) {
      const evaluationData = evaluationInfo.data.data;

      setFormState({
        id: evaluationData.id,
        section_name: evaluationData.section_name,
        evaluation_id: evaluationId,
        instructor_subject_assignment: evaluationData.instructor_subject_assignment,
        intake_program_level_module: evaluationData.intake_program_level_module,
        marker_id: evaluationData.marker?.adminId || '',
        number_of_questions: evaluationData.number_of_questions,
        questionaire_setting_status: evaluationData.questionaire_setting_status,
        section_total_marks: evaluationData.section_total_marks,
        subject_academic_year_period:
          evaluationData.subject_academic_year_period.toString(),
      });
    }
  }, [evaluationInfo, evaluationId]);

  function handleChange({ name, value }: ValueType) {
    // const { name, value } = event.target;
    // setMinutes(value.toString());
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

 
  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();
    // console.log("evaluationSectionInfo",evaluationSectionInfo)
    updateSection(evaluationSectionInfo, {
      onSuccess: () => {
        toast.success('Evaluation Section Updated successfully');
        queryClient.invalidateQueries(['evaluation', evaluationSectionInfo.id]);
        history.push(`/dashboard/evaluations/details/${evaluationId}/overview`);
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  }

  return (
    <form onSubmit={submitForm}>
      <InputMolecule
        required={false}
        name="section_name"
        placeholder="section name"
        type="text"
        handleChange={handleChange}
        value={evaluationSectionInfo.section_name}>
        Section name
      </InputMolecule>
      <InputMolecule
        required={false}
        name="section_total_marks"
        placeholder="section total marks"
        type="text"
        handleChange={handleChange}
        value={evaluationSectionInfo.section_total_marks}>
        section total marks
      </InputMolecule>

      <InputMolecule
        required={false}
        name="number_of_questions"
        placeholder="number of questions"
        type="text"
        handleChange={handleChange}
        value={evaluationSectionInfo.number_of_questions}>
        number of questions
      </InputMolecule>

      <SelectMolecule
        className="pb-3"
        width="36"
        value={evaluationSectionInfo.marker_id}
        name="marker_id"
        placeholder="select marker"
        handleChange={handleChange}
        //   handleChange={(e: ValueType) => handleModuleChange(index, e)}
        options={instrs.map((marker) => ({
          label: `${marker.rank} ${marker.first_name} ${marker.last_name}`,
          value: marker.id,
        }))}>
        section Marker
      </SelectMolecule>

      <SelectMolecule
        className="pb-3"
        width="36"
        value={evaluationSectionInfo.instructor_subject_assignment}
        name="instructor_subject_assignment"
        placeholder="select setter"
        handleChange={handleChange}
        //   handleChange={(e: ValueType) => handleModuleChange(index, e)}
        options={instrs.map((setter) => ({
          label: `${setter.rank} ${setter.first_name} ${setter.last_name}`,
          value: setter.id,
        }))}>
        Select Setter
      </SelectMolecule>

      <div>
        <Button type="submit" full>
          Save
        </Button>
      </div>
    </form>
  );
}
