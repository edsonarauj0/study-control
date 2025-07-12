import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import PrivateRoute from '@/components/PrivateRoute';
import Login from '@/Login';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import MateriaDetails from '@/pages/MateriaDetails';
import Sidebar from './components/sidebar/page';
import { OrganizacaoProvider } from './contexts/OrganizacaoContext';
import { useAuth } from '@/hooks/useAuth';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
    );
  }

  return (
    <OrganizacaoProvider>
      <Sidebar>
        <Routes>
          <Route
            path="/"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/settings"
            element={<PrivateRoute><Settings /></PrivateRoute>}
          />
          <Route
            path="/organizacao/:idOrganizacao/materia/:idMateria"
            element={<PrivateRoute><MateriaDetails /></PrivateRoute>}
          />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </Sidebar>
    </OrganizacaoProvider>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
