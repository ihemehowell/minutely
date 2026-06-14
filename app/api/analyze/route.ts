/**
 * POST /api/analyze
 *
 * Agentic route — runs 6 agents via orchestrator, saves to Supabase.
 * The old /api/analysis route is untouched as a fallback.
 */

import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { orchestrate } from "@/lib/agents/orchestrator"
import { saveAnalysis } from "@/lib/storage"

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const requestStart = Date.now()

  // Auth — anonymous users still get results, just no persistence
  let userId: string | null = null
  try {
    const session = await auth()
    userId = session.userId ?? null
  } catch {
    // Clerk not configured or token expired — continue anonymously
  }

  // Validate input
  let transcript: string
  try {
    const body = await req.json()
    transcript = (body?.transcript ?? "").trim()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!transcript) {
    return NextResponse.json({ error: "transcript is required" }, { status: 400 })
  }

  if (transcript.length > 100_000) {
    return NextResponse.json(
      { error: "Transcript exceeds 100k character limit" },
      { status: 413 }
    )
  }

  // Run orchestrator
  let intelligence
  try {
    intelligence = await orchestrate(transcript)
  } catch (err) {
    console.error("[/api/analyze] orchestrator error:", err)
    return NextResponse.json(
      {
        error: "Analysis failed",
        detail: err instanceof Error ? err.message : "Unknown error",
        requestDurationMs: Date.now() - requestStart,
      },
      { status: 500 }
    )
  }

  // Persist to Supabase non-blocking — don't fail the response on DB error
  let savedId: string | null = null
  if (userId) {
    try {
      savedId = await saveAnalysis(intelligence, userId)
    } catch (err) {
      console.error("[/api/analyze] supabase save failed:", err)
    }
  }

  console.log(
    `[/api/analyze] complete — mode:${intelligence.analysisMode} items:${intelligence.actionItems.length} blockers:${intelligence.blockers.length} sprints:${intelligence.sprintPlan.length} savedId:${savedId}`
  )

  return NextResponse.json(
    { ...intelligence, savedId: savedId ?? null },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "X-Agent-Version": intelligence.agentVersion,
        "X-Analysis-Mode": intelligence.analysisMode,
        "X-Processing-Ms": String(intelligence.processingTime * 1000),
      },
    }
  )
}