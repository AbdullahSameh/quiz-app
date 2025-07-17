import React from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="bg-primary-50 mb-6 flex h-24 w-24 items-center justify-center rounded-full"
      >
        <HelpCircle className="text-primary-600 h-14 w-14" />
      </motion.div>

      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <h2 className="mb-2 text-2xl font-semibold">Page Not Found</h2>
      <p className="mx-auto mb-8 max-w-md text-gray-600">
        Looks like you've ventured into uncharted territory! The page you're looking for doesn't exist or has been moved.
      </p>

      <Link to="/" className="bg-primary-600 hover:bg-primary-700 rounded-md px-6 py-3 font-medium text-white transition-colors">
        Back to Home
      </Link>
    </motion.div>
  )
}

export default NotFound
