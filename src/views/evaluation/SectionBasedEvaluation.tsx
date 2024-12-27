import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import Button from '../../components/Atoms/custom/Button';
import PopupMolecule from '../../components/Molecules/Popup';
import EvaluationSubjects from '../../components/Organisms/evaluation/EvaluationSubjects';
import SectionBasedEvaluationContent from '../../components/Organisms/evaluation/SectionBasedEvaluationContent';
import { evaluationStore } from '../../store/evaluation/evaluation.store';
import { ParamType } from '../../types';
import { IQuestionaireTypeEnum } from '../../types/services/evaluation.types';

export default function SectionBasedEvaluation() {
  const { id: evaluationId } = useParams<ParamType>();
  const [showSubjectsAdd, setshowSubjectsAdd] = useState(false);
  const [showSubjects, setshowSubjects] = useState(false);
  const evaluationInfo = evaluationStore.getEvaluationById(evaluationId).data?.data.data;
 
  return (
    <>
      <SectionBasedEvaluationContent
        showSetQuestions={true}
        evaluationId={evaluationId}
        actionType="section_based">
        <Button
          disabled={evaluationInfo?.questionaire_type === IQuestionaireTypeEnum.MANUAL}
          styleType="outline"
          onClick={() =>
            evaluationInfo?.questionaire_type !== IQuestionaireTypeEnum.MANUAL &&
            setshowSubjects(true)
          }>
          Finish setting
        </Button>

        <div className="tooltip">
          {evaluationInfo?.evaluation_status != "PUBLISHED" &&(
          <Button
            styleType="outline"
            disabled={evaluationInfo?.questionaire_type === IQuestionaireTypeEnum.MANUAL}
            onClick={() =>
              evaluationInfo?.questionaire_type !== IQuestionaireTypeEnum.MANUAL &&
              setshowSubjectsAdd(true)
            }>
            Set questions
          </Button>)}
          {evaluationInfo?.questionaire_type === IQuestionaireTypeEnum.MANUAL && (
            <span className="tooltiptext">
              You cannot set questions for MANUAL evaluation
            </span>
          )}
        </div>

        <PopupMolecule
          closeOnClickOutSide={false}
          onClose={() => setshowSubjectsAdd(false)}
          open={showSubjectsAdd}
          title="Select subject to add questions">
          <EvaluationSubjects evaluationId={evaluationId} action="add_questions" />
        </PopupMolecule>

        {/* <Button>Save as template</Button> */}
      </SectionBasedEvaluationContent>

      <PopupMolecule
        onClose={() => setshowSubjects(false)}
        open={showSubjects}
        title="Select subject to finish setting">
        <EvaluationSubjects evaluationId={evaluationId} action="finish_setting" />
      </PopupMolecule>
    </>
  );
}
