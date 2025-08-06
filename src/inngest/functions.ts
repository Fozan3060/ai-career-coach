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
    const { recordId, base64ResumeFile, pdfText, aiAgentType, userEmail } =
      event.data

    // ✅ STEP 1: UPLOAD RESUME TO CLOUDINARY
    const uploadedFile = await step.run('uploadResumePDF', async () => {
      try {
        // Sanitize email for public_id (remove @ and .)
        const safeEmail = userEmail.replace(/[@.]/g, '-')
        const publicId = `resumes/${safeEmail}/${recordId}.pdf`

        const result = await cloudinary.uploader.upload(
          `data:application/pdf;base64,${base64ResumeFile}`,
          {
            resource_type: 'raw',
            public_id: publicId,
            access_mode: 'public'
          }
        )

        console.log('✅ File uploaded to Cloudinary:', result.secure_url)
        return result
      } catch (error) {
        console.error('❌ Cloudinary upload failed:', error)
        throw error
      }
    })

    const resumeUrl = uploadedFile.secure_url

    // ✅ STEP 2: RUN AI ANALYSIS
    const cleanedText = pdfText?.trim().slice(0, 8000)
    const AiResumeReport = await AiResumeAnalyzerAgent.run(cleanedText)

    // ✅ STEP 3: PARSE THE AI RESPONSE
    let parsedJson
    try {
      const firstMessage = AiResumeReport.output?.[0]
      const rawContent =
        firstMessage && 'content' in firstMessage
          ? (firstMessage as { content: string }).content
          : '{}'
      const jsonString = rawContent
        .replace(/```json\s?/, '')
        .replace(/```$/, '')
      parsedJson = JSON.parse(jsonString)
    } catch (error) {
      console.error('❌ Failed to parse JSON from AI response:', error)
      throw new Error('Invalid JSON response from AI Agent.')
    }

    // ✅ STEP 4: SAVE RESULTS TO THE DATABASE
    await step.run('SaveToDb', async () => {
      try {
        const result = await db.insert(HistoryTable).values({
          recordId,
          content: parsedJson,
          aiAgentType,
          userEmail,
          metaData: resumeUrl
        })
        console.log('✅ Analysis saved to database.')
        return result
      } catch (error) {
        console.error('❌ Database insert failed:', error)
        throw error
      }
    })

    // ✅ STEP 5: RETURN FINAL OUTPUT
    return {
      uploadedUrl: resumeUrl,
      report: parsedJson
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

export const AIRoadmapGeneratorAgent = createAgent({
  name: 'AIRoadmapGeneratorAgent',
  description: 'Generate Details Tree Like Flow Roadmap',
  system: `Generate a React flow tree-structured learning roadmap for user input position/ skills the following format:
 vertical tree structure with meaningful x/y positions to form a flow

- Structure should be similar to roadmap.sh layout
- Steps should be ordered from fundamentals to advanced
- Include branching for different specializations (if applicable)
- Each node must have a title, short description, and learning resource link
- Use unique IDs for all nodes and edges
- make it more specious node position, 
- Response n JSON format
{
roadmapTitle:'',
description:<3-5 Lines>,
duration:'',
initialNodes : [
{
 id: '1',
 type: 'turbo',
 position: { x: 0, y: 0 },
 data: {
title: 'Step Title',
description: 'Short two-line explanation of what the step covers.',
link: 'Helpful link for learning this step',
 },
},
...
],
initialEdges : [
{
 id: 'e1-2',
 source: '1',
 target: '2',
},
...
];
}

`,
  model: gemini({
    model: 'gemini-2.0-flash',
    apiKey: process.env.GEMINI_API_KEY
  })
})
export const AIRoadmapAgentFunction = inngest.createFunction(
  { id: 'AIRoadmapAgent' },
  { event: 'AIRoadmapAgent' },
  async ({ event, step }) => {
    const { roadmapId, userInput, userEmail } = event.data

    const roadmapResult = await AIRoadmapGeneratorAgent.run(userInput) 

    try {
      const firstMessage = roadmapResult.output?.[0]
      const rawContent =
        firstMessage && 'content' in firstMessage
          ? (firstMessage as { content: string }).content
          : '{}'
      const cleanedJson = rawContent
        .replace(/```json\s?/, '')
        .replace(/```$/, '')

      const parsed = JSON.parse(cleanedJson)
      await step.run('SaveToDb', async () => {
        try {
          const result = await db.insert(HistoryTable).values({
            recordId: roadmapId,
            content: parsed,
            aiAgentType: 'ai-roadmap-generator',
            userEmail,
            metaData: userInput
          })
          console.log('✅ Analysis saved to database.')
          return result
        } catch (error) {
          console.error('❌ Database insert failed:', error)
          throw error
        }
      })
      return parsed
    } catch (err) {
      console.error('❌ Failed to parse roadmap output', err)
      throw new Error('Invalid JSON from roadmap agent')
    }
  }
)

export const AiCoverLetterGeneratorAgent = createAgent({
  name: 'AiCoverLetterGeneratorAgent',
  description: 'Generates tailored cover letters for job applications',
  system: `You are a professional AI that writes customized cover letters for job applications.

📥 INPUT:
- fullName: The user's full name.
- jobTitle: The position the user is applying for.
- companyName: The target company.
- jobDescription: The job listing text.
- resumeHighlights: A summary of key achievements or skills.

🎯 GOAL:
Write a polished, compelling cover letter that:
- Matches the job description
- Highlights the user's most relevant experience
- Feels personal and confident
- Is formatted as a plain text cover letter (no markdown, no JSON)

💡 TONE:
Professional, clear, and concise. Avoid filler, generic phrases, or overly formal language.`,
  model: gemini({
    model: 'gemini-2.0-flash',
    apiKey: process.env.GEMINI_API_KEY
  })
})
export const AiCoverLetterGeneratorFunction = inngest.createFunction(
  { id: 'AiCoverLetterGeneratorAgent' },
  { event: 'AiCoverLetterGeneratorAgent' },
  async ({ event }) => {
    const { fullName, jobTitle, companyName, resumeHighlights, jobDescription } = event.data

    const prompt = `
Generate a personalized cover letter using the following:

Full Name: ${fullName}
Job Title: ${jobTitle}
Company Name: ${companyName}
Resume Highlights: ${resumeHighlights}
Job Description: ${jobDescription}

Write the final output as a clean, plain text cover letter.
`

    const result = await AiCoverLetterGeneratorAgent.run(prompt)

    return result
  }
)

