import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  ArrowLeft,
  Users,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
  Trash2,
  History,
} from "lucide-react";

function StudentManagement() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const response = await api.get("/users/students");

      setStudents(response.data.students || []);
    } catch (error) {
      console.error("Students Error:", error);
      alert(
        error.response?.data?.message || "Unable to fetch students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const toggleStatus = async (student) => {
    const action = student.isActive ? "deactivate" : "activate";

    if (!window.confirm(`Are you sure you want to ${action} this student?`)) {
      return;
    }

    try {
      await api.patch(`/users/students/${student._id}/status`);
      alert(`Student ${action}d successfully`);
      fetchStudents();
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to update student status"
      );
    }
  };

  const deleteStudent = async (student) => {
    if (
      !window.confirm(
        `Delete ${student.name}? Their exam attempts and history will also be deleted. This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/users/students/${student._id}`);
      alert("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      alert(
        error.response?.data?.message || "Unable to delete student"
      );
    }
  };

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}
      <header className="bg-slate-900 text-white px-6 py-5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          <div>
            <h1 className="text-2xl font-bold">
              Student Management
            </h1>

            <p className="text-slate-400 text-sm">
              Manage registered students
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg hover:bg-slate-600"
          >
            <ArrowLeft size={18} />
            Dashboard
          </button>

        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">

        {/* Statistics */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex items-center gap-4">

          <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
            <Users size={30} />
          </div>

          <div>
            <p className="text-slate-500">Total Registered Students</p>
            <h2 className="text-3xl font-bold">
              {students.length}
            </h2>
          </div>

        </div>

        {/* Student Table */}
        <div className="bg-white rounded-xl shadow-sm p-5">

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">

            <h2 className="text-xl font-bold">
              All Students
            </h2>

            <div className="flex gap-2">

              <div className="relative">

                <Search
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />

              </div>

              <button
                onClick={fetchStudents}
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
              >
                <RefreshCw size={18} />
              </button>

            </div>

          </div>

          {loading ? (

            <p className="text-center py-10 text-slate-500">
              Loading students...
            </p>

          ) : filteredStudents.length === 0 ? (

            <p className="text-center py-10 text-slate-500">
              No students found.
            </p>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead className="bg-slate-100 text-slate-600 text-sm">

                  <tr>
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Registration Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {filteredStudents.map((student) => (

                    <tr
                      key={student._id}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="p-4 font-semibold">
                        {student.name}
                      </td>

                      <td className="p-4 text-slate-600">
                        {student.email}
                      </td>

                      <td className="p-4 text-sm text-slate-600">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            student.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {student.isActive ? "Active" : "Inactive"}
                        </span>

                      </td>

                      <td className="p-4">

                        <div className="flex flex-wrap gap-2">

                          <button
                            onClick={() => toggleStatus(student)}
                            title={student.isActive ? "Deactivate" : "Activate"}
                            className={`p-2 rounded-lg text-white ${
                              student.isActive
                                ? "bg-orange-500 hover:bg-orange-600"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            {student.isActive ? (
                              <UserX size={17} />
                            ) : (
                              <UserCheck size={17} />
                            )}
                          </button>

                          <button
                            onClick={() =>
                              navigate(`/admin/student/${student._id}/history`)
                            }
                            title="Exam History"
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <History size={17} />
                          </button>

                          <button
                            onClick={() => deleteStudent(student)}
                            title="Delete Student"
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

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

export default StudentManagement;