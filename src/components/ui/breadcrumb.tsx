import { ReactNode } from 'react'

export function Breadcrumb({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <nav aria-label="breadcrumb" className={className}>
      {children}
    </nav>
  )
}

export function BreadcrumbList({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <ol className={`flex items-center gap-1 ${className}`}>{children}</ol>
}

export function BreadcrumbItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <li className={className}>{children}</li>
}

export function BreadcrumbPage({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`text-sm font-medium text-gray-700 ${className}`}>{children}</span>
}
