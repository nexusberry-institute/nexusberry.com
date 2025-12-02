import Quiz from './_components/Quiz';

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Quiz: Python Functions</h1>
        <Quiz />
      </div>
    </div>
  );
}

// export default function QuizPage() {

    // Fetch and Render quiz by Module or Module topic via search params 
    // <ModuleQuiz />

//   if no search params  
//   return (
//     <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-lg mx-auto">
//         <h1 className="text-3xl font-bold text-center mb-8"> Select: </h1>
//         <select className="text-3xl font-bold text-center mb-8"> Subject: Fecth Modules </select>
//         <select className="text-3xl font-bold text-center mb-8"> Topics: Fecth Module Topic </select>
//         <h1 className="text-3xl font-bold text-center mb-8">
//           Browse Pre-made QUIZZES : Goto Listing Page
//         </h1>
//         {/* <QuizzesListing /> */}
//       </div>
//     </div>
//   );
// }
