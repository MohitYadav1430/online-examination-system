import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Award,
  CheckCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";

function AdminExamDetails() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExamDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/exams/admin/${examId}`);
        setExam(response.data.exam);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load exam details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [examId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={35} />
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <AlertCircle size={45} className="text-red-500" />
        <p className="text-red-600">{error || "Exam not found."}</p>
        <button
          onClick={() => navigate("/admin/manage-exams")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <button
          onClick={() => navigate("/admin/manage-exams")}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Manage Exams
        </button>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {exam.title}
              </h1>

              <p className="text-gray-500 mt-2">
                {exam.description || "No description available."}
              </p>
            </div>

            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                exam.isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {exam.isPublished ? "Published" : "Unpublished"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 p-4 rounded-xl">
              <Clock className="text-blue-600 mb-2" />
              <p className="text-gray-500 text-sm">Duration</p>
              <h3 className="text-xl font-bold">
                {exam.duration} Minutes
              </h3>
            </div>

            <div className="bg-purple-50 p-4 rounded-xl">
              <BookOpen className="text-purple-600 mb-2" />
              <p className="text-gray-500 text-sm">Total Questions</p>
              <h3 className="text-xl font-bold">
                {exam.questions?.length || 0}
              </h3>
            </div>

            <div className="bg-green-50 p-4 rounded-xl">
              <Award className="text-green-600 mb-2" />
              <p className="text-gray-500 text-sm">Total Marks</p>
              <h3 className="text-xl font-bold">
                {exam.totalMarks ??
                  exam.questions?.reduce(
                    (sum, q) => sum + Number(q.marks || 0),
                    0
                  )}
              </h3>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-5">
          Examination Questions
        </h2>

        <div className="space-y-5">
          {exam.questions?.map((question, index) => (
            <div
              key={question._id || index}
              className="bg-white rounded-xl shadow p-6"
            >
              <div className="flex justify-between items-start gap-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Q{index + 1}. {question.questionText}
                </h3>

                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                  {question.marks} Marks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
                {question.options?.map((option, optionIndex) => {
                  const isCorrect =
                    Number(question.correctOption) === optionIndex;

                  return (
                    <div
                      key={optionIndex}
                      className={`p-4 rounded-lg border flex items-center justify-between gap-3 ${
                        isCorrect
                          ? "bg-green-50 border-green-400 text-green-800"
                          : "bg-gray-50 border-gray-200 text-gray-700"
                      }`}
                    >
                      <span>
                        <strong className="mr-2">
                          {String.fromCharCode(65 + optionIndex)}.
                        </strong>
                        {option}
                      </span>

                      {isCorrect && (
                        <CheckCircle
                          size={20}
                          className="text-green-600 shrink-0"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-green-700 text-sm font-semibold mt-4">
                ✓ Correct Answer: Option{" "}
                {String.fromCharCode(
                  65 + Number(question.correctOption)
                )}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/admin/manage-exams")}
          className="mt-8 mb-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Back to Manage Exams
        </button>
      </div>
    </div>
  );
}

export default AdminExamDetails;