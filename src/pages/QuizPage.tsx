import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Answer } from '../types/core'
import { quizzes } from '../data/quizData'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock } from 'lucide-react'
import QuestionRenderer from '../components/QuestionTypes/QuestionRenderer'

export const QuizPage: React.FC = () => {
  let params = useParams()
  const quiz = quizzes.find((q) => q.id === params.id)

  if (!quiz) {
    return <div>Quiz not found</div>
  }

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState(0)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(0)
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100 || 0
  const [startTime] = useState(Date.now())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [answers, setAnswers] = useState<any[]>([])

  // format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  // get current question
  const currentQuestion = quiz.questions[currentQuestionIndex]

  // Handle previous question navigation
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      // setQuestionTimeRemaining(currentQuestion.time_limit || 0)
    }
  }

  // Handle next question navigation
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      // setQuestionTimeRemaining(currentQuestion.time_limit || 0)
    }
  }

  const handleAnswerChange = (answer: any) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)
  }

  // return (
  //   <div className="flex h-screen items-center justify-center">
  //     <h1 className="text-3xl font-bold">Quiz Page</h1>
  //   </div>
  // )

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

          <QuestionRenderer question={currentQuestion} selectedAnswer={answers[currentQuestionIndex]} onAnswerChange={handleAnswerChange} />
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
            // onClick={handleSubmitQuiz}
            // disabled={isSubmitting}
            className={`rounded-md px-4 py-2 ${isSubmitting ? 'cursor-not-allowed bg-gray-400' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>

      {/*  {!allQuestionsAnswered && currentQuestionIndex === quiz.questions.length - 1 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="text-yellow-700 text-sm">
            You haven't answered all questions. You can navigate back to review them.
          </span>
        </div>
      )} */}
    </div>
  )
}
export default QuizPage
