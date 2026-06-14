"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { BrainCircuit, CheckCircle2, Clock3, GitBranch, Network, Sparkles, Users, Zap } from "lucide-react"
import type { MeetingIntelligence } from "@/types/analysis"

const steps = [
  {
    icon: BrainCircuit,
    title: "Reading transcript",
    description: "Understanding context and structure",
  },
  {
    icon: Users,
    title: "Identifying speakers & tasks",
    description: "Mapping participants, roles, and commitments",
  },
  {
    icon: Zap,
    title: "Detecting blockers",
    description: "Surfacing risks and dependencies",
  },
  {
    icon: GitBranch,
    title: "Planning sprints",
    description: "Scheduling tasks by priority and capacity",
  },
  {
    icon: Network,
    title: "Building workflow",
    description: "Generating execution DAG",
  },
  {
    icon: Clock3,
    title: "Drafting follow-ups",
    description: "Preparing per-person action messages",
  },
]

interface Props {
  transcript: string
  onComplete: (data: MeetingIntelligence) => void
}

export default function ProcessingScreen({ transcript, onComplete }: Props) {
  const hasFired = useRef(false)
  const [activeStep, setActiveStep] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  // Tick elapsed time
  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  // Advance steps visually every ~1.8s to match ~5 agent calls
  useEffect(() => {
    if (activeStep >= steps.length - 1) return
    const t = setTimeout(() => setActiveStep((s) => s + 1), 1800)
    return () => clearTimeout(t)
  }, [activeStep])

  // Fire API once
  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

    const start = Date.now()

    async function analyze() {
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript }),
        })

       if (!res.ok) {
  let detail = null

  try {
    detail = await res.json()
  } catch {
    detail = await res.text().catch(() => null)
  }

  console.error("API route failed:", detail)

  throw new Error(
    detail?.error ||
    detail?.details ||
    "Analysis failed"
  )
}

        const data: MeetingIntelligence = await res.json()
        onComplete(data)
      } catch (err) {
        console.error("Processing error:", err)
        onComplete(getFallback(transcript, Date.now() - start))
      }
    }

    analyze()
  }, [transcript, onComplete])

  return (
    <div className="mx-auto max-w-lg">

      {/* Header */}
      <div className="mb-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border bg-card/80 shadow-lg backdrop-blur">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Running 5 agents</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Analysis · Blockers · Sprints · Workflow · Follow-ups
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isDone = index < activeStep
          const isActive = index === activeStep
          const isPending = index > activeStep

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isPending ? 0.4 : 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-500 ${
                isActive
                  ? "border-primary/30 bg-primary/5"
                  : isDone
                  ? "bg-card/40"
                  : "bg-card/20"
              }`}
            >
              {/* Icon */}
              <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-500 ${
                isDone ? "bg-primary/15" : isActive ? "bg-primary/10" : "bg-muted/50"
              }`}>
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </motion.div>
                ) : (
                  <step.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                )}
                {isActive && (
                  <span className="absolute inset-0 animate-ping rounded-xl bg-primary/20" />
                )}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isPending ? "text-muted-foreground" : "text-foreground"}`}>
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.description}</p>
              </div>

              {/* State */}
              <div className="shrink-0">
                {isDone && <span className="text-xs text-primary">Done</span>}
                {isActive && (
                  <div className="flex gap-0.5">
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:0.15s]" />
                    <span className="h-1 w-1 animate-bounce rounded-full bg-primary [animation-delay:0.3s]" />
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between text-xs text-muted-foreground">
        <span>Powered by Qwen</span>
        <span className="tabular-nums">{elapsed}s elapsed</span>
      </div>
    </div>
  )
}

function getFallback(transcript: string, elapsed: number): MeetingIntelligence {
  return {
    title: "Meeting Analysis",
    summary: "Could not reach the AI service. Check your GROQ_API_KEY or network connection.",
    processingTime: parseFloat((elapsed / 1000).toFixed(1)),
    actionItems: [],
    decisions: [],
    participants: [],
    transcript,
    blockers: [],
    sprintPlan: [],
    workflow: [],
    actionPlan: [],
    followUps: [],
    agentVersion: "1.0.0",
    analysisMode: "legacy",
  }
}