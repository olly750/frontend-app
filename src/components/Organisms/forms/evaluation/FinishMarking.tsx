import React, { FormEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router-dom';

import  * as  markingStore  from '../../../../store/administration/marking.store';
import { Link as LinkList, ValueType } from '../../../../types';
import Button from '../../../Atoms/custom/Button';
import Heading from '../../../Atoms/Text/Heading';
import BreadCrumb from '../../../Molecules/BreadCrumb';
import TextAreaMolecule from '../../../Molecules/input/TextAreaMolecule';

interface FinishMarks {
  student_code: string;
  obtained_marks: number;
  student_evaluation: string;
}

export default function FinishMarking({
  student_evaluation,
  student_code,
  obtained_marks,
}: FinishMarks) {
  const list: LinkList[] = [
    { to: '/', title: 'Instructor' },
    { to: 'evaluations', title: 'evaluations' },
    { to: '/evaluations/evaluation_id', title: 'Evaluation Details' },
    { to: 'evaluations/evaluation_id/marking_studentEvaluation', title: 'Marking' },
    { to: 'evaluations/evaluation_id/marking_studentEvaluation', title: 'Confirm Marks' },
  ];
  const { mutate, isLoading } = markingStore.finalizaMarkingWithRemarks();
  const history = useHistory();
  const [remark, setRemark] = useState('');
  const updateRemark = ({ value }: ValueType) => {
    setRemark(value.toString());
  };

  function submitForm(e: FormEvent) {
    e.preventDefault();

    mutate(
      {
        studentEvaluationId: student_evaluation,
        body: { remarks: remark, available: 'MARKED' },
      },
      {
        onSuccess: () => {
          toast.success('Remarks added successfully', { duration: 3000 });
          history.push('/dashboard/evaluations');
        },
        onError: (error) => {
          console.log(error);
          toast.error(error + '');
        },
      },
    );
  }

  return (
    <>
      <section>
        <BreadCrumb list={list}></BreadCrumb>
      </section>
      <div className="w-max bg-main px-6 py-10 mt-8">
        <div className="p-2 m-2">
          <Heading fontSize="sm" color="txt-secondary">
            Student Code
          </Heading>
          <Heading color="txt-secondary">{student_code}</Heading>
        </div>

        <div className="p-2 m-2">
          <Heading fontSize="xs" color="txt-secondary">
            Student Marks
          </Heading>
          <Heading color="success">{obtained_marks || 0}</Heading>
        </div>
        <form className="flex flex-col" onSubmit={(e: FormEvent) => submitForm(e)}>
          <TextAreaMolecule
            name={'question'}
            value={remark}
            placeholder="Your remarks here..."
            handleChange={updateRemark}>
            Add remarks
          </TextAreaMolecule>
          <div className="flex gap-4">
            <Button type="submit" isLoading={isLoading}>
              Add remark
            </Button>
            {/* <Button styleType={'text'} color={'tertiary'}>
              Publish later
            </Button> */}
          </div>
        </form>

        {/* <div className="pr-14">
                <div className="flex items-center">
                  <Icon name="attach" size={17} fill="primary" />
                  <Heading color="primary" fontSize="base">
                    Attach file
                  </Heading>
                </div>
              </div> */}
      </div>
    </>
  );
}
