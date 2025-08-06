"use client"

import type React from "react"
import { SidebarInset } from "@/components/ui/sidebar"

interface MainbarProps {
  children: React.ReactNode
}

const Mainbar = ({ children }: MainbarProps) => {
  return (
    <SidebarInset className="bg-gray-950  z-0 min-h-screen">
      <div className="relative min-h-screen pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/5 via-blue-900/5 to-gray-900 pointer-events-none"></div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 ">{children}</div>
      </div>
    </SidebarInset>
  )
}

export default Mainbar
