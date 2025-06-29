'use client'

import type React from 'react'

import { ClerkProvider } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { AppSidebar } from '@/components/complex/AppSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import Mainbar from '@/components/complex/Mainbar'
import Header from '@/components/complex/Header'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export default function ClientLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showSidebar =
    ['/dashboard', '/billing', '/ai-tools', '/history'].includes(pathname) ||
    pathname.startsWith('/profile')
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning className='dark'>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans bg-gray-950 text-white`}
        >
          {showSidebar ? (
            <div className='flex min-h-screen bg-gray-950'>
              <SidebarProvider>
                <AppSidebar />
                <Mainbar>
                  <Header />
                  <main className=''>{children}</main>
                </Mainbar>
              </SidebarProvider>
            </div>
          ) : (
            <div className='bg-gray-950 min-h-screen'>{children}</div>
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}
