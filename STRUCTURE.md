# Project Structure

This document provides an overview of the Library Management System codebase structure to help quickly understand the project layout.

## Overview

This is a full-stack monorepo application using npm workspaces, consisting of a React frontend and Express backend with Prisma ORM.

## Technology Stack

### Frontend
- **Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite 7.2
- **Styling**: Tailwind CSS 3.4
- **Routing**: React Router DOM (SPA)
- **Package Manager**: npm

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express 4.21
- **ORM**: Prisma 6.2
- **Database**: MySQL
- **Dev Server**: tsx with watch mode

### Monorepo Management
- **Workspaces**: npm workspaces
- **Concurrent Execution**: concurrently package

## Root Structure

```
library-management-system/
├── frontend/              # React SPA application
├── backend/               # Express API server
├── node_modules/          # Shared workspace dependencies
├── .claude/               # Claude Code configuration
├── .git/                  # Git repository
├── package.json           # Root workspace configuration
├── docker-compose.yml     # Docker services (MySQL)
├── tsconfig.json          # Root TypeScript config
├── CLAUDE.md              # Claude-specific instructions
├── PROJECT.md             # Project documentation
├── README.md              # Main documentation
└── LICENSE                # MIT License
```

## Frontend Structure (`/frontend`)

```
frontend/
├── src/
│   ├── components/        # Reusable React components
│   │   └── Navigation.tsx # Main navigation bar with routing and user display
│   ├── contexts/          # React Context providers
│   │   └── UserContext.tsx # User authentication context and provider
│   ├── pages/             # Page-level components
│   │   ├── Home.tsx       # Home page (book listing table with borrowed status)
│   │   ├── BorrowedBooks.tsx # Borrowed books page (user's current borrowed books)
│   │   ├── About.tsx      # About page
│   │   ├── Checkout.tsx   # Checkout page
│   │   └── Return.tsx     # Return page (placeholder)
│   ├── assets/            # Static assets (images, fonts)
│   ├── App.tsx            # Root component with router setup and UserProvider
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles (Tailwind imports)
├── public/                # Public static files
├── node_modules/          # Frontend dependencies
├── index.html             # HTML entry point
├── package.json           # Frontend dependencies & scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
├── tsconfig.json          # TypeScript base config
├── tsconfig.app.json      # TypeScript app config
├── tsconfig.node.json     # TypeScript node config
└── eslint.config.js       # ESLint configuration
```

### Frontend Key Files

- **`src/App.tsx`**: Router setup with BrowserRouter wrapped in UserProvider, defines routes for "/", "/borrowed", "/about", "/checkout/:bookId", and "/return/:bookId"
- **`src/contexts/UserContext.tsx`**: React Context for managing current user state, provides useUser hook for accessing user data throughout the app
- **`src/components/Navigation.tsx`**: Navigation bar with active link highlighting, includes links to Home, Borrowed Books, and About, logged-in user display in top right (uses UserContext)
- **`src/pages/Home.tsx`**: Displays available books in a responsive table with checkout buttons, no user-specific logic
- **`src/pages/BorrowedBooks.tsx`**: Displays user's currently borrowed books in a table with book title, author, borrowed datetime, and return button for each book (uses UserContext)
- **`src/pages/About.tsx`**: Static about page with project information
- **`src/pages/Checkout.tsx`**: Book checkout page with book details display, checkout confirmation, success/error handling, prevents checkout if user already has a copy of that specific book borrowed (uses UserContext)
- **`src/pages/Return.tsx`**: Book return page with borrowed datetime display, return confirmation, success/error handling (uses UserContext)
- **`src/main.tsx`**: ReactDOM render entry point

## Backend Structure (`/backend`)

```
backend/
├── src/
│   ├── routes/            # API route handlers
│   │   ├── books.ts       # GET /api/books - List available books, GET /api/books/:id/borrowed-info - Get borrowed book details
│   │   ├── checkout.ts    # POST /api/checkout - Checkout a book
│   │   ├── return.ts      # POST /api/return - Return a book
│   │   └── user.ts        # GET /api/user/:id - Get user information
│   ├── __tests__/         # Unit tests
│   │   ├── setup.ts       # Jest test setup
│   │   ├── prisma-mock.ts # Prisma mocking configuration
│   │   └── books.test.ts  # Books API unit tests
│   ├── prisma.ts          # Prisma client singleton
│   └── index.ts           # Express server entry point
├── prisma/
│   ├── migrations/        # Database migration history
│   ├── schema.prisma      # Prisma database schema
│   └── seed.ts            # Database seeding script
├── node_modules/          # Backend dependencies
├── package.json           # Backend dependencies & scripts
├── jest.config.js         # Jest configuration for testing
├── tsconfig.json          # TypeScript configuration
├── .env                   # Environment variables (not committed)
└── .env.example           # Environment template
```

