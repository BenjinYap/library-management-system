import { Link, useLocation } from 'react-router-dom'

function Navigation() {
  const location = useLocation()

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
        </div>
      </div>
    </header>
  )
}

export default Navigation
