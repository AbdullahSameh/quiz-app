import { Link } from 'react-router'
import { BookOpen, Award, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

const Home: React.FC = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            Test Your Knowledge with <span className="text-primary-600">Quiz</span>
          </motion.h1>
          <motion.p
            className="mx-auto mb-8 max-w-3xl text-xl text-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Explore our diverse collection of quizzes across multiple categories. Challenge yourself, learn something new, and track your progress.
          </motion.p>
          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
          >
            <Link
              to="/categories"
              className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 focus:ring-opacity-50 rounded-lg px-8 py-3 font-medium text-white shadow-md transition-colors focus:ring-2 focus:outline-none"
            >
              Browse Categories
            </Link>
            <Link
              to="/explore"
              className="text-primary-600 border-primary-200 hover:bg-primary-50 focus:ring-primary-500 focus:ring-opacity-50 rounded-lg border bg-white px-8 py-3 font-medium shadow-md transition-colors focus:ring-2 focus:outline-none"
            >
              Explore All Quizzes
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* {quizzesTaken > 0 && (
        <section className="bg-gray-100 py-12">
          <div className="container mx-auto px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">Your Quiz Journey</h2>
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center rounded-lg bg-white p-6 shadow-md">
                <div className="bg-primary-100 mr-4 rounded-full p-3">
                  <BookOpen className="text-primary-600 h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Quizzes Completed</p>
                  <p className="text-2xl font-bold">{quizzesTaken}</p>
                </div>
              </div>
              <div className="flex items-center rounded-lg bg-white p-6 shadow-md">
                <div className="bg-secondary-100 mr-4 rounded-full p-3">
                  <Award className="text-secondary-600 h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-2xl font-bold">{averageScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )} */}

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-2xl font-bold">Why Quiz?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<BookOpen className="text-primary-600 h-8 w-8" />}
              title="Diverse Categories"
              description="From science to pop culture, we've got quizzes for every interest."
            />
            <FeatureCard
              icon={<Award className="text-primary-600 h-8 w-8" />}
              title="Challenge Yourself"
              description="Multiple difficulty levels to test your knowledge and learn more."
            />
            <FeatureCard
              icon={<TrendingUp className="text-primary-600 h-8 w-8" />}
              title="Track Your Progress"
              description="See your scores improve over time and track your learning journey."
            />
          </div>
        </div>
      </section>
    </motion.div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <motion.div className="rounded-lg bg-white p-6 text-center shadow-md" whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
    <div className="bg-primary-50 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">{icon}</div>
    <h3 className="mb-2 text-xl font-semibold">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
)
export default Home
