import React, { FormEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

import useAuthenticator from '../../../../hooks/useAuthenticator';
import usePickedRole from '../../../../hooks/usePickedRole';
import { evaluationStore } from '../../../../store/evaluation/evaluation.store';
import { getInstructorsDeployedInAcademy } from '../../../../store/instructordeployment.store';
import { SelectData, ValueType } from '../../../../types';
import {
  IEvaluationApproval,
  IMarkingType,
} from '../../../../types/services/evaluation.types';
import Button from '../../../Atoms/custom/Button';
import Heading from '../../../Atoms/Text/Heading';
import ILabel from '../../../Atoms/Text/ILabel';
import DropdownMolecule from '../../../Molecules/input/DropdownMolecule';
import SwitchMolecule from '../../../Molecules/input/SwitchMolecule';




export default function EvaluationSettings() {

    const { user } = useAuthenticator();
  const picked_role = usePickedRole();

  const { evaluationId } = useParams<{ evaluationId: string }>();

  const instructors = getInstructorsDeployedInAcademy(picked_role?.academy_id + '').data
    ?.data.data;

  const rankedInstructors =
    instructors?.filter((inst) => inst.user.person?.current_rank) || [];
  const unrankedInstructors =
    instructors?.filter(
      (inst) => inst !== rankedInstructors.find((ranked) => ranked.id === inst.id),
    ) || [];

  rankedInstructors.sort(function (a, b) {
    if (a.user.person && b.user.person) {
      return a.user.person.current_rank?.priority - b.user.person.current_rank?.priority;
    } else {
      return 0;
    }
  });

  const finalInstructors = rankedInstructors.concat(unrankedInstructors);

  const { data: evaluationInfo } =
    evaluationStore.getEvaluationById(evaluationId + '').data?.data || {};

 
  const [to_be_reviewed, setToBeReviewed] = useState(false);
  const [to_be_approved, setToBeApproved] = useState(false);
  const [approver_ids, setApprovalIds]= useState('');
  const [reviewer_ids, setReviewerIds]= useState('');
  const [marker_ids, setMarkerIds]= useState('');

  const handleto_be_reviewedChange = () => {
    setToBeReviewed(!to_be_reviewed);
  };

  const handleto_be_approvedChange = () => {
    setToBeApproved(!to_be_approved);
  };


  const { mutate, isLoading } = evaluationStore.createEvaluationSettings();


  function handleChangeReviewer({ name, value }: ValueType) { 
    setReviewerIds(value.toString());

    // setReviewerIds({ reviewer_ids: value.toString() });
  } 

  function handleChangeAprover({ name, value }: ValueType) {
    setApprovalIds(value.toString());

    // setApprovalIds({approver_ids: value.toString() }); 
  }

  function handleChange({ name, value }: ValueType) {
    setMarkerIds(value.toString());
    // setMarkerIds({marker_ids: value.toString() }); 
  }

   function handleSubmit(e: FormEvent) {
    e.preventDefault();
 

 
    // if (
    //   !marker_ids &&
    //   evaluationInfo?.marking_type !== IMarkingType.PER_SECTION
    // ) {
    //   marker_ids = user?.id.toString() || '';
    // }

    const settingdata: IEvaluationApproval = { 
     approver_ids: to_be_approved ? (approver_ids.toString() || '') : user?.id.toString() || '',
      evaluation_id: evaluationId + '',
      id:"",
      reviewer_ids:  to_be_reviewed ? (reviewer_ids.toString() || '') : user?.id.toString() || '',
      to_be_approved: true,
      to_be_reviewed: true
    }
 

    

    mutate(settingdata, {
      onSuccess: () => {
        toast.success('Settings added', { duration: 5000 });
        // To make sure that the evaluations are updated on the page
        window.location.href = '/dashboard/evaluations';
      },
      onError: (error: any) => {
        toast.error(error.response.data.message, { duration: 5000 });
      },
    });
  }
  return (
        <form onSubmit={handleSubmit}>
      <Heading fontSize="base" fontWeight="semibold">
        Evaluation Settings
      </Heading>
         <div className="pt-6 flex-col">
                      <ILabel>Evaluation Reviewing status</ILabel>
                    <SwitchMolecule
                      loading={false}
                      name="to_be_reviewed"
                      value={to_be_reviewed}
                      handleChange={handleto_be_reviewedChange}>
                      {to_be_reviewed}
                    </SwitchMolecule>
      </div>
    <div> 

      {to_be_reviewed && 
        <div className="pt-6">
          <DropdownMolecule
            isMulti
            width="60"
            placeholder="Reviewer"
            options={
              finalInstructors?.map((instr) => ({
                label: `${instr.user.person?.current_rank?.abbreviation || ''} ${
                  instr.user.first_name
                } ${instr.user.last_name}`,
                value: instr.user.id,
              })) as SelectData[]
            }
            name="reviewer_ids"
           handleChange={handleChangeReviewer}
            >
            To be reviewed by
          </DropdownMolecule>
        </div>
}
                <div className="pt-6 flex-col">
                      <ILabel>Evaluation Approval status</ILabel>
                    <SwitchMolecule
                      loading={false}
                      name="to_be_approved"
                      value={to_be_approved}
                      handleChange={handleto_be_approvedChange}>
                      {to_be_reviewed}
                    </SwitchMolecule>
                </div>
 
         <div>

        {to_be_approved &&  (
        <div className="pt-6">
          <DropdownMolecule
            isMulti
            width="60"
            placeholder="Approver"
            options={
              instructors?.map((instr) => ({
                label: `${instr.user.person?.current_rank?.abbreviation || ''}  ${
                  instr.user.first_name
                } ${instr.user.last_name}`,
                value: instr.user.id,
              })) as SelectData[]
            }
            name="approver_ids"
            handleChange={handleChangeAprover}
            >
            To be approved by
          </DropdownMolecule>
        </div>
      )}
      </div>
          {evaluationInfo?.marking_type !== IMarkingType.PER_SECTION && (
        <div className="pt-6">
          <DropdownMolecule
            isMulti
            width="60"
            placeholder="Marker"
            options={
              instructors?.map((instr) => ({
                label: `${instr.user.person?.current_rank?.abbreviation || ''}  ${
                  instr.user.first_name
                } ${instr.user.last_name}`,
                value: instr.user.id,
              })) as SelectData[]
            }
            name="marker_ids"
             handleChange={handleChange}
            >
            To be marked by
          </DropdownMolecule>
        </div>
      )}
        <div className="pt-4">
           <Button type="submit" isLoading={isLoading}>
             Finish
            </Button>
         </div>
    </div>
    </form>
  );
};

 