### Backend Key Files

- **`src/index.ts`**: Express server setup, CORS configuration, route mounting
- **`src/prisma.ts`**: Prisma client singleton used across the application
- **`src/routes/books.ts`**: Books API endpoints - list available books, get all borrowed books for a user, get borrowed book details with datetime
- **`src/routes/checkout.ts`**: Checkout API endpoint with race condition handling at SQL level, validates user doesn't already have a copy of the specific book checked out
- **`src/routes/return.ts`**: Return API endpoint with race condition handling at SQL level
- **`src/routes/user.ts`**: User API endpoint for fetching user information by ID
- **`prisma/schema.prisma`**: Database schema with 4 models (User, Book, BookCopy, BookCopyLendingHistory)
- **`prisma/seed.ts`**: Database seeding script for initial data
- **`jest.config.js`**: Jest test configuration with ts-jest and ESM support
- **`src/__tests__/prisma-mock.ts`**: Prisma mocking setup using jest-mock-extended

## Database Schema

The Prisma schema defines the following models:

### Models
1. **User**: Library members with lending history
   - Fields: id, fullName
   - Relations: bookCopies, bookCopyLendingHistories

2. **Book**: Book catalog entries
   - Fields: id, title, author
   - Relations: bookCopies (one-to-many)

3. **BookCopy**: Physical copies of books
   - Fields: id, bookId, currentUserId, status (AVAILABLE/BORROWED)
   - Relations: book, currentUser, bookCopyLendingHistories

4. **BookCopyLendingHistory**: Audit log of borrowing/returns
   - Fields: id, bookCopyId, userId, action (BORROWED/RETURNED), datetime
   - Relations: bookCopy, user

## NPM Scripts

### Root Level (`/`)
- `npm run dev` - Run both frontend and backend concurrently
- `npm run build` - Build both workspaces
- `npm run frontend` - Run only frontend dev server
- `npm run backend` - Run only backend dev server
- `npm run seed` - Run database seed script

### Frontend (`/frontend`)
- `npm run dev` - Start Vite dev server (default port 5173)
- `npm run build` - Build production bundle
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend (`/backend`)
- `npm run dev` - Start Express server with tsx watch (port 3001)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run compiled JavaScript
- `npm test` - Run unit tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run seed` - Seed database with initial data

## API Endpoints

The backend exposes the following API routes:

- **GET /api/books** - Get all books that are available for checkout (returns books with at least one available copy)
- **GET /api/books/borrowed?userId={id}** - Get all borrowed books for a user (requires userId query parameter, returns array of borrowed books with title, author, and borrowed datetime)
- **GET /api/books/:bookId/borrowed-info?userId={id}** - Get borrowed book details with borrowed datetime (requires userId query parameter, returns book details and borrowed datetime for a specific borrowed book)
- **POST /api/checkout** - Checkout a single book copy (requires bookId and userId in request body, handles race conditions at SQL level, validates user doesn't already have a copy of that specific book checked out)
- **POST /api/return** - Return a single book copy (requires bookId and userId in request body, handles race conditions at SQL level, ensures row was actually updated)
- **GET /api/user/:id** - Get user information by ID (returns user's id and fullName)

Base URL: `http://localhost:3001`

## Development Workflow

1. **Start Database**: `docker-compose up -d` (MySQL container)
2. **Run Migrations**: `cd backend && npm run prisma:migrate`
3. **Seed Database**: `npm run seed` (from root)
4. **Start Dev Servers**: `npm run dev` (from root)
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## Environment Variables

### Backend (`.env`)
```
DATABASE_URL="mysql://user:password@localhost:3306/library_db"
```

## Special Instructions

### CLAUDE.md Rules
- **Never run Prisma commands** - The user handles database migrations manually

## Git Information

- **Current Branch**: master
- **Main Branch**: master (use for PRs)
- **Status**: Clean working directory
