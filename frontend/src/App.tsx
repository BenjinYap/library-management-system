import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import About from './pages/About'
import BorrowedBooks from './pages/BorrowedBooks'
import Checkout from './pages/Checkout'
import Return from './pages/Return'
import { UserProvider } from './contexts/UserContext'

function App() {
  return (
    <Router>
      <UserProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/borrowed" element={<BorrowedBooks />} />
              <Route path="/about" element={<About />} />
              <Route path="/checkout/:bookId" element={<Checkout />} />
              <Route path="/return/:bookId" element={<Return />} />
            </Routes>
          </main>
        </div>
      </UserProvider>
    </Router>
  )
}

export default App
