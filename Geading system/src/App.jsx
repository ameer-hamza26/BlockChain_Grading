import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel.jsx';
import ChairmanPanel from './components/ChairmanPanel.jsx';
import StudentPanel from './components/StudentPanel.jsx';
import InstructorPanel from './components/InstructorPanel.jsx';
import { initWeb3 } from './services/web3.jsx';
import { useEffect, useState } from 'react';

function RoleSelector({ setRole }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-6 text-center">Select Your Role</h2>
        <div className="space-y-4">
          <button onClick={() => setRole('admin')} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Admin</button>
          <button onClick={() => setRole('chairman')} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Chairman</button>
          <button onClick={() => setRole('student')} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Student</button>
          <button onClick={() => setRole('instructor')} className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Instructor</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [role, setRoleState] = useState(() => localStorage.getItem('role') || null);
  const navigate = useNavigate();

  // Helper to set role in state and localStorage
  const setRole = (newRole) => {
    setRoleState(newRole);
    localStorage.setItem('role', newRole);
  };

  useEffect(() => {
    initWeb3();
  }, []);

  useEffect(() => {
    if (role) {
      navigate(`/${role}`);
    }
  }, [role, navigate]);

  if (!role) {
    return <RoleSelector setRole={setRole} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Blockchain Education System</h1>
            <div className="flex space-x-4">
              <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => setRole('admin')}>Admin</Link>
              <Link to="/chairman" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => setRole('chairman')}>Chairman</Link>
              <Link to="/student" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => setRole('student')}>Student</Link>
              <Link to="/instructor" className="hover:bg-blue-700 px-3 py-2 rounded" onClick={() => setRole('instructor')}>Instructor</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/chairman" element={<ChairmanPanel />} />
          <Route path="/student" element={<StudentPanel />} />
          <Route path="/instructor" element={<InstructorPanel />} />
          <Route path="/" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWithRouter;