'use client'
import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import { SignOutButton } from '@clerk/nextjs'

const Header = () => {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 flex h-16 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
      <div className='flex items-center justify-between w-full gap-2 pl-4 pr-10'>
        <SidebarTrigger className='-ml-1' />
        <SignOutButton />
      </div>
     
    </header>
  )
}

export default Header
