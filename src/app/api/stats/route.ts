import { NextResponse } from "next/server"

import { count, eq } from "drizzle-orm"
import { HistoryTable , usersTable } from '../../../db/schema';
import { db } from "@/db/drizzle";

export async function GET() {
  try {
    // Get total user count
    const totalUsersResult = await db.select({ count: count() }).from(usersTable)
    const totalUsers = totalUsersResult[0]?.count || 0

    // Get total AI interactions
    const totalInteractionsResult = await db.select({ count: count() }).from(HistoryTable)
    const totalInteractions = totalInteractionsResult[0]?.count || 0

    // Get counts for each AI agent type
    const chatAgentCountResult = await db
      .select({ count: count() })
      .from(HistoryTable)
      .where(eq(HistoryTable.aiAgentType, "ai-chat"))
    const chatAgentCount = chatAgentCountResult[0]?.count || 0

    const resumeAgentCountResult = await db
      .select({ count: count() })
      .from(HistoryTable)
      .where(eq(HistoryTable.aiAgentType, "ai-resume-analyzer"))
    const resumeAgentCount = resumeAgentCountResult[0]?.count || 0

    const roadmapAgentCountResult = await db
      .select({ count: count() })
      .from(HistoryTable)
      .where(eq(HistoryTable.aiAgentType, "ai-roadmap-generator"))
    const roadmapAgentCount = roadmapAgentCountResult[0]?.count || 0

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalInteractions,
        chatAgentCount,
        resumeAgentCount,
        roadmapAgentCount,
      },
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}