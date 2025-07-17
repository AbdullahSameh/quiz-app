// import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
// import { QuizProvider } from './contexts/QuizContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Categories from './pages/Categories'
import QuizExplorer from './pages/QuizExplorer'
import QuizPage from './pages/QuizPage'
// import ResultsPage from './pages/ResultsPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    // <QuizProvider>
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <main className="container mx-auto flex-grow px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/explorer" element={<QuizExplorer />} />
            <Route path="/quiz/:id" element={<QuizPage />} />
            {/* <Route path="/results/:id" element={<ResultsPage />} />*/}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
    // </QuizProvider>
  )
}

export default App
