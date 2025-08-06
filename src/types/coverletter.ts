export interface CoverLetterFormData {
  fullName: string
  jobTitle: string
  companyName: string
  resumeHighlights: string
  jobDescription: string
}

export interface CoverLetterResponse {
  output: {
    coverLetter: string
    suggestions?: string[]
  }
}

export interface CoverLetterRecord {
  id: number
  recordId: string
  content: {
    formData: CoverLetterFormData
    generatedLetter: string
    suggestions?: string[]
  }
  userEmail: string
  createdAt: string
  aiAgentType: string
  metaData?: string
}
