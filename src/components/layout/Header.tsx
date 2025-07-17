import React, { useState } from 'react'
import { NavLink, Link } from 'react-router'
import { Menu, X, BookOpen } from 'lucide-react'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    // ${scrolled ? 'bg-white py-2 shadow-md' : 'bg-transparent py-4'}
    <header className={`sticky top-0 z-10 bg-transparent py-4 transition-all duration-300`}>
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen className="text-primary-600 h-8 w-8" />
          <span className="text-primary-700 text-xl font-bold">Quiz</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden space-x-8 md:flex">
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              `rounded-md px-3 py-2 transition-colors ${isActive ? 'text-primary-700 font-medium' : 'hover:text-primary-600 hover:bg-primary-50 text-gray-700'}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/categories"
            className={({ isActive }: { isActive: boolean }) =>
              `rounded-md px-3 py-2 transition-colors ${isActive ? 'text-primary-700 font-medium' : 'hover:text-primary-600 hover:bg-primary-50 text-gray-700'}`
            }
          >
            Categories
          </NavLink>
          <NavLink
            to="/explorer"
            className={({ isActive }: { isActive: boolean }) =>
              `rounded-md px-3 py-2 transition-colors ${isActive ? 'text-primary-700 font-medium' : 'hover:text-primary-600 hover:bg-primary-50 text-gray-700'}`
            }
          >
            Explore
          </NavLink>
        </nav>

        {/* Mobile menu button */}
        <button
          className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="bg-white shadow-lg md:hidden">
          <div className="container mx-auto flex flex-col space-y-4 px-4 py-3">
            <NavLink
              to="/"
              className={({ isActive }: { isActive: boolean }) =>
                `rounded-md px-3 py-2 transition-colors ${isActive ? 'text-primary-700 font-medium' : 'hover:text-primary-600 hover:bg-primary-50 text-gray-700'}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }: { isActive: boolean }) =>
                `rounded-md px-3 py-2 transition-colors ${isActive ? 'text-primary-700 font-medium' : 'hover:text-primary-600 hover:bg-primary-50 text-gray-700'}`
              }
            >
              Categories
            </NavLink>
            <NavLink
              to="/explore"
              className={({ isActive }: { isActive: boolean }) =>
                `rounded-md px-3 py-2 transition-colors ${isActive ? 'text-primary-700 font-medium' : 'hover:text-primary-600 hover:bg-primary-50 text-gray-700'}`
              }
            >
              Explore
            </NavLink>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
