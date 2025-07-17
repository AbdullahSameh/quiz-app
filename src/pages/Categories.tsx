import React from 'react'
import { Link } from 'react-router'
// import { useQuiz } from '../contexts/QuizContext'
import { motion } from 'framer-motion'
import { FlaskRound as Flask, Landmark, Globe, BookOpen, Film, Cpu, ChevronRight } from 'lucide-react'
import { categories } from '../data/categoryData'

// Map category IDs to their respective icons
const categoryIcons: Record<string, React.ReactNode> = {
  1: <Flask className="h-8 w-8" />,
  2: <Landmark className="h-8 w-8" />,
  3: <Globe className="h-8 w-8" />,
  4: <BookOpen className="h-8 w-8" />,
  5: <Film className="h-8 w-8" />,
  6: <Cpu className="h-8 w-8" />,
}

const Categories: React.FC = () => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12 text-center">
        <h1 className="mb-4 text-3xl font-bold md:text-4xl">Quiz Categories</h1>
        <p className="text-lg text-gray-700">Browse our diverse collection of quizzes organized by category</p>
      </motion.div>

      <motion.div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" variants={container} initial="hidden" animate="show">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            variants={item}
            whileHover={{ y: -5 }}
            className="overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <div className={`${category.color} h-2 w-full`} />
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <div className={`mr-3 rounded-full p-3 ${category.color} opacity-50`}>{categoryIcons[category.id]}</div>
                <h2 className="text-xl font-semibold">{category.name}</h2>
              </div>

              <p className="mb-4 text-gray-600">{category.description}</p>

              <div className="flex items-center justify-between">
                {/* <span className="text-sm text-gray-500"> {category.quiz_count} quiz available</span> */}
                <Link
                  to="/explorer"
                  className="text-primary-600 hover:text-primary-700 inline-flex items-center"
                  onClick={() => {
                    // This could be used to filter quizzes by category on the explore page
                  }}
                >
                  <span>Explore</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Categories
