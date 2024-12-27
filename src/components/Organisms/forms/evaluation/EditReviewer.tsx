import React, { FormEvent } from 'react';
import { useState,useEffect } from 'react';
import { queryClient } from '../../../../plugins/react-query';
import toast from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom';
import InputMolecule from '../../../Molecules/input/InputMolecule';
import Button from '../../../Atoms/custom/Button';
import { SelectData, ValueType } from '../../../../types'; 
import { evaluationStore } from '../../../../store/evaluation/evaluation.store'; 
import { getInstructorByAcademyOrderedByRank } from '../../../../store/instructordeployment.store';
import usePickedRole from '../../../../hooks/usePickedRole'; 
import SelectMolecule from '../../../Molecules/input/SelectMolecule';
import { UserView } from '../../../../types/services/user.types'; 

type ReviewerProps = {
        reviewer_id: string; 
  };



  export default function EditEvaluationSection({selectedEditId, selectedReviewerAdminId, evaluationId}: { selectedEditId: string, selectedReviewerAdminId: string,evaluationId: string }) {
    const history = useHistory();
    const [formState, setFormState] = useState<ReviewerProps>({  
      reviewer_id: selectedReviewerAdminId, 
    }); 

    const { mutate: updateReviewer, isLoading: updateTimeLoader } =  evaluationStore.updateEvaluationReviewer();
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

        const reviewerDetailsInfo:any= {
          id:selectedEditId,
          reviewerId:formState.reviewer_id
        }
  // console.log("reviewerDetailsInfo",reviewerDetailsInfo)
        updateReviewer(reviewerDetailsInfo, {
          onSuccess: () => {
            toast.success('Evaluation reviwer Updated successfully');
            queryClient.invalidateQueries(['evaluation',selectedReviewerAdminId]);
            history.push(`/dashboard/evaluations/details/${evaluationId}/overview`);
          },
          onError: (error: any) => {
            toast.error(error.response.data.message);
          },
        })
    }

      


  return (
    <form onSubmit={submitForm}> 
{/* {selectedReviewerAdminId}<br/>
{selectedEditId} */}
        <SelectMolecule
                  className="pb-3"
                  width="36"
                  value={formState.reviewer_id}
                  name="reviewer_id"
                  placeholder="select reviewer"
                  handleChange={handleChange}
                //   handleChange={(e: ValueType) => handleModuleChange(index, e)}
                options={instructors.map((marker) => ({label: `${marker.rank} ${marker.first_name} ${marker.last_name}`,
                value: marker.id,
              }))} 
                  >
                  Evaluation Reviewer
                </SelectMolecule>
 

    <div>
      <Button type="submit" full>
        Save
      </Button>
    </div> 
  </form>
  );
}
