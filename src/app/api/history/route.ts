import { NextResponse } from "next/server";
import { currentUser } from '@clerk/nextjs/server';
import { db } from "@/db/drizzle";
import { HistoryTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: any) {
    const { content, recordId } = await req.json();
    const user = await currentUser();
    try {
        const result = await db.insert(HistoryTable).values({
            recordId: recordId,
            content: content,
            userEmail: user?.primaryEmailAddress?.emailAddress
        });

        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json(e);
    }
}

export async function PUT(req: any) {
    const { content, recordId } = await req.json();
    try {
        const result = await db.update(HistoryTable).set({
            content: content,
        }).where(eq(HistoryTable.recordId, recordId))

        return NextResponse.json(result)
    } catch (e) {
        return NextResponse.json(e)
    }
}


