import Head from 'next/head';
import { useMemo } from 'react';

import { SoftLink } from '@/components/ui/soft-link';
import { QuizCard } from '@/components/quizzes/quiz-card';
import { QuizEmptyState } from '@/components/quizzes/quiz-empty-state';
import { useDeleteQuizMutation, useQuizzesQuery } from '@/api/quiz.queries';

const emptyQuizzes = [] as const;

export default function QuizzesListPage() {
  const quizzesQuery = useQuizzesQuery();
  const deleteQuizMutation = useDeleteQuizMutation();
  const quizzes = quizzesQuery.data ?? emptyQuizzes;

  const statistics = useMemo(() => {
    return quizzes.reduce(
      (accumulator, quiz) => {
        accumulator.questions += quiz.questionsCount;
        return accumulator;
      },
      { questions: 0, quizzes: quizzes.length },
    );
  }, [quizzes]);

  const heroStatsLabel = quizzesQuery.isLoading
    ? 'Loading quizzes...'
    : `${statistics.quizzes} quizzes · ${statistics.questions} questions`;

  const handleDelete = (quizId: string) => {
    deleteQuizMutation.mutate(quizId);
  };

  return (
    <>
      <Head>
        <title>Quiz dashboard</title>
        <meta
          name="description"
          content="Live quiz dashboard for browsing, creating and deleting quizzes."
        />
      </Head>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.4)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
            Dashboard
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Your quizzes, organized with calm minimalism.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">
            The list below is loaded from the backend. Delete and create actions are wired to the
            real quiz endpoints through React Query.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <SoftLink href="/create" className="px-5 py-3 text-sm font-semibold">
              Create quiz
            </SoftLink>
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-500">
              {heroStatsLabel}
            </span>
          </div>
        </div>

        <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/75 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.3)] backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              What you can do
            </p>
            <h2 className="mt-3 mb-7 text-2xl font-semibold tracking-tight text-slate-950">
              Built for quick scanning.
            </h2>
          </div>

          <div className="grid gap-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              Open any card to inspect a quiz structure.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              Delete with a single click from the dashboard.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              Create boolean, input and checkbox questions.
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        {deleteQuizMutation.isError ? (
          <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {deleteQuizMutation.error instanceof Error
              ? deleteQuizMutation.error.message
              : 'Failed to delete quiz.'}
          </div>
        ) : null}

        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Quiz list
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              {quizzes.length > 0 ? 'All saved quizzes' : 'No quizzes yet'}
            </h2>
          </div>
          <SoftLink href="/create" className="hidden px-4 py-2 text-sm font-medium sm:inline-flex">
            New quiz
          </SoftLink>
        </div>

        {quizzesQuery.isLoading ? (
          <div className="mt-6 rounded-4xl border border-white/70 bg-white/70 p-10 text-center shadow-[0_24px_80px_-42px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <p className="text-lg font-semibold text-slate-950">Loading quizzes...</p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Fetching quiz data.
            </p>
          </div>
        ) : quizzesQuery.isError ? (
          <div className="mt-6 rounded-4xl border border-rose-200 bg-rose-50 p-10 text-center shadow-[0_24px_80px_-42px_rgba(15,23,42,0.18)]">
            <p className="text-lg font-semibold text-rose-700">Failed to load quizzes</p>
            <p className="mt-3 text-sm leading-7 text-rose-600">
              {quizzesQuery.error instanceof Error
                ? quizzesQuery.error.message
                : 'Unknown error while fetching quizzes.'}
            </p>
          </div>
        ) : quizzes.length === 0 ? (
          <QuizEmptyState />
        ) : (
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
