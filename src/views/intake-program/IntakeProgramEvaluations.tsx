import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import CommonCardMolecule from '../../components/Molecules/cards/CommonCardMolecule';
import Heading from '../../components/Atoms/Text/Heading';
import Permission from '../../components/Atoms/auth/Permission';
import Button from '../../components/Atoms/custom/Button';
import Loader from '../../components/Atoms/custom/Loader';
import NoDataAvailable from '../../components/Molecules/cards/NoDataAvailable';
import PopupMolecule from '../../components/Molecules/Popup';
import TabNavigation, { TabType } from '../../components/Molecules/tabs/TabNavigation';
import SelectMolecule from '../../components/Molecules/input/SelectMolecule';
import useInstructorLevels from '../../hooks/getInstructorLevels';
import intakeProgramStore, {
  getIntakeProgramsByStudent,
  getStudentLevels,
} from '../../store/administration/intake-program.store';
import { getLevelsByAcademicProgram } from '../../store/administration/program.store';
import { evaluationStore } from '../../store/evaluation/evaluation.store'; 
import { SelectData, ValueType } from '../../types';
import {
  IntakeProgParam,
  IntakeLevelParam,
} from '../../types/services/intake-program.types';
import { CommonCardDataType, Link as LinkList, Privileges } from '../../types';
import {
    IEvaluationOwnership,
    IEvaluationSectionBased,
    IEvaluationSettingType,
    IEvaluationStatus,
    IQuestionaireTypeEnum,
    ISubjects,
  } from '../../types/services/evaluation.types';
import { getLocalStorageData } from '../../utils/getLocalStorageItem';
import { getObjectFromLocalStrg } from '../../utils/utils';
import EvaluationDetailedReport from "../evaluation/EvaluationDetailedReport"

interface IntakeProgramEvaluationsProp {
  action: 'learn' | 'manage' | 'teach';
}
interface CardEvaluaitonInfoType extends CommonCardDataType {
    settingType: IEvaluationSettingType;
    questionaireType: IQuestionaireTypeEnum;
    created_on: string;
    evaluation_module_subjects: IEvaluationSectionBased[];
  }
  
