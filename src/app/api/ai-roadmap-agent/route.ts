import { inngest } from '@/inngest/client'
import { currentUser } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'
import axios from 'axios'

interface RunStatus {
  data?: Array<{
    status?: string
    output?: any
  }>
}

export async function POST(req: NextRequest) {
  const { roadmapId, userInput } = await req.json()
  const user = await currentUser()
  const resultIds = await inngest.send({
    name: 'AIRoadmapAgent',
    data: {
      userInput,
      roadmapId: roadmapId,
      userEmail: user?.primaryEmailAddress?.emailAddress
    }
  })

  const runId = resultIds.ids[0]
  console.log(runId)

  let runStatus: RunStatus | undefined

  while (true) {
    runStatus = await getRuns(runId)

    const status = runStatus?.data?.[0]?.status
    if (status === 'Completed') break

    // Wait 500ms before polling again
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const output = runStatus?.data?.[0]?.output

  return new Response(JSON.stringify({ output }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

async function getRuns(runId: string): Promise<RunStatus> {
  const result = await axios.get<RunStatus>(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`
      }
    }
  )

  return result.data
}
