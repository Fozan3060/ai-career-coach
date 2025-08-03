import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { checkAndUpdateUsage, AgentType } from '@/lib/usage-utils'

export async function POST(req: NextRequest) {
  try {
    const { userEmail, agentType } = await req.json()
    
    if (!userEmail || !agentType) {
      return NextResponse.json(
        { error: 'Missing userEmail or agentType' },
        { status: 400 }
      )
    }

    // Validate agentType
    const validAgentTypes: AgentType[] = ['resume-analyzer', 'roadmap-generator', 'cover-letter-generator']
    if (!validAgentTypes.includes(agentType as AgentType)) {
      return NextResponse.json(
        { error: 'Invalid agentType' },
        { status: 400 }
      )
    }

    // Check usage and update
    const canUse = await checkAndUpdateUsage(userEmail, agentType as AgentType)

    return NextResponse.json({
      canUse
    })
  } catch (error) {
    console.error('Error checking usage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 