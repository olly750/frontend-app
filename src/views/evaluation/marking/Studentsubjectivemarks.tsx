import { pick } from 'lodash';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';

import Icon from '../../../components/Atoms/custom/Icon';
import  * as  markingStore  from '../../../store/administration/marking.store';

type SubmissionsToDisplay = {
  id: string;
  'Student Code': string;
  'Obtained Marks': number | string;
  'Total Marks': number;
  'Attempted At': string;
  // 'Time Used': string;
  evaluation_module_subjects: [];
  status: string;
};

export default function Studentsubjectivemarks({ studentevalu }: any) {
  const studentAnswers = markingStore.getStudentEvaluationAnswers(studentevalu.id).data
    ?.data.data;

  let total = 0;
  let question = 0;
  {
    studentevalu.evaluation_module_subjects.map((data: any) =>
      studentAnswers?.map((studentAnswersdata: any) => {
        if (
          studentAnswersdata.marked != false &&
          data.id === studentAnswersdata.evaluation_question.evaluation_module_subject.id
        ) {
          total++;
        }
        if (
          data.id === studentAnswersdata.evaluation_question.evaluation_module_subject.id
        ) {
          question++;
        }
      }),
    );
  }

  return (
    <tr className="hover:bg-[#ffffff] cursor-pointer">
      <td className="h-12 flex items-center justify-center">
        <div className="flex gap-2 h-12 items-end mt-4 justify-end w-full">
          {total >= question ? (
            <span>
              <Icon name="tick" size={18} fill={'secondary'} />
            </span>
          ) : (
            <span>
              <Icon name="cross" size={18} fill={'warning'} />
            </span>
          )}
        </div>
        <br />
      </td>
    </tr>
  );
}
