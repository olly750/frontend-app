import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Heading from '../../components/Atoms/Text/Heading';
import AcademyProfileCard from '../../components/Molecules/cards/AcademyProfileCard';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import useAuthenticator from '../../hooks/useAuthenticator';
import { instructorDeployment } from '../../services/administration/InstructorDeployment.service';
import { intakeProgramService } from '../../services/administration/IntakeProgram.service';
import academyStore from '../../store/administration/academy.store';
import { institutionStore } from '../../store/administration/institution.store';
import { i18n } from '../../translations/i18n';
import { CommonCardDataType, RoleType } from '../../types';
import { chooseRole } from '../../utils/auth';
import cookie from '../../utils/cookie';
import { usePicture } from '../../utils/file-util';
import { setLocalStorageData } from '../../utils/getLocalStorageItem';
import { advancedTypeChecker } from '../../utils/getOption';

interface PickedData extends CommonCardDataType {
  academy_trans: string;
}

export default function ChooseRole() {
  const { user } = useAuthenticator();
  const [user_roles, setUserRoles] = useState<PickedData[]>([]);
  const [picked_role, setPickedRole] = useState<string>('');
  const [translation, setTranslation] = useState('');

  const institutions = institutionStore.getAll();
  const institution = institutions.data?.data.data[0];

  const academies = academyStore.fetchAcademies();

  useEffect(() => {
    let roles: PickedData[] = [];
    user?.user_roles.forEach((role) => {
      roles.push({
        code: '',
        subTitle:
          role.type === RoleType.INSTITUTION
            ? institutions.isLoading
              ? 'Loading...'
              : institutions.data?.data.data.find(
                  (inst) => inst.id === role.institution_id,
                )?.name + ''
            : RoleType.ACADEMY
            ? academies.isLoading
              ? 'Loading...'
              : 'Academy: ' +
                academies.data?.data.data.find((ac) => ac.id === role.academy_id)?.name +
                ''
            : '',
        title: role.name,
        description: role.description,
        id: role.id,
        status: {
          type: advancedTypeChecker(role.type),
          text: role.type,
        },
        academy_trans:
          academies.data?.data.data.find((ac) => ac.id === role.academy_id)
            ?.translation_preset || 'default',
      });
    });

    setUserRoles(roles);
  }, [
    academies.data?.data.data,
    academies.isLoading,
    institutions.data?.data.data,
    institutions.isLoading,
    user?.user_roles,
  ]);

  const handleChoose = (user_role: PickedData) => {
    setPickedRole(user_role.id?.toString() || '');
    setTranslation(user_role.academy_trans);
  };

  const pickRole = async () => {
    let role = user?.user_roles.find((rl) => rl.id == picked_role);
    if (role && picked_role) {
      cookie.setCookie('user_role', picked_role);
      i18n.changeLanguage(translation);
      const instructor = await instructorDeployment.getInstructorByUserId(
        user?.id.toString() || '',
      );
      const student = await intakeProgramService.getStudentShipByUserId(
        user?.id.toString() || '',
      );

      setLocalStorageData(
        'instructorInfo',
        instructor.data.data?.find((inst) => inst.academy.id === role?.academy_id) || {},
      );
      setLocalStorageData(
        'studentInfo',
        student?.data.data.find((stud) => stud.academy_id === role?.academy_id) || {},
      );
      chooseRole(role);
    } else {
      toast.error('You must pick a role');
    }
  };

  return (
    <div className="p-2 md:px-48 md:py-14">
      <div className="pb-16">
        <AcademyProfileCard
          src={usePicture(
            institution?.logo_attachment_id || undefined,
            institution?.id,
            '/images/rdf-logo.png',
            'logos',
          )}
          alt="institution logo"
          size="80"
          bgColor="none"
          txtSize="lg"
          fontWeight="semibold"
          color="primary"
          subtitle={institutions.data?.data.data[0].moto}>
          {institutions.data?.data.data[0].name}
        </AcademyProfileCard>
        <Button styleType="text" className="pt-10">
          <Link to="/login" className="flex items-center justify-center">
            <Icon
              size={16}
              name="chevron-left"
              fill="primary"
              useheightandpadding={false}
            />{' '}
            Back to login
          </Link>
        </Button>
      </div>
      <div>
        <Heading fontSize="2xl" fontWeight="medium" className="py-2">
          Choose Role
        </Heading>
        <Heading
          fontSize="lg"
          color="txt-secondary"
          fontWeight="medium"
          className=" pb-8">
          Which Role would you like to use?
        </Heading>

        <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-32 md:gap-y-8">
          {user_roles.map((user_role) => (
            <CommonCardMolecule
              className="my-2"
              active={picked_role == user_role.id}
              data={user_role}
              key={user_role.id}
              handleClick={() => handleChoose(user_role)}
            />
          ))}
        </div>
        <Button onClick={() => pickRole()} className="mt-8">
          Use role
        </Button>
      </div>
    </div>
  );
}
