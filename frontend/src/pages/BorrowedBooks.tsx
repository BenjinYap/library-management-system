import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '../contexts/UserContext'

interface BorrowedBook {
  id: number
  title: string
  author: string
  borrowedDatetime: string
  bookCopyId: number
}

function BorrowedBooks() {
  const { userId } = useUser()
  const [books, setBooks] = useState<BorrowedBook[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId === null) {
      setLoading(false)
      return
    }

    fetch(`http://localhost:3001/api/books/borrowed?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Borrowed books:', data)
        setBooks(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching borrowed books:', err)
        setLoading(false)
      })
  }, [userId])

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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold">My Borrowed Books</h2>
        </div>

        {loading ? (
          <div className="px-6 py-8">
            <p className="text-gray-600">Loading borrowed books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="px-6 py-8">
            <p className="text-gray-600">You don't have any borrowed books at the moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Book
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrowed
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book) => (
                  <tr key={book.bookCopyId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDateTime(book.borrowedDatetime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/return/${book.id}`}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Return Book
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default BorrowedBooks
