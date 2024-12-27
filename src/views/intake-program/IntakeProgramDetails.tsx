// eslint-disable-next-line prettier/prettier
/* eslint no-use-before-define: 0 */ // --> OFF
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Loader from '../../components/Atoms/custom/Loader';
import Heading from '../../components/Atoms/Text/Heading';
import BreadCrumb from '../../components/Molecules/BreadCrumb';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import UsersPreview from '../../components/Molecules/cards/UsersPreview';
import PopupMolecule from '../../components/Molecules/Popup';
import TabNavigation, { TabType } from '../../components/Molecules/tabs/TabNavigation';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import AddPrerequesitesForm from '../../components/Organisms/forms/modules/AddPrerequisiteForm';
import NewModuleForm from '../../components/Organisms/forms/modules/NewModuleForm';
import useAuthenticator from '../../hooks/useAuthenticator';
import { useInstructorByUserId } from '../../hooks/useInstructorByUserId';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import { attachementStore } from '../../store/administration/attachment.store';
import enrollmentStore from '../../store/administration/enrollment.store';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../utils/utils';
import { Instructor } from '../../types/services/instructor.types';
import intakeProgramStore, {
  getIntakeProgramsByStudent,
  getStudentLevels,
  getStudentShipByUserId,
} from '../../store/administration/intake-program.store';
import { getLevelsByAcademicProgram } from '../../store/administration/program.store';
import { Link as Links, Privileges } from '../../types';
import { StudentApproval } from '../../types/services/enrollment.types';
import { MediaType } from '../../types/services/gallery.types';
import { IntakeProgParam } from '../../types/services/intake-program.types';
import { UserView } from '../../types/services/user.types';
import { downloadAttachment } from '../../utils/file-util';
import { titleCase } from '../../utils/getOption';
import { advancedTypeChecker } from '../../utils/getOption';
import { IProgramData } from '../programs/AcademicPrograms';
import AddLevelToProgram from '../programs/AddLevelToProgram';
import AddProgramLeader from '../programs/AddProgramLeader';
import AddProgramSyllabus from '../programs/AddProgramSyllabus';
import ApproveStudent from '../users/ApproveStudent';
import AddGallery from './addGallery';
import EnrollInstructorIntakeProgram from './EnrollInstructorIntakeProgram';
import EnrollRetakingStudents from './EnrollRetakingStudents';
import EnrollStudentIntakeProgram from './EnrollStudentIntakeProgram';
import Gallery from './Gallery';
import IntakeProgramLevel from './IntakeProgramLevel';
import IntakeProgramModules from './IntakeProgramModules';
import IntakeProgramEvaluations from './IntakeProgramEvaluations';

