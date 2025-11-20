import { useState, useEffect } from 'react'

function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:3001/api/books')
      .then(res => res.json())
      .then(data => {
        console.log('Books:', data)
        setBooks([])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching books:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Available Books</h2>

        {loading ? (
          <p className="text-gray-600">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-gray-600">No books available. Add some books to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book: any) => (
              <div key={book.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-gray-600">by {book.author}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Available copies: {book.availableCopies}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
