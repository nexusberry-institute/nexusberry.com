import Quiz from './_components/Quiz';

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Python Programming Quiz: Functions</h1>
        <Quiz />
      </div>
    </div>
  );
}
