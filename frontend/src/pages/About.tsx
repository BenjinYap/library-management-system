function About() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">About Library Management System</h2>

        <div className="prose max-w-none">
          <p className="text-gray-700 mb-4">
            Welcome to our Library Management System! This application helps libraries manage
            their book collections, track borrowing activities, and maintain member records efficiently.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Browse available books in the library catalog</li>
            <li>Track book availability and copies</li>
            <li>Manage member information and borrowing history</li>
            <li>Monitor due dates and returns</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Technology Stack</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>Frontend:</strong> React with TypeScript and Tailwind CSS</li>
            <li><strong>Backend:</strong> Node.js with Express</li>
            <li><strong>Database:</strong> Prisma ORM</li>
            <li><strong>Routing:</strong> React Router (SPA)</li>
          </ul>

          <p className="text-gray-600 mt-6 text-sm italic">
            This is a modern single-page application (SPA) with seamless navigation
            and no page reloads.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
