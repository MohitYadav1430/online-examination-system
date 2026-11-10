import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";

function AnswerSheet() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnswerSheet = async () => {
      try {
        const response = await api.get(
          `/exams/admin/answer-sheet/${attemptId}`
        );

        setData(response.data);
      } catch (err) {
        console.error("Answer Sheet Error:", err);
        setError(
          err.response?.data?.message || "Unable to load answer sheet."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnswerSheet();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading Answer Sheet...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || "Answer Sheet not found."}</p>

        <button
          onClick={() => navigate("/admin/results")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Results
        </button>
      </div>
    );
  }

  const { student, exam, result, answerSheet } = data;

  const correctCount = answerSheet.filter(
    (answer) => answer.isCorrect
  ).length;

  const wrongCount = answerSheet.filter(
    (answer) =>
      answer.selectedOption !== null && !answer.isCorrect
  ).length;

  const unattemptedCount = answerSheet.filter(
    (answer) => answer.selectedOption === null
  ).length;

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-slate-900 text-white p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Student Answer Sheet</h1>
            <p className="text-slate-400 text-sm mt-1">
              Complete examination performance
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/results")}
            className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">

        {/* Student Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">
            Student Information
          </h2>

          <p>
            <strong>Name:</strong> {student?.name || "Unknown"}
          </p>

          <p className="mt-2">
            <strong>Email:</strong> {student?.email || "Unknown"}
          </p>

          <p className="mt-2">
            <strong>Exam:</strong> {exam?.title || "Unknown"}
          </p>

          <p className="mt-2">
            <strong>Submitted:</strong>{" "}
            {result.submittedAt
              ? new Date(result.submittedAt).toLocaleString()
              : "N/A"}
          </p>
        </div>

        {/* Result Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-slate-500">Final Score</p>
            <h2 className="text-2xl font-bold mt-2">
              {result.score} / {result.totalMarks}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-slate-500">Correct Answers</p>
            <h2 className="text-2xl font-bold text-green-600 mt-2">
              {correctCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-slate-500">Wrong Answers</p>
            <h2 className="text-2xl font-bold text-red-600 mt-2">
              {wrongCount}
            </h2>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-slate-500">Not Attempted</p>
            <h2 className="text-2xl font-bold text-slate-600 mt-2">
              {unattemptedCount}
            </h2>
          </div>

        </div>

        {/* Questions */}
        <div className="space-y-5">

          <h2 className="text-2xl font-bold">
            Question-wise Analysis
          </h2>

          {answerSheet.map((question, index) => (

            <div
              key={question.questionId}
              className="bg-white p-6 rounded-xl shadow-sm border-l-4"
              style={{
                borderLeftColor:
                  question.isCorrect
                    ? "#16a34a"
                    : question.selectedOption === null
                    ? "#64748b"
                    : "#dc2626",
              }}
            >

              <div className="flex justify-between items-start gap-3 mb-4">

                <h3 className="font-bold text-lg">
                  Q{index + 1}. {question.questionText}
                </h3>

                {question.isCorrect ? (
                  <CheckCircle className="text-green-600 shrink-0" />
                ) : question.selectedOption === null ? (
                  <Clock className="text-slate-500 shrink-0" />
                ) : (
                  <XCircle className="text-red-600 shrink-0" />
                )}

              </div>

              <div className="space-y-2">

                {question.options.map((option, optionIndex) => {

                  const isSelected =
                    question.selectedOption === optionIndex;

                  const isCorrect =
                    question.correctOption === optionIndex;

                  let optionStyle =
                    "border border-slate-200 bg-white";

                  if (isCorrect) {
                    optionStyle =
                      "border border-green-500 bg-green-50 text-green-800";
                  } else if (isSelected) {
                    optionStyle =
                      "border border-red-500 bg-red-50 text-red-800";
                  }

                  return (
                    <div
                      key={optionIndex}
                      className={`p-3 rounded-lg ${optionStyle}`}
                    >
                      <div className="flex justify-between items-center gap-3">

                        <span>
                          {String.fromCharCode(65 + optionIndex)}. {option}
                        </span>

                        <span className="text-sm font-semibold">
                          {isCorrect
                            ? "Correct Answer"
                            : isSelected
                            ? "Student Answer"
                            : ""}
                        </span>

                      </div>
                    </div>
                  );
                })}

              </div>

              <div className="mt-4 flex flex-wrap justify-between gap-2 text-sm">

                <span className="text-slate-600">
                  Marks: {question.earnedMarks} / {question.marks}
                </span>

                <span
                  className={`font-semibold ${
                    question.isCorrect
                      ? "text-green-600"
                      : question.selectedOption === null
                      ? "text-slate-500"
                      : "text-red-600"
                  }`}
                >
                  {question.isCorrect
                    ? "Correct"
                    : question.selectedOption === null
                    ? "Not Attempted"
                    : "Incorrect"}
                </span>

              </div>

            </div>

          ))}

        </div>

      </main>
    </div>
  );
}

export default AnswerSheet;