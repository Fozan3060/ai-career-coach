'use client'

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

export default function RootLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const showSidebar = [
    '/dashboard',
    '/profile',
    '/billing',
    '/ai-tools',
    '/history'
  ].includes(pathname)

  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans`}
        >
          {showSidebar ? (
            <div className='flex min-h-screen'>
              <SidebarProvider>
                <AppSidebar />
                <Mainbar>
                  <Header />
                  <main className='flex-1 mt-24 z-10'>{children}</main>
                </Mainbar>
              </SidebarProvider>
            </div>
          ) : (
            children
          )}
        </body>
      </html>
    </ClerkProvider>
  )
}
