User Management Web Application
This is a full-stack web application for managing user registration, authentication, and administration, built as a solution for Task #5. The application features a React frontend with TypeScript and a Node.js/Express backend with a PostgreSQL database.

✨ Features
User Registration: New users can create an account.

Email Verification: A verification email is sent upon registration using Nodemailer and Mailtrap for testing.

User Login: Authenticated users receive a JWT (JSON Web Token) to access protected routes.

User Management Dashboard:

View a list of all registered users with their status, registration date, and last login time.

Sortable data in the table.

Multiple user selection with checkboxes ("Select All" is supported).

Toolbar actions:

Block selected users.

Unblock selected users.

Delete selected users.

Delete all unverified users.

Security:

Passwords are encrypted using bcrypt.

Protected routes on the backend require a valid JWT.

Blocked or deleted users are automatically logged out and redirected if they try to perform an action.

🛠️ Tech Stack
Frontend:

React

TypeScript

Vite

React Router

Tailwind CSS

Heroicons (for icons)

Backend:

Node.js

Express.js

PostgreSQL

node-postgres (pg) for database connection

jsonwebtoken (JWT) for authentication

bcrypt for password hashing

nodemailer for sending emails

🚀 Getting Started
To run this project locally, you will need to run the frontend and backend servers separately.

Prerequisites
Node.js (v18 or later)

PostgreSQL installed and running

A Mailtrap account for email testing

1. Backend Setup
Navigate to the backend directory:

cd backend-app 

Install dependencies:

npm install

Set up the database:

Create a PostgreSQL database named user_management_db.

Run the SQL commands from the database.sql file to create the users table and necessary types/indexes.

Configure Environment Variables:

Update the database connection details in server.js if they differ from the defaults.

Add your Mailtrap credentials in the nodemailer transporter configuration in server.js.

Run the server:

npm start

The backend server will be running on http://localhost:3001.

2. Frontend Setup
Navigate to the frontend directory (the root of this repository).

Install dependencies:

npm install

Run the development server:

npm run dev

The application will be available at http://localhost:5173.

下一步 (Next Steps)
The final step for this project is to deploy it to make it publicly accessible. The recommended services are:

Backend: Render

Frontend: Vercel
