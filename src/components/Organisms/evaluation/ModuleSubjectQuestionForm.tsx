import { Editor } from '@tiptap/react';
import React, { Fragment } from 'react';
import toast from 'react-hot-toast';

import  * as  evaluationService  from '../../../services/evaluation/evaluation.service';
import { evaluationStore } from '../../../store/evaluation/evaluation.store';
import { ValueType } from '../../../types';
import {
  IEvaluationQuestionsInfo,
  IEvaluationStatus,
  IQuestionType,
} from '../../../types/services/evaluation.types';
import { removeIdFromFileName } from '../../../utils/file-util';
import Button from '../../Atoms/custom/Button';
import Icon from '../../Atoms/custom/Icon';
import Heading from '../../Atoms/Text/Heading';
import Tiptap from '../../Molecules/editor/Tiptap';
import InputMolecule from '../../Molecules/input/InputMolecule';
import TextAreaMolecule from '../../Molecules/input/TextAreaMolecule';

export default function ModuleSubjectQuestionForm({
  question,
  index,
  showActions,
  setrefetchQuestions,
}: {
  question: IEvaluationQuestionsInfo;
  index: number;
  showActions?: boolean;
  setrefetchQuestions: (_val: boolean) => void;
}) {
  const { mutate: updateEvaluationQuestion } = evaluationStore.updateEvaluationQuestion();

  const [questionData, setQuestionData] =
    React.useState<IEvaluationQuestionsInfo>(question);

  function handleChange({ name, value }: ValueType) {
    setQuestionData({ ...questionData, [name]: Number(value) });
  }

  function updateStatus(questionId: string, status: IEvaluationStatus) {
    evaluationService
      .updateQuestionChoosen(questionId, status)
      .then(() => {
        if (status === IEvaluationStatus.REJECTED) {
          toast.success(
            "Question was marked as rejected. Make sure to add it's marks to add questions or add a new one",
            {
              duration: 5000,
            },
          );
        } else {
          toast.success('Successfully updated');
        }
        setrefetchQuestions(true);
      })
      .catch((error: any) => {
        toast.error('Failed to update', error.message);
      });
  }

  function saveUpdate() {
    updateEvaluationQuestion(questionData, {
      onSuccess() {
        toast.success(`Question ${index + 1} updated`);
      },
      onError(error: any) {
        toast.error(error.response.data.message);
      },
    });
  }

  function handleChangeEditor(editor: Editor, name: string) {
    let data = {
      ...questionData,
    };
    if (name === 'question') {
      data = {
        ...questionData,
        question: editor.getHTML(),
      };
    } else if (name === 'answer') {
      data = {
        ...questionData,
        answer: editor.getHTML(),
      };
    }
    setQuestionData(data);
  }
 
  return (
    <Fragment>
      <div className="mt-3 flex justify-between">
        <div className="flex flex-col gap-4">
          <Heading color="txt-secondary" fontSize="base">{`Question ${
            index + 1
          }`}</Heading>
          {showActions ? (
            <Tiptap
              handleChange={function (_editor: Editor): void {
                handleChangeEditor(_editor, 'question');
              }}
              editable={true}
              content={question.question}
            />
          ) : ( <>
            <div
              dangerouslySetInnerHTML={{
                __html: question.question,
              }}
            />
           {question.question_type  === IQuestionType.MULTIPLE_CHOICE ?(
           <>
                  <div className="flex flex-col gap-4">
            {question.multiple_choice_answers && question.multiple_choice_answers?.length > 0
              ? question.multiple_choice_answers?.map((multipleQuestion, choiceIndex) => (
                <>  
                 {multipleQuestion.correct ?(<button
      type="button"
      className="flex flex-col" >
      <div className="flex">
        <div
          className={`w-auto h-8 bg-lightblue text-primary-500 border-primary-500 border-2 rounded-tr-md rounded-br-md flex items-center px-2 justify-center`}
          style={{ minWidth: '20rem' }}>
         {multipleQuestion.answer_content}
        </div>
      </div>
    </button>):(<button
      type="button"
      className="flex flex-col" >
      <div className="flex"> 
        <div
          className={`w-auto h-8  border-2 rounded-tr-md rounded-br-md flex items-center px-4 justify-center`}
          style={{ minWidth: '20rem' }}>
         {multipleQuestion.answer_content}
        </div>
      </div>
    </button>)}
        
 
                </> 
                ))
              : null}
          </div>
           </>
           ):(
           <>
                  <div
                  className='bg-warning-500'
              dangerouslySetInnerHTML={{
                __html: question.answer,
              }}
            />
           </>
           )}
       
          </>)}

          {/* <Heading color="txt-secondary" fontSize="base">{`Question ${
            index + 1
          } answer`}</Heading>

          {showActions ? (
            <Tiptap
              handleChange={function (_editor: Editor): void {
                handleChangeEditor(_editor, 'answer');
              }}
              editable={false}
              content={question.answer}
            />
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: question.answer,
              }}
            />
          )} */}

          {question.attachments?.length > 0 && (
            <div className="flex flex-col py-3">
              <Heading fontSize="sm" color="primary" className="py-2">
                Question attachments
              </Heading>
              {question.attachments &&
                question.attachments?.map((attachment, index) => (
                  <a
                    className="text-blue-800 hover:underline"
                    href={`${
                      import.meta.env.VITE_EVALUATION_API_URL
                    }/evaluation-service/api/evaluationQuestions/${
                      attachment.id
                    }/loadAttachment`}
                    key={attachment.id}
                    target="_blank"
                    download
                    rel="noreferrer">
                    {index + 1}. {removeIdFromFileName(attachment.name)}
                  </a>
                ))}
            </div>
          )}
        </div>
        <div className="flex justify-center gap-5">
          {showActions ? (
            <InputMolecule
              value={question.mark}
              name={'mark'}
              type="number"
              style={{ width: '5rem', height: '2.5rem' }}
              handleChange={handleChange}
            />
          ) : (
            <Heading fontSize="sm">{question.mark}</Heading>
          )}
          <Heading fontWeight="semibold" fontSize="sm">
            {question.mark === 1 ? 'mark' : 'marks'}
          </Heading>
        </div>
      </div>

      {showActions && (
        <div className="self-end flex gap-4">
          {/* <button
            className={
              question?.choosen_question === IEvaluationStatus.ACCEPTED
                ? 'right-button'
                : 'normal-button'
            }
            onClick={() => updateStatus(question.id, IEvaluationStatus.ACCEPTED)}>
            <Icon
              name={'tick'}
              size={18}
              stroke={
                question?.choosen_question === IEvaluationStatus.PENDING ||
                question?.choosen_question === IEvaluationStatus.REJECTED
                  ? 'none'
                  : 'main'
              }
              fill={'none'}
            />
          </button>

          <button
            className={
              question?.choosen_question === IEvaluationStatus.REJECTED
                ? 'wrong-button'
                : 'normal-button'
            }
            onClick={() => updateStatus(question.id, IEvaluationStatus.REJECTED)}>
            <Icon
              name={'cross'}
              size={18}
              fill={
                question?.choosen_question === IEvaluationStatus.PENDING ||
                question?.choosen_question === IEvaluationStatus.ACCEPTED
                  ? 'none'
                  : 'main'
              }
            />
          </button> */}

          <Button onClick={() => saveUpdate()}>update question</Button>
        </div>
      )}

      <hr className="my-4" />
    </Fragment>
  );
}
