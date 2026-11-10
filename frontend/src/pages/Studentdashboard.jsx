import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [examResponse, historyResponse] = await Promise.all([
        API.get("/exams/available"),
        API.get("/exams/history"),
      ]);

      setExams(examResponse.data.exams || []);
      setHistory(historyResponse.data.history || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Student Dashboard
            </h1>

            <p className="text-slate-500 mt-2">
              Welcome, {user?.name || "Student"}!
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-slate-500">Available Exams</h3>
            <p className="text-3xl font-bold mt-2 text-blue-600">
              {exams.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-slate-500">Completed Exams</h3>
            <p className="text-3xl font-bold mt-2 text-green-600">
              {history.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-slate-500">Total Attempts</h3>
            <p className="text-3xl font-bold mt-2 text-purple-600">
              {history.length}
            </p>
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-600">
            Loading dashboard...
          </p>
        ) : (
          <>

            {/* Available Examinations */}
            <div className="bg-white p-6 rounded-xl shadow mb-10">

              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                Available Examinations
              </h2>
              <p className="text-red-600 font-bold text-xl">
  TEST - UPDATED DASHBOARD
</p>

              {exams.length === 0 ? (
                <p className="text-slate-500">
                  No examinations are currently available.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {exams.map((exam) => (
                    <div
                      key={exam._id}
                      className="border border-slate-200 p-5 rounded-xl"
                    >

                      <h3 className="text-lg font-bold text-slate-800">
                        {exam.title}
                      </h3>

                      <p className="text-slate-500 mt-2">
                        {exam.description}
                      </p>

                      <div className="flex justify-between mt-5 text-sm">
                        <span>
                          Duration: {exam.duration} minutes
                        </span>

                        <span>
                          Marks: {exam.totalMarks}
                        </span>
                      </div>

                      {/* Start Exam Button */}
                      <button
                        onClick={() => navigate(`/exam/${exam._id}`)}
                        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                      >
                        Start Exam
                      </button>

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* Exam History */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h2 className="text-2xl font-bold text-slate-800 mb-6">
                My Exam History
              </h2>

              {history.length === 0 ? (
                <p className="text-slate-500">
                  You have not completed any examination yet.
                </p>
              ) : (
                <div className="overflow-x-auto">

                  <table className="w-full text-left">

                    <thead>
                      <tr className="border-b text-slate-500">
                        <th className="p-3">Exam Name</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Total Marks</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {history.map((item) => (
                        <tr
                          key={item.attemptId}
                          className="border-b"
                        >
                          <td className="p-3 font-medium">
                            {item.examName}
                          </td>

                          <td className="p-3 text-green-600 font-semibold">
                            {item.score}
                          </td>

                          <td className="p-3">
                            {item.totalMarks}
                          </td>

                          <td className="p-3">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              Completed
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>

                </div>
              )}

            </div>

          </>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;