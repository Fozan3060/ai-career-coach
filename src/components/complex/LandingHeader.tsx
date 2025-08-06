"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import { Zap } from "lucide-react"

export default function LandingHeader() {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-gray-950/60 border-b border-gray-800/50 py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight group-hover:text-purple-300 transition-colors duration-300">
            AI Career Coach
          </span>
        </Link>

        {/* Auth Buttons / Loading State */}
        <nav className="flex items-center gap-4">
          {!isLoaded ? (
            // Skeleton Loading State
            <div className="flex items-center gap-4">
              {/* Sign In Button Skeleton */}
              <div className="h-10 w-20 rounded-full bg-gray-700 animate-pulse"></div>
              {/* Sign Up Button Skeleton */}
              <div className="h-10 w-24 rounded-full bg-gradient-to-r from-purple-600/50 to-blue-600/50 animate-pulse"></div>
            </div>
          ) : isSignedIn ? (
            // User is signed in, show UserButton
            <UserButton signInUrl="/" />
          ) : (
            // User is not signed in, show Sign In/Sign Up buttons
            <>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-5 py-2 rounded-full shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
