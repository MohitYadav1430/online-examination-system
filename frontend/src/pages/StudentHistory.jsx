import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  BookOpen,
  Trophy,
  Calendar,
  Eye,
} from "lucide-react";

function StudentHistory() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get(
          `/users/students/${studentId}/history`
        );

        setStudent(response.data.student);
        setAttempts(response.data.attempts || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load student history"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [studentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading student history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate("/admin/students")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Students
        </button>
      </div>
    );
  }

  const submittedAttempts = attempts.filter(
    (attempt) => attempt.status === "submitted"
  );

  const inProgressAttempts = attempts.filter(
    (attempt) => attempt.status === "in-progress"
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        <button
          onClick={() => navigate("/admin/students")}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Students
        </button>

        {/* Student Information */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Student Exam History
          </h1>

          {student && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold">
                {student.name}
              </h2>

              <p className="text-gray-500">
                {student.email}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Account Status:{" "}
                <span
                  className={
                    student.isActive === false
                      ? "text-red-600"
                      : "text-green-600"
                  }
                >
                  {student.isActive === false
                    ? "Inactive"
                    : "Active"}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

          <div className="bg-white rounded-xl shadow p-5">
            <BookOpen className="text-blue-600 mb-3" size={28} />
            <p className="text-gray-500">Total Attempts</p>
            <h2 className="text-3xl font-bold">
              {attempts.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <Trophy className="text-green-600 mb-3" size={28} />
            <p className="text-gray-500">Submitted Exams</p>
            <h2 className="text-3xl font-bold">
              {submittedAttempts.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <Calendar className="text-purple-600 mb-3" size={28} />
            <p className="text-gray-500">In Progress</p>
            <h2 className="text-3xl font-bold">
              {inProgressAttempts.length}
            </h2>
          </div>

        </div>

        {/* Exam Attempts Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="p-5 border-b">
            <h2 className="text-xl font-bold">
              Exam Attempts
            </h2>
          </div>

          {attempts.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              This student has not attempted any exam yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4">Exam Name</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Total Marks</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt._id} className="border-t">

                      <td className="p-4 font-medium">
                        {attempt.exam?.title || "Exam Deleted"}
                      </td>

                      <td className="p-4">
                        {attempt.score ?? 0}
                      </td>

                      <td className="p-4">
                        {attempt.totalMarks}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            attempt.status === "submitted"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {attempt.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {new Date(
                          attempt.createdAt
                        ).toLocaleDateString("en-IN")}
                      </td>

                      <td className="p-4">
                        {attempt.status === "submitted" ? (
                          <button
                            onClick={() =>
                              navigate(
                                `/admin/answer-sheet/${attempt._id}`
                              )
                            }
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm"
                          >
                            <Eye size={16} />
                            View Answers
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Not Submitted
                          </span>
                        )}
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default StudentHistory;