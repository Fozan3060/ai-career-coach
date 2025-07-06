import { createAgent, gemini } from '@inngest/agent-kit'
import { inngest } from './client'
import { v2 as cloudinary } from 'cloudinary'
import { db } from '@/db/drizzle'
import { HistoryTable } from '@/db/schema'

export const AiCareerChatAgent = createAgent({
  name: 'AiCareerChatAgent',
  description: 'An Ai agent the answers career related questions',
  system:
    "You are an intelligent and supportive AI Career Coach.  Your goal is to help users make smarter career decisions based on their interests, background, and goals.  You can answer questions about job roles, career paths, required skills, resume improvements, interview preparation, and growth opportunities in the tech industry.  You provide clear, practical, and encouraging guidance while remaining honest and realistic. Avoid giving legal, medical, or financial advice.  Always keep answers concise and tailored to the user's query.",
  model: gemini({
    model: 'gemini-2.0-flash',
    apiKey: process.env.GEMINI_API_KEY
  })
})

export const AiCareerChatFunction = inngest.createFunction(
  { id: 'AiCareerAgent' },
  { event: 'AiCareerAgent' },
  async ({ event, step }) => {
    const { userInput } = await event?.data
    const result = await AiCareerChatAgent.run(userInput)
    return result
  }
)

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
})

export const AiResumeAnalyzerFunction = inngest.createFunction(
  { id: 'AiResumeAnalyzerAgent' },
  { event: 'AiResumeAnalyzerAgent' },
  async ({ event, step }) => {
    const { recordId, base64ResumeFile, pdfText,aiAgentType,userEmail} = event.data

    const uploadedFile = await step.run('uploadResumePDF', async () => {
      return await cloudinary.uploader.upload(
        `data:application/pdf;base64,${base64ResumeFile}`,
        {
          resource_type: 'auto',
          public_id: `resume_${Date.now()}`
        }
      )
    })

    const cleanedText = pdfText?.trim().slice(0, 8000)

    const AiResumeReport = await AiResumeAnalyzerAgent.run(cleanedText)
    const rawcontent = AiResumeReport.output?.[0]?.content || ''
    const rawcontentjson = rawcontent.replace('```json', '').replace('```', '')
    const parsejson = JSON.parse(rawcontentjson)
    const saveToDb = await step.run('SaveToDb', async () => {
      const result = await db.insert(HistoryTable).values({
        recordId: recordId,
        content: parsejson,
        aiAgentType: aiAgentType,
        userEmail: userEmail
      })

      console.log(result)
    })
    return {
      uploadedUrl: uploadedFile.secure_url,
      report: parsejson
    }
  }
)

export const AiResumeAnalyzerAgent = createAgent({
  name: 'AiResumeAnalyzerAgent',
  description: 'Analyzes resumes and returns structured feedback',
  system: `You are an advanced AI Resume Analyzer Agent.

Your task is to evaluate a candidate's resume and return a detailed analysis in the following structured JSON schema format.

The schema must match the layout and structure of a visual UI that includes overall score, section scores, summary feedback, improvement tips, strengths, and weaknesses.



📤 INPUT: I will provide a plain text resume.

🎯 GOAL: Output a JSON report as per the schema below. The report should reflect:



overall_score (0–100)



overall_feedback (short message e.g., "Excellent", "Needs improvement")



summary_comment (1–2 sentence evaluation summary)



Section scores for:



Contact Info



Experience



Education



Skills



Each section should include:



score (as percentage)



Optional comment about that section



Tips for improvement (3–5 tips)



What’s Good (1–3 strengths)



Needs Improvement (1–3 weaknesses)



🧠 Output JSON Schema:

json

Copy

Edit

{

  "overall_score": 85,

  "overall_feedback": "Excellent!",

  "summary_comment": "Your resume is strong, but there are areas to refine.",

  "sections": {

    "contact_info": {

      "score": 95,

      "comment": "Perfectly structured and complete."

    },

    "experience": {

      "score": 88,

      "comment": "Strong bullet points and impact."

    },

    "education": {

      "score": 70,

      "comment": "Consider adding relevant coursework."

    },

    "skills": {

      "score": 60,

      "comment": "Expand on specific skill proficiencies."

    }

  },

  "tips_for_improvement": [

    "Add more numbers and metrics to your experience section to show impact.",

    "Integrate more industry-specific keywords relevant to your target roles.",

    "Start bullet points with strong action verbs to make your achievements stand out."

  ],

  "whats_good": [

    "Clean and professional formatting.",

    "Clear and concise contact information.",

    "Relevant work experience."

  ],

  "needs_improvement": [

    "Skills section lacks detail.",

    "Some experience bullet points could be stronger.",

    "Missing a professional summary/objective."

  ]

}

`,
  model: gemini({
    model: 'gemini-2.0-flash',
    apiKey: process.env.GEMINI_API_KEY
  })
})
