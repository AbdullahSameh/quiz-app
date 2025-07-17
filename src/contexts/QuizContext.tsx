import React, { createContext, useState, useContext, useEffect } from 'react'
import { quizzes } from '../data/quizData'
import { categories } from '../data/categoryData'
import { Quiz, Category, QuizResult } from '../types'

interface QuizContextType {
  categories: Category[]
  quizzes: Quiz[]
  currentQuiz: Quiz | null
  quizResults: QuizResult[]
  filteredQuizzes: Quiz[]
  setCurrentQuiz: (quiz: Quiz | null) => void
  saveQuizResult: (result: QuizResult) => void
  getQuizById: (id: string) => Quiz | undefined
  getResultById: (id: string) => QuizResult | undefined
  filterQuizzes: (categoryId: string | null, difficulty: string | null) => void
}

const QuizContext = createContext<QuizContextType | undefined>(undefined)

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(quizzes)

  // Load saved results from localStorage on initial render
  useEffect(() => {
    const savedResults = localStorage.getItem('quizResults')
    if (savedResults) {
      setQuizResults(JSON.parse(savedResults))
    }
  }, [])

  // Save results to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quizResults', JSON.stringify(quizResults))
  }, [quizResults])

  const saveQuizResult = (result: QuizResult) => {
    setQuizResults((prev) => [...prev, result])
  }

  const getQuizById = (id: string) => {
    return quizzes.find((quiz) => quiz.id === id)
  }

  const getResultById = (id: string) => {
    return quizResults.find((result) => result.id === id)
  }

  const filterQuizzes = (categoryId: string | null, difficulty: string | null) => {
    let filtered = [...quizzes]

    if (categoryId) {
      filtered = filtered.filter((quiz) => quiz.categoryId === categoryId)
    }

    if (difficulty) {
      filtered = filtered.filter((quiz) => quiz.difficulty === difficulty)
    }

    setFilteredQuizzes(filtered)
  }

  const value = {
    categories,
    quizzes,
    currentQuiz,
    quizResults,
    filteredQuizzes,
    setCurrentQuiz,
    saveQuizResult,
    getQuizById,
    getResultById,
    filterQuizzes,
  }

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export const useQuiz = (): QuizContextType => {
  const context = useContext(QuizContext)
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider')
  }
  return context
}
