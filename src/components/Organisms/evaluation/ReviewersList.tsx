import React, { Fragment, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import instructordeploymentStore from '../../../store/instructordeployment.store';
import { ParamType } from '../../../types';
import Loader from '../../Atoms/custom/Loader';
import Heading from '../../Atoms/Text/Heading';
import NoDataAvailable from '../../Molecules/cards/NoDataAvailable';
import Table2 from '../../Molecules/table/Table';
import PopupMolecule from '../../Molecules/Popup';
import EditReviewer from "../forms/evaluation/EditReviewer"

export default function ReviewersList() {
    const { id: evaluationId } = useParams<ParamType>();
    const [reviewers, setReviewers] = useState<{ first_name: string, id: string | number, last_name: string }[]>([]);


    // get evaluation by id 
    const { data: evaluationReviewers, isLoading: loadingIds } = evaluationStore.getEvaluationReviewersById(evaluationId)


    const [reviwersIDs, setReviwerIDs] = useState<string[]>([])

    useEffect(() => {
        if (evaluationReviewers?.data.data) {
            //@ts-ignore
            setReviwerIDs(evaluationReviewers?.data.data.reduce((acc, curr) => {
                if (!curr.reviewer) return
                return [...acc, curr.reviewer.adminId]
            }, []) as string[])
        }
    }, [evaluationReviewers?.data.data])



    const { mutate, data, isLoading: loadingInstructors } = instructordeploymentStore.getUsersByRanks();

    useEffect(() => {
        mutate(reviwersIDs as unknown as string[])
    }, [reviwersIDs])
    useEffect(() => {
        if (!loadingInstructors && data?.data.data && evaluationReviewers?.data.data) {
            const reviewersArray = evaluationReviewers.data.data.map((review, index) => {
                const instructor = data.data.data[index];
                return {
                    id: instructor?.id,
                    first_name: instructor?.first_name,
                    last_name: instructor?.last_name,
                    email: instructor?.email,
                    phone: instructor?.phone,
                    status: review.evaluation_reviewer_status, 
                };
            });
            setReviewers(reviewersArray);
        }
    }, [data?.data.data, evaluationReviewers?.data.data, loadingInstructors]);
    
 
    

    // useEffect(() => {
    //     if (!loadingInstructors && data?.data.data) {
    //         console.log("data", evaluationReviewers?.data.data)
    //         let reviewersArray = []
    //         for (const review of data.data.data) {
    //             reviewersArray.push({
    //                 id: review.id,
    //                 first_name: review.first_name,
    //                 last_name: review.last_name,
    //                 email: review.email,
    //                 phone: review.phone,
    //                 status: evaluation_reviewer_status
    //             })
    //         }
    //         setReviewers(reviewersArray)
    //     }
    // }, [data?.data.data])

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedEditId, setSelectedEditId] = useState<string | null>(null);
    const [selectedReviewerAdminId, setSelectedReviewerAdminId] = useState<string | null>(null);

 
    const actions = [
        {
         name: 'Edit',
         handleAction: (id: string | number | undefined) => {
           if (typeof id === 'string') {
            setSelectedReviewerAdminId(id);
           }
           const filteredReviewerAdm:any = evaluationReviewers?.data.data.filter(item => item.reviewer.adminId === id).map(item => item.id);       
           setSelectedEditId(filteredReviewerAdm.toString());

           setIsPopupVisible(true)
         }, 
       },
     ];

    if (loadingInstructors || loadingIds) return <Loader />


    return <Fragment>
        <Heading className="py-4">
            Reviewers
        </Heading>

        {!reviewers.length ? <NoDataAvailable title={'Nothing to show here'} description={'There is no reviewers for this evaluation'} /> : <Table2 data={reviewers}   statusColumn="status" actions={actions} showSelect={true} hide={["id"]} uniqueCol="id" />}

        {isPopupVisible && (
        <PopupMolecule
          closeOnClickOutSide={false}
          title="Edit Reviewers"
          open={true}
          onClose={() => setIsPopupVisible(false)}
        >
          <EditReviewer  evaluationId={evaluationId ?? ''} selectedEditId={selectedEditId ?? ''} selectedReviewerAdminId={selectedReviewerAdminId ?? ''}/>
        </PopupMolecule>
      )}
    </Fragment>

}
