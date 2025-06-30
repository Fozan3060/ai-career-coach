import { inngest } from '@/inngest/client'
import axios from 'axios'

export async function POST (req: Request) {
  const { userInput } = await req.json()

  const resultIds = await inngest.send({
    name: 'AiCareerAgent',
    data: {
      userInput
    }
  })

  const runId = await resultIds.ids[0]
  console.log(runId)

  let runStatus

  while (true) {
    runStatus = await getRuns(runId)

    // ✅ Fix type error here
    const status = runStatus?.data?.[0]?.status
    if (status === 'Completed') break

    // Wait 500ms before polling again
    await new Promise(resolve => setTimeout(resolve, 500))
  }

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