function IntakeProgramEvaluations({ action }: IntakeProgramEvaluationsProp) {
  const history = useHistory();
  const { path } = useRouteMatch(); 
  const { intakeProg, intakeId, id } = useParams<IntakeProgParam>();
  const { level } = useParams<IntakeLevelParam>();
  const [intakeAcademicYearPeriodId, setSelectedPeriod] = useState('');
  
 

const { data: allEvaluations, isLoading: loading,isSuccess } = evaluationStore.getEvaluationsCollectionByPeriod(intakeAcademicYearPeriodId || '');
  const { data: period } = intakeProgramStore.getPeriodsByLevel(+level);



  let newPeriod: any[]= [];
  period?.data.data.forEach((mod) => {
    newPeriod.push({
       id: mod.id,
       name: mod.academic_period.name
       },)
  });

  const periodToDisplay = newPeriod.map((lv) => {
    return {
      value: lv.id,
      label: lv.name,
    };
  }) as SelectData[];

  function handleChangePeriod(e: ValueType) {
    setSelectedPeriod(e.value + '');
 
  }
  const [evaluations, setEvaluations] = useState<CardEvaluaitonInfoType[]>([]); 


useEffect(() => {
    let formattedEvals: CardEvaluaitonInfoType[] = [];

    function getTypeColor(color: IEvaluationStatus) {
      switch (color) {
        case IEvaluationStatus.APPROVED:
          return 'success';
        case IEvaluationStatus.PUBLISHED:
          return 'success';
        case IEvaluationStatus.REJECTED || IEvaluationStatus.REVIEW_REJECTED:
          return 'reject';
        case IEvaluationStatus.MARKED:
          return 'marked';
        case IEvaluationStatus.REVIEWED:
          return 'reviewed';
        default:
          return 'warning';
      }
    }

    allEvaluations?.data.data.forEach((evaluation) => {
      let formattedEvaluations: CardEvaluaitonInfoType = {
        created_on: evaluation.created_on,
        questionaireType: evaluation.questionaire_type,
        settingType: evaluation.setting_type,
        id: evaluation.id,
        title: evaluation.name,
        code: '',
        description: `${evaluation.total_mark} marks`,
        status: {
          type: getTypeColor(evaluation.evaluation_status),
          text: evaluation.evaluation_status.replaceAll('_', ' '),
        },
        evaluation_module_subjects: evaluation.evaluation_module_subjects,
      };
      formattedEvals.push(formattedEvaluations);
    });
    setEvaluations(formattedEvals);
  }, [allEvaluations?.data.data]);

  function findEvaluationById(evaluationId: string) {
    return evaluations.find((evaluation) => evaluation.id === evaluationId);
  }
 
  const handleClick = async (id: string) => {
    const evaluationInfo = findEvaluationById(id);
  
     if (evaluationInfo?.id === id) {
        history.push(`/dashboard/evaluations/details/${id}/detailedreport`);
    //     if (
    //         evaluationInfo.questionaireType === IQuestionaireTypeEnum.MANUAL ||
    //         evaluationInfo.questionaireType === IQuestionaireTypeEnum.HYBRID ||
    //         evaluationInfo.questionaireType === IQuestionaireTypeEnum.FIELD ||
    //         evaluationInfo.settingType === IEvaluationSettingType.SUBJECT_BASED
    //       ) {
    //         history.push(`${path}/details/${id}/review`);

    //         return;
    //       }

     }
  }

  return (
    <>
         <SelectMolecule
              className="p-2"
              width="2/5"
              handleChange={handleChangePeriod}
              name={'periodId'}
              placeholder="Select term"
              value={intakeAcademicYearPeriodId}
              options={periodToDisplay}
            /> 
 <Switch>
          <section className="flex flex-wrap justify-start gap-4 mt-2">
                {loading && evaluations.length === 0 && <Loader />}
                {isSuccess && evaluations.length === 0 ? (
                  <NoDataAvailable
                    icon="evaluation"
                    showButton={false}
                    title={'No evaluations available'}
                    description="Consider adding some evaluation to see them here!"
                  />
                ) : isSuccess && evaluations.length > 0 ? (
                  evaluations?.map((info) => (
                    <div key={info.id}>
                      <CommonCardMolecule
                        className='cursor-pointer'
                        data={info}
                        handleClick={() => handleClick(info.id + '')}>
                        <div>
                          <div className="flex gap-4 pt-4">
                            <Heading fontSize="sm" fontWeight="semibold">
                              Type:{' '}
                            </Heading>

                            <Heading fontSize="sm" color="primary">
                              {info.questionaireType}
                            </Heading>
                          </div>
                          <div className="flex gap-4 pt-4">
                            <Heading fontSize="sm" fontWeight="semibold">
                              Setting type:{' '}
                            </Heading>

                            <Heading fontSize="sm" color="primary">
                              {(info.settingType || '').replaceAll('_', ' ')}
                            </Heading>
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Heading fontSize="sm" fontWeight="semibold">
                              Created on:{' '}
                            </Heading>

                            <Heading fontSize="sm" color="primary">
                              {(info.created_on || '').replaceAll('_', ' ')}
                            </Heading>
                          </div>
                        </div>
                      </CommonCardMolecule>
                    </div>
                  ))
                )  :  <NoDataAvailable
                icon="evaluation"
                showButton={false}
                title={'No evaluations available'}
                description="Consider adding some evaluation to see them here!"
              />}
              </section>

              <Route
            exact
            path={`${path}/completed/student-evaluation/:id/detailedreport`}
            component={EvaluationDetailedReport}
          />

              </Switch>
    </>
  );
}

export default IntakeProgramEvaluations;
