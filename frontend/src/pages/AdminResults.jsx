import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  ArrowLeft,
  Users,
  BookOpen,
  Award,
  RefreshCw,
  Search,
  Eye,
} from "lucide-react";

function AdminResults() {
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchResults = async () => {
    try {
      setLoading(true);

      const response = await api.get("/exams/admin/results");

      setResults(response.data.results || []);
    } catch (error) {
      console.error("Results Error:", error);
      alert(
        error.response?.data?.message || "Unable to fetch exam results"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const filteredResults = results.filter((result) => {
    const searchText = search.toLowerCase();

    return (
      result.studentName.toLowerCase().includes(searchText) ||
      result.studentEmail.toLowerCase().includes(searchText) ||
      result.examTitle.toLowerCase().includes(searchText)
    );
  });

  const averageScore =
    results.length > 0
      ? (
          results.reduce((sum, result) => sum + result.percentage, 0) /
          results.length
        ).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-5 flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Exam Results Dashboard
          </h1>

          <p className="text-slate-400 text-sm">
            Monitor student examination performance
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600"
        >
          <ArrowLeft size={18} />
          Dashboard
        </button>

      </header>

      <main className="max-w-7xl mx-auto p-6">

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Users className="text-blue-600 mb-3" size={30} />

            <p className="text-slate-500">Total Submissions</p>

            <h2 className="text-3xl font-bold">
              {results.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <BookOpen className="text-purple-600 mb-3" size={30} />

            <p className="text-slate-500">Exams Attempted</p>

            <h2 className="text-3xl font-bold">
              {new Set(results.map((r) => r.examTitle)).size}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <Award className="text-green-600 mb-3" size={30} />

            <p className="text-slate-500">Average Percentage</p>

            <h2 className="text-3xl font-bold">
              {averageScore}%
            </h2>
          </div>

        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

            <h2 className="text-xl font-bold">
              Student Results
            </h2>

            <div className="flex gap-2">

              <div className="relative">

                <Search
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search student or exam..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <button
                onClick={fetchResults}
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
              >
                <RefreshCw size={18} />
              </button>

            </div>

          </div>

          {loading ? (

            <p className="text-center py-10 text-slate-500">
              Loading results...
            </p>

          ) : filteredResults.length === 0 ? (

            <p className="text-center py-10 text-slate-500">
              No exam results found.
            </p>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-100 text-slate-600 text-sm">

                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Exam</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Percentage</th>
                    <th className="p-4">Submitted At</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredResults.map((result) => (

                    <tr
                      key={result.attemptId}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="p-4">

                        <p className="font-semibold">
                          {result.studentName}
                        </p>

                        <p className="text-sm text-slate-500">
                          {result.studentEmail}
                        </p>

                      </td>

                      <td className="p-4 font-medium">
                        {result.examTitle}
                      </td>

                      <td className="p-4">
                        {result.score} / {result.totalMarks}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            result.percentage >= 40
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {result.percentage}%
                        </span>

                      </td>

                      <td className="p-4 text-sm text-slate-600">
                        {result.submittedAt
                          ? new Date(result.submittedAt).toLocaleString()
                          : "N/A"}
                      </td>

                      <td className="p-4">

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                          Submitted
                        </span>

                      </td>

                      <td className="p-4">

                        <button
                          onClick={() =>
                            navigate(
                              `/admin/answer-sheet/${result.attemptId}`
                            )
                          }
                          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                        >
                          <Eye size={16} />
                          View Answers
                        </button>

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

export default AdminResults;