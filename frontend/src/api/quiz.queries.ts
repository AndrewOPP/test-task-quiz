import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createQuiz,
  deleteQuiz,
  getQuizById,
  getQuizzes,
  type CreateQuizInput,
  type QuizListItem,
} from '@/api/quiz.api';
import type { DraftQuestion } from '@/lib/mock-quizzes';

export const quizKeys = {
  all: ['quizzes'] as const,
  list: () => [...quizKeys.all, 'list'] as const,
  detail: (quizId: string) => [...quizKeys.all, 'detail', quizId] as const,
};

function normalizeCheckboxCorrectAnswers(options: string[], selectedAnswers: string[]) {
  const availableOptions = options.map((option) => option.trim()).filter(Boolean);
  const selected = selectedAnswers.filter((answer) => availableOptions.includes(answer));

  if (selected.length > 0) {
    return selected;
  }

  return availableOptions.length > 0 ? [availableOptions[0]] : [];
}

function mapDraftQuestionToApiQuestion(
  question: DraftQuestion,
): CreateQuizInput['questions'][number] {
  if (question.type === 'BOOLEAN') {
    return {
      text: question.text.trim(),
      type: question.type,
      options: ['True', 'False'],
      correctAnswers: [question.correctAnswer === 'False' ? 'False' : 'True'],
    };
  }

  if (question.type === 'INPUT') {
    const correctAnswer = question.correctAnswer.trim();

    return {
      text: question.text.trim(),
      type: question.type,
      options: null,
      correctAnswers: correctAnswer ? [correctAnswer] : [],
    };
  }

  const options = question.options.map((option) => option.trim()).filter(Boolean);

  return {
    text: question.text.trim(),
    type: question.type,
    options,
    correctAnswers: normalizeCheckboxCorrectAnswers(options, question.correctAnswers),
  };
}

export function useQuizzesQuery() {
  return useQuery({
    queryKey: quizKeys.list(),
    queryFn: getQuizzes,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

export function useQuizQuery(quizId?: string) {
  return useQuery({
    queryKey: quizId ? quizKeys.detail(quizId) : quizKeys.detail('missing'),
    queryFn: () => getQuizById(quizId ?? ''),
    enabled: Boolean(quizId),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}

type CreateQuizDraft = {
  title: string;
  questions: DraftQuestion[];
};

export function useCreateQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (draft: CreateQuizDraft) => {
      return createQuiz({
        title: draft.title.trim(),
        questions: draft.questions.map(mapDraftQuestionToApiQuestion),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: quizKeys.all });
    },
  });
}

export function useDeleteQuizMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteQuiz,
    onMutate: async (quizId: string) => {
      await queryClient.cancelQueries({ queryKey: quizKeys.list() });

      const previousQuizzes = queryClient.getQueryData<QuizListItem[]>(quizKeys.list());

      if (previousQuizzes) {
        queryClient.setQueryData<QuizListItem[]>(
          quizKeys.list(),
          previousQuizzes.filter((quiz) => quiz.id !== quizId),
        );
      }

      return { previousQuizzes };
    },
    onError: (_error, _quizId, context) => {
      if (context?.previousQuizzes) {
        queryClient.setQueryData(quizKeys.list(), context.previousQuizzes);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: quizKeys.all });
    },
  });
}
