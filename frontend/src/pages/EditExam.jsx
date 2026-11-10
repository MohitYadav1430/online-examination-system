import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";

function EditExam() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    questions: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await api.get(`/exams/admin/${examId}`);
        const exam = response.data.exam;

        setFormData({
          title: exam.title || "",
          description: exam.description || "",
          duration: exam.duration || "",
          questions: exam.questions.map((q) => ({
            questionText: q.questionText || "",
            options: [...q.options],
            correctOption: Number(q.correctOption),
            marks: Number(q.marks || 1),
          })),
        });
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load examination."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateQuestion = (index, field, value) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      questions[index] = {
        ...questions[index],
        [field]: value,
      };

      return { ...prev, questions };
    });
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setFormData((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[questionIndex].options];

      options[optionIndex] = value;

      questions[questionIndex] = {
        ...questions[questionIndex],
        options,
      };

      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          questionText: "",
          options: ["", "", "", ""],
          correctOption: 0,
          marks: 1,
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (formData.questions.length <= 1) {
      setError("At least one question is required.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title.trim()) {
      setError("Please enter examination title.");
      return;
    }

    if (
      !Number.isFinite(Number(formData.duration)) ||
      Number(formData.duration) <= 0
    ) {
      setError("Please enter a valid duration.");
      return;
    }

    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];

      if (!q.questionText.trim()) {
        setError(`Please enter Question ${i + 1}.`);
        return;
      }

      if (
        q.options.length !== 4 ||
        q.options.some((option) => !option.trim())
      ) {
        setError(`Please fill all four options for Question ${i + 1}.`);
        return;
      }

      if (
        !Number.isInteger(Number(q.correctOption)) ||
        Number(q.correctOption) < 0 ||
        Number(q.correctOption) > 3
      ) {
        setError(`Select correct answer for Question ${i + 1}.`);
        return;
      }

      if (!Number.isFinite(Number(q.marks)) || Number(q.marks) <= 0) {
        setError(`Enter valid marks for Question ${i + 1}.`);
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        duration: Number(formData.duration),
        questions: formData.questions.map((q) => ({
          questionText: q.questionText.trim(),
          options: q.options.map((option) => option.trim()),
          correctOption: Number(q.correctOption),
          marks: Number(q.marks),
        })),
      };

      const response = await api.put(`/exams/${examId}`, payload);

      setSuccess(
        response.data.message || "Examination updated successfully!"
      );

      setTimeout(() => {
        navigate("/admin/manage-exams");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update examination."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" size={35} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-5 sm:p-8">
      <div className="max-w-5xl mx-auto">

        <button
          type="button"
          onClick={() => navigate("/admin/manage-exams")}
          className="flex items-center gap-2 text-blue-600 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Manage Exams
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Edit Examination
          </h1>

          <p className="text-gray-500 mt-2 mb-7">
            Update examination details and questions.
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-5 flex gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-5">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block font-semibold mb-2">
                  Examination Title
                </label>

                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    updateField("title", e.target.value)
                  }
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Description
                </label>

                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  className="w-full border rounded-lg p-3"
                  rows="3"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Duration (Minutes)
                </label>

                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    updateField("duration", e.target.value)
                  }
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold">
                Questions
              </h2>

              <button
                type="button"
                onClick={addQuestion}
                className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Plus size={18} />
                Add Question
              </button>
            </div>

            <div className="space-y-6">
              {formData.questions.map((question, index) => (
                <div
                  key={index}
                  className="border rounded-xl p-5 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">
                      Question {index + 1}
                    </h3>

                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 flex items-center gap-1"
                    >
                      <Trash2 size={18} />
                      Remove
                    </button>
                  </div>

                  <label className="block font-semibold mb-2">
                    Question Text
                  </label>

                  <textarea
                    value={question.questionText}
                    onChange={(e) =>
                      updateQuestion(
                        index,
                        "questionText",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-lg p-3 mb-4"
                    rows="2"
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex}>
                        <label className="block text-sm font-medium mb-1">
                          Option {String.fromCharCode(65 + optionIndex)}
                        </label>

                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            updateOption(
                              index,
                              optionIndex,
                              e.target.value
                            )
                          }
                          className="w-full border rounded-lg p-3"
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block font-semibold mb-2">
                        Correct Answer
                      </label>

                      <select
                        value={question.correctOption}
                        onChange={(e) =>
                          updateQuestion(
                            index,
                            "correctOption",
                            Number(e.target.value)
                          )
                        }
                        className="w-full border rounded-lg p-3"
                      >
                        {question.options.map((_, optionIndex) => (
                          <option
                            key={optionIndex}
                            value={optionIndex}
                          >
                            Option {String.fromCharCode(65 + optionIndex)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-2">
                        Marks
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={question.marks}
                        onChange={(e) =>
                          updateQuestion(
                            index,
                            "marks",
                            e.target.value
                          )
                        }
                        className="w-full border rounded-lg p-3"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-4 rounded-lg flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Examination
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default EditExam;