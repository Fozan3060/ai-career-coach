"use client"

import { Bot, CreditCard, History, Home, User, Zap, Sparkles } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { UserButton, useUser } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

const navigationItems = [
  {
    title: "Workspace",
    url: "/dashboard",
    icon: Home,
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "AI Tools",
    url: "/ai-tools",
    icon: Bot,
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "My History",
    url: "/history",
    icon: History,
    color: "from-green-500 to-green-600",
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
    color: "from-orange-500 to-orange-600",
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    color: "from-purple-500 to-pink-500",
  },
]

export function AppSidebar() {
  const { user, isLoaded } = useUser()
  const path = usePathname()

  return (
    <Sidebar  className="bg-slate-950 fixed">
      <SidebarHeader className="bg-slate-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard" className="flex items-center group hover:bg-gray-800/50 transition-all duration-300">
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg group-hover:shadow-purple-500/25 group-hover:scale-105 transition-all duration-300">
                  <Zap className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-bold text-white text-base">AI Career Coach</span>
                  <span className="truncate text-xs text-purple-300 flex items-center gap-1">
                    <Sparkles className="size-3" />
                    Pro Plan
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-slate-950">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2 p-2">
              {navigationItems.map((item, index) => {
                const isActive = path.startsWith(item.url)
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        relative overflow-hidden rounded-xl transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/10"
                            : "hover:bg-gray-800/50 text-gray-300 hover:text-white border border-transparent hover:border-gray-700"
                        }
                      `}
                    >
                      <a href={item.url} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl">
                        <div
                          className={`
                          p-2 rounded-lg bg-gradient-to-br ${item.color} 
                          ${isActive ? "shadow-lg" : "opacity-70 group-hover:opacity-100"}
                          transition-all duration-300 group-hover:scale-110
                        `}
                        >
                          <item.icon className="size-4 text-white bg-gradient-to-br ${item.color} " />
                        </div>
                        <span className="font-medium">{item.title}</span>
                        {isActive && (
                          <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
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

      <SidebarFooter className="bg-gray-900/50 border-t border-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-gray-800/50 transition-all duration-300 rounded-xl group">
              <div className="flex items-center gap-3 w-full">
                <div className="relative">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox:
                          "w-10 h-10 rounded-xl border-2 border-purple-500/30 group-hover:border-purple-500/50 transition-all duration-300",
                      },
                    }}
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-white">{user?.fullName || "Loading..."}</span>
                  <span className="truncate text-xs text-gray-400">
                    {user?.emailAddresses?.[0]?.emailAddress || "Loading..."}
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
