/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import { queryClient } from '../../../../plugins/react-query';
import {
  deliberationStore,
  getLevelsByIntakeProgram,
} from '../../../../store/evaluation/deliberation.store';
import { getEnrollmentByStudentAndLevel } from '../../../../store/evaluation/deliberation.store';
import { ValueType } from '../../../../types';
import { EnrollmentStatus } from '../../../../types/services/enrollment.types';
import {
  PromotionParams,
  PromotionStatus,
  PromotionType,
} from '../../../../types/services/report.types';
import { getDropDownOptions } from '../../../../utils/getOption';
import Button from '../../../Atoms/custom/Button';
import SelectMolecule from '../../../Molecules/input/SelectMolecule';

interface LevelSelectInfo {
  id: string;
  name: string;
}

export default function UpdateLevel() {
  const { mutateAsync, isLoading } = deliberationStore.updatePromotion();
  const history = useHistory();
  const { reportId, levelId } = useParams<PromotionParams>();
  const [promotion, setPromotion] = useState<PromotionType>({
    id: reportId,
    promotion_status: PromotionStatus.RETAKE,
    enrolment_status: EnrollmentStatus.COMPLETED,
    final_level: false,
    intake_academic_level_enrolment_id: '',
    next_intake_academic_level_enrolment_id: '',
    position: 0,
  });

  const [nextLevels, setNextLevels] = useState<LevelSelectInfo[]>([]);

  const { data } = deliberationStore.getReportById(reportId);

  const studentId = data?.data.data.student.admin_id;

  const { data: levelData } = getEnrollmentByStudentAndLevel(
    levelId,
    studentId + '',
    !!studentId,
  );

  const academicProgramId = levelData?.data.data.intake_program_student.intake_program.id;

  const programLevels = getLevelsByIntakeProgram(academicProgramId + '').data?.data.data;

  useEffect(() => {
    data?.data.data &&
      setPromotion((prom) => {
        return { ...prom, position: data?.data.data.position };
      });
  }, [data]);

  useEffect(() => {
    const levels: LevelSelectInfo[] = [];
    programLevels?.forEach((element) => {
      if (
        levelData &&
        element.id !== levelData?.data.data.academic_year_program_level.id &&
        element.academic_program_level.level.flow >
          levelData?.data.data.academic_year_program_level?.academic_program_level.level
            .flow
      ) {
        levels.push({
          id: element.id + '',
          name: element.academic_program_level.level.name,
        });
      }
    });
    if (levels.length == 0) {
      setPromotion((old) => ({
        ...old,
        final_level: true,
      }));
    } else {
      setPromotion((old) => ({
        ...old,
        final_level: false,
      }));
    }
    setNextLevels(levels);
  }, [levelData, programLevels]);

  useEffect(() => {
    setPromotion((old) => ({
      ...old,
      intake_academic_level_enrolment_id: levelData?.data.data.id.toString() || '',
    }));
    console.log(levelData);
  }, [levelData]);

  function handleChange(e: ValueType) {
    if (e.name === 'promotion_status' && e.value !== PromotionStatus.PROMOTED) {
      setPromotion((old) => ({
        ...old,
        next_intake_academic_level_enrolment_id: '',
      }));
    }

    setPromotion((old) => ({ ...old, [e.name]: e.value }));
  }

  function submitForm<T>(e: FormEvent<T>) {
    e.preventDefault();
    mutateAsync(promotion, {
      onSuccess: () => {
        queryClient.invalidateQueries(['reports/overal/class/period']);
        toast.success('Successfully saved');
        history.goBack();
      },
      onError: (error: any) => {
        toast.error(error.response.data.message);
      },
    });
  }

  return (
    <form onSubmit={submitForm}>
      <SelectMolecule
        width="64"
        name="promotion_status"
        placeholder="Select Promotion Status"
        value={promotion.promotion_status}
        handleChange={handleChange}
        options={[
          { label: 'Promote', value: PromotionStatus.PROMOTED },
          { label: 'Retake', value: PromotionStatus.RETAKE },
          {
            label: 'Expell',
            value: PromotionStatus.DISMISSED,
          },
        ]}>
        Select Next Level
      </SelectMolecule>{' '}
      <SelectMolecule
        width="64"
        required={promotion.promotion_status === PromotionStatus.PROMOTED}
        disabled={promotion.promotion_status !== PromotionStatus.PROMOTED}
        name="next_intake_academic_level_enrolment_id"
        placeholder="Select Level"
        value={promotion.next_intake_academic_level_enrolment_id.toString()}
        handleChange={handleChange}
        options={getDropDownOptions({
          inputs: nextLevels,
          labelName: ['name'],
        })}>
        Select Next Level
      </SelectMolecule>{' '}
      <Button type="submit" isLoading={isLoading}>
        Save
      </Button>
    </form>
  );
}
