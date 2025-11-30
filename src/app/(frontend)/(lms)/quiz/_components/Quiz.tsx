'use client'

import React, { useState } from 'react';
import { quizData } from './quizData';

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerClick = (selectedOption: number) => {
    if (answered) return;

    setSelectedAnswer(selectedOption);
    setAnswered(true);

    if (selectedOption === quizData[currentQuestion]?.correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  if (!quizData.length)
    return "No questions loaded"

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      {showScore ? (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl mb-4">
            You scored {score} out of {quizData.length}
          </p>
          <button
            onClick={resetQuiz}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <span className="text-lg font-semibold">Question {currentQuestion + 1}</span>/{quizData.length}
          </div>
          <h2 className="text-xl font-bold mb-4 whitespace-pre-wrap">{quizData[currentQuestion]?.text}</h2>
          <div className="space-y-2">
            {quizData[currentQuestion]?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(index)}
                disabled={answered}
                className={`w-full text-left p-3 rounded ${answered
                  ? index === quizData[currentQuestion]?.correctAnswer
                    ? 'bg-green-200'
                    : index === selectedAnswer
                      ? 'bg-red-200'
                      : 'bg-gray-100'
                  : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors ${answered && 'cursor-default'}`}
              >
                {option}
              </button>
            ))}
          </div>

          {answered && (
            <>
              <h2 className="mt-4 text-lg font-semibold">Explnation:</h2>
              <div>{quizData[currentQuestion]?.explanation}</div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Quiz;