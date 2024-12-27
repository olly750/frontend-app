import { Editor } from '@tiptap/react';
import React, { FormEvent, useRef, useState } from 'react';
import toast from 'react-hot-toast';
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
import useAuthenticator from '../../hooks/useAuthenticator';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import academyStore from '../../store/administration/academy.store';
import { getClassById } from '../../store/administration/class.store';
import intakeProgramStore from '../../store/administration/intake-program.store';
import {
  getDSCriticsReport,
  reportStore,
} from '../../store/evaluation/school-report.store';
import { Privileges } from '../../types';
import { DSAssessForm } from '../../types/services/report.types';

interface IParamType {
  levelId: string;
  classId: string;
  dsid: string;
}

export default function DSAssessmentSheet() {
  const [isPrinting, setisPrinting] = useState(false);
  const report = useRef(null);
  const { user } = useAuthenticator();
  const picked_role = usePickedRole();
  const { data: role_academy } = academyStore.getAcademyById(
    picked_role?.academy_id + '',
  );
  const history = useHistory();

  // const recipients =
  //   usersStore.getUsersByAcademy(picked_role?.academy_id.toString() || '').data?.data.data
  //     .content || [];

  const [details, setDetails] = useState<DSAssessForm>({
    term: 0,
    label: '',
    receiver: '',
    value: '',
    week: 0,
  });

  const { levelId, classId, dsid } = useParams<IParamType>();

  const { data: classInfo } = getClassById(classId);

  let periodOfThisClass = classInfo?.data.data.intake_academic_year_period_id;
  const { data: intakeProgLevel } = intakeProgramStore.getIntakeLevelById(levelId);
  const { data } = getDSCriticsReport(periodOfThisClass || 0);
  const reportData = data?.data.data || [];

  const rpt = reportData.find((rpt) => rpt.id === dsid);

  let elements = document.getElementsByClassName('reportHide');
  const handlePrint = useReactToPrint({
    content: () => report.current,
    bodyClass: 'bg-white',
    documentTitle: 'student-end-term-report',
    onBeforeGetContent: () => setisPrinting(true),
    onAfterPrint: () => setisPrinting(false),
  });

  const [open, setOpen] = useState(false);
  // const [isCreating, setCreating] = useState(false);

  const { mutate, isLoading } = reportStore.addDSCritique();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // if (details.receiver === '') {
    //   toast.error(`Please select recipient is required`);
    //} else
    if (details.label === '') {
      toast.error(`Please enter item of instruction`);
    } else if (details.value === '') {
      toast.error(`Please enter comment`);
      // } else if (details.week === 0) {
      //   toast.error(`Please enter week number`);
    } else {
      if (rpt) {
        mutate(
          {
            ...details,
            term: periodOfThisClass || 0,
            receiver: rpt?.receiver.adminId,
            week: rpt?.week,
          },
          {
            onSuccess(data) {
              toast.success(data.data.message);
              queryClient.invalidateQueries([
                'reports/student/level/critics',
                periodOfThisClass,
              ]);
              setOpen(false);
              // setCreating(false);
            },
            onError(error: any) {
              toast.error(
                error.response.data.message || 'error occurred please try again',
              );
            },
          },
        );
      }
    }
  };

  // function handleChange(e: ValueType) {
  //   setDetails((details) => ({
  //     ...details,
  //     [e.name]: e.value,
  //   }));
  // }

  function handleLabelChange(editor: Editor) {
    setDetails((details) => ({ ...details, label: editor.getHTML() }));
  }
  function handleValueChange(editor: Editor) {
    setDetails((details) => ({ ...details, value: editor.getHTML() }));
  }

  return (
    <>
      <Button
        styleType={'text'}
        onClick={() => history.goBack()}
        icon
        className="flex items-center p-2 hover:underline">
        <Icon name="chevron-left" fill="primary" size={16} />
        Back
      </Button>
      <div className="max-w-4xl">
        <div
          className={`${
            // rpt?.author.adminId === user?.id ? 'flex justify-between' :
            'text-right'
          } mb-5`}>
          {/* <Permission privilege={Privileges.CAN_WRITE_WEEKLY_CRITICS}> */}
          {/* {rpt?.author.adminId === user?.id && (
            <Button
              styleType="outline"
              onClick={() => {
                setOpen(!open), 
                setCreating(!isCreating);
              }}>
              Write DS Critics
            </Button>
          )} */}
          {/* </Permission> */}
          <Permission privilege={Privileges.CAN_DOWNLOAD_REPORTS}>
            <Button
              disabled={isPrinting}
              onClick={() => {
                for (const el of elements) {
                  el.classList.add('hidden');
                }

                handlePrint();

                for (const el of elements) {
                  el.classList.remove('hidden');
                }
              }}>
              Download Report
            </Button>
          </Permission>
        </div>
        <div
          ref={report}
          className="px-10 py-10 bg-white mx-auto max-w-4xl border border-gray-300 print:border-none">
          <div className="provider">
            <Heading fontWeight="medium" fontSize="lg" className="text-center uppercase">
              {role_academy?.data.data.name}
            </Heading>
            <Heading fontWeight="medium" fontSize="lg" className="text-center uppercase">
              {intakeProgLevel?.data.data.academic_program_level.program.name || ''} -{' '}
              {intakeProgLevel?.data.data.academic_program_level.level.name}
            </Heading>
          </div>
          <Heading
            fontWeight="semibold"
            fontSize="base"
            className="text-center underline my-8">
            DS CRITIQUE SHEET
          </Heading>

          {rpt ? (
            <>
              <div className="flex justify-between pb-8">
                <div className="flex items-center gap-2">
                  <Heading fontSize="lg" className="uppercase">
                    To
                  </Heading>
                  <Heading fontSize="base" className="capitalize italic">
                    {rpt.receiver.username || ''}
                  </Heading>
                </div>
                <div className="flex items-center gap-2">
                  <Heading fontSize="lg" className="uppercase">
                    From
                  </Heading>
                  <Heading fontSize="base" className="capitalize italic">
                    {rpt.author.username || ''}
                  </Heading>
                </div>
              </div>
              <div className="flex justify-between pb-8">
                <div className="flex items-center gap-2">
                  <Heading
                    fontWeight="semibold"
                    fontSize="base"
                    className="text-center my-8">
                    COURSE CRITIQUE FOR WEEK:
                  </Heading>
                  <Heading fontSize="base">4</Heading>
                </div>
                <div className="flex items-center gap-2">
                  <Heading fontSize="lg" className="uppercase" fontWeight="semibold">
                    Term
                  </Heading>
                  <Heading fontSize="base">{''}</Heading>
                </div>
              </div>
              <div className="grid grid-cols-12">
                <div className="p-1 border border-black text-sm font-bold">Ser</div>
                <div className="py-1 px-4 col-span-5 border border-black text-sm font-bold">
                  Item of Instruction
                </div>
                <div className="p-2 col-span-6 border border-black text-sm font-bold">
                  Comments
                </div>
                {/* table body */}
                {rpt.critique_rows?.map((cr, index) => (
                  <React.Fragment key={index}>
                    <div className="px-4 py-2 text-sm border border-black">
                      <Tiptap
                        showBorder={false}
                        content={`${index + 1}`}
                        editable={false}
                        viewMenu={false}
                        handleChange={() => {}}
                      />
                    </div>
                    <div className="px-4 py-2 text-sm border border-black col-span-5">
                      <Tiptap
                        showBorder={false}
                        content={cr.label}
                        editable={false}
                        viewMenu={false}
                        handleChange={() => {}}
                      />
                    </div>
                    <div className="px-4 py-2 text-sm border border-black col-span-6">
                      <Tiptap
                        showBorder={false}
                        content={cr.value}
                        editable={false}
                        viewMenu={false}
                        handleChange={() => {}}
                      />
                    </div>
                  </React.Fragment>
                ))}
              </div>
              {rpt.author.adminId === user?.id && (
                <Permission privilege={Privileges.CAN_WRITE_WEEKLY_CRITICS}>
                  <div className="reportHide flex justify-center py-2">
                    <Button
                      icon
                      onClick={() => {
                        setOpen(!open);
                        // setCreating(false);
                      }}
                      className="rounded-sm">
                      <Icon name="add" fill="main" size={12} />
                    </Button>
                  </div>
                </Permission>
              )}
            </>
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
      </div>
      <PopupMolecule
        title="Write DS critics on level"
        closeOnClickOutSide={false}
        open={open}
        onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          {/* {isCreating ? (
            <div>
              <ILabel className="py-4 font-semibold">To (Recipient)</ILabel>
              <SelectMolecule
                handleChange={handleChange}
                name={'receiver'}
                options={getDropDownOptions({
                  inputs: recipients,
                  labelName: ['first_name', 'last_name'],
                })}
              />
              <div>
                <ILabel className="py-4 font-semibold">Week number</ILabel>
                <InputMolecule
                  type="number"
                  name={'week'}
                  handleChange={handleChange}
                  value={details.week}
                />
              </div>
            </div>
          ) : null} */}
          <div>
            <ILabel className="py-4 font-semibold">Item of instruction</ILabel>
            <Tiptap handleChange={handleLabelChange} content={details.label} />
          </div>
          <div>
            <ILabel className="py-4 font-semibold">Comments</ILabel>
            <Tiptap handleChange={handleValueChange} content={details.value} />
          </div>
          <Button type="submit" isLoading={isLoading}>
            Save
          </Button>
        </form>
      </PopupMolecule>
    </>
  );
}
