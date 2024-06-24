'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container = ({ children, className }: ContainerProps) => {
  const path = usePathname()
  const segments = path.split('/')
  const isSetting = segments.some((segment) => segment === 'settings')

  return (
    <div className={cn('container  p-6 my-0 mx-auto max-w-[1024px]', isSetting && 'max-w-full', className)}>
      {children}
    </div>
  )
}
