import { useRouter } from 'next/router';
import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';

import { useCreateQuizMutation } from '@/api/quiz.queries';
import { QuestionEditor } from '@/components/quizzes/question-editor';
import { QuizDraftSummary } from '@/components/quizzes/quiz-draft-summary';
import { SoftButton } from '@/components/ui/soft-button';
import {
  createDraftQuestion,
  normalizeCheckboxCorrectAnswers,
  type DraftQuestion,
  type QuestionType,
} from '@/lib/mock-quizzes';

function updateCheckboxSelection(
  question: DraftQuestion,
  nextOptionValue: string,
  nextIndex: number,
) {
  const updatedOptions = [...question.options];
  const previousValue = updatedOptions[nextIndex] ?? '';
  updatedOptions[nextIndex] = nextOptionValue;

  const mappedCorrectAnswers = question.correctAnswers.map((answer) =>
    answer === previousValue ? nextOptionValue : answer,
  );

  return {
    ...question,
    options: updatedOptions,
    correctAnswers: normalizeCheckboxCorrectAnswers(updatedOptions, mappedCorrectAnswers),
  };
}

function validateQuizDraft(title: string, questions: DraftQuestion[]) {
  if (!title.trim()) {
    return 'Quiz title is required.';
  }

  if (questions.length === 0) {
    return 'Add at least one question.';
  }

  for (const [index, question] of questions.entries()) {
    if (!question.text.trim()) {
      return `Question ${index + 1} needs a text prompt.`;
    }

    if (question.type === 'INPUT' && !question.correctAnswer.trim()) {
      return `Question ${index + 1} needs a short answer.`;
    }

    if (question.type === 'CHECKBOX') {
      const validOptions = question.options.map((option) => option.trim()).filter(Boolean);

      if (validOptions.length < 2) {
        return `Question ${index + 1} needs at least two options.`;
      }

      const selectedAnswers = normalizeCheckboxCorrectAnswers(
        question.options,
        question.correctAnswers,
      );

      if (selectedAnswers.length === 0) {
        return `Question ${index + 1} needs at least one correct option.`;
      }
    }
  }

  return null;
}

