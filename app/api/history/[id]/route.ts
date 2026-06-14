import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { deleteAnalysis } from "@/lib/storage"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    await deleteAnalysis(id, userId)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("[DELETE /api/history/:id]", err)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}