import { inngest } from '@/inngest/client'
import { currentUser } from '@clerk/nextjs/server'
import axios from 'axios'

export async function POST(req: Request) {
  const { fullName, jobTitle, companyName, resumeHighlights, jobDescription } = await req.json()
  const user = await currentUser()

  const resultIds = await inngest.send({
    name: 'AiCoverLetterGeneratorAgent',
    data: {
      fullName,
      jobTitle,
      companyName,
      resumeHighlights,
      jobDescription,
      userEmail: user?.primaryEmailAddress?.emailAddress
    }
  })

  const runId = resultIds.ids[0]
  console.log(runId)

  let runStatus
  while (true) {
    runStatus = await getRuns(runId)
    const status = runStatus?.data?.[0]?.status
    if (status === 'Completed') break
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  const output = runStatus?.data?.[0]?.output
  return new Response(JSON.stringify({ output }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

async function getRuns(runId: string) {
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
