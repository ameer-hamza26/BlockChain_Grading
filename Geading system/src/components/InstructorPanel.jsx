import React, { useState, useEffect } from 'react';
import {
  getCourses,
  getUsers,
  getStudentsForCourse,
  enrollStudentInCourse
} from '../services/web3.jsx';

const InstructorPanel = () => {
  // State for courses, students, UI, etc.
  const [courses, setCourses] = useState([]);
  const [studentCounts, setStudentCounts] = useState({});
  const [openCourse, setOpenCourse] = useState(null);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [selectedAddStudent, setSelectedAddStudent] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [instructorName, setInstructorName] = useState('');

  // Load courses and students on mount
  useEffect(() => {
    loadCourses();
    getUsers().then(users => setAllStudents(users.filter(u => u.role === 'student')));
  }, []);

  // Load courses and student counts
  const loadCourses = async () => {
    const courseList = await getCourses();
    const filteredCourses = courseList.filter(c => c.instructorId === 2);
    setCourses(filteredCourses);
    // Fetch real-time student counts for each course
    const counts = {};
    for (const course of filteredCourses) {
      const students = await getStudentsForCourse(course.id);
      counts[course.id] = students.length;
    }
    setStudentCounts(counts);
  };

  // Open course details
  const handleOpenCourse = async (courseId) => {
    const course = courses.find(c => c.id === courseId);
    setOpenCourse(course);
    const students = await getStudentsForCourse(courseId);
    setEnrolledStudents(students);
    // Find instructor name
    const users = await getUsers();
    const instructor = users.find(u => u.id === course.instructorId);
    setInstructorName(instructor ? instructor.name : '');
  };

  // Add student to course
  const handleAddStudent = async (studentId) => {
    setAddLoading(true);
    await enrollStudentInCourse(openCourse.id, studentId);
    const students = await getStudentsForCourse(openCourse.id);
    setEnrolledStudents(students);
    setAddLoading(false);
    // Update the count for this course
    setStudentCounts(prev => ({ ...prev, [openCourse.id]: students.length }));
  };

  // Filter students by search
  const filteredStudents = enrolledStudents.filter(s =>
    s.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 p-8">
      {/* Course Cards */}
      <div className="space-y-6 mb-8">
        {courses.map((course) => (
          <div key={course.id} className="flex items-center bg-white shadow-md border border-gray-200 rounded-xl p-6 justify-between hover:shadow-lg transition">
            <div className="flex-1">
              <div className="font-bold text-xl text-blue-800">{course.title}</div>
              <div className="font-mono text-base text-gray-500">{course.code}</div>
            </div>
            <div className="flex flex-col items-center mx-6">
              <div className="border-2 border-blue-400 px-6 py-2 text-2xl font-bold mb-1 min-w-[60px] text-center bg-blue-50 text-blue-700 rounded-lg">{studentCounts[course.id] ?? 0}</div>
              <div className="text-sm mt-0.5 text-gray-600">Total Students</div>
            </div>
            <button
              className="border-2 border-blue-600 px-10 py-2 text-xl font-semibold ml-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
              onClick={() => handleOpenCourse(course.id)}
            >
              Open
            </button>
          </div>
        ))}
      </div>
      {/* Course Details Modal/Panel */}
      {openCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-blue-600 rounded-2xl shadow-2xl p-10 w-full max-w-4xl relative">
            {/* Course Metadata */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="font-bold text-3xl text-blue-800 mb-1">{openCourse.title}</div>
                <div className="font-mono text-xl text-gray-500 mb-2">{openCourse.code}</div>
                <div className="text-gray-700 mb-1">Credits: <span className="font-semibold">{openCourse.credits}</span></div>
                <div className="text-gray-700 mb-1">Instructor: <span className="font-semibold">{instructorName}</span></div>
                <div className="text-gray-700">Total Students: <span className="font-semibold">{enrolledStudents.length}</span></div>
              </div>
              <div className="flex flex-col gap-4 items-end">
                <button className="border-2 border-blue-600 px-10 py-2 text-lg font-semibold w-40 bg-white text-blue-700 rounded-lg hover:bg-blue-50" onClick={() => setOpenCourse(null)}>Close</button>
                <button className="border-2 border-blue-600 px-10 py-2 text-lg font-semibold w-40 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700" onClick={() => setAddStudentOpen(true)}>Add Student</button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search students by registration or email..."
              className="border-2 border-blue-400 w-full px-4 py-3 mb-8 text-lg text-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full border divide-y divide-blue-200 rounded-lg">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-2 border text-xs font-bold text-blue-700 uppercase">#</th>
                    <th className="px-4 py-2 border text-xs font-bold text-blue-700 uppercase">Registration</th>
                    <th className="px-4 py-2 border text-xs font-bold text-blue-700 uppercase">Email</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-100">
                  {filteredStudents.map((student, idx) => (
                    <tr key={student.id} className={idx % 2 === 0 ? 'bg-blue-50' : ''}>
                      <td className="px-4 py-2 border text-center font-semibold">{idx + 1}</td>
                      <td className="px-4 py-2 border font-mono text-blue-700 font-bold text-center">{student.registrationNumber}</td>
                      <td className="px-4 py-2 border text-center">{student.email}</td>
                    </tr>
                  ))}
                  {filteredStudents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-4 py-6 text-center text-gray-400">No students found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Add Student Modal */}
            {addStudentOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white border-2 border-blue-600 rounded-xl p-8 w-full max-w-md shadow-xl">
                  <h3 className="text-xl font-bold mb-4 text-blue-700">Add Student</h3>
                  <div className="mb-4">
                    <select
                      className="border-2 border-blue-400 w-full px-3 py-2 rounded-lg"
                      onChange={e => setSelectedAddStudent(e.target.value)}
                      value={selectedAddStudent || ''}
                    >
                      <option value="">Select student</option>
                      {allStudents.filter(s => !enrolledStudents.some(es => es.id === s.id)).map(s => (
                        <option key={s.id} value={s.id}>{s.registrationNumber} - {s.email}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end gap-3">
                    <button className="border-2 border-blue-600 px-6 py-2 rounded-lg" onClick={() => setAddStudentOpen(false)}>Cancel</button>
                    <button
                      className="border-2 border-blue-600 px-6 py-2 bg-blue-600 text-white rounded-lg shadow"
                      onClick={async () => {
                        await handleAddStudent(Number(selectedAddStudent));
                        setAddStudentOpen(false);
                        setSelectedAddStudent('');
                      }}
                      disabled={!selectedAddStudent || addLoading}
                    >
                      {addLoading ? 'Adding...' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorPanel;
