import { HomeIcon, ListIcon, UserIcon, CogIcon } from './icons';

export default function Sidebar() {
  const link =
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100';
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-gray-50 md:block">
      <nav className="grid gap-1 p-4">
        <a href="#" className={link}>
          <HomeIcon className="h-4 w-4" />
          Dashboard
        </a>
        <a href="#" className={link}>
          <ListIcon className="h-4 w-4" />
          Tasks
        </a>
        <a href="#" className={link}>
          <UserIcon className="h-4 w-4" />
          Users
        </a>
        <a href="#" className={link}>
          <CogIcon className="h-4 w-4" />
          Settings
        </a>
      </nav>
    </aside>
  );
}
