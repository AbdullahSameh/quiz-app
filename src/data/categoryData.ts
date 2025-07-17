import { Category } from '../types'

export const categories: Category[] = [
  {
    id: 1,
    name: 'Science',
    description: 'Test your knowledge of scientific principles, discoveries, and famous scientists',
    icon: 'flask',
    color: 'bg-green-500',
    // quiz_count: 8,
  },
  {
    id: 2,
    name: 'History',
    description: 'Explore the past with questions about significant events and historical figures',
    icon: 'landmark',
    color: 'bg-amber-500',
    // quiz_count: 10,
  },
  {
    id: 3,
    name: 'Geography',
    description: 'Challenge yourself with questions about countries, capitals, and natural features',
    icon: 'globe',
    color: 'bg-blue-500',
    // quiz_count: 6,
  },
  {
    id: 4,
    name: 'Literature',
    description: 'Test your knowledge of famous authors, books, and literary characters',
    icon: 'book-open',
    color: 'bg-purple-500',
    // quiz_count: 18,
  },
  {
    id: 5,
    name: 'Movies & TV',
    description: 'Questions about popular films, TV shows, actors, and directors',
    icon: 'film',
    color: 'bg-red-500',
    // quiz_count: 20,
  },
  {
    id: 6,
    name: 'Technology',
    description: 'Test your knowledge of computers, gadgets, programming, and tech history',
    icon: 'cpu',
    color: 'bg-indigo-500',
    // quiz_count: 15,
  },
]
