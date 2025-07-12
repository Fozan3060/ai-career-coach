import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/db/drizzle'
import { HistoryTable } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST (req: any) {
  const { content, recordId, aiAgentType } = await req.json()
  const user = await currentUser()
  try {
    const result = await db.insert(HistoryTable).values({
      recordId: recordId,
      content: content,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      aiAgentType: aiAgentType
    })

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(e)
  }
}

export async function PUT (req: any) {
  const { content, recordId } = await req.json()
  console.log('in update message ', content)
  try {
    const result = await db
      .update(HistoryTable)
      .set({
        content: content
      })
      .where(eq(HistoryTable.recordId, recordId))

    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json(e)
  }
}

export async function GET (req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const recordId = searchParams.get('recordId')
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress
  try {
    if (recordId) {
      const result = await db
        .select()
        .from(HistoryTable)
        .where(eq(HistoryTable.recordId, recordId))
      return NextResponse.json(result[0] || {})
    } else {
      if (email) {
        const result = await db
          .select()
          .from(HistoryTable)
          .where(
            eq(HistoryTable.userEmail, user.primaryEmailAddress.emailAddress)
          )
        return NextResponse.json(result || {})
      }
    }
    return NextResponse.json({})
  } catch (e) {
    return NextResponse.json({ error: e })
  }
}
