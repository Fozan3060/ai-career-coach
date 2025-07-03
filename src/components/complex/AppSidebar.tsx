'use client'

import {
  Bot,
  CreditCard,
  History,
  Home,
  User,
  Zap,
  Sparkles
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import { UserButton, useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'

const iconColorClasses: Record<string, string> = {
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  emerald: 'text-emerald-400',
  orange: 'text-orange-400',
  pink: 'text-pink-400'
}

const navigationItems = [
  {
    title: 'Workspace',
    url: '/dashboard',
    icon: Home,
    color: 'from-purple-600/20 via-purple-500/10 to-blue-600/20', // Gradient for active background
    iconBaseColor: 'blue' // Base color for icon text when not active
  },
  {
    title: 'AI Tools',
    url: '/ai-tools',
    icon: Bot,
    color: 'from-blue-600/20 via-blue-500/10 to-purple-600/20',
    iconBaseColor: 'purple'
  },
  {
    title: 'My History',
    url: '/history',
    icon: History,
    color: 'from-emerald-600/20 via-emerald-500/10 to-blue-600/20',
    iconBaseColor: 'emerald'
  },
  {
    title: 'Billing',
    url: '/billing',
    icon: CreditCard,
    color: 'from-orange-600/20 via-orange-500/10 to-yellow-600/20',
    iconBaseColor: 'orange'
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: User,
    color: 'from-pink-600/20 via-pink-500/10 to-purple-600/20',
    iconBaseColor: 'pink'
  }
]

export function AppSidebar () {
  const { user, isLoaded } = useUser()
  const path = usePathname()

  return (
    <Sidebar className='bg-gray-950 fixed' >
      {/* Elegant Header */}
      <SidebarHeader className='border-b px-6 py-6 bg-gray-900/50 border-gray-800'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg'>
            <Zap className='w-5 h-5 text-white' />
          </div>
          <div>
            <h1 className='text-white font-semibold text-lg tracking-tight'>
              AI Career Coach
            </h1>
            <div className='flex items-center gap-1.5 mt-0.5'>
              <Sparkles className='w-3 h-3 text-purple-400' />
              <span className='text-xs text-gray-400 font-medium'>
                Pro Plan
              </span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='px-4 py-6 bg-gray-950'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className='space-y-2'>
              {navigationItems.map(item => {
                const isActive = path.startsWith(item.url)
                const iconColorClass =
                  iconColorClasses[item.iconBaseColor] || 'text-gray-400' // Fallback to gray

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={`
                        w-full h-14 px-4 rounded-xl transition-all duration-300 group relative overflow-hidden
                        ${
                          isActive
                            ? `bg-gradient-to-r ${item.color} text-white border border-purple-500/30 shadow-lg shadow-purple-500/10`
                            : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-transparent hover:border-gray-700/50'
                        }
                        [&>a>svg]:!w-6 [&>a>svg]:!h-6 /* Override icon size */
                      `}
                    >
                      <a
                        href={item.url}
                        className='flex items-center gap-4 w-full relative z-10'
                      >
                        <item.icon
                          className={`
                            flex-shrink-0 transition-all !w-6 !h-6 duration-300
                            ${isActive ? 'text-white' : iconColorClass}
                            group-hover:scale-110
                          `}
                        />
                        <span className='font-medium text-base tracking-wide'>
                          {item.title}
                        </span>{' '}
      
                        {isActive && (
                          <div className='absolute right-3 w-2 h-2 bg-purple-400 rounded-full animate-pulse'></div>
                        )}
  
                        {!isActive && (
                          <div className='absolute inset-0 bg-gradient-to-r from-purple-600/5 via-transparent to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl'></div>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Elegant Footer */}
      <SidebarFooter className='bg-gray-900/50 border-t border-gray-800'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='hover:bg-gray-800/50 transition-all duration-300 rounded-xl group'
            >
              <div className='flex items-center gap-3 w-full'>
                <div className='relative'>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          'w-10 h-10 rounded-xl border-2 border-purple-500/30 group-hover:border-purple-500/50 transition-all duration-300'
                      }
                    }}
                  />
                  <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center'>
                    <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
                  </div>
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold text-white'>
                    {user?.fullName || 'Loading...'}
                  </span>
                  <span className='truncate text-xs text-gray-400'>
                    {user?.emailAddresses?.[0]?.emailAddress || 'Loading...'}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
