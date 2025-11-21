import { useParams } from 'react-router-dom'

function Checkout() {
  const { bookId } = useParams()

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Checkout Book</h2>
        <p className="text-gray-600">Checkout page for book ID: {bookId}</p>
      </div>
    </div>
  )
}

export default Checkout
