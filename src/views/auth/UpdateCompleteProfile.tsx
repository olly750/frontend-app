import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';

import Stepper from '../../components/Molecules/Stepper/Stepper';
import UpdateAccountDetails from '../../components/Organisms/forms/auth/signup/personal/UpdateAccountDetails';
import UpdateEmploymentDetails from '../../components/Organisms/forms/auth/signup/personal/UpdateEmploymentDetails';
import UpdatePersonalDetails from '../../components/Organisms/forms/auth/signup/personal/UpdatePersonalDetails';
import { queryClient } from '../../plugins/react-query';
// import useAuthenticator from '../../hooks/useAuthenticator';
import usersStore from '../../store/administration/users.store';
import { ParamType } from '../../types';
// import { ParamType } from '../../types';
import {
  BloodGroup,
  DocType,
  EducationLevel,
  GenderStatus,
  MaritalStatus,
  ProfileStatus,
  SendCommunicationMsg,
  UpdateUserInfo,
  UserType,
} from '../../types/services/user.types';
import {
  getLocalStorageData,
  removeLocalStorageData,
  setLocalStorageData,
} from '../../utils/getLocalStorageItem';

export default function UpdateCompleteProfile() {
  const history = useHistory();
  const [currentStep, setCurrentStep] = useState<number>(
    Number(getLocalStorageData('currentStep')) || 0,
  );

  const [completeStep, setCompleteStep] = useState(0);

  const { id } = useParams<ParamType>();
  const { data: user } = usersStore.getUserById(id);

  const [personalInfo, setPersonalInfo] = useState<UpdateUserInfo>({
    // academy_id: '',
    acdemic_year_id: '',
    activation_key: '',
    birth_date: '',
    blood_group: BloodGroup['A+'],
    current_rank_id: '',
    date_of_commission: '',
    date_of_issue: '',
    date_of_last_promotion: '',
    deployed_on: '',
    deployment_number: '',
    doc_type: DocType.NID,
    document_expire_on: '',
    education_level: EducationLevel.SECONDARY,
    email: '',
    emp_no: '',
    father_names: '',
    first_name: '',
    id: '',
    institution_id: '',
    intake_program_id: '',
    last_name: '',
    marital_status: MaritalStatus.SINGLE,
    mother_names: '',
    nationality: '',
    nid: '',
    other_rank: '',
    password: '',
    password_reset_period_in_days: 0,
    person_id: '',
    phone: '',
    place_of_birth: '',
    place_of_birth_description: '',
    place_of_birth_id: 0,
    place_of_issue: '',
    place_of_residence: '',
    profile_status: ProfileStatus.INCOMPLETE,
    rank_depart: '',
    reset_date: '',
    residence_location_id: 0,
    send_communication_msg: SendCommunicationMsg.EMAIL,
    sex: GenderStatus.MALE,
    spouse_name: '',
    user_type: UserType.STUDENT,
    username: '',
  });

  useEffect(() => {
    const userInfo = user?.data.data;
    // const deployedUser = userInfo?.person.doc_type === null;

    userInfo &&
      setPersonalInfo({
        // academy_id: userInfo.academy.id,
        acdemic_year_id: userInfo.acdemic_year_id,
        activation_key: '',
        birth_date: userInfo.person?.birth_date || '',
        blood_group: userInfo.person?.blood_group || BloodGroup['A+'],
        current_rank_id: userInfo.person?.current_rank?.id.toString() || '',
        date_of_commission: userInfo.person?.date_of_commission || '',
        date_of_issue: userInfo.person?.date_of_issue || '',
        date_of_last_promotion: userInfo.person?.date_of_last_promotion || '',
        deployed_on: '',
        deployment_number: '',
        doc_type: userInfo.person?.doc_type || DocType.NID,
        document_expire_on: userInfo.person?.document_expire_on || '',
        education_level: userInfo.person?.education_level || EducationLevel.SECONDARY,
        email: userInfo.email,
        emp_no: userInfo.person?.service_number || '',
        father_names: userInfo.person?.father_names || '',
        first_name: userInfo.person?.first_name || '',
        id: userInfo.id.toString(),
        institution_id: userInfo.institution_id,
        intake_program_id: '',
        last_name: userInfo.last_name,
        marital_status: userInfo.person?.marital_status || MaritalStatus.SINGLE,
        mother_names: userInfo.person?.mother_names || '',
        nationality: userInfo.person?.nationality || '',
        nid: userInfo.person?.nid || '',
        other_rank: userInfo.person?.other_rank || '',
        password: '',
        password_reset_period_in_days: userInfo.password_reset_period_in_days,
        person_id: userInfo.person?.id.toString() || '',
        phone: userInfo.phone || userInfo.person?.phone_number || '',
        place_of_birth: userInfo.person?.place_of_birth || '',
        place_of_birth_description: userInfo.person?.place_of_birth_description || '',
        place_of_birth_id: parseInt(userInfo.person?.place_of_birth_id || '0'),
        place_of_issue: userInfo.person?.place_of_issue || '',
        place_of_residence: userInfo.person?.place_of_residence || '',
        profile_status: ProfileStatus.INCOMPLETE,
        rank_depart: userInfo.person?.rank_depart || '',
        reset_date: userInfo.reset_date,
        residence_location_id: parseInt(
          userInfo.person?.residence_location_id?.toString() || '0',
        ),
        send_communication_msg:
          userInfo.send_communication_msg || SendCommunicationMsg.EMAIL,
        sex: userInfo.person?.sex || GenderStatus.MALE,
        spouse_name: userInfo.person?.spouse_name || '',
        user_type: userInfo.user_type || UserType.STUDENT,
        username: userInfo.username,
      });
  }, [user?.data.data]);

  useEffect(() => {
    let data: UpdateUserInfo = getLocalStorageData('user');
    let person = { ...personalInfo };

    Object.keys(person).map((val) => {
      //@ts-ignore
      if (person[val] == null) person[val] = '';
    });

    setLocalStorageData('user', { ...data, ...person });
  }, [personalInfo]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('currentStep');
      localStorage.removeItem('user');
    };
  }, []);

  const { mutateAsync } = usersStore.updateUser();

  async function saveInfo(isComplete: boolean) {
    let userFromLocalStorage: UpdateUserInfo = getLocalStorageData('user');
    const finalPayload: UpdateUserInfo = {
      ...userFromLocalStorage,
      profile_status: ProfileStatus.COMPLETD,
      user_type: user?.data.data.user_type
        ? user?.data.data.user_type
        : user?.data.data.user_type === UserType.SUPER_ADMIN
        ? UserType.SUPER_ADMIN
        : UserType.STUDENT,
      id: personalInfo.id,
      username: user?.data.data.username || '',
    };

    if (isComplete) setCompleteStep((completeStep) => completeStep + 1);
    if (personalInfo) {
      await mutateAsync(finalPayload, {
        onSuccess() {
          toast.success('Profile updated successfully', {
            duration: 1200,
          });
          setTimeout(() => {
            removeLocalStorageData('user');
            removeLocalStorageData('currentStep');
            queryClient.invalidateQueries(['user/id', id]);
            history.goBack();
          }, 900);
        },
        onError(error: any) {
          toast.error(error.response.data.message);
        },
      });
    }
  }
  const nextStep = (isComplete: boolean) => {
    setLocalStorageData('currentStep', currentStep + 1);
    setCurrentStep((currentStep) => currentStep + 1);
    if (isComplete) setCompleteStep((completeStep) => completeStep + 1);
  };

  const prevStep = () => {
    setLocalStorageData('currentStep', currentStep - 1);
    setCurrentStep((currentStep) => currentStep - 1);
  };

  const navigateToStepHandler = (index: number) => {
    if (index !== currentStep) {
      setCurrentStep(index);
    }
  };
  return (
    <div className="bg-main p-8 md:px-24 md:py-14">
      <Stepper
        isDisabled={false}
        isVertical={false}
        width="w-80"
        currentStep={currentStep}
        completeStep={completeStep}
        navigateToStepHandler={navigateToStepHandler}>
        <UpdatePersonalDetails
          display_label="Personal details"
          nextStep={nextStep}
          user={user?.data.data}
        />
        <UpdateEmploymentDetails
          display_label="Employment details"
          prevStep={prevStep}
          nextStep={nextStep}
          user={user?.data.data}
        />
        <UpdateAccountDetails
          display_label="Account details"
          prevStep={prevStep}
          nextStep={saveInfo}
          user={user?.data.data}
        />
      </Stepper>
    </div>
  );
}
