import { inngest } from '@/inngest/client'
import axios from 'axios'
import { NextRequest } from 'next/server'

interface RunStatus {
  data?: Array<{
    status?: string
    output?: Record<string, unknown>
  }>
}

export async function POST(req: NextRequest) {
  const { userInput } = await req.json()

  const resultIds = await inngest.send({
    name: 'AiCareerAgent',
    data: {
      userInput
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
