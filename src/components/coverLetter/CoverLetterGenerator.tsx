"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, FileText, Sparkles, Copy, Download, RefreshCw, CheckCircle } from "lucide-react"
import { useParams } from "next/navigation"
import axios from "axios"
import type { CoverLetterFormData, CoverLetterResponse } from "@/types/coverletter"
import type { CoverLetterRecord } from "@/types/coverletter"
import { useUser } from "@clerk/nextjs"

// Constants moved outside component to prevent recreation
const REQUIRED_FIELDS: (keyof CoverLetterFormData)[] = [
  "fullName",
  "jobTitle",
  "companyName",
  "resumeHighlights",
  "jobDescription",
]

const INITIAL_FORM_DATA: CoverLetterFormData = {
  fullName: "",
  jobTitle: "",
  companyName: "",
  resumeHighlights: "",
  jobDescription: "",
}

export function CoverLetterGenerator() {
  const { letterid } = useParams()
  const { user } = useUser()

  // State management
  const [formData, setFormData] = useState<CoverLetterFormData>(INITIAL_FORM_DATA)
  const [generatedLetter, setGeneratedLetter] = useState<string>("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState(false)

  // Memoized validation
  const validationErrors = useMemo(() => {
    const missingFields = REQUIRED_FIELDS.filter((field) => !formData[field].trim())
    return missingFields.length > 0 ? `Please fill in all required fields: ${missingFields.join(", ")}` : null
  }, [formData])

  // Optimized input handler with useCallback
  const handleInputChange = useCallback(
    (field: keyof CoverLetterFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
      // Clear error when user starts typing
      if (error) setError(null)
    },
    [error],
  )

  // Optimized API calls with better error handling
  const getCoverLetterRecord = useCallback(async (id: string) => {
    if (!id) {
      setError("Invalid cover letter ID provided.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data } = await axios.get<CoverLetterRecord>("/api/history", {
        params: { recordId: id },
        timeout: 10000, // 10 second timeout
      })

      console.log("Fetched cover letter record:", data.content)

      if (data?.content) {
        if (data.content.formData) {
          setFormData(data.content.formData)
        }
        if (data.content.generatedLetter) {
          setGeneratedLetter(data.content.generatedLetter)
        }
        if (data.content.suggestions) {
          setSuggestions(data.content.suggestions)
        }
      }
    } catch (err) {
      console.error("Error fetching cover letter record:", err)
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          setError("Request timed out. Please try again.")
        } else if (err.response?.status === 404) {
          setError("Cover letter not found.")
        } else {
          setError(`Failed to load cover letter: ${err.response?.data?.message || err.message}`)
        }
      } else {
        setError("An unexpected error occurred while loading the cover letter.")
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleGenerate = useCallback(async () => {
    // Validate before making API call
    if (validationErrors) {
      setError(validationErrors)
      return
    }

    if (!letterid) {
      setError("No letter ID found. Please refresh the page.")
      return
    }

    // Check usage before generating
    try {
      const response = await axios.post<{ canUse: boolean }>('/api/check-usage', {
        userEmail: user?.primaryEmailAddress?.emailAddress,
        agentType: 'cover-letter-generator'
      })
      
      console.log(`Cover letter generation check:`, response.data)
      
      if (!response.data.canUse) {
        setError("You've reached the usage limit for cover letter generation. Please upgrade to Premium for unlimited access.")
        setTimeout(() => {
          window.location.href = '/billing'
        }, 2000)
        return
      }
    } catch (error) {
      console.error('Error checking usage:', error)
      // If error, allow generation as fallback
    }

    setIsGenerating(true)
    setError(null)

    try {
      // Call the AI API to generate cover letter
      const { data } = await axios.post<CoverLetterResponse>(
        "/api/ai-cover-letter-generator",
        formData,
        { timeout: 30000 }, // 30 second timeout for AI generation
      )

      console.log("AI Response:", data)

      const coverLetter = data?.output?.coverLetter
      if (!coverLetter) {
        throw new Error("No cover letter content received from AI")
      }

      console.log("Generated Cover Letter:", coverLetter)

      const responseSuggestions: string[] = [] // No suggestions in current API response

      setGeneratedLetter(coverLetter)
      setSuggestions(responseSuggestions)

      // Update the existing database entry with PUT request
      await axios.put(
        "/api/history",
        {
          recordId: letterid,
          content: {
            formData,
            generatedLetter: coverLetter,
            suggestions: responseSuggestions,
          },
        },
        { timeout: 10000 },
      )

      console.log("Cover letter saved to database with ID:", letterid)
    } catch (err: unknown) {
      console.error("Error generating cover letter:", err)
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any
        if (axiosError.code === "ECONNABORTED") {
          setError("Request timed out. Please try again with a shorter description.")
        } else if (axiosError.response?.status === 429) {
          setError("Too many requests. Please wait a moment and try again.")
        } else if (axiosError.response?.status === 403) {
          setError("You've reached the usage limit for cover letter generation. Please upgrade to Premium for unlimited access.")
          // Redirect to billing page after showing error
          setTimeout(() => {
            window.location.href = '/billing'
          }, 2000)
        } else {
          setError(`Failed to generate cover letter: ${axiosError.response?.data?.message || axiosError.message}`)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsGenerating(false)
    }
  }, [formData, validationErrors, letterid, user?.primaryEmailAddress?.emailAddress])

  const copyToClipboard = useCallback(async () => {
    if (!generatedLetter) return

    try {
      await navigator.clipboard.writeText(generatedLetter)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy to clipboard:", err)
      setError("Failed to copy to clipboard. Please try selecting and copying manually.")
    }
  }, [generatedLetter])

  const downloadAsText = useCallback(() => {
    if (!generatedLetter || !formData.fullName || !formData.companyName) return

    try {
      const blob = new Blob([generatedLetter], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${formData.fullName.replace(/\s+/g, "_")}_${formData.companyName.replace(/\s+/g, "_")}_Cover_Letter.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Failed to download file:", err)
      setError("Failed to download file. Please try copying the text instead.")
    }
  }, [generatedLetter, formData.fullName, formData.companyName])

  // Load existing data on mount
  useEffect(() => {
    if (letterid && typeof letterid === "string") {
      getCoverLetterRecord(letterid)
    } else {
      setIsLoading(false)
      setError("Invalid cover letter ID provided.")
    }
  }, [letterid, getCoverLetterRecord])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-400 text-lg">Loading cover letter...</p>
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
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <FileText className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">AI Cover Letter Generator</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Create Your Perfect Cover Letter
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Generate a personalized, professional cover letter tailored to your target job and company.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm shadow-lg shadow-gray-900/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Tell Us About Yourself
              </CardTitle>
              <CardDescription className="text-gray-300">
                Fill in the details below to generate your personalized cover letter.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-300">
                  Full Name *
                </label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-slate-700/60 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  maxLength={100}
                />
              </div>

              {/* Job Title */}
              <div className="space-y-2">
                <label htmlFor="jobTitle" className="text-sm font-medium text-gray-300">
                  Job Title *
                </label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  className="bg-slate-700/60 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  maxLength={100}
                />
              </div>

              {/* Company Name */}
              <div className="space-y-2">
                <label htmlFor="companyName" className="text-sm font-medium text-gray-300">
                  Company Name *
                </label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="Enter the company name"
                  className="bg-slate-700/60 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20"
                  maxLength={100}
                />
              </div>

              {/* Resume Highlights */}
              <div className="space-y-2">
                <label htmlFor="resumeHighlights" className="text-sm font-medium text-gray-300">
                  Resume Highlights *
                </label>
                <Textarea
                  id="resumeHighlights"
                  value={formData.resumeHighlights}
                  onChange={(e) => handleInputChange("resumeHighlights", e.target.value)}
                  placeholder="List your key achievements, skills, and experiences relevant to this role..."
                  rows={4}
                  className="bg-slate-700/60 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                  maxLength={1000}
                />
                <div className="text-xs text-slate-500 text-right">{formData.resumeHighlights.length}/1000</div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <label htmlFor="jobDescription" className="text-sm font-medium text-gray-300">
                  Job Description *
                </label>
                <Textarea
                  id="jobDescription"
                  value={formData.jobDescription}
                  onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                  placeholder="Paste the job description or key requirements here..."
                  rows={6}
                  className="bg-slate-700/60 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500/20 resize-none"
                  maxLength={2000}
                />
                <div className="text-xs text-slate-500 text-right">{formData.jobDescription.length}/2000</div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/20 border border-red-700/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !!validationErrors}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Your Cover Letter...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Cover Letter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Preview/Results Section */}
          <Card className="bg-gray-800/50 border border-gray-700 backdrop-blur-sm shadow-lg shadow-gray-900/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-400" />
                Cover Letter Preview
              </CardTitle>
              <CardDescription className="text-gray-300">Your generated cover letter will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedLetter ? (
                <div className="space-y-4">
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={copyToClipboard}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50 transition-all duration-200"
                    >
                      {copySuccess ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={downloadAsText}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={handleGenerate}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700/50 border-slate-600 text-slate-200 hover:bg-slate-600/50"
                      disabled={isGenerating || !!validationErrors}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>

                  {/* Generated Letter */}
                  <div className="bg-slate-900/60 border border-slate-700/50 rounded-lg p-6 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-slate-200 text-sm leading-relaxed font-sans">
                      {generatedLetter}
                    </pre>
                  </div>

                  {/* Suggestions */}
                  {suggestions.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-lg font-semibold text-white mb-3">Suggestions for Improvement</h4>
                      <ul className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-slate-300 text-sm">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <FileText className="w-16 h-16 text-slate-600 mb-4" />
                  <p className="text-slate-400 text-lg mb-2">No cover letter generated yet</p>
                  <p className="text-slate-500 text-sm">
                    Fill out the form and click "Generate Cover Letter" to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
