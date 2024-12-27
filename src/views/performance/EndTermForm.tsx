import { Editor } from '@tiptap/react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Heading from '../../components/Atoms/Text/Heading';
import ILabel from '../../components/Atoms/Text/ILabel';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Tiptap from '../../components/Molecules/editor/Tiptap';
import PopupMolecule from '../../components/Molecules/Popup';
import { Tab, Tabs } from '../../components/Molecules/tabs/tabs';
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import { getClassById } from '../../store/administration/class.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import {
  getStudentInformativeReport,
  reportStore,
} from '../../store/evaluation/school-report.store';
import { Privileges } from '../../types';
import {
  ISubjectiveForm,
  TermFormComment,
  TermFormSection,
} from '../../types/services/report.types';
import { usePicture } from '../../utils/file-util';
import { calculateGrade, formatPercentage } from '../../utils/school-report';

// const sections = [
//   'Introduction',
//   'Written Work',
//   'Oral work',
//   'Attitude to Work',
//   'Practical Ability',
//   'Extra-Curricular Activities',
//   'Summary',
// ];

// const comments = [
//   'Intellectual Competence',
//   'Professional Competence',
//   'Personal Qualities',
// ];
interface EoTParamType {
  levelId: string;
  classId: string;
  studentId: string;
  periodId: string;
}

type TermFormSectionValue = `${TermFormSection}`;

const sections: TermFormSectionValue[] = Object.values(TermFormSection);

type TermFormCommentValue = `${TermFormComment}`;

const comments: TermFormCommentValue[] = Object.values(TermFormComment);

