"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AIToolCardProps {
  title: string
  description: string
  icon: React.ReactNode
  color: keyof typeof colorMappings
  onClickLabel: string
  onClick?: () => void
}

const colorMappings = {
  purple: {
    border: "border-purple-500/20",
    hoverBorder: "hover:border-purple-400/60",
    text: "text-purple-300",
    hoverText: "hover:text-purple-200",
    hoverBg: "hover:bg-purple-500/15",
    cardHoverBorder: "hover:border-purple-500/40",
    cardHoverShadow: "hover:shadow-purple-500/20",
    iconGradient: "from-purple-500 to-purple-600",
    buttonShadow: "hover:shadow-purple-500/25",
  },
  blue: {
    border: "border-blue-500/20",
    hoverBorder: "hover:border-blue-400/60",
    text: "text-blue-300",
    hoverText: "hover:text-blue-200",
    hoverBg: "hover:bg-blue-500/15",
    cardHoverBorder: "hover:border-blue-500/40",
    cardHoverShadow: "hover:shadow-blue-500/20",
    iconGradient: "from-blue-500 to-blue-600",
    buttonShadow: "hover:shadow-blue-500/25",
  },
  green: {
    border: "border-green-500/20",
    hoverBorder: "hover:border-green-400/60",
    text: "text-green-300",
    hoverText: "hover:text-green-200",
    hoverBg: "hover:bg-green-500/15",
    cardHoverBorder: "hover:border-green-500/40",
    cardHoverShadow: "hover:shadow-green-500/20",
    iconGradient: "from-green-500 to-green-600",
    buttonShadow: "hover:shadow-green-500/25",
  },
  orange: {
    border: "border-orange-500/20",
    hoverBorder: "hover:border-orange-400/60",
    text: "text-orange-300",
    hoverText: "hover:text-orange-200",
    hoverBg: "hover:bg-orange-500/15",
    cardHoverBorder: "hover:border-orange-500/40",
    cardHoverShadow: "hover:shadow-orange-500/20",
    iconGradient: "from-orange-500 to-orange-600",
    buttonShadow: "hover:shadow-orange-500/25",
  },
} as const

export function AIToolCard({ title, description, icon, color, onClickLabel, onClick }: AIToolCardProps) {
  const colorConfig = colorMappings[color]

  return (
    <Card
      className={`
      bg-gray-800/50 border-gray-700/50 backdrop-blur-sm
      ${colorConfig.cardHoverBorder} 
      transition-all duration-500 ease-out
      hover:shadow-xl ${colorConfig.cardHoverShadow} 
      hover:bg-gray-800/70
      hover:-translate-y-1
      group cursor-pointer
    `}
    >
      <CardHeader className="text-center pb-4">
        <div
          className={`
          w-16 h-16 bg-gradient-to-br ${colorConfig.iconGradient} 
          rounded-2xl flex items-center justify-center mx-auto mb-4 
          group-hover:scale-110 group-hover:rotate-3
          transition-all duration-500 ease-out
          shadow-lg group-hover:shadow-xl
        `}
        >
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold text-white group-hover:text-gray-100 transition-colors duration-300">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        <Button
          variant="outline"
          onClick={onClick}
          className={`
            w-full h-11 font-medium
            bg-gray-950/80 backdrop-blur-sm
            ${colorConfig.border} 
            ${colorConfig.text} 
            ${colorConfig.hoverBorder} 
            ${colorConfig.hoverText}
            ${colorConfig.hoverBg} 
            hover:bg-gray-900/90
            hover:scale-[1.02]
            hover:shadow-lg ${colorConfig.buttonShadow}
            active:scale-[0.98]
            transition-all duration-300 ease-out
            cursor-pointer
            border-2
            relative overflow-hidden
            group/button
          `}
        >
          <span className="relative z-10 transition-transform duration-300 group-hover/button:scale-105">
            {onClickLabel}
          </span>

          {/* Subtle shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out" />
        </Button>
      </CardContent>
    </Card>
  )
}
