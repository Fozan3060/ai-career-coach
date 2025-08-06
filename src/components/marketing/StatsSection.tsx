"use client"

import { useState, useEffect } from "react"
import { Users, MessageCircle, FileText, Map, PenTool } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatsData {
  totalUsers: number
  totalInteractions: number
  chatAgentCount: number
  resumeAgentCount: number
  roadmapAgentCount: number
  coverLetterAgentCount: number
}

export function StatsSection() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/stats")
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        if (data.success) {
          setStats(data.data)
        } else {
          setError(data.error || "Failed to load stats.")
        }
      } catch (e: any) {
        console.error("Error fetching stats:", e)
        setError(e.message || "An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statItems = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      icon: <Users className="w-6 h-6 text-purple-400" />,
      description: "Join our growing community",
    },
    {
      title: "AI Chat Sessions",
      value: stats?.chatAgentCount,
      icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
      description: "Conversations with our AI Coach",
    },
    {
      title: "Resumes Analyzed",
      value: stats?.resumeAgentCount,
      icon: <FileText className="w-6 h-6 text-green-400" />,
      description: "Resumes improved with AI feedback",
    },
    {
      title: "Roadmaps Generated",
      value: stats?.roadmapAgentCount,
      icon: <Map className="w-6 h-6 text-orange-400" />,
      description: "Personalized career paths created",
    },
    {
      title: "Cover Letters Created",
      value: stats?.coverLetterAgentCount,
      icon: <PenTool className="w-6 h-6 text-pink-400" />,
      description: "Professional cover letters generated",
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto py-12">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm animate-pulse">
            <CardHeader className="pb-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full mb-2"></div>
              <div className="h-6 bg-gray-700 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-400">
        <p>Error loading statistics: {error}</p>
      </div>
    )
  }

  return (
    <section className="py-20 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Our Impact
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See how many professionals are transforming their careers with AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {statItems.map((item, index) => (
            <Card
              key={index}
              className="
                bg-gray-800/50 border-gray-700/50 backdrop-blur-sm
                transition-all duration-500 ease-out
                hover:shadow-xl hover:shadow-purple-500/10 
                hover:bg-gray-800/70
                hover:-translate-y-1
                group
              "
            >
              <CardHeader className="pb-3">
                <div
                  className={`
                    w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 
                    rounded-xl flex items-center justify-center mb-3
                    group-hover:scale-110 group-hover:rotate-3
                    transition-all duration-500 ease-out
                    shadow-lg group-hover:shadow-xl
                  `}
                >
                  {item.icon}
                </div>
                <CardTitle className="text-2xl xl:text-3xl font-bold text-white group-hover:text-gray-100 transition-colors duration-300">
                  {item.value?.toLocaleString() || "N/A"}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <p className="text-gray-300 text-base xl:text-lg font-medium">{item.title}</p>
                <p className="text-gray-400 text-xs xl:text-sm mt-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
