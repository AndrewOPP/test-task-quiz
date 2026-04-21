import { SoftLink } from '@/components/ui/soft-link';

export function QuizEmptyState() {
  return (
    <div className="mt-6 rounded-4xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-[0_24px_80px_-42px_rgba(15,23,42,0.18)] backdrop-blur-xl">
      <p className="text-lg font-semibold text-slate-950">There are no quizzes yet.</p>
      <p className="mt-3 text-sm leading-7 text-slate-500">
        Create the first quiz to populate the dashboard.
      </p>
      <SoftLink href="/create" className="mt-6 px-5 py-3 text-sm font-semibold">
        Create the first quiz
      </SoftLink>
    </div>
  );
}
