import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getHistory } from "@/lib/storage"

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const entries = await getHistory(userId)
    return NextResponse.json({ entries })
  } catch (err) {
    console.error("[GET /api/history]", err)
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 })
  }
}