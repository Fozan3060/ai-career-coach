import { eq } from 'drizzle-orm' // ✅ this is required
import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/db/drizzle'
import { usersTable } from '@/db/schema'

export async function POST() {
  const user = await currentUser()

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 })
  }

  try {
    const email = user.primaryEmailAddress?.emailAddress || ''
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email)) 

    if (existing.length === 0) {
      await db.insert(usersTable).values({
        name: user.fullName || 'Anonymous',
        email
      })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
