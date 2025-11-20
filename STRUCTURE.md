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
│   │   └── Navigation.tsx # Main navigation bar with routing
│   ├── pages/             # Page-level components
│   │   ├── Home.tsx       # Home page (book listing)
│   │   └── About.tsx      # About page
│   ├── assets/            # Static assets (images, fonts)
│   ├── App.tsx            # Root component with router setup
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

- **`src/App.tsx`**: Router setup with BrowserRouter, defines routes for "/" and "/about"
- **`src/components/Navigation.tsx`**: Navigation bar with active link highlighting
- **`src/pages/Home.tsx`**: Fetches and displays books from API (http://localhost:3001/api/books)
- **`src/pages/About.tsx`**: Static about page with project information
- **`src/main.tsx`**: ReactDOM render entry point

## Backend Structure (`/backend`)

```
backend/
├── src/
│   ├── routes/            # API route handlers
│   │   ├── books.ts       # Book-related endpoints
│   │   ├── bookCopies.ts  # BookCopy-related endpoints
│   │   └── users.ts       # User-related endpoints
│   └── index.ts           # Express server entry point
├── prisma/
│   ├── migrations/        # Database migration history
│   ├── schema.prisma      # Prisma database schema
│   └── seed.ts            # Database seeding script
├── node_modules/          # Backend dependencies
├── package.json           # Backend dependencies & scripts
├── tsconfig.json          # TypeScript configuration
├── .env                   # Environment variables (not committed)
└── .env.example           # Environment template
```

### Backend Key Files

- **`src/index.ts`**: Express server setup, CORS configuration, route mounting
- **`prisma/schema.prisma`**: Database schema with 4 models (User, Book, BookCopy, BookCopyLendingHistory)
- **`prisma/seed.ts`**: Database seeding script for initial data

## Database Schema

The Prisma schema defines the following models:

### Models
1. **User**: Library members with lending history
   - Fields: id, fullName, createdAt, updatedAt
   - Relations: bookCopies, bookCopyLendingHistories

2. **Book**: Book catalog entries
   - Fields: id, title, author, publishDate, createdAt, updatedAt
   - Relations: bookCopies (one-to-many)

3. **BookCopy**: Physical copies of books
   - Fields: id, bookId, currentUserId, status (AVAILABLE/BORROWED), createdAt, updatedAt
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
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio GUI
- `npm run seed` - Seed database with initial data

## API Endpoints

The backend exposes the following API routes (mounted at different paths):

- **Books**: `/api/books/*` - Book catalog operations
- **Book Copies**: `/api/book-copies/*` - Physical copy management
- **Users**: `/api/users/*` - User management

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
