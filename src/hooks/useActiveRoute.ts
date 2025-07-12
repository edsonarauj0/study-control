import { useLocation } from 'react-router-dom';

export function useActiveRoute() {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return { isActiveRoute, currentPath: location.pathname };
} 