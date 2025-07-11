import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import Login from '@/Login';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Sidebar from './components/sidebar/page';
import { OrganizacaoProvider } from './contexts/OrganizacaoContext';

export default function App() {
  return (
    <AuthProvider>
      <OrganizacaoProvider>
        <Sidebar>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={<PrivateRoute><Dashboard /></PrivateRoute>}
              />
              <Route
                path="/settings"
                element={<PrivateRoute><Settings /></PrivateRoute>}
              />
            </Routes>
          </Router>
        </Sidebar>
      </OrganizacaoProvider>
    </AuthProvider>
  );
}
