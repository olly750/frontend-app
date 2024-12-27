import moment from 'moment';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useRouteMatch } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import TableHeader from '../../components/Molecules/table/TableHeader';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import usePickedRole from '../../hooks/usePickedRole';
import { getInstructorIntakePrograms } from '../../store/administration/enrollment.store';
import { getIntakesByAcademy } from '../../store/administration/intake.store';
import { getIntakeProgramsByStudent } from '../../store/administration/intake-program.store';
import { fetchRegControlById } from '../../store/administration/registrationControl.store';
import { CommonCardDataType, Link as LinkType, Privileges } from '../../types';
import { StudentApproval } from '../../types/services/enrollment.types';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { advancedTypeChecker } from '../../utils/getOption';
import { getObjectFromLocalStrg } from '../../utils/utils';

interface IntakeCardType extends CommonCardDataType {
  registrationControlId: string;
}

export default function IntakeList() {
  const [academyIntakes, setAcademyIntakes] = useState<IntakeCardType[]>([]);
  const [studentIntakes, setStudentIntakes] = useState<IntakeCardType[]>([]);
  const [instructorIntakes, setInstructorIntakes] = useState<IntakeCardType[]>([]);
  const { t } = useTranslation();

  const list: LinkType[] = [
    { to: 'home', title: 'Institution Admin' },
    { to: 'faculty', title: t('Faculty') },
    { to: 'programs', title: t('Program') },
    { to: 'intakes', title: 'Intakes' },
  ];

  const picked_role = usePickedRole();
  const { search } = useLocation();
  const registrationControlId = new URLSearchParams(search).get('regId');

  // if (registrationControlId && !regSuccess && !regLoading) refetch();

  const instructorInfo = getObjectFromLocalStrg(getLocalStorageData('instructorInfo'));

  const studentInfo = getObjectFromLocalStrg(getLocalStorageData('studentInfo'));

  const {
    isSuccess: academyIntakesSuccess,
    isError: academyIntakeError,
    data: academyIntakesData,
    isLoading: academyIntakesLoading,
  } = registrationControlId
    ? getIntakesByAcademy(registrationControlId, true)
    : getIntakesByAcademy(picked_role?.academy_id.toString() || '', false);

  const {
    isSuccess: studentIntakeSuccess,
    isError: studentIntakeError,
    data: studentIntakesData,
    isLoading: studentIntakeLoading,
  } = getIntakeProgramsByStudent(studentInfo?.id.toString() || '');

  const {
    isSuccess: instructorIntakeSuccess,
    isError: instructorIntakeError,
    data: instructorIntakesData,
    isLoading: instructorIntakeLoading,
  } = getInstructorIntakePrograms(instructorInfo?.id.toString() || '');

  useEffect(() => {
    let loadedIntakes: IntakeCardType[] = [];
    if (studentIntakeSuccess && studentIntakesData?.data) {
      studentIntakesData?.data.data.forEach((intk) => {
        if (intk.enrolment_status === StudentApproval.APPROVED) {
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
            registrationControlId:
              intk.intake_program.intake.registration_control?.id + '',
          };
          if (!loadedIntakes.find((pg) => pg.id === prog.id)?.id) {
            loadedIntakes.push(prog);
          }
        }
      });
      setStudentIntakes(loadedIntakes);
    } else if (studentIntakeError)
      toast.error('error occurred when loading student intakes');
  }, [
    studentIntakeError,
    studentIntakeSuccess,
    studentIntakesData?.data,
    studentIntakesData?.data.data,
  ]);

  useEffect(() => {
    let loadedIntakes: IntakeCardType[] = [];
    if (instructorIntakeSuccess && instructorIntakesData?.data) {
      instructorIntakesData?.data.data.forEach((intk) => {
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
        };
        if (!loadedIntakes.find((pg) => pg.id === prog.id)?.id) {
          loadedIntakes.push(prog);
        }
      });
      setInstructorIntakes(loadedIntakes);
    } else if (instructorIntakeError)
      toast.error('error occurred when loading instructor intakes');
  }, [
    instructorIntakeError,
    instructorIntakeSuccess,
    instructorIntakesData?.data,
    instructorIntakesData?.data.data,
  ]);

  useEffect(() => {
    let loadedIntakes: IntakeCardType[] = [];
    if (academyIntakesData?.data.data.length) {
      academyIntakesData?.data.data.map((intk) => {
        let cardData = {
          id: intk.id,
          code: intk.title.toUpperCase(),
          description: `${intk.expected_start_date.toString().split(' ')[0]} - ${
            intk.expected_end_date.toString().split(' ')[0]
          }`,
          title: intk.description || ``,
          status: {
            type: advancedTypeChecker(intk.intake_status),
            text: intk.intake_status.toString(),
          },
          footerTitle: intk.total_num_students,
          registrationControlId: intk.registration_control.id.toString() || '',
        };
        loadedIntakes.push(cardData);
      });

      setAcademyIntakes(loadedIntakes);
    } else if (academyIntakeError)
      toast.error('error occurred when loading academy intakes');
  }, [
    academyIntakeError,
    academyIntakesData?.data,
    academyIntakesData?.data.data,
    academyIntakesSuccess,
  ]);

  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  return (
    <div>
      <BreadCrumb list={list} />

      {registrationControlId ? (
        <IntakeListDisplayed
          description={`${"There haven't been any intakes added yet! try adding some from the button below."}`}
          canBeShown
          intakes={academyIntakes}
          isLoading={academyIntakesLoading}
        />
      ) : studentInfo || instructorInfo ? (
        <>
          <Heading fontWeight="semibold" className="py-6">
            Tap on a tab you want to view
          </Heading>
          <Tabs activeIndex={studentInfo ? 0 : 1}>
            {studentInfo ? (
              <Tab label={`${t('Student')} Intakes`}>
                <IntakeListDisplayed
                  intakes={studentIntakes}
                  isLoading={studentIntakeLoading}
                  description={'You have not been approved to any intake yet!'}
                />
              </Tab>
            ) : (
              <></>
            )}
            {instructorInfo ? (
              <Tab label={`${t('Instructor')} Intakes`}>
                <IntakeListDisplayed
                  intakes={instructorIntakes}
                  isLoading={instructorIntakeLoading}
                  description={'You have not been enrolled to teach any intake yet!'}
                />
              </Tab>
            ) : (
              <></>
            )}
            {hasPrivilege(Privileges.CAN_CREATE_INTAKE) ||
            hasPrivilege(Privileges.CAN_MODIFY_INTAKE) ? (
              <Tab label={`Other Intakes`}>
                <IntakeListDisplayed
                  canBeShown
                  intakes={academyIntakes}
                  isLoading={academyIntakesLoading}
                  description={
                    "There haven't been any intakes added yet! try adding some from the button below."
                  }
                />
              </Tab>
            ) : (
              <></>
            )}
          </Tabs>
        </>
      ) : (
        <IntakeListDisplayed
          intakes={academyIntakes}
          isLoading={academyIntakesLoading}
          canBeShown
          description={
            "There haven't been any intakes added yet! try adding some from the button below."
          }
        />
      )}
    </div>
  );
}

