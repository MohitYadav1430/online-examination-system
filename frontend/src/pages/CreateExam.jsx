import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import API from "../services/api";

function CreateExam() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);

  const [questions, setQuestions] = useState([
    {
      questionText: "",
      options: ["", "", "", ""],
      correctOption: 0,
      marks: 2,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Add Question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: "",
        options: ["", "", "", ""],
        correctOption: 0,
        marks: 2,
      },
    ]);
  };

  // Remove Question
  const removeQuestion = (index) => {
    if (questions.length === 1) {
      setError("At least one question is required.");
      return;
    }

    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Update Question
  const updateQuestion = (index, value) => {
    const updated = [...questions];
    updated[index].questionText = value;
    setQuestions(updated);
  };

  // Update Options
  const updateOption = (questionIndex, optionIndex, value) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex] = value;
    setQuestions(updated);
  };

  // Update Correct Answer
  const updateCorrectOption = (index, value) => {
    const updated = [...questions];
    updated[index].correctOption = Number(value);
    setQuestions(updated);
  };

  // Update Marks
  const updateMarks = (index, value) => {
    const updated = [...questions];
    updated[index].marks = Number(value);
    setQuestions(updated);
  };

  // Create and Publish Examination
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter examination title.");
      return;
    }

    if (!Number.isFinite(Number(duration)) || Number(duration) <= 0) {
      setError("Please enter valid examination duration.");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];

      if (!q.questionText.trim()) {
        setError(`Please enter Question ${i + 1}.`);
        return;
      }

      if (q.options.some((option) => !option.trim())) {
        setError(`Please fill all options in Question ${i + 1}.`);
        return;
      }

      if (
        !Number.isInteger(q.correctOption) ||
        q.correctOption < 0 ||
        q.correctOption > 3
      ) {
        setError(`Select correct answer for Question ${i + 1}.`);
        return;
      }

      if (!Number.isFinite(q.marks) || q.marks <= 0) {
        setError(`Enter valid marks for Question ${i + 1}.`);
        return;
      }
    }

    try {
      setLoading(true);

      const examData = {
        title: title.trim(),
        description: description.trim(),
        duration: Number(duration),
        questions: questions.map((q) => ({
          questionText: q.questionText.trim(),
          options: q.options.map((option) => option.trim()),
          correctOption: Number(q.correctOption),
          marks: Number(q.marks),
        })),
      };

      // Create Exam
      const response = await API.post("/exams/create", examData);

      const examId =
        response.data.exam?._id ||
        response.data._id ||
        response.data.data?.exam?._id;

      if (!examId) {
        throw new Error(
          "Exam created, but Exam ID was not received from server."
        );
      }

      // Publish Exam
      await API.patch(`/exams/${examId}/publish`);

      setSuccess("Examination created and published successfully!");

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);

    } catch (err) {
      console.error("Examination Error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-5 md:p-10">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">

          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="bg-white p-3 rounded-lg shadow"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Create Examination
            </h1>

            <p className="text-slate-500 mt-1">
              Add examination details and questions.
            </p>
          </div>

        </div>

        <form onSubmit={handleSubmit}>

          {/* Exam Details */}
          <div className="bg-white p-6 rounded-xl shadow-sm mb-8">

            <h2 className="text-xl font-bold mb-6">
              Examination Details
            </h2>

            <label className="block font-medium mb-2">
              Examination Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter examination title"
              className="w-full border p-3 rounded-lg mb-5 outline-blue-500"
            />

            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter examination description"
              rows="3"
              className="w-full border p-3 rounded-lg mb-5 outline-blue-500"
            />

            <label className="block font-medium mb-2">
              Duration (Minutes)
            </label>

            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border p-3 rounded-lg outline-blue-500"
            />

          </div>

          {/* Questions Header */}
          <div className="flex justify-between items-center mb-6">

            <h2 className="text-2xl font-bold text-slate-800">
              Examination Questions
            </h2>

            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Add Question
            </button>

          </div>

          {/* Questions */}
          {questions.map((question, index) => (

            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm mb-6"
            >

              <div className="flex justify-between items-center mb-5">

                <h3 className="text-lg font-bold">
                  Question {index + 1}
                </h3>

                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="text-red-600"
                >
                  <Trash2 size={20} />
                </button>

              </div>

              <label className="block font-medium mb-2">
                Question Text
              </label>

              <textarea
                value={question.questionText}
                onChange={(e) =>
                  updateQuestion(index, e.target.value)
                }
                placeholder="Enter your question"
                rows="2"
                className="w-full border p-3 rounded-lg mb-5 outline-blue-500"
              />

              <label className="block font-medium mb-3">
                Options
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {question.options.map((option, optionIndex) => (

                  <input
                    key={optionIndex}
                    type="text"
                    value={option}
                    onChange={(e) =>
                      updateOption(index, optionIndex, e.target.value)
                    }
                    placeholder={`Option ${optionIndex + 1}`}
                    className="border p-3 rounded-lg outline-blue-500"
                  />

                ))}

              </div>

              <label className="block font-medium mt-5 mb-2">
                Correct Answer
              </label>

              <select
                value={question.correctOption}
                onChange={(e) =>
                  updateCorrectOption(index, e.target.value)
                }
                className="w-full border p-3 rounded-lg"
              >

                {question.options.map((option, optionIndex) => (

                  <option key={optionIndex} value={optionIndex}>
                    Option {optionIndex + 1}
                    {option.trim() ? ` - ${option}` : ""}
                  </option>

                ))}

              </select>

              <label className="block font-medium mt-5 mb-2">
                Marks
              </label>

              <input
                type="number"
                min="1"
                value={question.marks}
                onChange={(e) =>
                  updateMarks(index, e.target.value)
                }
                className="w-full border p-3 rounded-lg"
              />

            </div>

          ))}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-5">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-5">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold text-lg disabled:opacity-60"
          >
            {loading
              ? "Creating and Publishing..."
              : "Create & Publish Examination"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateExam;