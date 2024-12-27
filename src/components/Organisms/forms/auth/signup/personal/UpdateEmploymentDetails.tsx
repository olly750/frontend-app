import React from 'react';
import { FormEvent, useEffect, useState } from 'react';

import { rankStore } from '../../../../../../store/administration/rank.store';
import { CommonFormProps, CommonStepProps, ValueType } from '../../../../../../types';
import { EmploymentDetail, UserInfo, WorkUnit } from '../../../../../../types/services/user.types';
import {
  getLocalStorageData,
  setLocalStorageData,
} from '../../../../../../utils/getLocalStorageItem';
import { getDropDownUnitOptions } from '../../../../../../utils/getOption';
import { getDropDownOptions } from '../../../../../../utils/getOption';
import { employmentDetailsSchema } from '../../../../../../validations/complete-profile/complete-profile.validation';
import Button from '../../../../../Atoms/custom/Button';
import Heading from '../../../../../Atoms/Text/Heading';
import DateMolecule from '../../../../../Molecules/input/DateMolecule';
import InputMolecule from '../../../../../Molecules/input/InputMolecule';
import SelectMolecule from '../../../../../Molecules/input/SelectMolecule';

interface Employment<E> extends CommonStepProps, CommonFormProps<E> {
  user?: UserInfo;
}

export default function UpdateEmploymentDetails<E>({
  display_label,
  isVertical,
  prevStep,
  nextStep,
  user,
}: Employment<E>) {
  const initialState: EmploymentDetail = {
    current_rank_id: '',
    other_rank: '',
    rank_depart: '',
    emp_no: '',
    date_of_commission: '',
    date_of_last_promotion: '',
    place_of_issue: '',
    date_of_issue: '',
  };

  const [employmentDetails, setEmploymentDetails] =
    useState<EmploymentDetail>(initialState);

  const [errors, setErrors] = useState<EmploymentDetail>(initialState);

  const moveBack = () => {
    prevStep && prevStep();
  };
  const handleChange = (e: ValueType) => {
    setEmploymentDetails({ ...employmentDetails, [e.name]: e.value });
  };

  const [userInfo] = useState<UserInfo>(getLocalStorageData('user'));
  //get all ranks in an institution

  // const ranks: RankRes[] | undefined = rankStore.getRankByInstitution(
  //   user.data?.data.data.institution_id + '',
  // ).data?.data.data;
  const { data: ranks, isLoading: loadRanks } = rankStore.getRankByInstitution(
    user?.institution_id + '',
  );

  const moveForward = (e: FormEvent) => {
    e.preventDefault();
    let data: any = getLocalStorageData('user');
    let newObj = Object.assign({}, data, employmentDetails);
    Object.keys(newObj).map((val) => {
      if (newObj[val] == null || newObj[val] == undefined) newObj[val] = '';
    });

    const validatedForm = employmentDetailsSchema.validate(employmentDetails, {
      abortEarly: false,
    });

    validatedForm
      .then(() => {
        delete newObj.current_rank;
        setLocalStorageData('user', newObj);
        nextStep(true);
      })
      .catch((err) => {
        const validatedErr: EmploymentDetail = initialState;
        err.inner.map((el: { path: string | number; message: string }) => {
          validatedErr[el.path as keyof EmploymentDetail] = el.message;
        }),
          setErrors(validatedErr);
      });
  };

  //when information change from the backend
  // useEffect(() => {
  //   let personInfo = user?.person;
  //   personInfo &&
  //     setEmploymentDetails((old) => {
  //       return { ...old, ...personInfo };
  //     });
  // }, [user?.person]);

  useEffect(() => {
    let personInfo = user?.person;
    setEmploymentDetails({
      ...employmentDetails,
      emp_no: personInfo?.service_number || '',
      current_rank_id: personInfo?.current_rank?.id.toString() || '',
    });
  }, [user?.person]);

  //when user comes back to this step
  useEffect(() => {
    setEmploymentDetails((old) => {
      {
        return { ...old, ...userInfo };
      }
    });
  }, [userInfo]);

  return (
    <div className={`flex flex-col gap-4 ${!isVertical && 'pt-8'}`}>
      {!isVertical && <Heading fontWeight="semibold">{display_label}</Heading>}
      <form onSubmit={moveForward}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* <div className="flex flex-col gap-4"> */}
          <div>
            <InputMolecule
              required={false}
              error={errors.rank_depart}
              name="rank_depart"
              placeholder="Enter your unit name"
              value={employmentDetails.rank_depart}
              handleChange={handleChange}>
              Unit
            </InputMolecule>

            {/* <SelectMolecule
             required={true}
              placeholder={'Select your organ or DG'}
              handleChange={handleChange}
              name="rank_depart"
              value={employmentDetails.rank_depart}
              options={getDropDownUnitOptions(WorkUnit)}>
                Unit / Directorate
            </SelectMolecule> */}

            <SelectMolecule
              error={errors.current_rank_id}
              placeholder="Select your current rank"
              name="current_rank_id"
              loading={loadRanks}
              value={employmentDetails.current_rank_id}
              options={getDropDownOptions({ inputs: ranks?.data.data || [] })}
              handleChange={handleChange}>
              Current Rank Title
            </SelectMolecule>
            <InputMolecule
              required={false}
              error={errors.other_rank}
              name="other_rank"
              placeholder="Other ranks u might hold"
              value={employmentDetails.other_rank}
              handleChange={handleChange}>
              Other Title
            </InputMolecule>
            <DateMolecule
              error={errors.date_of_commission}
              defaultValue={
                //@ts-ignore
                userInfo.date_of_commission ||
                userInfo.person?.date_of_commission ||
                user?.person?.date_of_commission
              }
              handleChange={handleChange}
              name="date_of_commission"
              date_time_type={false}
              width="60 md:w-80">
              Date of commission (started the career)
            </DateMolecule>
            <DateMolecule
              error={errors.date_of_last_promotion}
              defaultValue={
                //@ts-ignore
                userInfo.date_of_last_promotion ||
                userInfo.person?.date_of_last_promotion ||
                user?.person?.date_of_last_promotion
              }
              handleChange={handleChange}
              name="date_of_last_promotion"
              date_time_type={false}
              width="60 md:w-80">
              Date of last promotion
            </DateMolecule>
          </div>
          <div>
            <InputMolecule
              required={false}
              error={errors.emp_no}
              name="emp_no"
              placeholder="Service number"
              value={employmentDetails.emp_no}
              handleChange={handleChange}>
              Service / Card number
            </InputMolecule>
            <InputMolecule
            hidden
              required={false}
              error={errors.place_of_issue}
              name="place_of_issue"
              value={employmentDetails.place_of_issue}
              placeholder={`Enter the place you got your ID`}
              handleChange={handleChange}>
              {/* Place of issue */}
            </InputMolecule>
            <div hidden>
            <DateMolecule
              error={errors.date_of_issue}
              defaultValue={
                //@ts-ignore
                userInfo.date_of_issue ||
                userInfo.person?.date_of_issue ||
                user?.person?.date_of_issue
              }
              handleChange={handleChange}
              name="date_of_issue"
              date_time_type={false}
              width="60 md:w-80">
              {/* Date of issue */}
            </DateMolecule>
            </div>
          </div>
        </div>
        <div className="flex w-4/5 my-6 justify-between">
          {prevStep && (
            <Button
              styleType="text"
              hoverStyle="no-underline"
              color="txt-secondary"
              onClick={() => moveBack()}>
              Back
            </Button>
          )}
          <Button type="submit">Next</Button>
        </div>
      </form>
    </div>
  );
}