function IntakeListDisplayed({
  intakes,
  isLoading,
  description,
  canBeShown = false,
}: {
  intakes: IntakeCardType[];
  isLoading: boolean;
  description: string;
  canBeShown?: boolean;
}) {
  const { search } = useLocation();
  const history = useHistory();
  const { url } = useRouteMatch();
  const registrationControlId = new URLSearchParams(search).get('regId');
  const { data: regControl } = fetchRegControlById(
    registrationControlId?.toString() || '',
  );

  function regControlName() {
    return `${moment(regControl?.data.data.expected_start_date).format(
      'MMM D YYYY',
    )} - ${moment(regControl?.data.data.expected_end_date).format('MMM D YYYY')}`;
  }

  const goToEdit = (e: Event, intakeId: string, IntakeRegId: string) => {
    e.stopPropagation();

    history.push(`${url}/${intakeId}/edit/${IntakeRegId}`);
  };

  return (
    <>
      <TableHeader
        title={`${registrationControlId ? regControlName() : 'Intakes'}`}
        totalItems={
          registrationControlId ? `${intakes.length} intakes` : `${intakes.length}`
        }
        showSearch={false}>
        {registrationControlId && (
          <Permission privilege={Privileges.CAN_CREATE_INTAKE}>
            <Link
              to={`/dashboard/registration-periods/${registrationControlId}/add-intake`}>
              <Button>Add Intake</Button>
            </Link>
          </Permission>
        )}
      </TableHeader>
      <section className="flex flex-wrap justify-start gap-4 mt-2">
        {intakes.map((intake) => (
          <div key={intake.code + Math.random() * 10} className="p-1 mt-3">
            <div className="p-1 mt-3">
              <CommonCardMolecule
                data={intake}
                handleClick={() => history.push(`${url}/programs/${intake.id}`)}>
                <Permission privilege={Privileges.CAN_MODIFY_INTAKE}>
                  <div className="mt-4 space-x-4 z-30">
                    <Button
                      //@ts-ignore
                      onClick={(e: Event) =>
                        goToEdit(e, intake.id + '', intake.registrationControlId)
                      }>
                      Edit Intake
                    </Button>
                  </div>
                </Permission>
              </CommonCardMolecule>
            </div>
          </div>
        ))}

        {isLoading ? (
          <Loader />
        ) : (
          intakes.length == 0 && (
            <NoDataAvailable
              fill={false}
              icon="academy"
              showButton={canBeShown}
              buttonLabel={
                registrationControlId ? 'Add Intake ' : 'Go to registration control'
              }
              title={
                registrationControlId
                  ? 'No intake available in this registration Period'
                  : 'No intake available'
              }
              privilege={Privileges.CAN_CREATE_INTAKE}
              handleClick={() => {
                if (registrationControlId)
                  history.push(
                    `/dashboard/registration-periods/${registrationControlId}/add-intake`,
                  );
                else history.push('/dashboard/registration-periods');
              }}
              description={description}
            />
          )
        )}
      </section>
    </>
  );
}