function IntakeProgramDetails() {
  const history = useHistory();
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  const { id, intakeId, intakeProg } = useParams<IntakeProgParam>();

  const [fileUrl, setUrl] = useState('');
  const [unselectAll, setUnselectAll] = useState(false);
  const { data: studentsProgram, isLoading: studLoading } =
    intakeProgramStore.getStudentsByIntakeProgramByStatus(
      intakeProg,
      StudentApproval.APPROVED,
    );

    
  const { data: instructorsProgram, isLoading: instLoading } =
    intakeProgramStore.getInstructorsByIntakeProgram(intakeProg);

  const { user } = useAuthenticator();

  const picked_role = usePickedRole();

  const user_privileges = picked_role?.role_privileges?.map((role) => role.name);
  const hasPrivilege = (privilege: Privileges) => user_privileges?.includes(privilege);

  const [students, setStudents] = useState<UserView[]>([]);
  const [instructors, setInstructors] = useState<UserView[]>([]);
  const initialShowSidebar = {
    showStudent: false,
    showInstructor: false,
    enrollStudent: false,
    enrollInstructor: false,
    enrollRetaking: false,
  };
  const instructorData: Instructor | null = getObjectFromLocalStrg(
    getLocalStorageData('instructorInfo'),
  );

  const [showSidebar, setShowSidebar] = useState(initialShowSidebar);
  useEffect(() => {
    let studentsView: UserView[] = [];

    studentsProgram?.data.data.sort(function (a, b) {
      if (a.student.user.person && b.student.user.person) {
        return (
          a.student.user.person.current_rank?.priority -
          b.student.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });

    studentsProgram?.data.data.forEach((stud) => {
      let studentView: UserView = {
        id: stud.id,
        rank: stud.student.user.person?.current_rank?.abbreviation,
        first_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
          ? stud.student.user.person?.alias_first_name
          : stud.student.user.first_name,
        last_name: hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
          ? stud.student.user.person?.alias_last_name
          : stud.student.user.last_name,
        image_url: stud.student.user.image_url,
        alias_first_name:
          stud.student.user.person?.alias_first_name === null
            ? 'Alias'
            : stud.student.user.person?.alias_first_name,
        alias_last_name:
          stud.student.user.person?.alias_last_name === null
            ? 'last_Alias'
            : stud.student.user.person?.alias_last_name,
      };
      studentsView.push(studentView);
    });
    for (let i = 0; i < studentsView.length; i++) {
      for (let j = i + 1; j < studentsView.length; j++) {
        if (studentsView[i].id === studentsView[j].id) {
          studentsView.splice(j, 1);
          j--;
        }
      }
    }
    setStudents(studentsView);
  }, [studentsProgram]);

  useEffect(() => {
    let demoInstructors: UserView[] = [];

    const rankedInstructors =
      instructorsProgram?.data.data.filter(
        (inst) => inst.instructor.user.person?.current_rank,
      ) || [];
    const unrankedInstructors =
      instructorsProgram?.data.data.filter(
        (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
      ) || [];

    rankedInstructors.sort(function (a, b) {
      if (a.instructor.user.person && b.instructor.user.person) {
        return (
          a.instructor.user.person.current_rank?.priority -
          b.instructor.user.person.current_rank?.priority
        );
      } else {
        return 0;
      }
    });
    const finalInstructors = rankedInstructors.concat(unrankedInstructors);

    finalInstructors.map((inst) => {
      demoInstructors.push({
        id: inst.id,
        rank: inst.instructor.user.person?.current_rank?.abbreviation,
        first_name: inst.instructor.user.first_name,
        last_name: inst.instructor.user.last_name,
        image_url: inst.instructor.user.image_url,
        alias_first_name: undefined,
        alias_last_name: undefined,
      });
    });
    setInstructors(demoInstructors);
  }, [instructorsProgram]);

  const { data: intakeProgram, isLoading } =
    intakeProgramStore.getIntakeProgramId(intakeProg);
 
  const program = intakeProgram?.data.data;
  const { mutate, isLoading: isDeleting } = attachementStore.deleteAttachmentById();
 
  async function downloadProgramAttachment(downloadId: any, attachmentName: any) {
    const fileurl = await downloadAttachment(downloadId + '', '/attachments/download/');
  

    var element = document.createElement('a');
    element.setAttribute('href', fileurl);
    element.setAttribute('download', attachmentName + '');

    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const getProgramData = () => {
    let programData: IProgramData | undefined;
    if (program) {
      
     programData = {
      code: program.intake?.title,
        status: {
          type: advancedTypeChecker(program.program?.generic_status),
          text: program.program?.generic_status.toString(),
        },
 total_num_modules: program.program?.total_num_modules, 
      title: program.program.name,
        subTitle: program.program?.type.replaceAll('_', ' '),
        description: program.program?.description,
        department: program.program?.department,
        incharge_names: program.program?.current_admin_names,
      };
    }
    return programData;
  };

  
 


  console.log("programs",program)
  const handleClose = () => {
    history.goBack();
  };

  function deleteSyllabus(id: string) {
    mutate(id, {
      onSuccess() {
        toast.success('successfully deleted');
        queryClient.invalidateQueries(['intake-program/id', id]);
      },
      onError(error: any) {
        toast.error(error.response.data.message);
      },
    });
  }

  const getLevels =
    intakeProgramStore.getLevelsByIntakeProgram(intakeProg).data?.data.data || [];
  const programLevels = getLevelsByAcademicProgram(id).data?.data.data;

  const unaddedLevels = programLevels?.filter(
    (pg) => !getLevels.map((lv) => lv.academic_program_level.id).includes(pg.id),
  );

  const instructorInfo = useInstructorByUserId(user?.id.toString() || '')?.find(
    (inst) => inst.academy.id === picked_role?.academy?.id,
  );

  let { data: instructorLevels } = enrollmentStore.getInstructorLevels(
    instructorInfo?.id + '',
  );

  const studentInfo = getStudentShipByUserId(user?.id + '' || '').data?.data.data[0];
  const studPrograms = getIntakeProgramsByStudent(studentInfo?.id + '').data?.data.data;
  let studIntkProgstud = studPrograms?.find(
    (prg) => prg.intake_program.id === intakeProg,
  );
  let { data: studentLevels } = getStudentLevels(studIntkProgstud?.id.toString() || '');

  const programData = getProgramData();
  let tabs: TabType[] = [
    {
      label: t('Program') + ' information',
      href: `${url}`,
    },
  ];
  tabs.push({
    label: t('Program') + ' modules',
    href: `${url}/modules`,
    privilege: Privileges.CAN_ACCESS_INTAKE_PROGRAM_MODULES,
  });
  //intakeProgram?.data.data.incharge_instructor



  let instructorLevelsIds = instructorLevels?.data.data.map(
    (instLvl) => instLvl.academic_year_program_intake_level?.id,
  );

  const instructorProgLevels = getLevels?.filter((level) =>
    instructorLevelsIds?.includes(level.id),
  );


  if (instructorProgLevels && instructorProgLevels?.length > 0) {
    tabs.push({
      label: t('Instructor') + t('Program') + ' levels',
      href: `${url}/levels/teach/${instructorProgLevels[0]?.id || ''}`,
      privilege: Privileges.CAN_TEACH_IN_INTAKE_PROGRAM_LEVELS,
    });
  }

  if (getLevels && getLevels?.length > 0) {
    tabs.push({
      label: '' + t('Program') + ' details',
      href: `${url}/levels/manage/${getLevels[0]?.id || ''}`,
      // privilege: Privileges.CAN_ACCESS_INTAKE_PROGRAM_LEVELS,
    });
  }
  tabs.push({
    label: 'Approve students',
    href: `${url}/approve`,
    privilege: Privileges.CAN_APPROVE_STUDENT,
  });
  if (intakeProgram?.data.data.incharge_instructor === instructorData?.id) { 
    tabs.push({
      label: 'Evaluations',
      href: `${url}/evaluations/${getLevels[0]?.id || ''}/level`,
    });
  }
  tabs.push({
    label: 'Gallery',
    href: `${url}/gallery`,
    privilege: Privileges.CAN_ACCESS_INTAKE_PROGRAM_GALLERY,
  });
  
  const list: Links[] = [
    { to: 'home', title: 'home' },
    { to: 'intakes', title: 'intakes' },
    { to: 'intakes/programs', title: t('Program') },
    { to: `${url}`, title: 'details' },
  ];

  const incharge_inst = instructorsProgram?.data.data.find(
    (inst) => inst.instructor.id === intakeProgram?.data.data.incharge_instructor,
  );

  const incharge_stud = studentsProgram?.data.data.find(
    (stud) => stud.student.id === intakeProgram?.data.data.student_in_lead,
  );

  
  return (
    <>
      <BreadCrumb list={list} />

      <div className="pt-5">
        <Heading className="pb-5" fontWeight="semibold" fontSize="xl">
          {program?.program.name}
        </Heading>
        <TabNavigation
          tabs={tabs}
          headerComponent={
            getLevels.length === 0 && unaddedLevels?.length !== 0 ? (
              <Permission privilege={Privileges.CAN_CREATE_PROGRAM_LEVELS}>
                <div className="text-right">
                  <Link
                    to={`/dashboard/intakes/programs/${intakeId}/${id}/${intakeProg}/add-level`}>
                    <Button>Add level to {t('Program')}</Button>
                  </Link>
                </div>
              </Permission>
            ) : (
              <></>
            )
          }>
          <Switch>
            <Route
              exact
              path={`${path}/level/add`}
              render={() => {
                return (
                  <PopupMolecule
                    closeOnClickOutSide={false}
                    title={'Add level to ' + t('Program')}
                    open={true}
                    onClose={() => history.goBack()}>
                    <AddLevelToProgram />
                  </PopupMolecule>
                );
              }}
            />
            <Route
              exact
              path={`${path}`}
              render={() => (
                <>
                  {isLoading ? (
                    <Loader />
                  ) : (
                    programData && (
                      <div className="flex gap-8 py-9">
                        <div className="mr-24">
                          <CommonCardMolecule data={programData}>
                            {/* <div className="flex items-center gap-2 pb-6s">
                              <Heading color="txt-secondary" fontSize="sm">
                                {t('Program')} in charge:
                              </Heading>
                              <div className="flex items-center">
                                <Heading fontSize="sm">
                                  {programData.incharge_names}
                                </Heading>
                              </div>
                            </div> */}

                            <Permission privilege={Privileges.CAN_MODIFY_PROGRAM}>
                              <div className="mt-4 flex space-x-4">
                                <Button
                                  onClick={() =>
                                    history.push(
                                      `/dashboard/intakes/programs/${intakeId}/${id}/edit`,
                                    )
                                  }>
                                  Edit {t('Program')}
                                </Button>
                                {/* <Button styleType="outline">Change Status</Button> */}
                              </div>
                            </Permission>
                          </CommonCardMolecule>
                        </div>
                        <div className="flex flex-col gap-8 z-0">
                          <UsersPreview
                            title="Students"
                            label={`Students in ${programData.title}`}
                            data={students}
                            totalUsers={students.length || 0}
                            dataLabel={''}
                            isLoading={studLoading}
                            showSidebar={showSidebar.showStudent}
                            handleShowSidebar={() =>
                              setShowSidebar({
                                ...initialShowSidebar,
                                showStudent: !showSidebar.showStudent,
                              })
                            }
                          />
                          <Permission
                            privilege={Privileges.CAN_ENROLL_STUDENTS_ON_PROGRAM}>
                            <EnrollStudentIntakeProgram
                              showSidebar={showSidebar.enrollStudent}
                              existing={studentsProgram?.data.data || []}
                              handleShowSidebar={() =>
                                setShowSidebar({
                                  ...initialShowSidebar,
                                  enrollStudent: !showSidebar.enrollStudent,
                                })
                              }
                            />

                            <EnrollRetakingStudents
                              showSidebar={showSidebar.enrollRetaking}
                              existing={studentsProgram?.data.data || []}
                              handleShowSidebar={() =>
                                setShowSidebar({
                                  ...initialShowSidebar,
                                  enrollRetaking: !showSidebar.enrollRetaking,
                                })
                              }
                            />
                          </Permission>

                          <Permission
                            privilege={
                              Privileges.CAN_ACCESS_INSTRUCTORS_ON_LEVEL_PROGRAM
                            }>
                            <UsersPreview
                              title={t('Instructor')}
                              label={t('Instructor') + ` in ${programData.title}`}
                              data={instructors}
                              totalUsers={instructors.length || 0}
                              dataLabel={''}
                              isLoading={instLoading}
                              showSidebar={showSidebar.showInstructor}
                              handleShowSidebar={() =>
                                setShowSidebar({
                                  ...initialShowSidebar,
                                  showInstructor: !showSidebar.showInstructor,
                                })
                              }
                            />
                          </Permission>

                          <Permission
                            privilege={Privileges.CAN_ENROLL_INSTRUCTORS_ON_PROGRAM}>
                            <EnrollInstructorIntakeProgram
                              showSidebar={showSidebar.enrollInstructor}
                              existing={instructorsProgram?.data.data || []}
                              handleShowSidebar={() =>
                                setShowSidebar({
                                  ...initialShowSidebar,
                                  enrollInstructor: !showSidebar.enrollInstructor,
                                })
                              }
                            />
                          </Permission>
                        </div>
                        <div className="flex flex-col gap-8">
                          <Permission
                            privilege={Privileges.CAN_ACCESS_PROGRAMS_IN_INTAKE}>
                            <div className="rounded border-2 border-[#e9ecef] flex flex-col p-6 bg-main">
                              <Heading
                                color="txt-secondary"
                                fontSize="base"
                                className="pb-4">
                                Intake Leaders
                              </Heading>
                              <div className="flex gap-2 items-center">
                                <Heading
                                  color="txt-primary"
                                  fontSize="sm"
                                  fontWeight="semibold">
                                  {t('Instructor')} in charge :
                                </Heading>
                                {intakeProgram?.data.data.incharge_instructor ? (
                                  <div className="flex items-center justify-between">
                                    <Heading color="txt-primary" fontSize="sm">
                                      {`${
                                        incharge_inst?.instructor.user.person
                                          ?.current_rank?.abbreviation || ''
                                      } ${
                                        incharge_inst?.instructor.user.person
                                          ?.first_name || ''
                                      }  ${
                                        incharge_inst?.instructor.user.person
                                          ?.last_name || ''
                                      }`}
                                    </Heading>
                                    <Link to={`${url}/leader/edit?type=instructor`}>
                                      <Button icon styleType="text">
                                        <Icon name="edit" size={20} />
                                      </Button>
                                    </Link>
                                  </div>
                                ) : (
                                  <Permission
                                    privilege={Privileges.CAN_CREATE_PROGRAMS_IN_INTAKE}>
                                    <div className="text-primary-500 py-2 text-sm mr-3 flex space-x-4">
                                      <Link
                                        to={`${url}/leader/add?type=instructor`}
                                        className="bg-secondary px-2 rounded-sm hover:bg-tertiary flex items-center justify-end">
                                        <Icon name="add" size={12} fill="primary" />
                                        Add {t('Instructor')} incharge
                                      </Link>
                                    </div>
                                  </Permission>
                                )}
                              </div>
                              <div className="flex gap-2 items-center">
                                <Heading
                                  color="txt-primary"
                                  fontSize="sm"
                                  fontWeight="semibold">
                                  Student in charge :
                                </Heading>
                                {intakeProgram?.data.data.student_in_lead ? (
                                  <div className="flex items-center justify-between">
                                    <Heading color="txt-primary" fontSize="sm">
                                      {`${
                                        incharge_stud?.student.user.person?.current_rank
                                          ?.abbreviation || ''
                                      } ${
                                        hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
                                          ? incharge_stud?.student.user.person
                                              ?.alias_first_name || ''
                                          : incharge_stud?.student.user.person?.first_name
                                      }  ${
                                        hasPrivilege(Privileges.CANNOT_VIEW_REAL_NAME)
                                          ? incharge_stud?.student.user.person
                                              ?.alias_last_name || ''
                                          : incharge_stud?.student.user.person?.last_name
                                      }`}
                                    </Heading>
                                    <Link to={`${url}/leader/edit?type=student`}>
                                      <Button icon styleType="text">
                                        <Icon name="edit" size={20} />
                                      </Button>
                                    </Link>
                                  </div>
                                ) : (
                                  <Permission
                                    privilege={Privileges.CAN_CREATE_PROGRAMS_IN_INTAKE}>
                                    <div className="text-primary-500 py-2 text-sm mr-3 flex space-x-4">
                                      <Link
                                        to={`${url}/leader/add?type=student`}
                                        className="bg-secondary px-2 rounded-sm hover:bg-tertiary flex items-center justify-end">
                                        <Icon name="add" size={12} fill="primary" />
                                        Add student incharge
                                      </Link>
                                    </div>
                                  </Permission>
                                )}
                              </div>
                            </div>
                            <Permission
                              privilege={Privileges.CAN_ACCESS_PROGRAM_SYLLABUS}>
                              <div className="mr-20 rounded border-2 border-[#e9ecef] flex flex-col gap-7 p-6 bg-main">
                                <Heading color="txt-secondary" fontSize="base">
                                  {t('Program')} Syllabus
                                </Heading>

                                <div className="flex flex-col gap-4">
                                  {intakeProgram?.data.data?.attachment_id ? (
                                    <>
                                      <button
                                        style={{
                                          background: 'rgb(250,251,252)',
                                          width: 'max-content',
                                        }}
                                        onClick={() =>
                                          downloadProgramAttachment(
                                            intakeProgram.data.data.attachment_id,
                                            intakeProgram.data.data.attachment_file_name,
                                          )
                                        }>
                                        {program?.program.name + ' Syllabus'}
                                      </button>

                                      <Permission
                                        //change to adding program syllabus
                                        // Privileges.CAN_ADD_PROGRAM_SYLLABUS
                                        privilege={Privileges.CAN_ADD_PROGRAM_SYLLABUS}>
                                        <div className="text-primary-500 py-1 text-sm mr-3 flex space-x-4">
                                          {/* <Link
                                            to={`${url}/programSyllabus/add`}
                                            className="flex items-center justify-end">
                                            <Icon name="add" size={12} fill="primary" />
                                            Add new {t('Program')} Syllabus
                                          </Link> */}
                                        </div>
                                      </Permission>
                                      <div className="flex space-x-4">
                                        <Permission
                                          privilege={
                                            Privileges.CAN_DOWNLOAD_PROGRAM_SYLLABUS
                                          }>
                                          <Button
                                            onClick={() =>
                                              downloadProgramAttachment(
                                                intakeProgram.data.data.attachment_id,
                                                intakeProgram.data.data
                                                  .attachment_file_name,
                                              )
                                            }>
                                            Download
                                          </Button>
                                        </Permission>
                                        <Permission
                                          privilege={
                                            Privileges.CAN_DELETE_PROGRAM_SYLLABUS
                                          }>
                                          <Button
                                            isLoading={isDeleting}
                                            onClick={() => deleteSyllabus(intakeProg)}
                                            styleType="outline">
                                            Delete
                                          </Button>
                                        </Permission>
                                      </div>
                                    </>
                                  ) : (
                                    <Permission
                                      privilege={
                                        //change to creating syllabus
                                        // Privileges.CAN_ADD_PROGRAM_SYLLABUS
                                        Privileges.CAN_ADD_PROGRAM_SYLLABUS
                                      }>
                                      <div className="text-primary-500 py-2 text-sm mr-3 flex space-x-4">
                                        <Link
                                          to={`${url}/programSyllabus/add`}
                                          className="bg-secondary px-2 rounded-sm hover:bg-tertiary flex items-center justify-end">
                                          <Icon name="add" size={12} fill="primary" />
                                          Add {t('Program')} Syllabus
                                        </Link>
                                      </div>
                                    </Permission>
                                  )}
                                </div>
                              </div>
                            </Permission>
                          </Permission>
                        </div>
                      </div>
                    )
                  )}
                </>
              )}
            />

            {/* add intake program leader */}
            <Route
              exact
              path={`${path}/leader/add`}
              render={() => {
                return (
                  <PopupMolecule
                    title={'New ' + t('Program') + ' leader'}
                    open
                    onClose={history.goBack}>
                    <AddProgramLeader
                      intakeProg={intakeProg}
                      intakeProgram={intakeProgram?.data.data}
                    />
                  </PopupMolecule>
                );
              }}
            />
            {/* edit intake program leader */}
            <Route
              exact
              path={`${path}/leader/edit`}
              render={() => {
                return (
                  <PopupMolecule
                    title={'New ' + t('Program') + ' leader'}
                    open
                    onClose={history.goBack}>
                    <AddProgramLeader
                      intakeProg={intakeProg}
                      intakeProgram={intakeProgram?.data.data}
                    />
                  </PopupMolecule>
                );
              }}
            />
            {/* add syllabus */}
            <Route
              exact
              path={`${path}/programSyllabus/add`}
              render={() => {
                return (
                  <PopupMolecule
                    title={'New ' + t('Program') + ' Syllabus'}
                    open
                    onClose={history.goBack}>
                    <AddProgramSyllabus programId={intakeProg} />
                  </PopupMolecule>
                );
              }}
            />
            {/* add module popup */}
            <Route
              exact
              path={`${path}/modules/add`}
              render={() => {
                return (
                  <PopupMolecule title="New Module" open onClose={handleClose}>
                    <NewModuleForm />
                  </PopupMolecule>
                );
              }}
            />
            {/* add prerequesite popup */}
            <Route
              exact
              path={`${path}/modules/:moduleId/add-prereq`}
              render={() => {
                return (
                  <PopupMolecule
                    closeOnClickOutSide={false}
                    title="Add Prerequesite"
                    open
                    onClose={handleClose}>
                    <AddPrerequesitesForm />
                  </PopupMolecule>
                );
              }}
            />
            <Route
              exact
              path={`${path}/modules`}
              render={() => <IntakeProgramModules />}
            />
            {/* <Route
              path={`${path}/levels/learn`}
              render={() => <IntakeProgramLevel action="learn" />}
            /> */}
            <Route
              path={`${path}/levels/manage`}
              render={() => <IntakeProgramLevel action="manage" />}
            />
              <Route
              path={`${path}/evaluations/:level`}
              render={() => <IntakeProgramEvaluations action="manage" />}
            />
            <Route
              path={`${path}/levels/teach`}
              render={() => <IntakeProgramLevel action="teach" />}
            />
            <Route exact path={`${path}/approve`} render={() => <ApproveStudent />} /> 
            <Route
              exact
              path={`${path}/gallery`}
              render={() => (
                <>
                  <Tabs onTabChange={() => setUnselectAll(true)}>
                    {Object.keys(MediaType).map((item) => (
                      <Tab key={item} className="py-3" label={titleCase(item)}>
                        {isLoading ? (
                          <Loader />
                        ) : (
                          <div className="pt-2">
                            {item.length <= 0 ? (
                              ' '
                            ) : (
                              <>
                                {item.toLowerCase() === 'images' ? (
                                  <>
                                    <div className="mr-20 rounded border-2 border-[#e9ecef] flex flex-col gap-7 p-6 bg-main">
                                      <Heading
                                        color="info"
                                        fontSize="lg"
                                        fontWeight="bold">
                                        Images
                                      </Heading>
                                      <div className="text-primary-500 py-2 text-sm mr-3 flex space-x-4">
                                        {hasPrivilege(
                                          Privileges.ADD_INTAKE_PROGRAM_GALLERY,
                                        ) && (
                                          <Link
                                            to={`${url}/addgallery`}
                                            className="bg-secondary px-2 rounded-sm hover:bg-tertiary flex items-center justify-end">
                                            {/* <Icon name="add" size={12} fill="primary" /> */}
                                            <Button>Add to Gallery</Button>
                                          </Link>
                                        )}
                                      </div>

                                      {hasPrivilege(
                                        Privileges.CAN_ACCESS_INTAKE_PROGRAM_GALLERY,
                                      ) && <Gallery galleryType={'img'} />}
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="mr-20 rounded border-2 border-[#e9ecef] flex flex-col gap-7 p-6 bg-main">
                                      <Heading
                                        color="info"
                                        fontSize="lg"
                                        fontWeight="bold">
                                        Videos
                                      </Heading>
                                      <div className="text-primary-500 py-2 text-sm mr-3 flex space-x-4">
                                        {hasPrivilege(
                                          Privileges.ADD_INTAKE_PROGRAM_GALLERY,
                                        ) && (
                                          <Link
                                            to={`${url}/addgallery`}
                                            className="bg-secondary px-2 rounded-sm hover:bg-tertiary flex items-center justify-end">
                                            {/* <Icon name="add" size={12} fill="primary" /> */}
                                            <Button>Add to Gallery</Button>
                                          </Link>
                                        )}
                                      </div>
                                      {hasPrivilege(
                                        Privileges.CAN_ACCESS_INTAKE_PROGRAM_GALLERY,
                                      ) && <Gallery galleryType={'video'} />}
                                    </div>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </Tab>
                    ))}
                  </Tabs>

                  {/* <TabNavigation tabs={galleryTabs} headerComponent={<></>}>
                    <div className="mr-20 rounded border-2 border-[#e9ecef] flex flex-col gap-7 p-6 bg-main">
                      <Heading color="txt-secondary" fontSize="base">
                        {' '}
                        Gallery
                      </Heading>
                      <div className="text-primary-500 py-2 text-sm mr-3 flex space-x-4">
                        <Link
                          to={`${url}/addgallery`}
                          className="bg-secondary px-2 rounded-sm hover:bg-tertiary flex items-center justify-end">
                          {/* <Icon name="add" size={12} fill="primary" /> */}
                  {/* <Button>Add to Gallery</Button>
                        </Link>
                      </div>
                    </div> */}
                  {/* {imagegallery.map((image) => {
                      // eslint-disable-next-line react/jsx-key
                      return <h1>hello</h1>;
                    // })} */}
                  {/* // <Gallery /> */}
                  {/* </TabNavigation>  */}
                </>
              )}
            />
            {/* <Route
              exact
              path={`${path}/gallery/videos`}
              render={() => (
                <>
                  <h1>Being worked on </h1>
                </>
              )}
            /> */}

            <Route
              exact
              path={`${path}/addgallery`}
              render={() => (
                <PopupMolecule
                  closeOnClickOutSide={false}
                  title="Add items to Gallery"
                  open
                  onClose={handleClose}>
                  <AddGallery intakeProg={intakeProg} />
                </PopupMolecule>
              )}
            />
          </Switch>
        </TabNavigation>
      </div>
    </>
  );
}

export default IntakeProgramDetails;
