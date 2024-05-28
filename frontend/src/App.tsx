import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from './store';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
}

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;
