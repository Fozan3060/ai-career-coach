export interface HistoryRecord {
  id: number
  recordId: string
  content: any 
  userEmail: string
  createdAt: string
  aiAgentType: string
  metaData?: string
}

export interface HistoryApiResponse {
  data: HistoryRecord[]
}
