import React, { FormEvent } from 'react';
import { useState,useEffect } from 'react';

import { queryClient } from '../../../../plugins/react-query';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom'; 
import Button from '../../../Atoms/custom/Button';
import { SelectData, ValueType } from '../../../../types'; 
import { getInstructorByAcademyOrderedByRank } from '../../../../store/instructordeployment.store';
import usePickedRole from '../../../../hooks/usePickedRole'; 
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import { UserView } from '../../../../types/services/user.types';
import { evaluationStore } from '../../../../store/evaluation/evaluation.store';

type ReviewerProps = {
        approver_id: string; 
  };



  export default function EditEvaluationAprrover({selectedEditId, evaluationId, selectedApprovalAdminId}: { selectedEditId: string, evaluationId:string, selectedApprovalAdminId: string}) {

    const history = useHistory();

    const [formState, setFormState] = useState<ReviewerProps>({ 
      approver_id: selectedApprovalAdminId, 
    }); 

    const { mutate: updateApprover, isLoading: updateTimeLoader } =  evaluationStore.updateEvaluationApprover();

    const picked_role = usePickedRole();

    const { data: instructorsInAcademy, isLoading } = getInstructorByAcademyOrderedByRank(
      picked_role?.academy_id,
    );

 
    const [instructors, setInstructors] = useState<UserView[]>([]);
    useEffect(() => { 
      let instructorsView: UserView[] = [];
  
      instructorsInAcademy?.data.data.content.forEach((inst) => { 
          let instructorView: UserView = {
            id: inst.user.id,
            rank: inst.user.person?.current_rank?.abbreviation,
            first_name: inst.user.first_name,
            last_name: inst.user.last_name,
            image_url: inst.user.image_url,
            alias_first_name: undefined,
            alias_last_name: undefined,
          };
 
          instructorsView.push(instructorView);
          
        // }
      });
  
      setInstructors(instructorsView);
    }, [instructorsInAcademy, picked_role?.academy_id]);

 
function handleChange({name, value }: ValueType) { 
    setFormState(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
//       function handleModuleChange(index: number, { name, value }: ValueType) {

//       }
    function submitForm<T>(e: FormEvent<T>) {
        e.preventDefault(); 
        const approverDetailsInfo:any= {
          id:selectedEditId,
          approverId:formState.approver_id
        }
        updateApprover(approverDetailsInfo, {
          onSuccess: () => {
            toast.success('Evaluation approver Updated successfully');
            queryClient.invalidateQueries(['evaluation',selectedEditId]);
            history.push(`/dashboard/evaluations/details/${evaluationId}/overview`);
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        });
    }

      


  return (
    <form onSubmit={submitForm}>  
        <SelectMolecule
                  className="pb-3"
                  width="36"
                  value={formState.approver_id}
                  name="approver_id"
                  placeholder="select approver"
                  handleChange={handleChange}
                //   handleChange={(e: ValueType) => handleModuleChange(index, e)}
                options={instructors.map((marker) => ({label: `${marker.rank} ${marker.first_name} ${marker.last_name}`,
                value: marker.id,
              }))} 
                  >
                  Evaluation approver
                </SelectMolecule>
 

    <div>
      <Button type="submit" full>
        Save
      </Button>
    </div> 
  </form>
  );
}
