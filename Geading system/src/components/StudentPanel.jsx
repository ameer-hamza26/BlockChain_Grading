import { useState, useEffect, useContext } from 'react';
import { getEnrolledCourses } from '../services/web3';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Helper to generate a random 4-digit code
function randomCode() {
  return Math.floor(1000 + Math.random() * 9000);
}

// Helper to generate random completed counts for demo
function randomDone(total) {
  return Math.floor(Math.random() * (total + 1));
}

// Mock grades data for demonstration
const mockGrades = [
  { id: 1, stdId: '22pwbcs234', hashed: 'PM2342', course: 'C0234', type: 'MID-TERM', marks: 19, email: 'john@example.com' },
  { id: 2, stdId: '22pwbcs234', hashed: 'Q13454', course: 'CL2394', type: 'QUIZ 01', marks: 2, email: 'john@example.com' },
  { id: 3, stdId: '21pwb2342', hashed: 'A23453', course: 'CL9823', type: 'ASSIGN. 02', marks: 2, email: 'other@example.com' },
  { id: 4, stdId: '20pwb2390', hashed: 'PF2093', course: 'C2389', type: 'FINAL-TERM', marks: 45, email: 'john@example.com' },
];

export default function StudentPanel() {
  const [courses, setCourses] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [progress, setProgress] = useState({});
  const [courseCodes, setCourseCodes] = useState({});
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Role-based access: only allow 'student' role
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'student') {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const courseList = await getEnrolledCourses(/* student ID */);
    setCourses(courseList);
    // Generate random progress for each course
    const prog = {};
    courseList.forEach(course => {
      prog[course.id] = {
        quizzes: randomDone(3),
        assignments: randomDone(3),
        exams: randomDone(2),
      };
    });
    setProgress(prog);
  };

  const handleShowDetails = (courseId) => {
    setExpanded(prev => ({ ...prev, [courseId]: !prev[courseId] }));
    // Generate codes if not already generated
    setCourseCodes(prev => {
      if (prev[courseId]) return prev;
      return {
        ...prev,
        [courseId]: {
          quizzes: [
            `Q1-${randomCode()}`,
            `Q2-${randomCode()}`,
            `Q3-${randomCode()}`,
          ],
          assignments: [
            `A1-${randomCode()}`,
            `A2-${randomCode()}`,
            `A3-${randomCode()}`,
          ],
          exams: [
            { label: 'Mid Term', code: 'PM' },
            { label: 'Final Term', code: 'PF' },
          ],
        },
      };
    });
  };

  // Filter grades for the logged-in student
  const studentGrades = user ? mockGrades.filter(g => g.email === user.email) : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-gray-600">{course.code} • {course.credits} credits</p>
              </div>
              <button
                onClick={() => handleShowDetails(course.id)}
                className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                {expanded[course.id] ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            {expanded[course.id] && courseCodes[course.id] && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-4 flex flex-wrap gap-6">
                  <span className="text-sm text-gray-700 font-semibold">Quizzes: {progress[course.id]?.quizzes ?? 0}/3 done</span>
                  <span className="text-sm text-gray-700 font-semibold">Assignments: {progress[course.id]?.assignments ?? 0}/3 done</span>
                  <span className="text-sm text-gray-700 font-semibold">Exams: {progress[course.id]?.exams ?? 0}/2 done</span>
                </div>
                <h4 className="font-semibold mb-2">Quizzes</h4>
                <ul className="mb-2">
                  {courseCodes[course.id].quizzes.map((q, idx) => (
                    <li key={q} className="text-gray-700">Quiz {idx + 1}: <span className="font-mono font-bold">{q}</span></li>
                  ))}
                </ul>
                <h4 className="font-semibold mb-2">Assignments</h4>
                <ul className="mb-2">
                  {courseCodes[course.id].assignments.map((a, idx) => (
                    <li key={a} className="text-gray-700">Assignment {idx + 1}: <span className="font-mono font-bold">{a}</span></li>
                  ))}
                </ul>
                <h4 className="font-semibold mb-2">Exams</h4>
                <ul>
                  {courseCodes[course.id].exams.map((e) => (
                    <li key={e.code} className="text-gray-700">{e.label}: <span className="font-mono font-bold">{e.code}</span></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Grades Table for Student */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8">My Grades</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase border">Sr. No</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase border">Registration</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase border">Hashed</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase border">Course</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase border">Type</th>
              <th className="px-4 py-2 text-left text-xs font-bold text-gray-700 uppercase border">Marks</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {studentGrades.map((grade, idx) => (
              <tr key={grade.id}>
                <td className="px-4 py-2 border font-bold text-blue-700">{idx + 1}</td>
                <td className="px-4 py-2 border font-bold text-blue-700">22pwbcs0952</td>
                <td className="px-4 py-2 border font-bold text-blue-700">{grade.hashed}</td>
                <td className="px-4 py-2 border font-bold text-blue-700">{grade.course}</td>
                <td className="px-4 py-2 border font-bold text-blue-700">{grade.type}</td>
                <td className="px-4 py-2 border font-bold text-blue-700">{grade.marks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}