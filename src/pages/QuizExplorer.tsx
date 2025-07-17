import React, { useEffect, useState } from 'react'
// import { Quiz } from '../types/core'
import QuizCard from '../components/QuizCard'
import { quizzes } from '../data/quizData'
import { categories } from '../data/categoryData'
// import { useQuiz } from '../contexts/QuizContext'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'

const QuizExplorer: React.FC = () => {
  // Assuming quizzes is an array of Quiz objects
  const [category, setCategory] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState<string | null>(null)
  const [search, setSearch] = useState<string>('')

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesCategory = category ? quiz.category_id === category : true
    const matchesDifficulty = difficulty ? quiz.difficulty === difficulty : true
    const matchesSearch = quiz.title.toLowerCase().includes(search.toLowerCase()) || quiz.description.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  useEffect(() => {
    // Reset filters when quizzes change
    setCategory(null)
    setDifficulty(null)
    setSearch('')
  }, [quizzes])

  const resetFilters = () => {
    setCategory(null)
    setDifficulty(null)
    setSearch('')
  }

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Explore Quizzes</h1>
        <p className="text-lg text-gray-700">Find the perfect quiz to challenge your knowledge</p>
      </motion.div>

      {/* Filters and Search */}
      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <div className="mb-4 flex flex-col items-center gap-4 md:flex-row">
          <div className="relative w-full md:w-1/2">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quizzes..."
              className="focus:ring-primary-400 w-full rounded-md border border-gray-300 p-2 pl-10 focus:ring-2 focus:outline-none"
            />
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row md:w-1/2">
            <select
              value={category || ''}
              onChange={(e) => setCategory(e.target.value || null)}
              className="focus:ring-primary-400 flex-1 rounded-md border border-gray-300 p-2 focus:ring-2 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              value={difficulty || ''}
              onChange={(e) => setDifficulty(e.target.value || null)}
              className="focus:ring-primary-400 flex-1 rounded-md border border-gray-300 p-2 focus:ring-2 focus:outline-none"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {filteredQuizzes.length} of {quizzes.length} quizzes
          </p>
          {(category || difficulty || search) && (
            <button onClick={resetFilters} className="text-primary-600 hover:text-primary-800 flex items-center text-sm">
              <Filter size={14} className="mr-1" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Quiz Grid */}
      <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" variants={containerAnimation} initial="hidden" animate="show">
        {filteredQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </motion.div>

      {/*  <div className="py-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-xl font-medium text-gray-700">No quizzes found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
          </motion.div>
        </div> */}
    </div>
  )
}

export default QuizExplorer
