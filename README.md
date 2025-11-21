# Library Management System

A monorepo for an online library book checkout/return application.

These files were only used to help the AI, you can read them or not:

* PROJECT.md
* TESTS.md
* STRUCTURE.md

# Local Development

## Prerequisites

* Node (tested with 22.13.0)
* NPM (tested with 11.4.2)
* Docker + Docker Compose

Install all dependencies:

```
npm ci
```

Launch the local Docker container for MySQL:

```
sudo docker compose up
```

Create `backend/.env` with the following:

```
PORT=3001
DATABASE_URL="mysql://root:password@localhost:3306/library_management"
```

Run the Prisma migrations to initialize the database tables:

```
cd backend
npx prisma migrate dev
```

Return to the root folder, then run the MySQL seed script to prepopulate with some data:

```
npm run seed
```

Start the frontend and backend service:

```
npm run dev
```

Visit the website at `http://localhost:5173/` and `http://localhost:3001/api/books`.

Browse the local MySQL with:

```
mysql -h 127.0.0.1 -u root -ppassword library_management
```

# System Design

## Frontend

* TypeScript
* React
* SPA (React Router)
* Vite
* Tailwind CSS

### User State

A form of user system is required to properly maintain a library that supports checking out and returning books to avoid
reckless checking out of books.

A mock login system has been implemented to simulate a logged-in user. The user is managed via a UserContext to allow easy
access to the user's information from one central location. Eventually a proper
authentication system will be implemented within the UserContext, but for now a user is always hardcoded
in the context.

### Book State

It would be ideal to implement a form of book status caching to prevent unnecessary potentially expensive calls to
the backend. Caching is also ideal here since the website is an SPA.

Similar to the UserContext, a BookContext of some kind could be used as follows:

* A cache of all available books.
  * This will populated using the backend endpoint if it doesn't exist in the context.
  * The cache could remain fresh until the user manually refreshes it via a Refresh button on the home page.
* A cache of all borrowed books.
  * This will be populated from the backend endpoint if it doesn't exist in the context.
  * The cache could remain fresh until the user checks out or returns a book, after which the cache will refresh, since we know the borrowed books state will not change unless those actions occur.

## Backend

* TypeScript
* Express

### Concurrency 1

The endpoints for checking out and returning are designed such that they only return a success if they actually
succeed in performing their final action of updating the status. This is achieved by something like this:

```
UPDATE book_copy
SET status = 'BORROWED'
WHERE id = 5
AND status = 'AVAILABLE'
```

This query is run and we check the actual updated rows from that query to see whether it's a 1 or 0. If it's a 1 then it means
we were able to borrow it successfully. If it's a 0 it means another user "swooped in" at the exact same time and was able to
borrow it a split second before this request.

This prevents the endpoint from incorrectly returning a success response and ensuring the user sees the correct
result.

### Concurrency 2

If in the future the amount of users checking out and returning grows so immensely that the endpoints can no longer
handle process immediate requests, we can shift to a queue model where users submitting the forms instead push to a 
check-out or return queue and a separate background process will handle the queue and do the actual processing. This allows
the website and background queue processor to be scaled at different capacities.

## Database

* MySQL
* Prisma ORM

### Rationale

* I'm not familiar with NoSQL so I won't choose it unless I have time to learn about it.
* All the operations required by this application should be able to be achieved using proper indexes which should help maintain performance.

### Models

You can see the actual models in `backend/prisma/schema.prisma`.