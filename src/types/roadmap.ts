import type { Node, Edge } from "reactflow"

export interface RoadmapNodeData {
  title: string
  description: string
  link?: string
}

export interface RoadmapData {
  roadmapTitle: string
  description: string
  duration: string
  initialNodes: Node<RoadmapNodeData>[]
  initialEdges: Edge[]
}

export interface RoadmapRecord {
  id: number
  recordId: string
  content: RoadmapData
  userEmail: string
  createdAt: string
  aiAgentType: string
  metaData?: string 
}

