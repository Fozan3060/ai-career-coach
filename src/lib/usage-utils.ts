import { auth } from '@clerk/nextjs/server'
import { db } from '@/db/drizzle'
import { UserUsageTable } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export type AgentType = 'resume-analyzer' | 'roadmap-generator' | 'cover-letter-generator'

export async function checkAndUpdateUsage(userEmail: string, agentType: AgentType) {
  try {
    // Step 1: Check if entry exists
    const existingRecord = await db
      .select()
      .from(UserUsageTable)
      .where(
        and(
          eq(UserUsageTable.userEmail, userEmail),
          eq(UserUsageTable.AgentType, agentType)
        )
      )
      .limit(1)

    let currentUsage = 0

    // Step 2: Create entry with usage = 1 if not exists, otherwise get current usage
    if (existingRecord.length === 0) {
      await db.insert(UserUsageTable).values({
        userEmail,
        AgentType: agentType,
        usageCount: 1
      })
      currentUsage = 1
    } else {
      currentUsage = existingRecord[0].usageCount
    }

    // Step 3: Check if user has free plan or premium
    const { has } = await auth()
    const hasPremiumPlan = has({ plan: 'premium' })
    console.log(hasPremiumPlan,"premium")
    // Step 4: Logic for premium and free users
    if (hasPremiumPlan) {
      // Premium: simply increment
      if (existingRecord.length > 0) {
        await db
          .update(UserUsageTable)
          .set({ usageCount: currentUsage + 1 })
          .where(
            and(
              eq(UserUsageTable.userEmail, userEmail),
              eq(UserUsageTable.AgentType, agentType)
            )
          )
      }
      return true // canUse = true
    } else {
      // Free plan: check if current usage < 3
      if (currentUsage < 3) {
        // Increment usage
        if (existingRecord.length > 0) {
          await db
            .update(UserUsageTable)
            .set({ usageCount: currentUsage + 1 })
            .where(
              and(
                eq(UserUsageTable.userEmail, userEmail),
                eq(UserUsageTable.AgentType, agentType)
              )
            )
        }
        return true // canUse = true
      } else {
        // Don't increment, return false
        return false // canUse = false
      }
    }
  } catch (error) {
    console.error('Error checking usage:', error)
    return false // canUse = false
  }
} 