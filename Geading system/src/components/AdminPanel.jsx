import { useState, useEffect } from 'react';
import { getUsers, addUser, updatePassword, deleteUser } from '../services/web3.jsx';
import { ClipboardDocumentIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import ChairmanPanel from './ChairmanPanel.jsx';
import InstructorPanel from './InstructorPanel.jsx';
import { UserGroupIcon, AcademicCapIcon, ClipboardDocumentListIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

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

// Mock grades data for demonstration
const mockGrades = [
  { id: 1, stdId: '22pwbcs234', hashed: 'PM2342', course: 'C0234', type: 'MID-TERM', marks: 19 },
  { id: 2, stdId: '22pwbcs234', hashed: 'Q13454', course: 'CL2394', type: 'QUIZ 01', marks: 2 },
  { id: 3, stdId: '21pwb2342', hashed: 'A23453', course: 'CL9823', type: 'ASSIGN. 02', marks: 2 },
  { id: 4, stdId: '20pwb2390', hashed: 'PF2093', course: 'C2389', type: 'FINAL-TERM', marks: 45 },
];

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [activePanel, setActivePanel] = useState('students'); // students | grading | chairman | instructor
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    password: '',
    registrationNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'success' });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const userList = await getUsers();
      setUsers(userList);
    } catch (err) {
      setNotification({ message: 'Failed to load users.', type: 'error' });
    }
    setLoading(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addUser(formData.name, formData.email, formData.role, formData.password, formData.registrationNumber);
      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', role: 'student', password: '', registrationNumber: '' });
      setNotification({ message: 'User added successfully!', type: 'success' });
      loadUsers();
    } catch (err) {
      setNotification({ message: 'Failed to add user.', type: 'error' });
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updatePassword(selectedUser.id, formData.password);
      setIsEditModalOpen(false);
      setFormData({ ...formData, password: '' });
      setNotification({ message: 'Password updated!', type: 'success' });
    } catch (err) {
      setNotification({ message: 'Failed to update password.', type: 'error' });
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        await deleteUser(userId);
        setNotification({ message: 'User deleted.', type: 'success' });
        loadUsers();
      } catch (err) {
        setNotification({ message: 'Failed to delete user.', type: 'error' });
      }
      setLoading(false);
    }
  };

  // Only show students in the students panel
  const students = users.filter(u => u.role === 'student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white/90 border-r flex flex-col p-6 space-y-4 shadow-lg">
        <h1 className="text-3xl font-extrabold mb-10 text-blue-700 tracking-tight flex items-center gap-2">
          <AcademicCapIcon className="h-8 w-8 text-blue-500" />
          Admin <span className="underline decoration-blue-400">Dashboard</span>
        </h1>
        <button
          className={`flex items-center gap-3 border px-4 py-3 rounded-lg text-lg font-semibold mb-2 transition-all duration-150 hover:bg-blue-100 ${activePanel === 'chairman' ? 'bg-blue-200 text-blue-900' : 'text-gray-700'}`}
          onClick={() => setActivePanel('chairman')}
        >
          <AcademicCapIcon className="h-6 w-6" /> Chairman
        </button>
        <button
          className={`flex items-center gap-3 border px-4 py-3 rounded-lg text-lg font-semibold mb-2 transition-all duration-150 hover:bg-blue-100 ${activePanel === 'instructor' ? 'bg-blue-200 text-blue-900' : 'text-gray-700'}`}
          onClick={() => setActivePanel('instructor')}
        >
          <UserGroupIcon className="h-6 w-6" /> Instructor
        </button>
        <button
          className={`flex items-center gap-3 border px-4 py-3 rounded-lg text-lg font-semibold mb-2 transition-all duration-150 hover:bg-blue-100 ${activePanel === 'students' ? 'bg-blue-200 text-blue-900' : 'text-gray-700'}`}
          onClick={() => setActivePanel('students')}
        >
          <ClipboardDocumentListIcon className="h-6 w-6" /> Students
        </button>
        <button
          className={`flex items-center gap-3 border px-4 py-3 rounded-lg text-lg font-semibold mb-2 transition-all duration-150 hover:bg-blue-100 ${activePanel === 'grading' ? 'bg-blue-200 text-blue-900' : 'text-gray-700'}`}
          onClick={() => setActivePanel('grading')}
        >
          <DocumentTextIcon className="h-6 w-6" /> Grading Log
        </button>
      </div>
      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col items-center">
        <div className="w-full max-w-6xl">
          {activePanel === 'students' && (
            <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-blue-700 tracking-tight">Students Panel</h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
                  disabled={loading}
                >
                  Add New
                </button>
              </div>
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full border divide-y divide-gray-200 text-center">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-2 border text-xs font-bold text-blue-700 uppercase">Sr.</th>
                      <th className="px-4 py-2 border text-xs font-bold text-blue-700 uppercase">Registration</th>
                      <th className="px-4 py-2 border text-xs font-bold text-blue-700 uppercase">Email</th>
                      <th className="px-4 py-2 border text-xs font-bold text-blue-700 uppercase">Status</th>
                      <th className="px-4 py-2 border text-xs font-bold text-blue-700 uppercase">Wallet Address</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, idx) => (
                      <tr key={student.id} className={idx % 2 === 0 ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-2 border font-semibold">{idx + 1}</td>
                        <td className="px-4 py-2 border font-mono">{student.registrationNumber || student.email.split('@')[0]}</td>
                        <td className="px-4 py-2 border">{student.email}</td>
                        <td className="px-4 py-2 border">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {student.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-2 border font-mono text-xs">{student.wallet}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activePanel === 'grading' && (
            <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-200">
              <h2 className="text-3xl font-bold text-blue-700 tracking-tight mb-8">Grading Log</h2>
              <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 border text-center">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-4 py-2 text-xs font-bold text-blue-700 uppercase border">Sr. No</th>
                      <th className="px-4 py-2 text-xs font-bold text-blue-700 uppercase border">Std id</th>
                      <th className="px-4 py-2 text-xs font-bold text-blue-700 uppercase border">Hashed</th>
                      <th className="px-4 py-2 text-xs font-bold text-blue-700 uppercase border">Course</th>
                      <th className="px-4 py-2 text-xs font-bold text-blue-700 uppercase border">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockGrades.map((grade, idx) => (
                      <tr key={grade.id} className={idx % 2 === 0 ? 'bg-blue-50' : ''}>
                        <td className="px-4 py-2 border font-bold text-blue-700">{idx + 1}</td>
                        <td className="px-4 py-2 border font-bold text-blue-700">{grade.stdId}</td>
                        <td className="px-4 py-2 border font-bold text-blue-700">{grade.hashed}</td>
                        <td className="px-4 py-2 border font-bold text-blue-700">{grade.course}</td>
                        <td className="px-4 py-2 border font-bold text-blue-700">{grade.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activePanel === 'chairman' && (
            <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-200">
              <h2 className="text-3xl font-bold text-blue-700 tracking-tight mb-8">Chairman Panel</h2>
              <ChairmanPanel />
            </div>
          )}
          {activePanel === 'instructor' && (
            <div className="bg-white rounded-xl shadow-lg p-8 transition-all duration-200">
              <h2 className="text-3xl font-bold text-blue-700 tracking-tight mb-8">Instructor Panel</h2>
              <InstructorPanel />
            </div>
          )}
        </div>
      </div>
      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New User</h3>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="registrationNumber">
                  Registration Number
                </label>
                <input
                  id="registrationNumber"
                  type="text"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
                  Role
                </label>
                <select
                  id="role"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Password Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Update Password for {selectedUser.name}</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}