import { NextRequest } from 'next/server'
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf'
import { inngest } from '@/inngest/client'
import axios from 'axios'
import { currentUser } from '@clerk/nextjs/server'

interface RunStatus {
  data?: Array<{
    status?: string
    output?: Record<string, unknown>
  }>
}

export async function POST(req: NextRequest) {
  const FormData = await req.formData()
  const resumeFile = FormData.get('resumeFile') as File
  const recordId = FormData.get('recordId') as string
  const user = await currentUser()
  const loader = new WebPDFLoader(resumeFile)
  const docs = await loader.load()
  console.log(docs[0])

  const arrayBuffer = await resumeFile.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')

  const resultIds = await inngest.send({
    name: 'AiResumeAnalyzerAgent',
    data: {
      recordId,
      base64ResumeFile: base64,
      pdfText: docs[0]?.pageContent,
      aiAgentType: 'ai-resume-analyzer',
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
