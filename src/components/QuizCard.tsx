import React from 'react'
import { Link } from 'react-router'
import { categories } from '../data/categoryData'
import { Quiz } from '../types/core'
import { motion } from 'framer-motion'
import { Clock, BarChart3, BookOpen } from 'lucide-react'

// Filter, Award, TrendingUp

// Truncate description to a maximum length
function truncateDesc(str: string, maxLength: number = 80): string {
  return str.length > maxLength ? str.slice(0, maxLength) + ' ...' : str
}

// Get difficulty badge color
const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'hard':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const QuizCard: React.FC<{ quiz: Quiz }> = ({ quiz }) => {
  // Animation variants
  const cardAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  // Find category by ID
  const category = categories.find((category) => category.id == quiz.category_id)

  return (
    <motion.div
      key={quiz.id}
      variants={cardAnimation}
      whileHover={{ y: -5 }}
      className="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
    >
      <div className={`h-2 ${category?.color || 'bg-gray-500'}`}></div>
      <div className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-xl font-semibold">{quiz.title}</h3>
          <span className={`rounded-full px-2 py-1 text-xs ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
          </span>
        </div>

        <p className="mb-4 text-gray-600">{truncateDesc(quiz.description)}</p>

        <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <BookOpen size={16} className="mr-1" />
            <span>{quiz.category_id}</span>
          </div>
          <div className="flex items-center">
            <BarChart3 size={16} className="mr-1" />
            <span>{quiz.questions.length} questions</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{Math.ceil(quiz.duration_limit / 60)} min</span>
          </div>
        </div>

        <Link
          to={`/quiz/${quiz.id}`}
          state={quiz}
          className="bg-primary-600 hover:bg-primary-700 inline-block w-full rounded-md px-4 py-2 text-center font-medium text-white transition-colors"
        >
          Start Quiz
        </Link>
      </div>
    </motion.div>
  )
}

export default QuizCard
