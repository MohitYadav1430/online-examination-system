import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [attemptId, setAttemptId] = useState("");
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [answersReady, setAnswersReady] = useState(false);
  const [error, setError] = useState("");

  const saveTimer = useRef(null);

  // Start or Resume Exam
  useEffect(() => {
    const startExam = async () => {
      try {
        const response = await API.post(`/exams/start/${examId}`);
        const data = response.data;

        const attempt = data.attempt || data.data?.attempt;
        const examData = data.exam || data.data?.exam;

        const id =
          data.attemptId ||
          attempt?._id ||
          attempt?.id;

        if (!id || !examData?.questions) {
          throw new Error("Invalid response from server.");
        }

        setAttemptId(id);
        setExam(examData);

        // Restore previously saved answers
        const savedAnswers = {};

        (attempt?.answers || []).forEach((answer) => {
          const questionId =
            answer.questionId?._id || answer.questionId;

          if (questionId) {
            savedAnswers[questionId.toString()] =
              answer.selectedOption;
          }
        });

       const localAnswers = JSON.parse(
  localStorage.getItem(`exam_answers_${examId}`) || "{}"
);

const restoredAnswers = {
  ...localAnswers,
  ...savedAnswers,
};

setAnswers(restoredAnswers);
localStorage.setItem(
  `exam_answers_${examId}`,
  JSON.stringify(restoredAnswers)
);

setAnswersReady(true);

        // Restore remaining time
        const expiry = attempt?.expiresAt || data.expiresAt;

        if (expiry) {
          const remaining = Math.max(
            0,
            Math.floor(
              (new Date(expiry).getTime() - Date.now()) / 1000
            )
          );

          setTimeLeft(remaining);
        } else {
          setTimeLeft((examData.duration || 30) * 60);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Unable to start examination."
        );
      } finally {
        setLoading(false);
      }
    };

    startExam();
  }, [examId]);

  // Auto Save Answers after 500ms
  useEffect(() => {
    if (
      !attemptId ||
      !answersReady ||
      submitting ||
      loading
    ) {
      return;
    }

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(async () => {
      try {
        setSaving(true);

        const answerArray = Object.entries(answers).map(
          ([questionId, selectedOption]) => ({
            questionId,
            selectedOption,
          })
        );

        await API.patch(
          `/exams/save-answers/${attemptId}`,
          { answers: answerArray }
        );
      } catch (err) {
        console.error(
          "Auto Save Error:",
          err.response?.data?.message || err.message
        );
      } finally {
        setSaving(false);
      }
    }, 500);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [answers, attemptId, answersReady, submitting, loading]);

  // Countdown Timer
  useEffect(() => {
    if (!attemptId || timeLeft <= 0 || submitting) return;

    const timer = setInterval(() => {
      setTimeLeft((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [attemptId, timeLeft, submitting]);

  // Select Answer
 const handleAnswer = (questionId, optionIndex) => {
  setAnswers((previous) => {
    const updatedAnswers = {
      ...previous,
      [questionId]: optionIndex,
    };

    localStorage.setItem(
      `exam_answers_${examId}`,
      JSON.stringify(updatedAnswers)
    );

    return updatedAnswers;
  });
};

  // Submit Exam
  // Submit Exam
const handleSubmit = async (autoSubmit = false) => {
  if (!attemptId || submitting) return;

  if (!autoSubmit) {
    const confirmed = window.confirm(
      "Are you sure you want to submit your examination?"
    );

    if (!confirmed) return;
  }

  try {
    setSubmitting(true);

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    // Manual submission: save latest answers first
    if (!autoSubmit) {
      const answerArray = Object.entries(answers).map(
        ([questionId, selectedOption]) => ({
          questionId,
          selectedOption,
        })
      );

      await API.patch(
        `/exams/save-answers/${attemptId}`,
        { answers: answerArray }
      );
    }

    // Auto submission uses answers already saved in MongoDB
    const response = await API.post(
      `/exams/submit/${attemptId}`,
      autoSubmit ? {} : {
        answers: Object.entries(answers).map(
          ([questionId, selectedOption]) => ({
            questionId,
            selectedOption,
          })
        ),
      }
    );

   localStorage.removeItem(`exam_answers_${examId}`);

navigate(`/result/${attemptId}`, {
  state: response.data,
});

  } catch (err) {
    alert(
      err.response?.data?.message ||
      "Unable to submit examination."
    );

    setSubmitting(false);
  }
};
  // Auto Submit when time expires
  useEffect(() => {
    if (
      attemptId &&
      timeLeft === 0 &&
      !loading &&
      !submitting &&
      answersReady
    ) {
      handleSubmit(true);
    }
  }, [timeLeft, attemptId, loading, submitting, answersReady]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Starting your examination...
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

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {exam.title}
            </h1>

            <p className="text-slate-500 mt-2">
              Total Marks: {exam.totalMarks}
            </p>

            <p className="text-sm mt-2 text-green-600">
              {saving ? "Saving answers..." : "Answers saved"}
            </p>
          </div>

          <div className="bg-red-100 text-red-700 px-5 py-3 rounded-lg font-bold text-xl">
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Questions */}
        {exam.questions.map((question, index) => (
          <div
            key={question._id}
            className="bg-white p-6 rounded-xl shadow mb-6"
          >
            <h2 className="text-lg font-semibold mb-5">
              Q{index + 1}. {question.questionText}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <label
                  key={optionIndex}
                  className={`flex items-center gap-3 border p-4 rounded-lg cursor-pointer transition ${
                    answers[question._id] === optionIndex
                      ? "border-blue-600 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={question._id}
                    checked={
                      answers[question._id] === optionIndex
                    }
                    onChange={() =>
                      handleAnswer(question._id, optionIndex)
                    }
                  />

                  <span>{option}</span>
                </label>
              ))}
            </div>

            <p className="text-sm text-slate-500 mt-4">
              Marks: {question.marks}
            </p>
          </div>
        ))}

        {/* Submit Button */}
        <div className="bg-white p-6 rounded-xl shadow flex justify-between items-center">
          <p className="text-slate-600">
            Answered: {Object.keys(answers).length} /{" "}
            {exam.questions.length}
          </p>

          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;