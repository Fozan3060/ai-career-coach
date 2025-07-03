import { createAgent, gemini } from "@inngest/agent-kit";
import { inngest } from "./client";

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