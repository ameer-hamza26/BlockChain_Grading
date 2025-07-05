import { useState, useEffect } from 'react';
import { getEnrolledCourses, generateEvaluationCodes } from '../services/web3';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

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

export default function StudentPanel() {
  const [courses, setCourses] = useState([]);
  const [codes, setCodes] = useState({});
  const [loading, setLoading] = useState({});
  const [notification, setNotification] = useState({ message: '', type: 'success' });
  const [loadingCourses, setLoadingCourses] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoadingCourses(true);
    try {
      const courseList = await getEnrolledCourses(/* student ID */);
      setCourses(courseList);
    } catch (err) {
      setNotification({ message: 'Failed to load courses.', type: 'error' });
    }
    setLoadingCourses(false);
  };

  const handleGenerateCodes = async (courseId) => {
    setLoading(prev => ({ ...prev, [courseId]: true }));
    try {
      const generatedCodes = await generateEvaluationCodes(courseId);
      setCodes(prev => ({ ...prev, [courseId]: generatedCodes }));
      setNotification({ message: 'Codes generated!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Failed to generate codes.', type: 'error' });
    }
    setLoading(prev => ({ ...prev, [courseId]: false }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setNotification({ message: 'Code copied to clipboard!', type: 'success' });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 relative">
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: 'success' })} />
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>
      {loadingCourses && <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10"><div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin"></div></div>}
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-gray-600">{course.code} • {course.credits} credits</p>
              </div>
              <button
                onClick={() => handleGenerateCodes(course.id)}
                disabled={loading[course.id]}
                className={`px-4 py-2 rounded-md text-white ${loading[course.id] ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {loading[course.id] ? 'Generating...' : 'Generate Codes'}
              </button>
            </div>

            {codes[course.id] && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {codes[course.id].map((code) => (
                      <tr key={code.code}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{code.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{code.code}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${code.isMarked ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {code.isMarked ? 'Marked' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => copyToClipboard(code.code)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <ClipboardDocumentIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}