import Head from 'next/head';
import { useRouter } from 'next/router';

import { SoftLink } from '@/components/ui/soft-link';
import { ReadOnlyQuestion } from '@/components/quizzes/read-only-question';
import { useQuizQuery } from '@/api/quiz.queries';

function formatQuizDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export default function QuizDetailPage() {
  const router = useRouter();
  const quizId = typeof router.query.id === 'string' ? router.query.id : undefined;
  const quizQuery = useQuizQuery(quizId);
  const quiz = quizQuery.data ?? null;
  const heroTitle = quizQuery.isLoading ? 'Loading quiz...' : (quiz?.title ?? 'Quiz not found');
  const heroDescription = quizQuery.isLoading
    ? 'Fetching quiz structure.'
    : quiz
      ? `Read-only structure for ${quiz.questions.length} questions loaded.`
      : 'The quiz ID is missing or the quiz was not found.';

  return (
    <>
      <Head>
        <title>{heroTitle}</title>
        <meta
          name="description"
          content="Read-only quiz detail page."
        />
      </Head>

      <section className="overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Quiz details
            </p>

            <h1 className="mt-4 max-w-full wrap-break-word text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              {heroTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">{heroDescription}</p>
          </div>

          <SoftLink href="/quizzes" className="px-4 py-2 text-sm font-medium">
            Back to dashboard
          </SoftLink>
        </div>

        {quizQuery.isLoading ? (
          <div className="mt-8 rounded-[28px] border border-slate-200 bg-white/70 p-10 text-center">
            <p className="text-lg font-semibold text-slate-950">Loading quiz...</p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Fetching quiz structure.
            </p>
          </div>
        ) : quizQuery.isError ? (
          <div className="mt-8 rounded-[28px] border border-rose-200 bg-rose-50 p-10 text-center">
            <p className="text-lg font-semibold text-rose-700">Quiz not found</p>
            <p className="mt-3 text-sm leading-7 text-rose-600">
              {quizQuery.error instanceof Error ? quizQuery.error.message : 'Unknown error.'}
            </p>
            <SoftLink href="/quizzes" className="mt-6 px-5 py-3 text-sm font-semibold">
              Back to dashboard
            </SoftLink>
          </div>
        ) : quiz ? (
          <div className="mt-8 grid gap-4">
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500">
                {quiz.questions.length} questions
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500">
                Created {formatQuizDate(quiz.createdAt)}
              </span>
            </div>

            <div className="grid gap-4">
              {quiz.questions.map((question, index) => (
                <ReadOnlyQuestion key={question.id} question={question} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-dashed border-slate-300 bg-white/70 p-10 text-center">
            <p className="text-lg font-semibold text-slate-950">Quiz not found</p>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Check the URL or return to the dashboard to open a valid quiz.
            </p>
            <SoftLink href="/quizzes" className="mt-6 px-5 py-3 text-sm font-semibold">
              Back to dashboard
            </SoftLink>
          </div>
        )}
      </section>
    </>
  );
}
