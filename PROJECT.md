# Project
* online book library that shows list of books, and ability to borrow books and return books 

# Architecture
* Monorepo with frontend + backend
* React
* Typescript
* SPA
* Express backend
* Tailwind
* Mysql
* Prisma ORM

# Local development
* `npm run dev` to spin up frontend and backend together
* `docker compose up` to spin up local mysql container
* hot reload wherever possible, shouldn't need to restart frontend or backend to see changes

# Initial database tables
## User
* Defines a person who has access to the library
* full name

## Book
* Defines a unique book
* author
* publish date

## BookCopy
* Defines a copy of a Book
* may have many copies of the same Book
* current User id
* status (available/borrowed)

## BookCopyLendingHistory
* Defines an instance of borrow/return of a specific BookCopy
* datetime
* User id
* BookCopy id
* action (borrowed/returned)