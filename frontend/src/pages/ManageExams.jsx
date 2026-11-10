import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  Trash2,
  Upload,
  EyeOff,
  RefreshCw,
  Pencil,
} from "lucide-react";
import API from "../services/api";

function ManageExams() {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch All Exams
  const fetchExams = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/exams/admin/all");

      setExams(response.data.exams || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to fetch examinations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // Publish / Unpublish
  const togglePublish = async (exam) => {
    try {
      if (exam.isPublished) {
        await API.patch(`/exams/${exam._id}/unpublish`);
      } else {
        await API.patch(`/exams/${exam._id}/publish`);
      }

      fetchExams();
    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to update exam status."
      );
    }
  };

  // Delete Exam
  const handleDelete = async (examId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this examination and its attempts?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/exams/${examId}`);
      fetchExams();
    } catch (err) {
      alert(
        err.response?.data?.message || "Unable to delete examination."
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-5 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-white p-3 rounded-lg shadow"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Examinations Management
              </h1>

              <p className="text-slate-500">
                Manage all your examinations.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchExams}
              className="bg-white border px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <button
              onClick={() => navigate("/admin/create-exam")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg"
            >
              + Create Exam
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="bg-white p-10 text-center rounded-xl">
            Loading examinations...
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-slate-100">
                <tr>
                  <th className="p-4">Exam Name</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Questions</th>
                  <th className="p-4">Total Marks</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      No examinations found.
                    </td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam._id} className="border-t">

                      <td className="p-4 font-semibold">
                        {exam.title}
                      </td>

                      <td className="p-4">
                        {exam.duration} minutes
                      </td>

                      <td className="p-4">
                        {exam.questions?.length || 0}
                      </td>

                      <td className="p-4">
                        {exam.totalMarks}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            exam.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {exam.isPublished
                            ? "Published"
                            : "Unpublished"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">

                          {/* View */}
                          <button
                            title="View Details"
                            onClick={() =>
                              navigate(`/admin/exam/${exam._id}`)
                            }
                            className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                          >
                            <Eye size={18} />
                          </button>

                          {/* Edit */}
                          <button
                            title="Edit Examination"
                            onClick={() =>
                              navigate(`/admin/edit-exam/${exam._id}`)
                            }
                            className="p-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                          >
                            <Pencil size={18} />
                          </button>

                          {/* Publish / Unpublish */}
                          <button
                            title={
                              exam.isPublished
                                ? "Unpublish"
                                : "Publish"
                            }
                            onClick={() => togglePublish(exam)}
                            className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200"
                          >
                            {exam.isPublished ? (
                              <EyeOff size={18} />
                            ) : (
                              <Upload size={18} />
                            )}
                          </button>

                          {/* Delete */}
                          <button
                            title="Delete Exam"
                            onClick={() => handleDelete(exam._id)}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageExams;