import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function ResultPage() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await API.get(
          `/exams/result/${attemptId}`
        );

        setResult(response.data.result);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Unable to load examination result."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Result...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error}</p>

        <button
          onClick={() => navigate("/student/dashboard")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const percentage =
    result.totalMarks > 0
      ? ((result.score / result.totalMarks) * 100).toFixed(2)
      : 0;

  return (
    <div className="min-h-screen bg-slate-100 p-6 flex items-center justify-center">

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">

        {/* Header */}
        <div className="text-center mb-8">

          <div className="text-6xl mb-4">
            🎉
          </div>

          <h1 className="text-3xl font-bold text-slate-800">
            Examination Completed!
          </h1>

          <p className="text-slate-500 mt-2">
            Your examination has been submitted successfully.
          </p>

        </div>

        {/* Exam Name */}
        <div className="bg-blue-50 p-5 rounded-xl mb-6 text-center">

          <p className="text-slate-500">
            Examination Name
          </p>

          <h2 className="text-xl font-bold text-blue-700 mt-2">
            {result.examName}
          </h2>

        </div>

        {/* Score */}
        <div className="grid grid-cols-2 gap-4 mb-6">

          <div className="bg-green-50 p-6 rounded-xl text-center">
            <p className="text-slate-500">
              Obtained Marks
            </p>

            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {result.score}
            </h2>
          </div>

          <div className="bg-purple-50 p-6 rounded-xl text-center">
            <p className="text-slate-500">
              Total Marks
            </p>

            <h2 className="text-4xl font-bold text-purple-600 mt-2">
              {result.totalMarks}
            </h2>
          </div>

        </div>

        {/* Percentage */}
        <div className="bg-slate-50 p-6 rounded-xl text-center mb-6">

          <p className="text-slate-500">
            Your Percentage
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-2">
            {percentage}%
          </h2>

        </div>

        {/* Status */}
        <div className="flex justify-between items-center border-b py-4">
          <span className="text-slate-600">
            Examination Status
          </span>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            Submitted
          </span>
        </div>

        <div className="flex justify-between items-center border-b py-4">
          <span className="text-slate-600">
            Started At
          </span>

          <span className="font-medium text-slate-800">
            {new Date(result.startedAt).toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center py-4">
          <span className="text-slate-600">
            Submitted At
          </span>

          <span className="font-medium text-slate-800">
            {new Date(result.submittedAt).toLocaleString()}
          </span>
        </div>

        {/* Dashboard Button */}
        <button
          onClick={() => navigate("/student/dashboard")}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  );
}

export default ResultPage;