import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

function Navigation() {
  const location = useLocation()
  const { user } = useUser()

  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-gray-900 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }

  return (
    <header className="bg-gray-800 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">
              Library Management System
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-4">
              <Link
                to="/"
                className={`${isActive('/')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={`${isActive('/about')} px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                About
              </Link>
            </nav>
            {user && (
              <div className="text-sm text-gray-300 pl-4 border-l border-gray-600">
                {user.fullName}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navigation
