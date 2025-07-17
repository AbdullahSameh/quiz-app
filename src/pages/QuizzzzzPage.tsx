import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuiz } from '../contexts/QuizContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, AlertCircle } from 'lucide-react'
import QuestionRenderer from '../components/quiz/QuestionRenderer'
import { Question, QuizAnswer } from '../types'

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getQuizById, saveQuizResult } = useQuiz()

  const [quiz] = useState(() => {
    if (!id) return null
    const foundQuiz = getQuizById(id)
    return foundQuiz || null
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<any[]>([])
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(quiz?.timeLimit || 0)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(0)
  const [questionStartTimes, setQuestionStartTimes] = useState<number[]>([])
  const [startTime] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize answers and timers
  useEffect(() => {
    if (quiz) {
      setAnswers(new Array(quiz.questions.length).fill(null))
      setQuestionStartTimes(new Array(quiz.questions.length).fill(0))
      setQuestionTimeRemaining(quiz.questions[0].timeLimit || 30)
    }
  }, [quiz])

  // Set question start time when changing questions
  useEffect(() => {
    if (quiz) {
      const newQuestionStartTimes = [...questionStartTimes]
      newQuestionStartTimes[currentQuestionIndex] = Date.now()
      setQuestionStartTimes(newQuestionStartTimes)
      setQuestionTimeRemaining(quiz.questions[currentQuestionIndex].timeLimit || 30)
    }
  }, [currentQuestionIndex])

  // Total quiz timer
  useEffect(() => {
    if (!quiz || isSubmitting) return

    const timer = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quiz, isSubmitting])

  // Individual question timer
  useEffect(() => {
    if (!quiz || isSubmitting) return

    const timer = setInterval(() => {
      setQuestionTimeRemaining((prev) => {
        if (prev <= 1) {
          // Auto-move to next question or submit if last question
          if (currentQuestionIndex < quiz.questions.length - 1) {
            handleNextQuestion()
          } else {
            handleSubmitQuiz()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, quiz, isSubmitting])

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  const handleAnswerChange = (answer: any) => {
    if (isSubmitting) return

    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const isQuestionAnswered = (questionIndex: number, question: Question): boolean => {
    const answer = answers[questionIndex]
    if (!answer) return false

    switch (question.type) {
      case 'multiple-choice':
        return typeof answer === 'number' && answer >= 0
      case 'fill-in-blank':
        return typeof answer === 'string' && answer.trim().length > 0
      case 'match':
        return Array.isArray(answer) && answer.length === question.leftItems.length
      case 'drag-drop':
        return Array.isArray(answer) && answer.length === question.items.length
      case 'dropdown':
        return Array.isArray(answer) && answer.length === question.dropdowns.length
      case 'labeling':
        return Array.isArray(answer) && answer.length === question.labels.length
      default:
        return false
    }
  }

  const checkAnswer = (question: Question, answer: any): boolean => {
    switch (question.type) {
      case 'multiple-choice':
        return answer === question.correctAnswer

      case 'fill-in-blank':
        if (!answer || typeof answer !== 'string') return false
        const userAnswer = question.caseSensitive ? answer : answer.toLowerCase()
        return question.correctAnswers.some((correct) => (question.caseSensitive ? correct === userAnswer : correct.toLowerCase() === userAnswer))

      case 'match':
        if (!Array.isArray(answer) || answer.length !== question.correctMatches.length) return false
        return question.correctMatches.every((correctMatch) =>
          answer.some((userMatch) => userMatch.left === correctMatch.left && userMatch.right === correctMatch.right),
        )

      case 'drag-drop':
        if (!Array.isArray(answer) || answer.length !== question.correctPlacements.length) return false
        return question.correctPlacements.every((correctPlacement) =>
          answer.some((userPlacement) => userPlacement.item === correctPlacement.item && userPlacement.zone === correctPlacement.zone),
        )

      case 'dropdown':
        if (!Array.isArray(answer) || answer.length !== question.dropdowns.length) return false
        return question.dropdowns.every((dropdown) => {
          const userAnswer = answer.find((a) => a.id === dropdown.id)
          return userAnswer && userAnswer.answer === dropdown.correctAnswer
        })

      case 'labeling':
        if (!Array.isArray(answer) || answer.length !== question.labelPositions.length) return false
        return question.labelPositions.every((position) => {
          const userPlacement = answer.find((p) => p.label === position.correctLabel)
          if (!userPlacement) return false
          // Allow some tolerance for label placement (within 10% of image dimensions)
          const xDiff = Math.abs(userPlacement.x - position.x)
          const yDiff = Math.abs(userPlacement.y - position.y)
          return xDiff <= 10 && yDiff <= 10
        })

      default:
        return false
    }
  }

  const handleSubmitQuiz = useCallback(() => {
    if (!quiz || isSubmitting) return

    setIsSubmitting(true)

    const endTime = new Date()
    const timeSpent = Math.round((endTime.getTime() - startTime.getTime()) / 1000)

    let score = 0
    const quizAnswers: QuizAnswer[] = quiz.questions.map((question, index) => {
      const userAnswer = answers[index]
      const isCorrect = checkAnswer(question, userAnswer)
      const questionTimeSpent = Math.round((Date.now() - questionStartTimes[index]) / 1000)

      if (isCorrect) score++

      const baseAnswer: Omit<QuizAnswer, 'selectedAnswer' | 'textAnswer' | 'matches' | 'placements' | 'dropdownAnswers' | 'labelPlacements'> = {
        questionId: question.id,
        questionType: question.type,
        correct: isCorrect,
        timeSpent: questionTimeSpent,
      }

      switch (question.type) {
        case 'multiple-choice':
          return { ...baseAnswer, selectedAnswer: userAnswer }
        case 'fill-in-blank':
          return { ...baseAnswer, textAnswer: userAnswer }
        case 'match':
          return { ...baseAnswer, matches: userAnswer }
        case 'drag-drop':
          return { ...baseAnswer, placements: userAnswer }
        case 'dropdown':
          return { ...baseAnswer, dropdownAnswers: userAnswer }
        case 'labeling':
          return { ...baseAnswer, labelPlacements: userAnswer }
        default:
          return baseAnswer as QuizAnswer
      }
    })

    const result = {
      id: `result-${Date.now()}`,
      quizId: quiz.id,
      date: Date.now(),
      score,
      totalQuestions: quiz.questions.length,
      timeSpent,
      answers: quizAnswers,
    }

    saveQuizResult(result)
    navigate(`/results/${result.id}`)
  }, [quiz, answers, isSubmitting, startTime, navigate, saveQuizResult, questionStartTimes])

  if (!quiz) return null

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  // Calculate if all questions have been answered
  const allQuestionsAnswered = quiz.questions.every((question, index) => isQuestionAnswered(index, question))

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold md:text-3xl">{quiz.title}</h1>
        <p className="mb-4 text-gray-600">{quiz.description}</p>

        {/* Progress and timers */}
        <div className="mb-2 h-2.5 w-full rounded-full bg-gray-200">
          <div className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </span>
          <div className="flex gap-4">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span className={questionTimeRemaining < 10 ? 'font-medium text-red-600' : ''}>Question: {formatTime(questionTimeRemaining)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span className={totalTimeRemaining < 60 ? 'font-medium text-red-600' : ''}>Total: {formatTime(totalTimeRemaining)}</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6 rounded-lg bg-white p-6 shadow-md"
        >
          <h2 className="mb-6 text-xl font-semibold">{currentQuestion.text}</h2>

          <QuestionRenderer question={currentQuestion} answer={answers[currentQuestionIndex]} onAnswerChange={handleAnswerChange} disabled={isSubmitting} />
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between">
        <button
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`rounded-md px-4 py-2 ${
            currentQuestionIndex === 0 ? 'cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Previous
        </button>

        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <button onClick={handleNextQuestion} className="bg-primary-600 hover:bg-primary-700 rounded-md px-4 py-2 text-white">
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmitQuiz}
            disabled={isSubmitting}
            className={`rounded-md px-4 py-2 ${isSubmitting ? 'cursor-not-allowed bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>

      {!allQuestionsAnswered && currentQuestionIndex === quiz.questions.length - 1 && (
        <div className="mt-4 flex items-center rounded-md border border-yellow-200 bg-yellow-50 p-3">
          <AlertCircle className="mr-2 h-5 w-5 text-yellow-500" />
          <span className="text-sm text-yellow-700">You haven't answered all questions. You can navigate back to review them.</span>
        </div>
      )}
    </div>
  )
}

export default QuizPage
