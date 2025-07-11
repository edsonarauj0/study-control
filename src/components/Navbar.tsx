import { Button } from '@/components/ui/Button';
import { logout } from '@/services/authService';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <span className="font-semibold">Study Control</span>
      <Button className="bg-gray-700" onClick={() => logout()}>
        Sign Out
      </Button>
    </nav>
  );
}
