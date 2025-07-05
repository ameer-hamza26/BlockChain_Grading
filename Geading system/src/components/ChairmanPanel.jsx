import React, { useState } from 'react';

// Mock chairman data
const initialChairmen = [
  { id: 1, name: 'Chairman 1', employeeId: 'EMP001', email: 'chairman1@example.com', isActive: true, wallet: '0xabc123...' },
  { id: 2, name: 'Chairman 2', employeeId: 'EMP002', email: 'chairman2@example.com', isActive: false, wallet: '0xdef456...' },
];

// Mock instructors
const mockInstructors = [
  { id: 1, name: 'Jane Smith' },
  { id: 2, name: 'Ali Khan' },
];

export default function ChairmanPanel() {
  // Chairmen
  const [chairmen, setChairmen] = useState(initialChairmen);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [chairmanForm, setChairmanForm] = useState({ name: '', employeeId: '', email: '', wallet: '', isActive: true });

  // Courses
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({ title: '', code: '', credits: '', quizzes: 3, assignments: 3, papers: 1 });

  // Assignments, Exams, Quizzes
  const [assignments, setAssignments] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({ title: '', instructorId: '', type: 'assignment', quantity: 1 });

  // Course assignment
  const [courseAssignForm, setCourseAssignForm] = useState({ courseId: '', instructorId: '' });
  const [courseAssignments, setCourseAssignments] = useState([]);

  // Add course
  const handleAddCourse = (e) => {
    e.preventDefault();
    setCourses([...courses, { ...courseForm, id: courses.length + 1 }]);
    setCourseForm({ title: '', code: '', credits: '', quizzes: 3, assignments: 3, papers: 1 });
  };

  // Assign course to instructor
  const handleAssignCourse = (e) => {
    e.preventDefault();
    const course = courses.find(c => c.id === Number(courseAssignForm.courseId));
    const instructor = mockInstructors.find(i => i.id === Number(courseAssignForm.instructorId));
    if (course && instructor) {
      setCourseAssignments([...courseAssignments, { ...course, instructorName: instructor.name }]);
    }
    setCourseAssignForm({ courseId: '', instructorId: '' });
  };

  // Create and assign assignment/exam/quiz
  const handleAddAssignment = (e) => {
    e.preventDefault();
    const instructor = mockInstructors.find(i => i.id === Number(assignmentForm.instructorId));
    if (instructor) {
      setAssignments([
        ...assignments,
        {
          ...assignmentForm,
          id: assignments.length + 1,
          instructorName: instructor.name,
        },
      ]);
    }
    setAssignmentForm({ title: '', instructorId: '', type: 'assignment', quantity: 1 });
  };

  // Add chairman
  const handleAddChairman = (e) => {
    e.preventDefault();
    setChairmen([
      ...chairmen,
      { ...chairmanForm, id: chairmen.length + 1 },
    ]);
    setChairmanForm({ name: '', employeeId: '', email: '', wallet: '', isActive: true });
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chairman Dashboard</h2>
      {/* Add Course */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Add Course</h3>
        <form onSubmit={handleAddCourse} className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label htmlFor="courseTitle" className="mb-1 text-sm font-medium text-gray-700">Course Title</label>
            <input
              id="courseTitle"
              type="text"
              placeholder="Course Title"
              className="border rounded px-3 py-2"
              value={courseForm.title}
              onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="courseCode" className="mb-1 text-sm font-medium text-gray-700">Course Code</label>
            <input
              id="courseCode"
              type="text"
              placeholder="Course Code"
              className="border rounded px-3 py-2"
              value={courseForm.code}
              onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="creditHours" className="mb-1 text-sm font-medium text-gray-700">Credit Hours</label>
            <input
              id="creditHours"
              type="number"
              placeholder="Credit Hours"
              className="border rounded px-3 py-2"
              value={courseForm.credits}
              onChange={e => setCourseForm({ ...courseForm, credits: e.target.value })}
              required
              min={1}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="numQuizzes" className="mb-1 text-sm font-medium text-gray-700"># Quizzes</label>
            <input
              id="numQuizzes"
              type="number"
              placeholder="# Quizzes"
              className="border rounded px-3 py-2 w-28"
              value={courseForm.quizzes}
              onChange={e => setCourseForm({ ...courseForm, quizzes: e.target.value })}
              min={0}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="numAssignments" className="mb-1 text-sm font-medium text-gray-700"># Assignments</label>
            <input
              id="numAssignments"
              type="number"
              placeholder="# Assignments"
              className="border rounded px-3 py-2 w-32"
              value={courseForm.assignments}
              onChange={e => setCourseForm({ ...courseForm, assignments: e.target.value })}
              min={0}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="numPapers" className="mb-1 text-sm font-medium text-gray-700">Papers</label>
            <input
              id="numPapers"
              type="number"
              placeholder="Papers"
              className="border rounded px-3 py-2 w-24"
              value={courseForm.papers}
              onChange={e => setCourseForm({ ...courseForm, papers: e.target.value })}
              min={0}
              required
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 self-end">Add</button>
        </form>
        {/* Courses Table */}
        {courses.length > 0 && (
          <table className="min-w-full mt-4 divide-y divide-gray-200 text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Credits</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Quizzes</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Assignments</th>
                <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase">Papers</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course.id}>
                  <td className="px-4 py-2">{course.title}</td>
                  <td className="px-4 py-2">{course.code}</td>
                  <td className="px-4 py-2">{course.credits}</td>
                  <td className="px-4 py-2">{course.quizzes}</td>
                  <td className="px-4 py-2">{course.assignments}</td>
                  <td className="px-4 py-2">{course.papers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {/* Assign Course to Instructor */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Assign Course to Instructor</h3>
        <form onSubmit={handleAssignCourse} className="flex flex-wrap gap-4 items-end">
          <select
            className="border rounded px-3 py-2"
            value={courseAssignForm.courseId}
            onChange={e => setCourseAssignForm({ ...courseAssignForm, courseId: e.target.value })}
            required
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course.id} value={course.id}>{course.title} ({course.code})</option>
            ))}
          </select>
          <select
            className="border rounded px-3 py-2"
            value={courseAssignForm.instructorId}
            onChange={e => setCourseAssignForm({ ...courseAssignForm, instructorId: e.target.value })}
            required
          >
            <option value="">Select Instructor</option>
            {mockInstructors.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Assign</button>
        </form>
        {/* Course Assignments Table */}
        {courseAssignments.length > 0 && (
          <table className="min-w-full mt-4 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courseAssignments.map((a, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{a.title}</td>
                  <td className="px-4 py-2">{a.code}</td>
                  <td className="px-4 py-2">{a.instructorName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 