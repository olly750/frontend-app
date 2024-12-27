import React, { useEffect, useState } from 'react'; 
import { Link, Route, Switch, useHistory, useRouteMatch,useParams } from 'react-router-dom';
import Loader from '../components/Atoms/custom/Loader';
import NoDataAvailable from '../components/Molecules/cards/NoDataAvailable';
import Table from '../components/Molecules/table/Table';
import { subjectService } from '../services/administration/subject.service';
import { userService } from '../services/administration/user.service';
import { evaluationStore } from '../store/evaluation/evaluation.store';
import { ParamType } from '../types';
import PopupMolecule from '../components/Molecules/Popup';
import { IEvaluationStatus,IEvaluationSectionBased } from '../types/services/evaluation.types';
import { ActionsType } from '../types/services/table.types';
import EditSection from '../components/Organisms/forms/evaluation/EditSection'

type ProggresSettingsProps = {
  subject: string;
  marks: string;
  questions: string;
  id: string;
  section: string;
  setter: string;
  marker: string;
  status: IEvaluationStatus;
};

export default function EvaluationSettingProgress() {
  const { id } = useParams<ParamType>();
  const { path,url } = useRouteMatch();
  const history = useHistory();

  const [isLoading, setIsloading] = useState(false);
  const [progress, setProgress] = useState<ProggresSettingsProps[]>([]);
  const { data: evaluationInfo, isLoading: evaluationLoading } =
    evaluationStore.getEvaluationById(id);
  useEffect(() => {
    let filteredInfo: ProggresSettingsProps[] = [];

    async function get() {
      setIsloading(true);
      if (evaluationInfo?.data.data.evaluation_module_subjects) {
        //   alert('we fetched');
        for (let [
          index,
          subj,
        ] of evaluationInfo.data.data.evaluation_module_subjects.entries()) {
          // request one
          const subjectData = await subjectService.getSubject(
            subj.subject_academic_year_period.toString(),
          );

          let temp:any = {
            id: '',
            section: '',
            subject: '',
             marks: '',
             questions: '',
            setter: '',
            marker: '',
            status: IEvaluationStatus.ACCEPTED,
          };
          temp.subject = subjectData.data.data.title;
          temp.section = `section ${index + 1}`;
          temp.section = subj.section_name;
           temp.marks = subj.section_total_marks;
           temp.questions = subj.number_of_questions;
          temp.status = subj.questionaire_setting_status;
          temp.id = subj.id;

          //request two
          const adminId: any = subj && subj.marker && subj.marker.adminId;
          const user = await userService.getUserByid(subj.instructor_subject_assignment);
          const section_marker = await userService.getUserByid(adminId);
          temp.setter = `${
            user.data?.data.person?.current_rank?.abbreviation || ''
          } ${user.data?.data.first_name} ${user.data?.data.last_name}`;

          temp.marker= `${
            section_marker.data?.data.person?.current_rank?.abbreviation || ''
          } ${section_marker.data?.data.first_name} ${section_marker.data?.data.last_name}`;

          filteredInfo.push(temp);
        }

        setProgress(filteredInfo);
        setIsloading(false);
      }
    }
    get();
  }, [evaluationInfo?.data.data.evaluation_module_subjects]);

  const controlActions: ActionsType<ProggresSettingsProps>[] = [];

  controlActions.push({
    name: 'Edit Section',
    handleAction: (id: string | number | undefined) => { 
      const sec = id;
      history.push(`${url}/${sec}/`);
    }, 
  });

  function handleClose() {
    history.goBack();
  }
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedEditId, setSelectedEditId] = useState<string | null>(null);

  const actions = [
     {
      name: 'Edit Section',
      handleAction: (id: string | number | undefined) => {
        if (typeof id === 'string') {
          setSelectedEditId(id);
        }
        setIsPopupVisible(true)
      }, 
    },
  ];


  return (

              <div>
                {evaluationLoading || isLoading ? (
                  <Loader />
                ) : (
                  <>
                    {progress.length > 0 ? (
                      <Table<ProggresSettingsProps>
                        statusColumn="status"
                        data={progress}
                        actions={actions}
                        uniqueCol={'id'}
                        hide={['id']}


                      />
                    ) : (
                      <NoDataAvailable
                        title={'No data available'}
                        description={'Try creating sections on this evaluation'}
                        showButton={false}
                      />
                    )}
                  </>
                    )}

{isPopupVisible && (
        <PopupMolecule
          closeOnClickOutSide={false}
          title="Edit Section Details"
          open={true}
          onClose={() => setIsPopupVisible(false)}
        >
           {selectedEditId !== null ? (
      <EditSection selectedEditId={selectedEditId} evaluationId={id} />
    ) : (
      <p>Error: No selected edit ID available</p>
    )}
          {/* <EditSection selectedEditId={selectedEditId} evaluationId={id}/> */}
        </PopupMolecule>
      )}

              </div> 
     
      );
}
