import { pick } from 'lodash';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import useAuthenticator from '../../hooks/useAuthenticator';
import { ParamType } from '../../types';
import { getStudentShipByUserId } from '../../store/administration/intake-program.store';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import Heading from '../../components/Atoms/Text/Heading';
import StudentViewAssignments from './StudentViewAssignments';

export default function Submitted() {
    const history = useHistory();  
    const { user } = useAuthenticator();
   const { url, path } = useRouteMatch();
   
//    const { data: student, isLoading: studLoad } = getStudentShipByUserId(
//     user?.id + '' || '',
//     !!user?.id,
//   );
//   const { data: studentEvaluations,
//      isLoading: loading 
//     } =   evaluationStore.getStudentEvaluationsByStudent(student?.data.data[0]?.id);

// const evaluationDetails=[];
 
 
// {studentEvaluations?.data.data && studentEvaluations?.data.data.length > 0 ?
//     studentEvaluations?.data.data.map((evaluation, index) => {   
//         evaluationDetails.push(evaluation.evaluation) 
//     }) : null}

    // console.log("data",studentEvaluations?.data.data )
          
    return (
        <>  
{/*   
        {loading ? (
          <Loader />
        ) : studentEvaluations.length == 0 ? (
          <NoDataAvailable
            icon="level"
            showButton={false}
            title={'Your summission list is empty!'}
            description="Dear student, you have not yet submit any assignment"
          />
        ) :(
             <>
               <Heading fontSize="base" fontWeight="bold">
               Submitted Assignment
          </Heading> 

          { evaluationDetails && evaluationDetails.length > 0 ?(
        <div className="flex flex-col gap-4 mt-8"> 
          <StudentViewAssignments            
            evaluationDetails={evaluationDetails}
          />
        </div>
      ) : null} */}

             {/* </>
            )
        } */}
      </>
 

    );
}