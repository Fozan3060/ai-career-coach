"use client"
import { SidebarTrigger, useSidebar } from "../ui/sidebar"
import { SignOutButton } from "@clerk/nextjs"
import { LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  const { state, open } = useSidebar()
  const sidebarTakesSpace = state === "expanded" && open

  return (
    <header
      className={`
        fixed top-0 z-50 flex h-16 shrink-0 items-center gap-2 
        bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-950/60 
        border-b border-gray-800/50 transition-all duration-200 ease-linear
        ${sidebarTakesSpace ? "left-0 right-0 md:left-[var(--sidebar-width)]" : "left-0 right-0"}
      `}
    >
      <div className="flex items-center justify-between w-full gap-2 pl-4 pr-6">
        {/* Left side - Sidebar trigger */}
        <div className="flex items-center gap-4">
          <SidebarTrigger
            className="
            -ml-1 p-2 rounded-lg 
            hover:bg-gray-800/50 
            text-gray-400 hover:text-white 
            transition-all duration-300 
            hover:scale-105
            border border-transparent hover:border-gray-700
          "
          >
            <Menu className="size-4" />
          </SidebarTrigger>

          {/* Breadcrumb or page title - show more when sidebar is collapsed */}
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-400">
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
            <span>{sidebarTakesSpace ? "AI Career Coach Dashboard" : "AI Career Coach - Dashboard"}</span>
          </div>
        </div>

        {/* Right side - Sign out */}
        <div className="flex items-center gap-3">
          {/* Status indicator - show more details when sidebar is collapsed */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border border-purple-500/20 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-300 font-medium">
              {sidebarTakesSpace ? "Online" : "Online - Pro Plan"}
            </span>
          </div>

          <SignOutButton>
            <Button
              variant="ghost"
              size="sm"
              className="
                flex items-center gap-2 
                hover:bg-red-500/10 hover:text-red-400 
                text-gray-400 
                border border-transparent hover:border-red-500/30
                transition-all duration-300
                rounded-lg px-3 py-2
              "
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </SignOutButton>
        </div>
      </div>
    </header>
  )
}

export default Header
