import { useState, useEffect } from 'react';
import { getCourses, getGrades, submitGrade } from '../services/web3';

function Notification({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded shadow-lg text-white ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`}
      onClick={onClose}
    >
      {message}
    </div>
  );
}

export default function InstructorPanel() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState([]);
  const [formData, setFormData] = useState({
    evaluationCode: '',
    marks: ''
  });
  const [loading, setLoading] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const courseList = await getCourses();
      setCourses(courseList.filter(c => c.instructorId === 22)); //temporaray ID
    } catch (err) {
      setNotification({ message: 'Failed to load courses.', type: 'error' });
    }
    setLoading(false);
  };

  const loadGrades = async (courseId) => {
    setLoadingGrades(true);
    try {
      const gradeList = await getGrades(courseId);
      setGrades(gradeList);
    } catch (err) {
      setNotification({ message: 'Failed to load grades.', type: 'error' });
    }
    setLoadingGrades(false);
  };

  const handleSubmitGrade = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitGrade(formData.evaluationCode, formData.marks);
      setFormData({ evaluationCode: '', marks: '' });
      setNotification({ message: 'Grade submitted!', type: 'success' });
      if (selectedCourse) {
        loadGrades(selectedCourse);
      }
    } catch (err) {
      setNotification({ message: 'Failed to submit grade.', type: 'error' });
    }
    setLoading(false);
  };

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    if (courseId) {
      loadGrades(courseId);
    } else {
      setGrades([]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 relative">
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: 'success' })} />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Grading Interface</h2>
      {loading && <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10"><div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div></div>}
      <div className="mb-6">
        <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-1">
          Select Course
        </label>
        <select
          id="course"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          onChange={handleCourseChange}
          value={selectedCourse || ''}
          disabled={loading}
        >
          <option value="">Numerical</option>
          <option value="">DSA</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>
              {course.title} ({course.code})
            </option>
          ))}
        </select>
      </div>
      <form onSubmit={handleSubmitGrade} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="evaluationCode" className="block text-sm font-medium text-gray-700 mb-1">
              Evaluation Code
            </label>
            <input
              id="evaluationCode"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.evaluationCode}
              onChange={(e) => setFormData({ ...formData, evaluationCode: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="marks" className="block text-sm font-medium text-gray-700 mb-1">
              Marks
            </label>
            <input
              id="marks"
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={formData.marks}
              onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
              placeholder="e.g. 8/10"
              required
              disabled={loading}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Grade'}
            </button>
          </div>
        </div>
      </form>
      {selectedCourse && (
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grade Records</h3>
          {loadingGrades && <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10"><div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div></div>}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {grades.map((grade) => (
                  <tr key={grade.txHash}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{grade.evaluationCode}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{grade.studentName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{grade.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{grade.marks}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(grade.timestamp * 1000).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}