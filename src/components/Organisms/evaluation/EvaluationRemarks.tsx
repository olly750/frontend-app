import React from 'react';
import { useParams } from 'react-router-dom';

import { getEvaluationFeedbacks } from '../../../store/evaluation/evaluation.store';
import { ParamType } from '../../../types';
import { IEvaluationAction } from '../../../types/services/evaluation.types';
import { Instructor } from '../../../types/services/instructor.types';
import { getLocalStorageData } from '../../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../../utils/utils';
import Heading from '../../Atoms/Text/Heading';

export default function EvaluationRemarks({
  actionType,
}: {
  actionType: IEvaluationAction;
}) {
  const { id } = useParams<ParamType>();
  const feedbacks = getEvaluationFeedbacks(id, actionType).data?.data.data || [
    { id: '', remarks: '', reviewer: { adminId: '' } },
  ];

  return (
    <>
      <Heading fontWeight="semibold" fontSize="base" className="pt-6">
        Evaluation remarks
      </Heading>
      <div className={`'bg-main  px-7 pt-5 flex flex-col gap-4 mt-8 w-12/12 pb-5`}>
        <ul>
          {feedbacks.map((feedback, index) => {
            let instructorInfo = getObjectFromLocalStrg(
              getLocalStorageData('instructorInfo'),
            ) as Instructor;

            return feedback.remarks ? (
              <div className="flex flex-col gap-2 pb-4" key={feedback.id}>
                <Heading fontSize="base" fontWeight="semibold">
                  {`${instructorInfo?.user.person?.current_rank?.abbreviation || ''} ${
                    instructorInfo?.user?.first_name
                  } ${instructorInfo?.user?.last_name}` || ''}
                </Heading>
                <Heading
                  fontSize="sm"
                  fontWeight="normal">{`=> ${feedback.remarks}`}</Heading>
              </div>
            ) : (
              <Heading key={index} fontSize="base" fontWeight="semibold">
                No remarks found
              </Heading>
            );
          })}
        </ul>
      </div>
    </>
  );
}
