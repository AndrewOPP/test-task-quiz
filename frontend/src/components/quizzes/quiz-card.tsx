import Link from 'next/link';

import type { QuizListItem } from '@/api/quiz.api';
import { SoftLink } from '@/components/ui/soft-link';

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path
        fill="currentColor"
        d="M9 3.75A2.25 2.25 0 0 1 11.25 1.5h1.5A2.25 2.25 0 0 1 15 3.75V4.5h4.5a.75.75 0 0 1 0 1.5h-1.09l-.78 11.21A3 3 0 0 1 14.64 21h-5.28a3 3 0 0 1-2.99-2.79L5.59 6H4.5A.75.75 0 0 1 4.5 4.5H9v-.75Zm1.5 0V4.5h3v-.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75ZM7.1 6l.76 10.92c.05.77.68 1.38 1.45 1.38h5.28c.77 0 1.4-.61 1.45-1.38L16.8 6H7.1Zm2.65 2.25c.41 0 .75.34.75.75v4.5a.75.75 0 0 1-1.5 0V9c0-.41.34-.75.75-.75Zm4.5 0c.41 0 .75.34.75.75v4.5a.75.75 0 0 1-1.5 0V9c0-.41.34-.75.75-.75Z"
      />
    </svg>
  );
}

type QuizCardProps = {
  quiz: QuizListItem;
  onDelete: (quizId: string) => void;
};

export function QuizCard({ quiz, onDelete }: QuizCardProps) {
  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_30px_90px_-48px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between gap-4">
        <Link href={`/quizzes/${quiz.id}`} className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">Quiz</p>
          <h3 className="mt-3 truncate text-2xl font-semibold tracking-tight text-slate-950">
            {quiz.title}
          </h3>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            {quiz.questionsCount} question{quiz.questionsCount === 1 ? '' : 's'}
          </p>
        </Link>

        <button
          type="button"
          onClick={() => onDelete(quiz.id)}
          className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Delete ${quiz.title}`}
        >
          <TrashIcon />
        </button>
      </div>

      <div className="mt-5 inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
        {quiz.questionsCount} question{quiz.questionsCount === 1 ? '' : 's'}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <SoftLink href={`/quizzes/${quiz.id}`} className="px-4 py-2 text-sm font-medium">
          Open details
        </SoftLink>
      </div>
    </article>
  );
}