export function QuizDraftForm() {
  const router = useRouter();
  const createQuizMutation = useCreateQuizMutation();
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<DraftQuestion[]>(() => [
    createDraftQuestion('BOOLEAN'),
  ]);
  const [error, setError] = useState<string | null>(null);

  const questionSummary = useMemo(() => {
    return questions.reduce(
      (accumulator, question) => {
        accumulator[question.type] += 1;
        return accumulator;
      },
      { BOOLEAN: 0, INPUT: 0, CHECKBOX: 0 },
    );
  }, [questions]);

  const updateQuestion = (
    questionId: string,
    updater: (current: DraftQuestion) => DraftQuestion,
  ) => {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.id === questionId ? updater(question) : question,
      ),
    );
  };

  const addQuestion = (type: QuestionType) => {
    setQuestions((currentQuestions) => [...currentQuestions, createDraftQuestion(type)]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions((currentQuestions) => {
      if (currentQuestions.length === 1) {
        return currentQuestions;
      }

      return currentQuestions.filter((question) => question.id !== questionId);
    });
  };

  const addOption = (questionId: string) => {
    updateQuestion(questionId, (question) => {
      const nextOptionNumber = question.options.length + 1;
      const nextOptions = [...question.options, `Option ${nextOptionNumber}`];

      return {
        ...question,
        options: nextOptions,
        correctAnswers: normalizeCheckboxCorrectAnswers(nextOptions, question.correctAnswers),
      };
    });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    updateQuestion(questionId, (question) => {
      if (question.options.length === 1) {
        return question;
      }

      const nextOptions = question.options.filter(
        (_, currentIndex) => currentIndex !== optionIndex,
      );
      const removedOption = question.options[optionIndex] ?? '';
      const nextCorrectAnswers = question.correctAnswers.filter(
        (answer) => answer !== removedOption,
      );

      return {
        ...question,
        options: nextOptions,
        correctAnswers: normalizeCheckboxCorrectAnswers(nextOptions, nextCorrectAnswers),
      };
    });
  };

  const toggleCorrectOption = (questionId: string, optionIndex: number) => {
    updateQuestion(questionId, (question) => {
      const targetOption = question.options[optionIndex] ?? '';

      if (!targetOption.trim()) {
        return question;
      }

      const hasSelection = question.correctAnswers.includes(targetOption);
      const nextCorrectAnswers = hasSelection
        ? question.correctAnswers.filter((answer) => answer !== targetOption)
        : [...question.correctAnswers, targetOption];

      return {
        ...question,
        correctAnswers: normalizeCheckboxCorrectAnswers(question.options, nextCorrectAnswers),
      };
    });
  };

  const changeOption = (questionId: string, optionIndex: number, value: string) => {
    updateQuestion(questionId, (question) => updateCheckboxSelection(question, value, optionIndex));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateQuizDraft(title, questions);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError(null);
      await createQuizMutation.mutateAsync({ title: title.trim(), questions });
      router.push('/quizzes');
    } catch (mutationError) {
      setError(mutationError instanceof Error ? mutationError.message : 'Failed to create quiz');
    }
  };

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-4xl border border-white/70 bg-white/80 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
            Create quiz
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Compose a quiz with a clean, structured workflow.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-slate-500">
            This form submits directly to the backend. Boolean, input and checkbox questions are
            mapped to the API payload before saving.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <SoftButton
              type="button"
              onClick={() => addQuestion('BOOLEAN')}
              className="px-4 py-2 text-sm font-medium"
            >
              + Boolean
            </SoftButton>
            <SoftButton
              type="button"
              onClick={() => addQuestion('INPUT')}
              className="px-4 py-2 text-sm font-medium"
            >
              + Input
            </SoftButton>
            <SoftButton
              type="button"
              onClick={() => addQuestion('CHECKBOX')}
              className="px-4 py-2 text-sm font-medium"
            >
              + Checkbox
            </SoftButton>
          </div>
        </div>

        <QuizDraftSummary questionSummary={questionSummary} />
      </section>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
        <section className="overflow-hidden rounded-4xl border border-white/70 bg-white/85 p-8 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.35)] backdrop-blur-xl">
          <div className="grid gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
              Quiz title
            </p>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              Give the quiz a clear name.
            </h2>
          </div>

          <label className="mt-6 grid gap-2">
            <span className="text-sm font-medium text-slate-600">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setTitle(event.target.value);
              }}
              placeholder="For example: Frontend sprint review"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-slate-400 focus:ring-2 focus:ring-slate-950/5"
            />
          </label>
        </section>

        <section className="grid gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-400">
                Questions
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                Build the quiz structure.
              </h2>
            </div>

            <SoftButton
              type="button"
              onClick={() => addQuestion('BOOLEAN')}
              className="px-5 py-3 text-sm font-semibold"
            >
              Add question
            </SoftButton>
          </div>

          {questions.map((question, questionIndex) => (
            <QuestionEditor
              key={question.id}
              question={question}
              questionIndex={questionIndex}
              onRemove={removeQuestion}
              onUpdate={updateQuestion}
              onAddOption={addOption}
              onRemoveOption={removeOption}
              onToggleCorrectOption={toggleCorrectOption}
              onChangeOption={changeOption}
            />
          ))}
        </section>

        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white/80 px-6 py-5 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.25)] backdrop-blur-xl">
          <p className="text-sm leading-7 text-slate-500">
            {createQuizMutation.isPending
              ? 'Saving the quiz before redirecting to the dashboard.'
              : 'Submit the form to store the quiz.'}
          </p>

          <SoftButton
            type="submit"
            disabled={createQuizMutation.isPending}
            className="px-5 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createQuizMutation.isPending ? 'Saving...' : 'Save quiz'}
          </SoftButton>
        </div>
      </form>
    </>
  );
}
