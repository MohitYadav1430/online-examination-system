import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import CreateExam from "./pages/CreateExam";
import ManageExams from "./pages/ManageExams";
import AdminExamDetails from "./pages/AdminExamDetails";
import EditExam from "./pages/EditExam";
import AdminResults from "./pages/AdminResults";
import AnswerSheet from "./pages/AnswerSheet";
import AdminAnalytics from "./pages/AdminAnalytics";
import StudentManagement from "./pages/StudentManagement";
import StudentHistory from "./pages/StudentHistory";

import StudentDashboard from "./pages/Studentdashboard.jsx";
import ExamPage from "./pages/ExamPage";
import ResultPage from "./pages/ResultPage";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-exam"
          element={
            <ProtectedRoute allowedRole="admin">
              <CreateExam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/manage-exams"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageExams />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/exam/:examId"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminExamDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/edit-exam/:examId"
          element={
            <ProtectedRoute allowedRole="admin">
              <EditExam />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/results"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminResults />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/answer-sheet/:attemptId"
          element={
            <ProtectedRoute allowedRole="admin">
              <AnswerSheet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/students"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentManagement />
            </ProtectedRoute>
          }
        />

        {/* Student Exam History Route */}
        <Route
          path="/admin/student/:studentId/history"
          element={
            <ProtectedRoute allowedRole="admin">
              <StudentHistory />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exam/:examId"
          element={
            <ProtectedRoute allowedRole="student">
              <ExamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/result/:attemptId"
          element={
            <ProtectedRoute allowedRole="student">
              <ResultPage />
            </ProtectedRoute>
          }
        />

        {/* Invalid Route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;