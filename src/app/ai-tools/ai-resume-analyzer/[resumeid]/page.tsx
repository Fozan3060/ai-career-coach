"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import { OverallScoreCard } from "@/components/resume/OverallScoreCard"
import { SectionAnalysisCard } from "@/components/resume/SectionAnalysisCard"
import { TipsSection } from "@/components/resume/TipsSection"
import { WhatsGoodNeedsImprovementSection } from "@/components/resume/WhatsGoodNeedsImprovementSection"
import { PremiumCtaSection } from "@/components/resume/PremiumCtaSection"
import { ResumePreviewPanel } from "@/components/resume/ResumePreviewPanel"
import type { ResumeAnalysisRecord, ResumeAnalysisContent } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2 } from "lucide-react"

const AiResume = () => {
  const { resumeid } = useParams()
  const [analysisData, setAnalysisData] = useState<ResumeAnalysisContent | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const GetResumeAnalyzerRecord = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await axios.get<ResumeAnalysisRecord>("/api/history", {
        params: { recordId: id },
      })
      console.log("Fetched resume record:", result.data)
      if (result.data && result.data.content) {
        setAnalysisData(result.data.content)
        setPdfUrl(result.data.metaData || null)
        console.log(result.data.metaData)
      } else {
        setError("No analysis data found for this resume ID.")
      }
    } catch (err) {
      console.error("Error fetching resume record:", err)
      setError("Failed to load resume analysis. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (resumeid && typeof resumeid === "string") {
      GetResumeAnalyzerRecord(resumeid)
    } else {
      setIsLoading(false)
      setError("Invalid resume ID provided.")
    }
  }, [resumeid])

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading resume analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-red-900/20 border border-red-700/50 rounded-xl shadow-lg">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Button
            onClick={() => resumeid && typeof resumeid === "string" && GetResumeAnalyzerRecord(resumeid)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!analysisData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800/50 border border-gray-700 rounded-xl shadow-lg">
          <p className="text-gray-400 text-xl mb-4">No analysis data available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-white p-6 md:p-8 lg:p-10">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-8xl mx-auto">
        {/* Header with Re-analyze button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            AI Analysis Results
          </h1>
          <Button
            variant="outline"
            className="bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300"
            onClick={() => alert("Re-analyze functionality coming soon!")} // Placeholder
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Re-analyze
          </Button>
        </div>

        <div className="grid  grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: AI Analysis Results */}
          <div className="lg:col-span-2 max-h-screen overflow-y-scroll space-y-8">
            <OverallScoreCard
              score={analysisData.overall_score}
              overallFeedback={analysisData.overall_feedback}
              summaryComment={analysisData.summary_comment}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(analysisData.sections).map(([key, section]) => (
                <SectionAnalysisCard
                  key={key}
                  title={key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())} // Format section titles
                  score={section.score}
                  comment={section.comment}
                  tipsForImprovement={section.tips_for_improvement}
                  whatsGood={section.whats_good}
                  needsImprovement={section.needs_improvement}
                />
              ))}
            </div>

            <TipsSection tips={analysisData.tips_for_improvement} />

            <WhatsGoodNeedsImprovementSection
              whatsGood={analysisData.whats_good}
              needsImprovement={analysisData.needs_improvement}
            />

            <PremiumCtaSection />
          </div>

          {/* Right Column: Resume Preview */}
          <div className="lg:col-span-2 max-h-screen ">
            <ResumePreviewPanel pdfUrl={pdfUrl} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiResume
