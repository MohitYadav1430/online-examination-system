import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  ArrowLeft,
  Users,
  BookOpen,
  ClipboardCheck,
  TrendingUp,
  Award,
  RefreshCw,
  Trophy,
  AlertCircle,
} from "lucide-react";

function AdminAnalytics() {
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const response = await api.get("/exams/admin/analytics");

      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Analytics Error:", error);
      alert(
        error.response?.data?.message ||
          "Unable to fetch analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-slate-500">{title}</p>
          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className={`p-4 rounded-xl ${color}`}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Analytics data is unavailable.</p>
        <button
          onClick={fetchAnalytics}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  const ScoreCard = ({ title, data, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <Icon className={color} size={28} />
        <h3 className="font-bold text-lg">{title}</h3>
      </div>

      {data ? (
        <>
          <p className="text-xl font-bold">{data.studentName}</p>
          <p className="text-slate-500 mt-1">{data.examTitle}</p>

          <div className="mt-4 flex justify-between">
            <span>
              {data.score} / {data.totalMarks} Marks
            </span>

            <span className="font-bold text-blue-600">
              {data.percentage}%
            </span>
          </div>
        </>
      ) : (
        <p className="text-slate-500">No submissions yet.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Admin Analytics Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Examination performance overview
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchAnalytics}
              className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded-lg"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg"
            >
              <ArrowLeft size={18} />
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Total Students"
            value={analytics.totalStudents}
            icon={Users}
            color="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Total Exams"
            value={analytics.totalExams}
            icon={BookOpen}
            color="bg-purple-100 text-purple-600"
          />

          <StatCard
            title="Total Submissions"
            value={analytics.totalSubmissions}
            icon={ClipboardCheck}
            color="bg-green-100 text-green-600"
          />

          <StatCard
            title="Average Performance"
            value={`${analytics.averagePercentage}%`}
            icon={TrendingUp}
            color="bg-orange-100 text-orange-600"
          />

        </div>

        {/* Highest and Lowest Scores */}
        <h2 className="text-xl font-bold mb-5">
          Student Performance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

          <ScoreCard
            title="Highest Score"
            data={analytics.highestScore}
            icon={Trophy}
            color="text-green-600"
          />

          <ScoreCard
            title="Lowest Score"
            data={analytics.lowestScore}
            icon={AlertCircle}
            color="text-red-600"
          />

        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">

          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">
              Recent Exam Submissions
            </h2>
          </div>

          {analytics.recentSubmissions.length === 0 ? (
            <p className="text-center py-10 text-slate-500">
              No submissions available.
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-100">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Exam</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Submission Date</th>
                  </tr>
                </thead>

                <tbody>
                  {analytics.recentSubmissions.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-slate-50">

                      <td className="p-4 font-semibold">
                        {item.studentName}
                      </td>

                      <td className="p-4">
                        {item.examTitle}
                      </td>

                      <td className="p-4">
                        {item.score} / {item.totalMarks}
                      </td>

                      <td className="p-4 text-sm text-slate-500">
                        {item.submittedAt
                          ? new Date(item.submittedAt).toLocaleString()
                          : "N/A"}
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

export default AdminAnalytics;