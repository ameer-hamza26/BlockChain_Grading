import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel.jsx';
import ChairmanPanel from './components/ChairmanPanel.jsx';
import StudentPanel from './components/StudentPanel.jsx';
import InstructorPanel from './components/InstructorPanel.jsx';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import { AuthProvider, AuthContext } from './context/AuthContext.jsx';
import { initWeb3 } from './services/web3.jsx';
import { useEffect, useContext } from 'react';

function PanelByRole({ role }) {
  switch (role) {
    case 'admin':
      return <AdminPanel />;
    case 'chairman':
      return <ChairmanPanel />;
    case 'student':
      return <StudentPanel />;
    case 'instructor':
      return <InstructorPanel />;
    default:
      return <div className="text-center mt-10 text-red-600">Unknown role</div>;
  }
}

function AppContent() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    initWeb3();
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('role');
    navigate('/login');
  };

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  // Only allow access to the user's own panel
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold">Blockchain Education System</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded">Logout</button>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-6">
        <Routes>
          <Route path={`/${user.role}`} element={<PanelByRole role={user.role} />} />
          <Route path="*" element={<Navigate to={`/${user.role}`} replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;