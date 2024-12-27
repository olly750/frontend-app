import { Editor } from '@tiptap/react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Icon from '../../components/Atoms/custom/Icon';
import Heading from '../../components/Atoms/Text/Heading';
import Tiptap from '../../components/Molecules/editor/Tiptap';
import usePickedRole from '../../hooks/usePickedRole';
import { queryClient } from '../../plugins/react-query';
import intakeProgramStore from '../../store/administration/intake-program.store';
import { getTewtReport, reportStore } from '../../store/evaluation/school-report.store';
import { Privileges } from '../../types';
import { TwetForm } from '../../types/services/report.types';
import { isFailure } from '../../utils/school-report';

interface DSRParamType {
  studentId: string;
  periodId: string;
}

export default function DSReportOnStudent() {
  const [isPrinting, setisPrinting] = useState(false);
  const report = useRef(null);

  const picked_role = usePickedRole();
  const history = useHistory();
  let elements = document.getElementsByClassName('reportHide');
  const handlePrint = useReactToPrint({
    content: () => report.current,
    bodyClass: 'bg-white',
    documentTitle: 'student-end-term-report',
    onBeforeGetContent: () => setisPrinting(true),
    onAfterPrint: () => setisPrinting(false),
  });
  const { studentId, periodId } = useParams<DSRParamType>();
  const { data: studentInfo } = intakeProgramStore.getStudentById(studentId);
  const { mutate, isLoading } = reportStore.addTewt();
  const [details, setDetails] = useState<TwetForm>({
    id: '',
    pen_picture: '',
    student_id: '',
    term: '',
  });

  const [showPenPicture, setShowPenPicture] = useState(false);
  const [showEditPenPicture, setShowEditPenPicture] = useState(false);

  const { data: reportData } = getTewtReport(studentId, periodId);

  function handleEditorChange(editor: Editor) {
    setDetails((details) => ({ ...details, pen_picture: editor.getHTML() }));
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (details.pen_picture === '') {
      toast.error(`pen picture is required`);
    } else {
      mutate(details, {
        onSuccess(data) {
          toast.success(data.data.message);
          queryClient.invalidateQueries([
            'reports/student/term/tewt',
            studentId,
            periodId,
          ]);
          setShowPenPicture(false);
        },
        onError(error: any) {
          toast.error(error.response.data.message || 'error occurred please try again');
        },
      });
    }
  };

  useEffect(() => {
    setDetails((details) => ({ ...details, student_id: studentId, term: periodId }));
  }, [studentId, periodId]);

  const total_hpm =
    reportData?.data.data.answers.reduce(
      (acc, curr) => acc + curr.evaluation_question.mark,
      0,
    ) || 0;

  const total_obt =
    reportData?.data.data.answers.reduce((acc, curr) => acc + curr.mark_scored, 0) || 0;

  return (
    <div className="max-w-4xl">
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
            Download report
          </Button>
        </Permission>
      </div>
      <div
        ref={report}
        className="px-10 py-10 bg-white mx-auto max-w-4xl border border-gray-300 print:border-none">
        <div className="provider">
          <Heading
            fontWeight="semibold"
            fontSize="2xl"
            className="text-center underline uppercase">
            {picked_role?.academy?.name}
          </Heading>
          <Heading
            fontWeight="semibold"
            fontSize="base"
            className="text-center underline uppercase pt-2">
            EX KAZA IBIRINDIRO
          </Heading>
        </div>
        <Heading
          fontWeight="semibold"
          fontSize="sm"
          className="text-center underline my-8">
          REPORT ON STUDENT OFFICERS
        </Heading>
        {/* Student particulars */}
        <div className="part-one">
          <Heading fontSize="base" fontWeight="semibold">
            1. <span className="pl-8">Students Particulars</span>
          </Heading>
          <div className="grid grid-cols-3 py-8">
            <div className="border border-black py-1 px-2">CODE No</div>
            <div className="border border-black py-1 px-2 uppercase">Rank</div>
            <div className="border border-black py-1 px-2 uppercase">Names</div>
            <div className="border border-black py-1 px-2">
              {studentInfo?.data.data.reg_number || ''}
            </div>
            <div className="border border-black py-1 px-2">
              {studentInfo?.data.data.user.person?.current_rank?.abbreviation || ''}
            </div>
            <div className="border border-black py-1 px-2 capitalize">
              {studentInfo?.data.data.user.last_name || ''}{' '}
              {studentInfo?.data.data.user.first_name || ''}
            </div>
          </div>
        </div>
        {/* areas to assess */}
        <div className="part-two">
          <Heading fontSize="base" fontWeight="semibold">
            2. <span className="pl-8">Areas to Assess</span>
          </Heading>
          <div className="grid grid-cols-8 py-8">
            <div className="border border-black py-1 px-2 uppercase font-semibold">
              SER
            </div>
            <div className="border border-black py-1 px-2 uppercase col-span-5 font-semibold">
              Area of assessment
            </div>
            <div className="border border-black py-1 px-2 uppercase font-semibold">
              Highest score
            </div>
            <div className="border border-black py-1 px-2 uppercase font-semibold">
              Awarded marks
            </div>
            {reportData?.data.data.answers.map((item, i) => (
              <>
                <div className="border border-black py-1 px-2">
                  {(i + 1 + 9).toString(36).toLowerCase()}
                </div>
                <div
                  className="border border-black py-1 px-2 col-span-5"
                  dangerouslySetInnerHTML={{
                    __html: item.evaluation_question.question,
                  }}
                />
                <div className="border border-black py-1 px-2">
                  {item.evaluation_question.mark}
                </div>
                <div
                  className={`border border-black py-1 px-2 ${
                    isFailure(item.mark_scored, item.evaluation_question.mark)
                      ? 'text-error-500'
                      : ''
                  } `}>
                  {item.mark_scored}
                </div>
              </>
            ))}
            {/* total */}
            <div className="px-4 py-2 text-sm border border-black uppercase col-span-6 font-bold">
              Total
            </div>
            <div className="px-4 py-2 text-sm border border-black">{total_hpm}</div>
            <div
              className={`px-4 py-2 text-sm border border-black ${
                isFailure(total_obt, total_hpm) ? 'text-error-500' : ''
              }`}>
              {total_obt}
            </div>
          </div>
        </div>
        {/* pen picture */}
        <div className="part-three">
          <Heading fontSize="base" fontWeight="semibold">
            3. <span className="underline pl-8">Pen picture.</span>
          </Heading>
          {showPenPicture ? (
            <form onSubmit={handleSubmit} className="py-4 reportHide">
              <Tiptap content={details.pen_picture} handleChange={handleEditorChange} />
              <Button type="submit" className="mt-4" isLoading={isLoading}>
                Save
              </Button>
            </form>
          ) : reportData?.data.data ? (
            <div className="py-4">
              <Tiptap
                editable={showEditPenPicture}
                viewMenu={showEditPenPicture}
                handleChange={handleEditorChange}
                showBorder={false}
                content={reportData.data.data.pen_picture}
              />
              <Button
                styleType="outline"
                className="mt-5 reportHide"
                onClick={() => {
                  setShowEditPenPicture(!showEditPenPicture);
                }}>
                {showEditPenPicture ? (
                  <Heading fontSize="sm">Save</Heading>
                ) : (
                  <Heading fontSize="sm">Edit</Heading>
                )}
              </Button>
            </div>
          ) : (
            <div className="h-48 max-h-48 flex items-center py-10 gap-2 reportHide">
              <Heading fontSize="sm">No pen picture added</Heading>
              <span>-</span>
              <Button
                styleType="text"
                onClick={() => {
                  setShowPenPicture(!showPenPicture);
                }}>
                <Heading fontSize="sm" color="primary" fontWeight="semibold">
                  add one here
                </Heading>
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-3">
          <p className="text-sm">
            <span className="font-semibold">Rank and Names:</span>{' '}
            {studentInfo?.data.data.user.person?.current_rank?.abbreviation || ''}{' '}
            {studentInfo?.data.data.user.first_name}{' '}
            {studentInfo?.data.data.user.last_name}
          </p>
          <div className="h-12 px-4 col-span-2 flex gap-8">
            <p className="text-sm font-semibold">Signature: </p>
            <div className="h-12"></div>
            <p className="text-sm">
              <span className="font-semibold">Date: </span>
              {new Date().toDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
