import { inngest } from '@/inngest/client'
import { currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST (req: NextResponse) {
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

  const runId = await resultIds.ids[0]
  console.log(runId)

  let runStatus

  while (true) {
    runStatus = await getRuns(runId)

    //@ts-ignore
    // ✅ Fix type error here
    const status = runStatus?.data?.[0]?.status
    if (status === 'Completed') break

    // Wait 500ms before polling again
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  //@ts-ignore
  const output = runStatus?.data?.[0]?.output

  // ✅ FIX: Send a proper response back
  return new Response(JSON.stringify({ output }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function getRuns (runId: string) {
  const result = await axios.get(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`
      }
    }
  )

  return result.data
}
