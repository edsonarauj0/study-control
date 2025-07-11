import { HTMLAttributes } from 'react'

export function Separator({ orientation = 'horizontal', className = '', ...props }: { orientation?: 'horizontal' | 'vertical' } & HTMLAttributes<HTMLDivElement>) {
  const styles = orientation === 'vertical' ? 'h-full w-px' : 'w-full h-px'
  return <div className={`${styles} bg-gray-200 ${className}`} {...props} />
}
