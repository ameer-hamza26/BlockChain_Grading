import React, { useState } from 'react';

// Mock instructors
const mockInstructors = [
  { id: 1, name: 'Jane Smith' },
  { id: 2, name: 'Ali Khan' },
];

export default function ChairmanPanel() {
  // Courses
  const [courses, setCourses] = useState([]);
  const [courseForm, setCourseForm] = useState({ title: '', code: '', credits: '' });

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
    setCourseForm({ title: '', code: '', credits: '' });
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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Chairman Dashboard</h2>

      {/* Add Course */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Add Course</h3>
        <form onSubmit={handleAddCourse} className="flex flex-wrap gap-4 items-end">
          <input
            type="text"
            placeholder="Course Title"
            className="border rounded px-3 py-2"
            value={courseForm.title}
            onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Course Code"
            className="border rounded px-3 py-2"
            value={courseForm.code}
            onChange={e => setCourseForm({ ...courseForm, code: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Credit Hours"
            className="border rounded px-3 py-2"
            value={courseForm.credits}
            onChange={e => setCourseForm({ ...courseForm, credits: e.target.value })}
            required
            min={1}
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
        </form>
        {/* Courses Table */}
        {courses.length > 0 && (
          <table className="min-w-full mt-4 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map(course => (
                <tr key={course.id}>
                  <td className="px-4 py-2">{course.title}</td>
                  <td className="px-4 py-2">{course.code}</td>
                  <td className="px-4 py-2">{course.credits}</td>
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

      {/* Create and Assign Exam/Quiz/Assignment */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Create & Assign Exam/Quiz/Assignment</h3>
        <form onSubmit={handleAddAssignment} className="flex flex-wrap gap-4 items-end">
          <select
            className="border rounded px-3 py-2"
            value={assignmentForm.type}
            onChange={e => setAssignmentForm({ ...assignmentForm, type: e.target.value })}
            required
          >
            <option value="assignment">Assignment</option>
            <option value="quiz">Quiz</option>
            <option value="exam">Exam</option>
            <option value="mid">Mid Exam</option>
            <option value="final">Final Exam</option>
          </select>
          <input
            type="text"
            placeholder="Title"
            className="border rounded px-3 py-2"
            value={assignmentForm.title}
            onChange={e => setAssignmentForm({ ...assignmentForm, title: e.target.value })}
            required
          />
          {assignmentForm.type === 'quiz' && (
            <input
              type="number"
              placeholder="Quiz Quantity"
              className="border rounded px-3 py-2"
              value={assignmentForm.quantity}
              min={1}
              onChange={e => setAssignmentForm({ ...assignmentForm, quantity: e.target.value })}
              required
            />
          )}
          <select
            className="border rounded px-3 py-2"
            value={assignmentForm.instructorId}
            onChange={e => setAssignmentForm({ ...assignmentForm, instructorId: e.target.value })}
            required
          >
            <option value="">Select Instructor</option>
            {mockInstructors.map(inst => (
              <option key={inst.id} value={inst.id}>{inst.name}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Assign</button>
        </form>
        {/* Assignments Table */}
        {assignments.length > 0 && (
          <table className="min-w-full mt-4 divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assignments.map((a, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2 capitalize">{a.type}</td>
                  <td className="px-4 py-2">{a.title}</td>
                  <td className="px-4 py-2">{a.type === 'quiz' ? a.quantity : '-'}</td>
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