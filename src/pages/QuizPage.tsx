import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { quizzes } from '../data/quizData'
import { QuizAnswer, QuizResult } from '../types/core'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, AlertCircle } from 'lucide-react'
import QuestionRenderer from '../components/QuestionTypes/QuestionRenderer'

export const QuizPage: React.FC = () => {
  let params = useParams()
  let navigate = useNavigate()

  const quiz = quizzes.find((q) => q.id === params.id)

  if (!quiz) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Quiz not found</h1>
      </div>
    )
  }

  const [quizTimeLeft, setQuizTimeLeft] = useState(600) // 10 minutes in seconds
  const [questionTimeLeft, setQuestionTimeLeft] = useState(30) // 30 seconds per question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100 || 0
  const [startTime] = useState(Date.now())
  const [isSubmitting] = useState(false)
  const [answers, setAnswers] = useState<any[]>([])

  // init quiz time left
  useEffect(() => {
    setQuizTimeLeft(quiz.duration_limit || 600) // default to 10 minutes
    setQuestionTimeLeft(quiz.questions[currentQuestionIndex].time_limit || 30) // reset question time to 30 seconds
  }, [quiz])

  // format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }

  // get current question
  const currentQuestion = quiz.questions[currentQuestionIndex]

  // handle quiz time left
  useEffect(() => {
    const timer = setInterval(() => {
      setQuizTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // handle quiz end logic here
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // handle question time left
  useEffect(() => {
    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // handle question end logic here, e.g., move to next question
          handleNextQuestion()
          return 30 // reset to 30 seconds for the next question
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer) // cleanup on unmount
  }, [currentQuestionIndex])

  // Handle previous question navigation
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setQuestionTimeLeft(currentQuestion.time_limit || 60)
    }
  }

  // Handle next question navigation
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setQuestionTimeLeft(currentQuestion.time_limit || 60)
    }
  }

  const handleAnswerChange = (answer: any) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = answer
    setAnswers(newAnswers)
  }

  const checkAnswer = (question: any, answer: any): boolean => {
    switch (question.type) {
      case 'multiple_choice':
        return question.options[answer.selected_option] === question.options[question.correct_option]
      case 'fill_in_blank':
        return question.correct_answers.includes(answer.blank_res.map((a: any) => a.value.toLowerCase()))
      case 'match':
        return question.correct_matches.every((m: any) => answer.matched_pairs.some((a: any) => a.left_id === m.left && a.right_id === m.right))
      case 'drag_drop':
        return question.correct_placements.every((placement: any) =>
          answer.drop_placements.some((dp: any) => dp.item_id === placement.item && dp.zone_id === placement.zone),
        )
      case 'drop_down':
        return question.dropdowns.every((dropdown: any) => {
          let dropAnswer = answer.dropdown_res.find((dro: any) => dro.dropdown_id === dropdown.id)
          return dropAnswer && dropAnswer.value === dropdown.correct_option
        })
      default:
        return false
    }
  }

  const handleSubmitQuiz = () => {
    // collect time spent for quiz
    const timeSpent = Math.floor((Date.now() - startTime) / 1000) // in seconds

    console.log('Time Spent:', timeSpent)

    // colcolect the score for each question with checking if the answer is correct
    const quizAnswers: QuizAnswer[] = answers.map((answer, index) => {
      const question = quiz.questions[index]
      const isCorrect = checkAnswer(question, answer)

      return {
        question_id: question.id,
        question_type: question.type,
        answer: answer, // Store the answer object
        is_correct: isCorrect,
        score: isCorrect ? question.points || 1 : 0, // Default score of 1 if not specified
      }
    })
    const totalScore = quizAnswers.reduce((sum, ans) => sum + ans.score, 0)

    // create a QuizResult object and save it to local storage
    const quizResult: QuizResult = {
      id: `result-${Date.now()}`, // Use timestamp as a unique ID
      quiz_id: quiz.id,
      score: totalScore,
      time_taken: timeSpent,
      date_taken: new Date().toISOString(),
      total_questions: quiz.questions.length,
      answers: quizAnswers,
    }
    localStorage.setItem('quizResult', JSON.stringify(quizResult))

    // redirect to results page or show a success message
    navigate(`/results/${quizResult.id}`)

    // setIsSubmitting(true)
    // Simulate submission delay
    // setTimeout(() => {
    //   setIsSubmitting(false)
    //   // Handle quiz submission logic here, e.g., save answers, calculate score, etc.
    //   console.log('Quiz submitted:', answers)
    //   // Redirect or show results
    //   alert('Quiz submitted successfully!')
    // }, 2000)
  }

  const allQuestionsAnswered = answers.length === quiz.questions.length && answers.every((a) => a !== undefined)

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
              <span className={questionTimeLeft < 10 ? 'font-medium text-red-600' : ''}>Question: {formatTime(questionTimeLeft)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span className={quizTimeLeft < 60 ? 'font-medium text-red-600' : ''}>Total: {formatTime(quizTimeLeft)}</span>
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
            onClick={handleSubmitQuiz}
            // disabled={isSubmitting}
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
