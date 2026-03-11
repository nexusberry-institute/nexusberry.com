'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { redirect as nextRedirect } from 'next/navigation'
import type { Quiz, QuizQuestion, QuizResult } from '@/payload-types'
import RichText from '@/components/RichText'
import { useAuth } from '@/app/(frontend)/_providers/Auth'

type Props = {
  quiz: Quiz
}

function CircularProgress({ score, total }: { score: number; total: number }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0
  const radius = 60
  const stroke = 8
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  let color = 'text-red-500'
  if (percentage >= 80) color = 'text-green-500'
  else if (percentage >= 50) color = 'text-yellow-500'

  let label = 'Needs Improvement'
  if (percentage >= 80) label = 'Excellent!'
  else if (percentage >= 50) label = 'Good'

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg height={radius * 2} width={radius * 2}>
          <circle
            stroke="currentColor"
            className="text-muted"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="currentColor"
            className={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            transform={`rotate(-90 ${radius} ${radius})`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            {score}/{total}
          </span>
        </div>
      </div>
      <span className={`text-lg font-semibold ${color}`}>{label}</span>
    </div>
  )
}

export default function QuizSection({ quiz }: Props) {
  const { user } = useAuth()
  const questions = (quiz.questions ?? []).filter(
    (q): q is QuizQuestion => typeof q === 'object' && q !== null,
  )

  const timePerQuestion = quiz.timePerQuestion ?? 60

  const hasInstructions = quiz.instructions && typeof quiz.instructions === 'object'
  const [quizStarted, setQuizStarted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(timePerQuestion)

  // Save marks state
  const [previousResult, setPreviousResult] = useState<QuizResult | null>(null)
  const [loadingResult, setLoadingResult] = useState(!!quiz.saveMarks)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  // Track score in a ref so timer callback always has the latest value
  const scoreRef = useRef(score)
  scoreRef.current = score

  // Fetch previous result if saveMarks is on
  useEffect(() => {
    if (!quiz.saveMarks || !user) {
      setLoadingResult(false)
      return
    }
    fetch(`/api/quiz-results?quizId=${quiz.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.result) setPreviousResult(data.result)
      })
      .catch(() => {})
      .finally(() => setLoadingResult(false))
  }, [quiz.saveMarks, quiz.id, user])

  // Countdown timer — runs continuously, does not pause when answered
  useEffect(() => {
    if (!quizStarted || showScore) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [quizStarted, showScore, currentQuestion])

  // Auto-advance when timer hits 0
  const handleAutoAdvance = useCallback(() => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      setAnswered(false)
      setSelectedAnswer(null)
      setTimeLeft(timePerQuestion)
    } else {
      setShowScore(true)
    }
  }, [currentQuestion, questions.length, timePerQuestion])

  useEffect(() => {
    if (timeLeft === 0 && quizStarted && !showScore) {
      handleAutoAdvance()
    }
  }, [timeLeft, quizStarted, showScore, handleAutoAdvance])

  // Increment attempt counter when quiz completes
  useEffect(() => {
    if (!showScore) return
    fetch('/api/quiz-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizId: quiz.id }),
    }).catch(() => {})
  }, [showScore, quiz.id])

  // Save results when quiz completes
  useEffect(() => {
    if (!showScore || !quiz.saveMarks || !user) return
    if (saveStatus !== 'idle') return

    setSaveStatus('saving')
    fetch('/api/quiz-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        quizId: quiz.id,
        score: scoreRef.current,
        totalQuestions: questions.length,
      }),
    })
      .then((res) => {
        if (res.ok) setSaveStatus('saved')
        else setSaveStatus('error')
      })
      .catch(() => setSaveStatus('error'))
  }, [showScore, quiz.saveMarks, quiz.id, user, questions.length, saveStatus])

  if (!questions.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No questions available for this quiz.
      </div>
    )
  }

  if (loadingResult) {
    return (
      <div className="text-center py-8 text-muted-foreground">Loading...</div>
    )
  }

  // Auth gate: if saveMarks is on and user is not logged in
  if (quiz.saveMarks && !user) {
    const handleGoogleLogin = () => {
      const currentUrl = window.location.pathname
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_SERVER_URL}/oauth/callback/google`,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
        state: currentUrl,
      })
      nextRedirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
    }

    return (
      <div className="max-w-md mx-auto py-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Sign in Required</h2>
        <p className="text-muted-foreground">
          This quiz saves your score. Please sign in with Google to take it.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Sign in with Google
        </button>
      </div>
    )
  }

  // Already completed and retake not allowed
  if (quiz.saveMarks && previousResult && !quiz.allowRetake && !showScore) {
    return (
      <div className="max-w-lg mx-auto py-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Quiz Completed!</h2>
        <p className="text-sm text-muted-foreground">You have already completed this quiz.</p>
        <CircularProgress score={previousResult.score} total={previousResult.totalQuestions} />
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-green-600 font-medium">Correct: {previousResult.score}</div>
          <div className="text-red-600 font-medium">Wrong: {previousResult.totalQuestions - previousResult.score}</div>
          <div className="text-muted-foreground font-medium">
            {Math.round((previousResult.score / previousResult.totalQuestions) * 100)}%
          </div>
        </div>
      </div>
    )
  }

  // Instructions / start screen
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto py-6 space-y-6">
        {hasInstructions && (
          <RichText data={quiz.instructions!} enableGutter={false} />
        )}
        {quiz.saveMarks && previousResult && quiz.allowRetake && (
          <p className="text-center text-sm text-muted-foreground">
            Your previous score: <span className="font-semibold text-foreground">{previousResult.score}/{previousResult.totalQuestions}</span>
          </p>
        )}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => {
              setQuizStarted(true)
              setTimeLeft(timePerQuestion)
              setSaveStatus('idle')
            }}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors text-lg"
          >
            {previousResult && quiz.allowRetake ? 'Retake Quiz' : 'Start Quiz'}
          </button>
        </div>
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
  }

  const handleNext = () => {
    const nextQuestion = currentQuestion + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion)
      setAnswered(false)
      setSelectedAnswer(null)
      setTimeLeft(timePerQuestion)
    } else {
      setShowScore(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowScore(false)
    setAnswered(false)
    setSelectedAnswer(null)
    setTimeLeft(timePerQuestion)
    setSaveStatus('idle')
    setQuizStarted(false)
  }

  const current = questions[currentQuestion]
  if (!current) return null

  if (showScore) {
    const finalScore = score
    const percentage = Math.round((finalScore / questions.length) * 100)

    return (
      <div className="max-w-lg mx-auto py-8 text-center space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Quiz Completed!</h2>
        <CircularProgress score={finalScore} total={questions.length} />
        <div className="flex justify-center gap-6 text-sm">
          <div className="text-green-600 font-medium">Correct: {finalScore}</div>
          <div className="text-red-600 font-medium">Wrong: {questions.length - finalScore}</div>
          <div className="text-muted-foreground font-medium">{percentage}%</div>
        </div>
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {quiz.saveMarks && saveStatus === 'saved' && (
          <p className="text-sm text-green-600 font-medium">Results saved</p>
        )}
        {quiz.saveMarks && saveStatus === 'saving' && (
          <p className="text-sm text-muted-foreground">Saving results...</p>
        )}
        {quiz.saveMarks && saveStatus === 'error' && (
          <p className="text-sm text-red-500">Failed to save results</p>
        )}
        {(!quiz.saveMarks || quiz.allowRetake) && (
          <button
            onClick={resetQuiz}
            className="mt-4 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {quiz.saveMarks ? 'Retake Quiz' : 'Restart Quiz'}
          </button>
        )}
      </div>
    )
  }

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60)
    const sec = s % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question <span className="font-semibold text-foreground">{currentQuestion + 1}</span> of{' '}
          {questions.length}
        </span>
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-mono font-semibold tabular-nums ${
              timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-muted-foreground'
            }`}
          >
            {formatTime(timeLeft)}
          </span>
          <div className="w-24 bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-lg font-semibold text-foreground">
        <RichText data={current.text} enableGutter={false} enableProse={false} />
      </div>

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
          <div className="text-blue-700 text-sm">
            <RichText data={current.explanation} enableGutter={false} enableProse={false} />
          </div>
        </div>
      )}

      {answered && (
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            {currentQuestion + 1 < questions.length ? 'Next Question' : 'See Results'}
          </button>
        </div>
      )}
    </div>
  )
}
