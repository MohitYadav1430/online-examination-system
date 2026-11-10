import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  RefreshCw,
  Clock,
  Award,
  BarChart3,
  Users,
} from "lucide-react";

function AdminDashboard() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const response = await api.get("/exams/available");
      setExams(response.data.exams || []);
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const totalDuration = exams.reduce(
    (sum, exam) => sum + Number(exam.duration || 0),
    0
  );

  const totalQuestions = exams.reduce(
    (sum, exam) => sum + (exam.questions?.length || 0),
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">

        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">ExamPortal</h1>
          <p className="text-slate-400 text-sm">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-3">

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="w-full flex items-center gap-3 bg-blue-600 px-4 py-3 rounded-lg"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/manage-exams")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
          >
            <FileText size={20} />
            Examinations
          </button>

          <button
            onClick={() => navigate("/admin/create-exam")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
          >
            <PlusCircle size={20} />
            Create Exam
          </button>

          <button
            onClick={() => navigate("/admin/results")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
          >
            <Award size={20} />
            Exam Results
          </button>

          <button
            onClick={() => navigate("/admin/analytics")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
          >
            <BarChart3 size={20} />
            Analytics Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/students")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800"
          >
            <Users size={20} />
            Student Management
          </button>

        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your online examinations.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchExams}
              className="flex items-center gap-2 bg-white border px-5 py-3 rounded-lg hover:bg-slate-50"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              onClick={() => navigate("/admin/create-exam")}
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              + Create Exam
            </button>
          </div>

        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <FileText className="text-blue-600 mb-4" size={30} />
            <p className="text-slate-500">Published Exams</p>
            <h2 className="text-3xl font-bold mt-2">
              {exams.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Clock className="text-green-600 mb-4" size={30} />
            <p className="text-slate-500">Total Duration</p>
            <h2 className="text-3xl font-bold mt-2">
              {totalDuration} min
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Award className="text-purple-600 mb-4" size={30} />
            <p className="text-slate-500">Total Questions</p>
            <h2 className="text-3xl font-bold mt-2">
              {totalQuestions}
            </h2>
          </div>

        </div>

        {/* Published Exams */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">
              Published Examinations
            </h2>
          </div>

          {loading ? (
            <p className="text-center py-10 text-slate-500">
              Loading examinations...
            </p>
          ) : exams.length === 0 ? (
            <p className="text-center py-10 text-slate-500">
              No published examinations found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4">Exam Name</th>
                    <th className="p-4">Duration</th>
                    <th className="p-4">Questions</th>
                    <th className="p-4">Total Marks</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {exams.map((exam) => (
                    <tr
                      key={exam._id}
                      className="border-b hover:bg-slate-50"
                    >
                      <td className="p-4 font-semibold">{exam.title}</td>
                      <td className="p-4">{exam.duration} Minutes</td>
                      <td className="p-4">
                        {exam.questions?.length || 0}
                      </td>
                      <td className="p-4">{exam.totalMarks}</td>
                      <td className="p-4">
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Published
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default AdminDashboard;