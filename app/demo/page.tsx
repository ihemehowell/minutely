"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ProcessingScreen from "@/components/upload/processing-screen"
import ResultsDashboard from "@/components/results/results-dashboard"
import Navbar from "@/components/layout/Navbar"
import type { MeetingIntelligence } from "@/types/analysis"

type AnalyzeResponse = MeetingIntelligence & { savedId?: string | null }

type Step = "processing" | "results" | "error"

const DEMO_TRANSCRIPT = `
[09:02] Sarah (PM): Alright, let's get started. We've got a lot to cover before the sprint ends Friday.

[09:03] Marcus (Engineering): Before we dive in, the auth token refresh bug from last sprint is still open. Users are getting logged out every 4 hours. I need design to sign off on the session extension modal before I can ship the fix.

[09:04] Priya (Design): I can have the modal spec ready by EOD tomorrow. It's pretty straightforward — extend session or sign out.

[09:05] Sarah: Great. Marcus, once you have the spec can you ship the fix by Thursday?

[09:06] Marcus: Yes, that's doable.

[09:07] Sarah: Moving on — the Notion integration. Where are we?

[09:08] Leo (Engineering): The API connection is working but we discovered Notion rate-limits at 3 requests per second. Our current implementation doesn't handle that. I need to add a queue and retry logic. Estimate is 2 days.

[09:09] Sarah: So that pushes the Notion integration past this sprint. Let's target next Wednesday for a soft launch. Leo, own that.

[09:10] Leo: Confirmed.

[09:11] Sarah: Dashboard performance — Aisha, you were looking into the slow load times?

[09:12] Aisha (Engineering): Yes. The main issue is we're fetching all action items on mount even if the user doesn't scroll to that tab. Lazy loading would fix it. I can have a PR up by Friday.

[09:13] Sarah: Perfect. That's high priority — we have a demo with the pilot customers next Monday.

[09:14] Marcus: Speaking of the demo — do we have sample data ready? Last time we used real meeting transcripts and it was awkward.

[09:15] Sarah: Good point. I'll create a set of anonymized sample transcripts by Thursday. That's on me.

[09:16] Priya: I also want to flag — the mobile layout on the results dashboard breaks below 375px. I can patch it today.

[09:17] Sarah: Do it. Let's make sure the demo environment is solid.

[09:18] Sarah: Last thing — Q3 planning. Everyone needs to submit their team's capacity and priorities to me by next Monday EOD for the roadmap meeting Tuesday.

[09:20] Sarah: Okay, let's wrap. Summary: Priya — session modal spec tomorrow, mobile fix today. Marcus — auth fix Thursday pending spec. Leo — Notion queue by next Wednesday. Aisha — lazy loading PR Friday. Sarah — sample transcripts Thursday, collect Q3 inputs by Monday. Talk Thursday.
`.trim()

export default function DemoPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("processing")
  const [analysis, setAnalysis] = useState<MeetingIntelligence | null>(null)

  const handleComplete = (raw: AnalyzeResponse) => {
    const { savedId, ...intelligence } = raw

    // If saved (signed-in user), navigate to the persisted result
    if (savedId) {
      router.push(`/results/${savedId}`)
      return
    }

    // Anonymous — show in-session results
    setAnalysis(intelligence)
    setStep("results")
  }

  const handleRetry = () => {
    setStep("processing")
    setAnalysis(null)
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      {/* Hide navbar during processing — no top padding needed */}
      {step !== "processing" && <Navbar />}

      <div className={`container relative pb-20 ${step === "processing" ? "pt-10" : "pt-32"}`}>
        {step === "processing" && (
          <ProcessingScreen
            transcript={DEMO_TRANSCRIPT}
            onComplete={handleComplete}
            onRetry={handleRetry}
          />
        )}

        {step === "results" && analysis && (
          <ResultsDashboard analysis={analysis} />
        )}
      </div>
    </main>
  )
}