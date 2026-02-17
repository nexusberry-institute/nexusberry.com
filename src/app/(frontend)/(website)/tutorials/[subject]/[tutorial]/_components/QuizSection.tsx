'use client'

import { useState } from 'react'
import type { Quiz, QuizQuestion } from '@/payload-types'

type Props = {
  quiz: Quiz
}

export default function QuizSection({ quiz }: Props) {
  const rawQuestions = quiz.Questions?.questions ?? []
  const questions = rawQuestions.filter(
    (q): q is QuizQuestion => typeof q === 'object' && q !== null,
  )

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  if (!questions.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No questions available for this quiz.
      </div>
    )
  }

  const handleAnswerClick = (selectedOption: number) => {
    if (answered) return

    setSelectedAnswer(selectedOption)
    setAnswered(true)

    if (selectedOption === questions[currentQuestion]?.correctAnswer) {
      setScore((s) => s + 1)
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion)
        setAnswered(false)
        setSelectedAnswer(null)
      } else {
        setShowScore(true)
      }
    }, 2000)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setAnswered(false)
    setSelectedAnswer(null)
  }

  const current = questions[currentQuestion]

  if (showScore) {
    return (
      <div className="max-w-lg mx-auto py-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Quiz Completed!</h2>
        <p className="text-xl text-muted-foreground">
          You scored <span className="font-bold text-foreground">{score}</span> out of{' '}
          <span className="font-bold text-foreground">{questions.length}</span>
        </p>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${(score / questions.length) * 100}%` }}
          />
        </div>
        <button
          onClick={resetQuiz}
          className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Restart Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question <span className="font-semibold text-foreground">{currentQuestion + 1}</span> of{' '}
          {questions.length}
        </span>
        <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-foreground whitespace-pre-wrap">{current?.text}</h2>

      <div className="space-y-3">
        {current?.options.map((opt, index) => {
          const isCorrect = index === current.correctAnswer
          const isSelected = index === selectedAnswer

          let className =
            'w-full text-left p-4 rounded-lg border transition-colors font-medium text-sm '
          if (answered) {
            if (isCorrect) {
              className += 'border-green-500 bg-green-50 text-green-800'
            } else if (isSelected) {
              className += 'border-red-500 bg-red-50 text-red-800'
            } else {
              className += 'border-border bg-muted/50 text-muted-foreground'
            }
            className += ' cursor-default'
          } else {
            className += 'border-border bg-card hover:border-primary hover:bg-primary/5 cursor-pointer'
          }

          return (
            <button
              key={opt.id ?? index}
              onClick={() => handleAnswerClick(index)}
              disabled={answered}
              className={className}
            >
              <span className="mr-3 inline-flex items-center justify-center w-6 h-6 rounded-full border border-current text-xs">
                {String.fromCharCode(65 + index)}
              </span>
              {opt.option}
            </button>
          )
        })}
      </div>

      {answered && current?.explanation && (
        <div className="mt-4 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-1">Explanation</h3>
          <p className="text-blue-700 text-sm">{current.explanation}</p>
        </div>
      )}
    </div>
  )
}