export default function EndTermForm() {
  const [isPrinting, setisPrinting] = useState(false);
  const report = useRef(null);
  const { t } = useTranslation();

  const picked_role = usePickedRole();

  //path params
  const { classId, studentId, periodId, levelId } = useParams<EoTParamType>();
  const history = useHistory();

  const { data: period } = intakeProgramStore.getPeriodsByLevel(+levelId);

  const { data: reportData } = getStudentInformativeReport(studentId, periodId);

  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [subjective, setSubjective] = useState({ id: '', content: '' });
  const [section, setSection] = useState<TermFormComment | TermFormSection>(
    TermFormSection.INTRODUCTION,
  );
  const [details, setDetails] = useState<ISubjectiveForm>({
    studentId: '',
    subjectiveLabel: TermFormSection.INTRODUCTION,
    subjectiveValue: '',
    termId: '',
  });
  useEffect(() => {
    setDetails((details) => ({
      ...details,
      studentId: studentId,
      termId: periodId,
      subjectiveLabel: section,
    }));
  }, [periodId, studentId, section]);

  const { mutate, isLoading } = reportStore.createSubjective();
  const { mutateAsync, isLoading: isEditting } = reportStore.editSubjective();
  function handleEditorChange(editor: Editor) {
    setDetails((details) => ({ ...details, subjectiveValue: editor.getHTML() }));
  }

  const returnSection = (label: string) => {
    const subjectives = reportData?.data.data.studentSubjective || [];
    for (const element of subjectives) {
      if (element.subjective_label == label) {
        return element;
      }
    }
    return null;
  };

  const { user: currentUser } = useAuthenticator();
  const { data: classInfo } = getClassById(classId);
  const { data: studentInfo } = intakeProgramStore.getStudentById(studentId);

  const termName =
    period?.data.data.find((prd) => prd.id == periodId)?.academic_period.name || '';

  const handlePrint = useReactToPrint({
    content: () => report.current,
    bodyClass: 'bg-white',
    documentTitle: 'student-end-term-report',
    onBeforeGetContent: () => setisPrinting(true),
    onAfterPrint: () => setisPrinting(false),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (details.subjectiveValue === '') {
      toast.error(`${details.subjectiveLabel.replaceAll('_', ' ')} is required`);
    } else {
      mutate(details, {
        onSuccess(data) {
          toast.success(data.data.message);
          queryClient.invalidateQueries([
            'reports/student/term/informative',
            studentId,
            periodId,
          ]);
          setOpen(false);
          setDetails({
            studentId: '',
            subjectiveLabel: TermFormSection.INTRODUCTION,
            subjectiveValue: '',
            termId: '',
          });
        },
        onError(error: any) {
          toast.error(error.response.data.message || 'error occurred please try again');
        },
      });
    }
  };

  const handleEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (details.subjectiveValue === '') {
      toast.error(`${section.replaceAll('_', ' ')} is required`);
    } else {
      mutateAsync(
        Object.assign(details, { id: subjective.id, subjectiveLabel: section }),
        {
          onSuccess(data) {
            toast.success(data.data.message);
            queryClient.invalidateQueries([
              'reports/student/term/informative',
              studentId,
              periodId,
            ]);
            setEditOpen(false);
            setSubjective({ id: '', content: '' });
          },
          onError(error: any) {
            toast.error(error.response.data.message || 'error occurred please try again');
          },
        },
      );
    }
  };

  let elements = document.getElementsByClassName('reportHide');
  let bluebackgrounds = document.getElementsByClassName('blueBackground');
  let redbackgrounds = document.getElementsByClassName('redBackground');

  const allowedToChangeInfo = currentUser
    ? studentInfo?.data.data.user.id !== currentUser.id
    : false;

  function download() {
    {
      for (const el of elements) {
        el.classList.add('hidden');
      }
      for (const el of bluebackgrounds) {
        el.classList.replace('bg-blue-100', 'bg-white');
      }
      for (const el of redbackgrounds) {
        el.classList.replace('bg-red-100', 'bg-white');
      }
      handlePrint();
      for (const el of elements) {
        el.classList.remove('hidden');
      }
      for (const el of bluebackgrounds) {
        el.classList.replace('bg-white', 'bg-blue-100');
      }
      for (const el of redbackgrounds) {
        el.classList.replace('bg-white', 'bg-red-100');
      }
    }
  }

  return (
    <div className="max-w-4xl">
      <Tabs>
        <Tab label="Student View">
          {reportData?.data.data ? (
            <div className="flex items-center justify-between mb-5">
              <Button
                styleType={'text'}
                onClick={() => history.goBack()}
                icon
                className="flex items-center p-2 hover:underline">
                <Icon name="chevron-left" fill="primary" size={16} />
                Back
              </Button>
              <Permission privilege={Privileges.CAN_DOWNLOAD_REPORTS}>
                <Button disabled={isPrinting} onClick={download}>
                  Download report
                </Button>
              </Permission>
            </div>
          ) : null}
          <div ref={report}>
            <div className="provider px-10 blueBackground bg-blue-100 py-10 mx-auto max-w-4xl border border-b-0 border-gray-300 print:border-none">
              <Heading
                fontWeight="medium"
                fontSize="lg"
                className="text-center uppercase">
                {picked_role?.academy?.name}
              </Heading>
              <img
                src={usePicture(
                  picked_role?.academy?.logo_attachment_id,
                  picked_role?.academy?.id,
                  '/images/rdf-logo.png',
                  'logos',
                )}
                alt="Institution logo"
                className=" mx-auto w-32 object-cover block my-5"
                onError={(e) => {
                  e.currentTarget.src = '/images/rdf-logo.png';
                }}
              />
            </div>
            {reportData?.data.data ? (
              <div className="px-10 blueBackground bg-blue-100 py-10 mx-auto max-w-4xl border border-t-0 border-gray-300 print:border-none">
                <h1 className="text-center font-bold underline my-8 text-base">
                  STUDENT {termName} REPORT
                </h1>
                {/* Part one */}
                <div className="part-one">
                  <Heading
                    className="underline uppercase"
                    fontSize="base"
                    fontWeight="semibold">
                    Part 1
                  </Heading>
                  <div className="my-4">
                    <div className="flex">
                      <div className="border border-black py-1 text-center w-40">
                        {t('Period')}
                      </div>
                      <div className="border border-black py-1 text-center w-32">
                        {termName}
                      </div>
                    </div>
                    <div className="flex">
                      <div className="border border-black py-1 text-center w-40">
                        {t('Class')}
                      </div>
                      <div className="border border-black py-1 text-center w-32">
                        {classInfo?.data.data.class_name}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5">
                    <div className="border border-black py-1 px-2">Army/service</div>
                    <div className="border border-black py-1 px-2">Rank</div>
                    <div className="border border-black py-1 px-2">Surname</div>
                    <div className="border border-black py-1 px-2">Initials</div>
                    <div className="border border-black py-1 px-2">First Name</div>
                    <div className="border border-black py-1 px-2">
                      {picked_role?.academy?.institution.short_name}
                    </div>
                    <div className="border border-black py-1 px-2">
                      {studentInfo?.data.data.user.person?.current_rank?.abbreviation ||
                        ''}
                    </div>
                    <div className="border border-black py-1 px-2 capitalize">
                      {studentInfo?.data.data.user.last_name}
                    </div>
                    <div className="border border-black py-1 px-2"></div>
                    <div className="border border-black py-1 px-2 capitalize">
                      {studentInfo?.data.data.user.first_name}
                    </div>
                  </div>
                </div>
                {/* Part 2 */}
                <div className="part-two py-10">
                  <Heading
                    className="underline mb-8 uppercase"
                    fontSize="base"
                    fontWeight="semibold">
                    Part 2
                  </Heading>
                  {sections.map((section, index) => {
                    let subjective = returnSection(section);

                    return (
                      <div key={index}>
                        <Heading
                          className="underline my-4"
                          fontSize="sm"
                          fontWeight="semibold">
                          {`${index + 1}. ${section.replaceAll('_', ' ')}.`}
                        </Heading>
                        {subjective ? (
                          <div className="h-48 py-5">
                            <Tiptap
                              showBorder={false}
                              backgroundColor={'bg-transparent'}
                              content={subjective.subjective_value}
                              editable={false}
                              viewMenu={false}
                              handleChange={() => {}}
                            />
                            {allowedToChangeInfo && (
                              <Permission
                                privilege={Privileges.CAN_WRITE_INFORMATIVE_REPORT}>
                                <Button
                                  styleType="outline"
                                  className="mt-5 reportHide"
                                  onClick={() => {
                                    setSubjective({
                                      id: subjective?.id + '',
                                      content: subjective?.subjective_value + '',
                                    });
                                    setSection(TermFormSection[section]);
                                    setEditOpen(!editOpen);
                                  }}>
                                  <Heading fontSize="sm">Edit</Heading>
                                </Button>
                              </Permission>
                            )}
                          </div>
                        ) : (
                          <div className="h-48 max-h-48 flex items-center py-10 gap-2 reportHide">
                            <Heading fontSize="sm">No subjective added</Heading>
                            {allowedToChangeInfo && (
                              <Permission
                                privilege={Privileges.CAN_WRITE_INFORMATIVE_REPORT}>
                                <span>-</span>
                                <Button
                                  styleType="text"
                                  onClick={() => {
                                    setOpen(!open);
                                    setSection(TermFormSection[section]);
                                  }}>
                                  <Heading
                                    fontSize="sm"
                                    color="primary"
                                    fontWeight="semibold">
                                    add one here
                                  </Heading>
                                </Button>
                              </Permission>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="flex items-center space-x-3">
                    <Heading className="underline" fontSize="sm" fontWeight="semibold">
                      8. Overall grading:
                    </Heading>
                    <Heading fontWeight="semibold">
                      {calculateGrade(
                        reportData.data.data.evaluationAttempts.reduce(
                          (acc, curr) => acc + curr.obtained,
                          0,
                        ) +
                          reportData.data.data.dsAssessments.reduce(
                            (acc, curr) => acc + curr.obtained,
                            0,
                          ),
                        reportData.data.data.evaluationAttempts.reduce(
                          (acc, curr) => acc + curr.maximum,
                          0,
                        ) +
                          reportData.data.data.dsAssessments.reduce(
                            (acc, curr) => acc + curr.maximum,
                            0,
                          ),
                      )}
                    </Heading>
                  </div>
                </div>
              </div>
            ) : (
              <NoDataAvailable
                icon="academy"
                fill={false}
                showButton={false}
                title={'Report has not been processed'}
                description="This report has not been processed yet or you are currently not allowed to see it"
                privilege={Privileges.CAN_ACCESS_REPORTS}
              />
            )}
          </div>
        </Tab>

        <Tab label={allowedToChangeInfo ? 'Management View' : ''}>
          {reportData?.data.data ? (
            <div className="text-right mb-5">
              <Permission privilege={Privileges.CAN_DOWNLOAD_REPORTS}>
                <Button
                  disabled={isPrinting}
                  onClick={() => {
                    for (const el of elements) {
                      el.classList.add('hidden');
                    }
                    for (const el of bluebackgrounds) {
                      el.classList.replace('bg-blue-100', 'bg-white');
                    }
                    for (const el of redbackgrounds) {
                      el.classList.replace('bg-red-100', 'bg-white');
                    }
                    handlePrint();
                    for (const el of elements) {
                      el.classList.remove('hidden');
                    }
                    for (const el of bluebackgrounds) {
                      el.classList.replace('bg-white', 'bg-blue-100');
                    }
                    for (const el of redbackgrounds) {
                      el.classList.replace('bg-white', 'bg-red-100');
                    }
                  }}>
                  Download report
                </Button>
              </Permission>
            </div>
          ) : null}
          <div ref={report}>
            {reportData?.data.data ? (
              <div className="px-10 redBackground bg-red-100 py-10 mx-auto max-w-4xl border border-gray-300 print:border-none">
                {/* Part 3 */}
                <div className="part-two py-10">
                  <Heading
                    className="underline mb-8 uppercase"
                    fontSize="base"
                    fontWeight="semibold">
                    PART 3: ASSESSED EXERCISES
                  </Heading>
                  <div className="grid grid-cols-12">
                    {/* table header */}
                    <div className="p-1 border border-black text-sm font-bold">Sr</div>
                    <div className="py-1 px-4 col-span-5 border border-black text-sm font-bold">
                      GRADED EXERCISES
                    </div>
                    <div className="p-2 col-span-2 border border-black text-sm font-bold">
                      HIGHEST POSSIBLE MARKS
                    </div>
                    <div className="p-2 col-span-2 border border-black text-sm font-bold">
                      STUDENT&apos;S MARKS
                    </div>
                    <div className="p-2 col-span-2 border border-black text-sm font-bold">
                      GRADE
                    </div>
                    {/* table body */}
                    {reportData.data.data.evaluationAttempts.map((exercise, index) => (
                      <React.Fragment key={index}>
                        <div className="px-4 py-2 text-sm border border-black">
                          {index + 1}
                        </div>
                        <div className="px-4 py-2 text-sm border border-black col-span-5">
                          {exercise.evaluationName}
                        </div>
                        <div className="px-4 py-2 text-sm border border-black col-span-2">
                          {exercise.maximum}
                        </div>
                        <div className="px-4 py-2 text-sm border border-black col-span-2">
                          {exercise.obtained}
                        </div>
                        <div className="px-4 py-2 text-sm border border-black col-span-2">
                          {calculateGrade(exercise.obtained, exercise.maximum)}
                        </div>
                      </React.Fragment>
                    ))}
                    {/* total */}
                    <div className="border border-black" />
                    <div className="px-4 py-2 text-sm border border-black uppercase col-span-5 font-bold">
                      Total
                    </div>
                    <div className="px-4 py-2 text-sm border border-black col-span-2">
                      {reportData.data.data.evaluationAttempts.reduce(
                        (acc, curr) => acc + curr.maximum,
                        0,
                      )}
                    </div>
                    <div className="px-4 py-2 text-sm border border-black col-span-2">
                      {reportData.data.data.evaluationAttempts.reduce(
                        (acc, curr) => acc + curr.obtained,
                        0,
                      )}
                    </div>
                    <div className="px-4 py-2 text-sm border border-black col-span-2">
                      {calculateGrade(
                        reportData.data.data.evaluationAttempts.reduce(
                          (acc, curr) => acc + curr.obtained,
                          0,
                        ),
                        reportData.data.data.evaluationAttempts.reduce(
                          (acc, curr) => acc + curr.maximum,
                          0,
                        ),
                      )}
                    </div>
                  </div>
                </div>

                {/* Part 4 */}
                <div className="part-two py-10">
                  <Heading
                    className="underline mb-4 uppercase"
                    fontSize="base"
                    fontWeight="semibold">
                    PART 4: DS ASSESSMENT
                  </Heading>
                  <div className="grid grid-cols-12 pt-8">
                    {/* table header */}
                    <div className="p-1 border border-black text-sm font-bold">Sr</div>
                    <div className="py-1 px-4 col-span-7 border border-black text-sm font-bold">
                      STAFF WORK
                    </div>
                    <div className="p-2 col-span-4 border border-black text-sm font-bold">
                      MARK (1) 1 to 5
                    </div>

                    {/* table body */}
                    {reportData.data.data.dsAssessments.map((dsAssessment, index) => (
                      <React.Fragment key={index}>
                        <div className="px-4 py-2 text-sm border border-black">
                          {index + 1}
                        </div>
                        <div className="px-4 py-2 text-sm border border-black col-span-7">
                          {dsAssessment.evaluationName}
                        </div>
                        <div className="px-4 py-2 text-sm border border-black col-span-4">
                          {dsAssessment.obtained}
                        </div>
                      </React.Fragment>
                    ))}
                    {/* total */}
                    <div className="border border-black" />
                    <div className="px-4 py-2 text-sm border border-black uppercase col-span-7 font-bold">
                      Total
                    </div>
                    <div className="px-4 py-2 text-sm border border-black col-span-4">
                      {reportData.data.data.dsAssessments.reduce(
                        (acc, curr) => acc + curr.obtained,
                        0,
                      )}
                    </div>
                  </div>
                </div>

                {/* Part 5 */}
                <div className="part-two py-10">
                  <Heading
                    className="underline mb-8 uppercase"
                    fontSize="base"
                    fontWeight="semibold">
                    PART 5: TERM ASSESSMENT
                  </Heading>

                  <div className="grid grid-cols-12">
                    {/* table header */}
                    <div className="p-1 border border-black text-sm font-bold">Sr</div>
                    <div className="py-1 px-4 col-span-5 border border-black text-sm font-bold">
                      GRADED EXERCISES
                    </div>
                    <div className="p-2 col-span-2 border border-black text-sm font-bold">
                      DS ASSESSMENT
                    </div>
                    <div className="p-2 col-span-2 border border-black text-sm font-bold">
                      TOTAL MARK AS % OF HPM
                    </div>
                    <div className="p-2 col-span-2 border border-black text-sm font-bold">
                      OVERALL GRADE FOR TERM
                    </div>
                    {/* table body */}
                    <div className="h-8 border border-black"></div>
                    <div className="h-8 border border-black col-span-5 px-4">
                      {reportData.data.data.evaluationAttempts.reduce(
                        (acc, curr) => acc + curr.obtained,
                        0,
                      )}
                    </div>
                    <div className="h-8 border border-black col-span-2 px-4">
                      {reportData.data.data.dsAssessments.reduce(
                        (acc, curr) => acc + curr.obtained,
                        0,
                      )}
                    </div>
                    <div className="h-8 border border-black col-span-2 px-4">
                      {formatPercentage(
                        reportData.data.data.evaluationAttempts.reduce(
                          (acc, curr) => acc + curr.obtained,
                          0,
                        ) +
                          reportData.data.data.dsAssessments.reduce(
                            (acc, curr) => acc + curr.obtained,
                            0,
                          ),
                        reportData.data.data.evaluationAttempts.reduce(
                          (acc, curr) => acc + curr.maximum,
                          0,
                        ) +
                          reportData.data.data.dsAssessments.reduce(
                            (acc, curr) => acc + curr.maximum,
                            0,
                          ),
                      )}
                    </div>
                    <div className="h-8 border border-black col-span-2 px-4">
                      {calculateGrade(
                        reportData.data.data.evaluationAttempts.reduce(
                          (acc, curr) => acc + curr.obtained,
                          0,
                        ) +
                          reportData.data.data.dsAssessments.reduce(
                            (acc, curr) => acc + curr.obtained,
                            0,
                          ),
                        reportData.data.data.evaluationAttempts.reduce(
                          (acc, curr) => acc + curr.maximum,
                          0,
                        ) +
                          reportData.data.data.dsAssessments.reduce(
                            (acc, curr) => acc + curr.maximum,
                            0,
                          ),
                      )}
                    </div>
                  </div>

                  <Heading
                    className="underline my-8 uppercase"
                    fontSize="sm"
                    fontWeight="semibold">
                    DS COMMENTS
                  </Heading>
                  {comments.map((comment, index) => {
                    let subjective = returnSection(comment);

                    return (
                      <div key={index}>
                        <Heading
                          className="underline my-4"
                          fontSize="sm"
                          fontWeight="semibold">
                          {`${index + 1}. ${comment.replaceAll('_', ' ')}.`}
                        </Heading>
                        {subjective ? (
                          <div className="h-48  max-h-48 py-5">
                            <Tiptap
                              content={subjective.subjective_value}
                              editable={false}
                              viewMenu={false}
                              handleChange={() => {}}
                            />

                            <Button
                              styleType="outline"
                              className="mt-5 reportHide"
                              onClick={() => {
                                setSubjective({
                                  id: subjective?.id + '',
                                  content: subjective?.subjective_value + '',
                                });
                                setSection(TermFormComment[comment]);
                                setEditOpen(!editOpen);
                              }}>
                              <Heading fontSize="sm">Edit</Heading>
                            </Button>
                          </div>
                        ) : (
                          <div className="h-48 max-h-48 flex items-center py-10 gap-2 reportHide">
                            <Heading fontSize="sm">No subjective added</Heading>
                            <span>-</span>
                            <Button
                              styleType="text"
                              onClick={() => {
                                setOpen(!open);
                                setSection(TermFormComment[comment]);
                              }}>
                              <Heading
                                fontSize="sm"
                                color="primary"
                                fontWeight="semibold">
                                add one here
                              </Heading>
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* chief instructor */}
                <Heading className="underline py-2" fontSize="sm" fontWeight="semibold">
                  Chief {t('Instructor')}
                </Heading>
                <div className="grid grid-cols-3 pt-4">
                  <p className="text-sm">
                    <span className="font-semibold">Date: </span>{' '}
                    {new Date().toDateString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-semibold">Rank: </span>
                  </p>
                  <div className="h-12 px-4 flex">
                    <p className="text-sm font-semibold">Signature: </p>
                  </div>
                </div>
              </div>
            ) : (
              <NoDataAvailable
                icon="academy"
                fill={false}
                showButton={false}
                title={'Report has not been processed'}
                description="This report has not been processed yet or you are currently not allowed to see it"
                privilege={Privileges.CAN_ACCESS_REPORTS}
              />
            )}
          </div>
        </Tab>
      </Tabs>
      <PopupMolecule
        title="Add subjective"
        closeOnClickOutSide={false}
        open={open}
        onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <ILabel className="py-4 font-semibold">
            {details.subjectiveLabel.replaceAll('_', ' ')}
          </ILabel>
          <Tiptap handleChange={handleEditorChange} content={details.subjectiveValue} />

          <Button className="mt-4" type="submit" isLoading={isLoading}>
            Add
          </Button>
        </form>
      </PopupMolecule>
      <PopupMolecule
        title="Edit subjective"
        closeOnClickOutSide={false}
        open={editOpen}
        onClose={() => setEditOpen(false)}>
        <form onSubmit={handleEditSubmit}>
          <ILabel className="py-4 font-semibold">{section.replaceAll('_', ' ')}</ILabel>
          <Tiptap handleChange={handleEditorChange} content={subjective.content} />
          <Button type="submit" isLoading={isEditting}>
            Save
          </Button>
        </form>
      </PopupMolecule>
    </div>
  );
}
