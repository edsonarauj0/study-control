import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import Login from '@/Login';
import Dashboard from '@/pages/Dashboard';
import Sidebar from './components/sidebar/page';

export default function App() {
  return (
    <AuthProvider>
      <Sidebar >
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          </Routes>
        </Router>
      </Sidebar>
    </AuthProvider>
  );
}
