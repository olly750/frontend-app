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
import EditEvaluationAprrover from "../forms/evaluation/EditEvaluationAprrover"

export default function ApprovalsList() {
    const { id: evaluationId } = useParams<ParamType>();
    const [approvers, setApprovers] = useState<{ first_name: string, id: string | number, last_name: string }[]>([]);


    // get evaluation by id 
    const { data: evaluationApprovers, isLoading: loadingIds } = evaluationStore.getEvaluationApprovalsById(evaluationId)


    const [approvalIDs, setApprovalIDs] = useState<string[]>([])

    useEffect(() => {
        if (evaluationApprovers?.data.data) {
            //@ts-ignore
            setApprovalIDs(evaluationApprovers?.data.data.reduce((acc, curr) => {
                if (!curr.approver) return
                return [...acc, curr.approver.adminId]
            }, []) as string[])
        }
    }, [evaluationApprovers?.data.data])



    const { mutate, data, isLoading: loadingInstructors } = instructordeploymentStore.getUsersByRanks();

    useEffect(() => {
        mutate(approvalIDs as unknown as string[])
    }, [approvalIDs])

 
  
  useEffect(() => {
      if (!loadingInstructors && data?.data.data && evaluationApprovers?.data.data) {
          const approvalsArray = evaluationApprovers.data.data.map((approve, index) => {
              const instructor = data.data.data[index];
              return {
                  id: approve.id,
                  first_name: instructor?.first_name,
                  last_name: instructor?.last_name,
                  email: instructor?.email,
                  phone: instructor?.phone,
                  status: approve.evaluation_approval_status, 
              };
          });
          setApprovers(approvalsArray);
      }
  }, [data?.data.data, evaluationApprovers?.data.data, loadingInstructors]);
    // useEffect(() => {
    //     if (!loadingInstructors && data?.data.data && evaluationApprovers?.data.data) {
    //         const approvalsArray = data.data.data.map(approve => {
    //             // Find the corresponding evaluationApprover using adminId
    //             const evaluationApprover = evaluationApprovers.data.data.find(approver => approver.approver.adminId === approve.id);
    //             // Access status from evaluationApprover if it exists 
    //             const id = evaluationApprover ? evaluationApprover.id : '';
    //             return {
    //                 id: id, 
    //                 first_name: approve.first_name,
    //                 last_name: approve.last_name,
    //                 email: approve.email,
    //                 phone: approve.phone, 
    //             };
    //         });
    //         setApprovers(approvalsArray);
    //     }
    // }, [data?.data.data, evaluationApprovers?.data.data, loadingInstructors]);
 

    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedEditId, setSelectedEditId] = useState<string | null>(null); 
    const [selectedApprovalAdminId, setSelectedApprovalAdminId] = useState<string | null>(null);

    const actions = [
        {
         name: 'Edit',
         handleAction: (id: string | number | undefined) => {
           if (typeof id === 'string') {
             setSelectedEditId(id);
           } 
 
           const filteredApproverAdm: any = evaluationApprovers?.data.data.filter(item => item.id === id).map(item => item.approver?.adminId );       
           setSelectedApprovalAdminId(filteredApproverAdm.toString());
           setIsPopupVisible(true)
         }, 
       },
     ];

    if (loadingInstructors || loadingIds) return <Loader />


    return <Fragment>
        <Heading className="py-4">
            Approvals
        </Heading>

        {!approvers.length ? <NoDataAvailable title={'Nothing to show here'} description={'There is no approval for this evaluation'} /> : <Table2 data={approvers}   statusColumn="status" actions={actions} showSelect={true} hide={["id"]} uniqueCol="id" />}

        {isPopupVisible && (
        <PopupMolecule
          closeOnClickOutSide={false}
          title="Edit approvers"
          open={true}
          onClose={() => setIsPopupVisible(false)}
        >
          <EditEvaluationAprrover evaluationId={evaluationId ?? ''} selectedEditId={selectedEditId ?? ''}   selectedApprovalAdminId={selectedApprovalAdminId ?? ''}/>
        </PopupMolecule>
      )}
    </Fragment>

}
