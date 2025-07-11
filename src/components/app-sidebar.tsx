import { useSidebar } from './ui/sidebar'
import { HomeIcon, ListIcon, UserIcon, CogIcon } from './icons'

export function AppSidebar() {
  const { open, setOpen } = useSidebar()
  const link =
    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100'
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r bg-gray-50 transition-transform md:static md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <nav className="grid gap-1 p-4">
          <a href="#" className={link} onClick={() => setOpen(false)}>
            <HomeIcon className="h-4 w-4" />
            Dashboard
          </a>
          <a href="#" className={link} onClick={() => setOpen(false)}>
            <ListIcon className="h-4 w-4" />
            Tasks
          </a>
          <a href="#" className={link} onClick={() => setOpen(false)}>
            <UserIcon className="h-4 w-4" />
            Users
          </a>
          <a href="#" className={link} onClick={() => setOpen(false)}>
            <CogIcon className="h-4 w-4" />
            Settings
          </a>
        </nav>
      </aside>
    </>
  )
}
