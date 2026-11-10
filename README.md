# Online Examination System

A Full Stack MERN-based Online Examination System that allows administrators to create and manage examinations and students to attempt exams online and view their results.

## Features

### Admin
- Admin Login
- Admin Dashboard
- Create, Edit and Delete Exams
- Publish and Unpublish Exams
- View Student Results
- View Student Answer Sheets
- Analytics Dashboard
- Student Management
- Activate and Deactivate Student Accounts
- View Student Examination History

### Student
- Student Registration and Login
- Student Dashboard
- View Available Examinations
- Attempt Online Exams
- Countdown Timer
- Automatic Answer Saving
- Refresh Recovery
- Automatic and Manual Submission
- View Examination Results

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Project Structure

```text
Online-Examination-System/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
└── .gitignore
```

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/MohitYadav1430/online-examination-system.git
```

### 2. Backend Setup

```bash
cd online-examination-system/backend
npm install
```

Create a `.env` file inside the backend folder and configure:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_SECRET=your_admin_secret
```

Start backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd online-examination-system/frontend
npm install
npm run dev
```

## Database

MongoDB Atlas is used for storing user accounts, examinations and examination attempts.

## Author

Mohit Yadav

B.Tech – Computer Science and Engineering
