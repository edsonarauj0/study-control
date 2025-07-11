import { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return <SidebarContext.Provider value={{ open, setOpen }}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('SidebarContext not found')
  return ctx
}

export function SidebarTrigger({ className = '' }: { className?: string }) {
  const { open, setOpen } = useSidebar()
  return (
    <button onClick={() => setOpen(!open)} className={`p-2 ${className}`}>
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}

export function SidebarInset({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`flex min-h-screen flex-1 flex-col ${className}`}>{children}</div>
}
