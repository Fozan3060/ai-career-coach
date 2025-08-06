export interface SectionDetail {
  score: number
  comment: string
  tips_for_improvement: string[]
  whats_good: string[]
  needs_improvement: string[]
}

export interface ResumeAnalysisContent {
  overall_score: number
  overall_feedback: string
  summary_comment: string
  sections: {
    contact_info: SectionDetail
    experience: SectionDetail
    education: SectionDetail
    skills: SectionDetail
  }
  tips_for_improvement: string[]
  whats_good: string[]
  needs_improvement: string[]
}

export interface ResumeAnalysisRecord {
  id: number
  recordId: string
  content: ResumeAnalysisContent
  userEmail: string
  createdAt: string
  aiAgentType: string
  metaData: string 
}
