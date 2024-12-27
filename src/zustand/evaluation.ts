/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { IStudentAnswer } from '../types/services/evaluation.types';
import {
  MarkingCorrection,
  StudentEvaluationInfo,
} from '../types/services/marking.types';

interface EvaluationState {
  evaluation: StudentEvaluationInfo | null;
  answers: Record<string, IStudentAnswer>;
  addEvaluation: (evaluation: StudentEvaluationInfo) => void;
  setAnswer: (id: string, answer: IStudentAnswer) => void;
  clearAnswers: () => void;
  // evaluation correction/marking
  correction: MarkingCorrection[];
  setCorrection: (correction: MarkingCorrection[]) => void;
  clearCorrection: () => void;
}

export const useEvaluationStore = create<EvaluationState>()(
  persist(
    (set) => ({
      evaluation: null,
      answers: {},
      addEvaluation: (evaluation) => set((state) => ({ ...state, evaluation })),
      setAnswer: (id, answer) =>
        set((state) => ({
          answers: {
            ...state.answers,
            [id]: answer,
          },
        })),
      clearAnswers: () => set((state) => ({ ...state, answers: {}, evaluation: null })),
      correction: [],
      setCorrection: (correction) => set((state) => ({ ...state, correction })),
      clearCorrection: () => set((state) => ({ ...state, correction: [] })),
    }),
    {
      name: 'evaluation-state',
    },
  ),
);
