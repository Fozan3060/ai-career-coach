'use client'

import {
  Bot,
  CreditCard,
  History,
  Home,
  Settings,
  User,
  Zap
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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

const navigationItems = [
  {
    title: 'Workspace',
    url: '/dashboard',
    icon: Home,
    isActive: true
  },
  {
    title: 'AI Tools',
    url: '/ai-tools',
    icon: Bot
  },
  {
    title: 'My History',
    url: '/history',
    icon: History
  },
  {
    title: 'Billing',
    url: '/billing',
    icon: CreditCard
  },
  {
    title: 'Profile',
    url: '/profile',
    icon: User
  }
]

export function AppSidebar () {
  const { user, isLoaded } = useUser()
  console.log(user)
  const path = usePathname()
  return (
    <Sidebar variant='inset'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <a href='#' className='flex items-center'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white'>
                  <Zap className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>
                    AI Career Coach
                  </span>
                  <span className='truncate text-xs text-muted-foreground'>
                    Pro Plan
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map(item => {
                const isActive = path.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`flex items-center hover:bg-zinc-500 hover:text-white transition-colors duration-300 ${
                        isActive ? 'bg-zinc-700 text-white' : ''
                      }`}
                    >
                      <a
                        href={item.url}
                        className='flex items-center gap-2 w-full px-3 py-2 rounded'
                      >
                        <item.icon className='size-4' />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <UserButton />
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>{user?.fullName}</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {user?.emailAddresses[0].emailAddress}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
