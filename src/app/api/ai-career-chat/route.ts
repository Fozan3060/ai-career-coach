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
  try {
    const { userInput } = await req.json()
    console.log(userInput, 'userInput')
    
    const resultIds = await inngest.send({
      name: 'AiCareerAgent',
      data: {
        userInput
      }
    })

    const runId = resultIds.ids[0]
    console.log(runId)

  let runStatus: RunStatus | undefined
  let attempts = 0
  const maxAttempts = 60 // 30 seconds max (60 * 500ms)

  while (attempts < maxAttempts) {
    try {
      runStatus = await getRuns(runId)
      const status = runStatus?.data?.[0]?.status
      const output = runStatus?.data?.[0]?.output
      
      console.log('Run status:', status, 'Attempt:', attempts + 1)
      console.log('Run output:', output)
      
      if (status === 'Completed') {
        console.log('✅ Inngest function completed successfully')
        break
      }
      
      if (status === 'Failed') {
        console.error('❌ Inngest function failed')
        throw new Error('Inngest function failed')
      }

      console.log('⏳ Waiting 500ms before next poll...')
      // Wait 500ms before polling again
      await new Promise(resolve => setTimeout(resolve, 500))
      attempts++
    } catch (error) {
      console.error('Error polling Inngest status:', error)
      break
    }
  }

  if (attempts >= maxAttempts) {
    console.error('Timeout waiting for Inngest completion')
    return new Response(JSON.stringify({ 
      error: 'Request timeout',
      output: [{ content: "I'm sorry, but the request is taking too long. Please try again." }]
    }), {
      status: 408,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const output = runStatus?.data?.[0]?.output

  if (!output) {
    return new Response(JSON.stringify({ 
      error: 'No output received',
      output: [{ content: "I'm sorry, but I couldn't generate a response. Please try again." }]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  console.log('Successfully received output from Inngest')
  return new Response(JSON.stringify({ output }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
  } catch (error) {
    console.error('Error in AI career chat API:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      output: [{ content: "I'm sorry, but I'm experiencing technical difficulties. Please try again later." }]
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

async function getRuns(runId: string): Promise<RunStatus> {
  try {
    console.log('Fetching run status for:', runId)
    console.log('Inngest server host:', process.env.INNGEST_SERVER_HOST)
    
    const result = await axios.get<RunStatus>(
      `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
      {
        headers: {
          Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`
        },
        timeout: 10000 // 10 second timeout
      }
    )

    console.log('Inngest API response:', JSON.stringify(result.data, null, 2))
    return result.data
  } catch (error) {
    console.error('Error fetching run status from Inngest:', error)
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any
      console.error('Axios error details:', {
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        data: axiosError.response?.data
      })
    }
    throw error
  }
}
