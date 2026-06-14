"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import UploadZone from "@/components/upload/upload-zone"
import ProcessingScreen from "@/components/upload/processing-screen"
import ResultsDashboard from "@/components/results/results-dashboard"
import Navbar from "@/components/layout/Navbar"
import type { MeetingIntelligence } from "@/types/analysis"

// The /api/analyze route injects savedId into the JSON response.
// It is NOT part of the domain type — we strip it before storing state.
type AnalyzeResponse = MeetingIntelligence & { savedId?: string | null }

type Step = "upload" | "processing" | "results"

export default function UploadPage() {
  const { user } = useUser()
  const router = useRouter()
  const [step, setStep] = useState<Step>("upload")
  const [transcript, setTranscript] = useState("")
  const [analysis, setAnalysis] = useState<MeetingIntelligence | null>(null)

  const handleAnalyze = (text: string) => {
    setTranscript(text)
    setStep("processing")
  }

  const handleProcessingComplete = (raw: AnalyzeResponse) => {
    const { savedId, ...intelligence } = raw

    // If the route already persisted and returned an id, navigate directly
    if (savedId) {
      router.push(`/results/${savedId}`)
      return
    }

    // Anonymous or save failed — show results in-session
    setAnalysis(intelligence)
    setStep("results")
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <Navbar />

      <div className="container relative pt-32 pb-20">
        {step === "upload" && (
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">
                Analyze a meeting
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Drop a transcript file or paste the text below
              </p>
            </div>
            <UploadZone onAnalyze={handleAnalyze} />
          </div>
        )}

        {step === "processing" && (
          <div className="mx-auto max-w-lg">
            <ProcessingScreen
              transcript={transcript}
              onComplete={handleProcessingComplete}
            />
          </div>
        )}

        {step === "results" && analysis && (
          <ResultsDashboard analysis={analysis} />
        )}
      </div>
    </main>
  )
}