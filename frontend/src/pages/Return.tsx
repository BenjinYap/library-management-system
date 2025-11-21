import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'

interface BorrowedBook {
  id: number
  title: string
  author: string
  publishDate: string
  borrowedDatetime: string
  bookCopyId: number
}

function Return() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const [book, setBook] = useState<BorrowedBook | null>(null)
  const [loading, setLoading] = useState(true)
  const [returning, setReturning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const userId = 1 // Hardcoded user ID for now
    fetch(`http://localhost:3001/api/books/${bookId}/borrowed-info?userId=${userId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Book not found or not borrowed by user')
        }
        return res.json()
      })
      .then((data: BorrowedBook) => {
        setBook(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching book:', err)
        setError('Failed to load book details. You may not have this book checked out.')
        setLoading(false)
      })
  }, [bookId])

  const handleReturn = async () => {
    if (!book) return

    setReturning(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3001/api/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          userId: 1 // Hardcoded user ID for now
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to return book')
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to return book')
      setReturning(false)
    }
  }

  const formatDateTime = (datetime: string) => {
    const date = new Date(datetime)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    )
  }

  if (!book || error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">Book Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The book you\'re trying to return could not be found or is not borrowed by you.'}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-green-600">Return Successful!</h2>
            <p className="text-gray-600 mb-4">You have successfully returned "{book.title}".</p>
            <p className="text-sm text-gray-500">Redirecting you to the home page...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Return Book</h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">{book.title}</h3>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Author:</span> {book.author}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Borrowed on:</span> {formatDateTime(book.borrowedDatetime)}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleReturn}
            disabled={returning}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {returning ? 'Returning...' : 'Confirm Return'}
          </button>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Return
