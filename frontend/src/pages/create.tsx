import Head from 'next/head';

import { QuizDraftForm } from '@/components/quizzes/quiz-draft-form';

export default function CreateQuizPage() {
  return (
    <>
      <Head>
        <title>Create quiz</title>
        <meta
          name="description"
          content="Live quiz creation form that posts boolean, input and checkbox questions to the backend."
        />
      </Head>

      <QuizDraftForm />
    </>
  );
}
