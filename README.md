# Library Management System

A full-stack library management system built with React, TypeScript, Express, and MySQL.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Backend**: Express, TypeScript, Prisma ORM
- **Database**: MySQL 8.0
- **Architecture**: Monorepo with npm workspaces

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- npm

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install dependencies for both frontend and backend workspaces.

### 2. Start the MySQL Database

```bash
docker compose up -d
```

This will start a MySQL 8.0 container on port 3306.

### 3. Set Up the Database

```bash
# Generate Prisma Client
npm run prisma:generate -w backend

# Run database migrations
npm run prisma:migrate -w backend
```

### 4. Start the Development Servers

```bash
npm run dev
```

This will start both the frontend (on `http://localhost:5173`) and backend (on `http://localhost:3001`) with hot reload enabled.

## Available Scripts

### Root Level

- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend
- `npm run frontend` - Start only the frontend
- `npm run backend` - Start only the backend

### Frontend (use `-w frontend`)

- `npm run dev -w frontend` - Start Vite dev server
- `npm run build -w frontend` - Build for production
- `npm run lint -w frontend` - Run ESLint

### Backend (use `-w backend`)

- `npm run dev -w backend` - Start Express server with hot reload
- `npm run build -w backend` - Build TypeScript to JavaScript
- `npm run start -w backend` - Start production server
- `npm run prisma:generate -w backend` - Generate Prisma Client
- `npm run prisma:migrate -w backend` - Run database migrations
- `npm run prisma:studio -w backend` - Open Prisma Studio

## Project Structure

```
├── frontend/              # React frontend
│   ├── src/
│   │   ├── App.tsx       # Main application component
│   │   ├── main.tsx      # Application entry point
│   │   └── index.css     # Global styles with Tailwind
│   ├── package.json
│   └── vite.config.ts
│
├── backend/               # Express backend
│   ├── src/
│   │   ├── index.ts      # Server entry point
│   │   └── routes/       # API route handlers
│   │       ├── books.ts
│   │       ├── bookCopies.ts
│   │       └── users.ts
│   ├── prisma/
│   │   └── schema.prisma # Database schema
│   ├── .env              # Environment variables
│   └── package.json
│
├── docker-compose.yml     # MySQL container configuration
└── package.json           # Root workspace configuration
```

## Database Schema

### User
- Defines a person who has access to the library
- Fields: id, fullName, createdAt, updatedAt

### Book
- Defines a unique book
- Fields: id, title, author, publishDate, createdAt, updatedAt

### BookCopy
- Defines a copy of a Book (multiple copies of same book)
- Fields: id, bookId, currentUserId, status (AVAILABLE/BORROWED), createdAt, updatedAt

### BookCopyLendingHistory
- Tracks borrow/return history
- Fields: id, bookCopyId, userId, action (BORROWED/RETURNED), datetime

## API Endpoints

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book

### Book Copies
- `POST /api/book-copies` - Create a new book copy
- `POST /api/book-copies/:id/borrow` - Borrow a book copy
- `POST /api/book-copies/:id/return` - Return a book copy

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `GET /api/users/:id/history` - Get borrowing history for a user

## Development

The project is set up with hot reload for both frontend and backend:

- Frontend uses Vite's HMR (Hot Module Replacement)
- Backend uses `tsx watch` for automatic restarts on file changes

Changes to the code will be reflected immediately without manual restarts.

## Next Steps

The basic structure is in place. To complete the application:

1. Implement Prisma queries in the route handlers
2. Add frontend components for borrowing/returning books
3. Add user management UI
4. Implement error handling and validation
5. Add authentication (if needed)
6. Write tests
