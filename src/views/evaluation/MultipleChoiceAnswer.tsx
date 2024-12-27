import React from 'react';

interface IMultipleChoiceAnswerProps {
  answer_content: string;
  choiceId: string;
  correct?: boolean;
  highlight?: boolean;
  handleChoiceSelect?: (_choiceId: string) => void;
}

export default function MultipleChoiceAnswer({
  answer_content,
  correct = false,
  choiceId,
  highlight,
  handleChoiceSelect = (_choiceId = '') => {},
}: IMultipleChoiceAnswerProps) {
  const classes =
    correct || highlight
      ? 'bg-lightblue text-primary-500 border-primary-500 text-primary-500'
      : 'border-tertiary';

  return (
    <button
      type="button"
      className="flex w-fit flex-col bg-secondary"
      onClick={() => handleChoiceSelect(choiceId)}>
      <div className="flex">
        <div
          className={`w-14 h-12 ${classes} text-lg border-primary-500' border-2 border-r-0 rounded-tl-md rounded-bl-md right-rounded-md flex items-center justify-center`}>
          *
        </div>
        <div
          className={`w-auto h-12 ${classes} border-2 rounded-tr-md rounded-br-md flex items-center px-4`}
          style={{ minWidth: '20rem' }}>
          {answer_content}
        </div>
      </div>
    </button>
  );
}
