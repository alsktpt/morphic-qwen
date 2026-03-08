'use client'

import React from 'react'

import { cn } from '@/lib/utils'

import { useSidebar } from '@/components/ui/sidebar'

export const Header: React.FC = () => {
  const { open } = useSidebar()

  return (
    <header
      className={cn(
        'absolute top-0 right-0 p-3 flex justify-between items-center z-10 backdrop-blur-sm lg:backdrop-blur-none bg-background/80 lg:bg-transparent transition-[width] duration-200 ease-linear',
        open ? 'md:w-[calc(100%-var(--sidebar-width))]' : 'md:w-full',
        'w-full'
      )}
    >
      <div></div>
      <div></div>
    </header>
  )
}

export default Header
