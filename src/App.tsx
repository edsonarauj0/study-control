import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import PrivateRoute from '@/components/common/PrivateRoute';
import Login from '@/Login';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import MateriaDetails from '@/pages/MateriaDetails';
import Sidebar from './components/sidebar/page';
import { OrganizacaoProvider } from './contexts/OrganizacaoContext';
import { useAuth } from '@/hooks/useAuth';
import { Toaster } from 'sonner';
import { ModalProvider } from './contexts/ModalContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { GlobalLoading } from './components/common/GlobalLoading';
import TopicoDetails from '@/pages/TopicoDetails';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // O loading será exibido pelo GlobalLoading
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
      <FavoritesProvider>
        <ModalProvider>
          <Sidebar>
            <Toaster />
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
              <Route
                path="/organizacao/:idOrganizacao/materia/:idMateria/topico/:idTopico"
                element={<PrivateRoute><TopicoDetails /></PrivateRoute>}
              />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Sidebar>
        </ModalProvider>
      </FavoritesProvider>
    </OrganizacaoProvider>
  );
}

export default function App() {
  return (
    <Router>
      <LoadingProvider>
        <GlobalLoading />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LoadingProvider>
    </Router>
  );
}
