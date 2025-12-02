import Link from "next/link";

export default function LMSHomePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">LMS Home Page</h1>
        <Link href="/lms/quiz">QUIZ </Link>
      </div>
    </div>
  );
}