"use client"

import { useMemo, useState } from "react"
import {
  Sparkles,
  RotateCcw,
  Activity,
  ArrowRight,
} from "lucide-react"
import type { MeetingAnalysis, MeetingIntelligence } from "@/types/analysis"
import ActionItems from "@/components/results/action-items"
import WorkflowPanel from "./workflow-panel"
import FollowUpsPanel from "./follow-ups"
import AnalysisChat from "@/components/chat/analysis-chat"
import ExportButton from "@/components/results/export-button"
import BlockerPanel from "@/components/results/blocker-panel"
import SprintBoard from "./sprint-board"
import ActionPlanPanel from "./action-plan"
import RuntimeTab from "./runtimetab"
import Link from "next/link"

interface Props {
  analysis: MeetingAnalysis | MeetingIntelligence
  meetingId?: string | null
}

function isIntelligence(a: MeetingAnalysis | MeetingIntelligence): a is MeetingIntelligence {
  return (
    "blockers" in a &&
    "sprintPlan" in a &&
    "workflow" in a &&
    "followUps" in a &&
    "actionPlan" in a
  )
}

type TabKey =
  | "Summary"
  | "Action Items"
  | "Action Plan"
  | "Sprint Plan"
  | "Blockers"
  | "Workflow"
  | "Follow-ups"
  | "Runtime"
  | "Decisions"
  | "Transcript"

/** Total number of agents RuntimeTab will render — keeps the badge in sync. */
const AGENT_COUNT = 6

export default function ResultsDashboard({ analysis: initial, meetingId }: Props) {
  const [analysis, setAnalysis] = useState<MeetingAnalysis | MeetingIntelligence>(initial)
  const [activeTab, setActiveTab] = useState<TabKey>("Summary")
  const intel = isIntelligence(analysis) ? analysis : null

  const runtimeStats = useMemo(() => {
    if (!intel) return { success: 1, running: 0, failed: 0, partial: 0 }

    const agentResults = [
      "success" as const,
      "success" as const,
      intel.sprintPlan?.length ? "success" : intel.analysisMode === "partial" ? "partial" : "success",
      intel.workflow?.length ? "success" : intel.analysisMode === "partial" ? "partial" : "success",
      intel.actionPlan?.length ? "success" : intel.analysisMode === "partial" ? "partial" : "success",
      intel.followUps?.length ? "success" : intel.analysisMode === "partial" ? "partial" : "success",
    ] as const

    return {
      success: agentResults.filter((s) => s === "success").length,
      running: 0,
      failed: 0,
      partial: agentResults.filter((s) => s === "partial").length,
    }
  }, [intel])

  if (!analysis) return null

  const { title, summary, processingTime, decisions, participants, transcript } = analysis
  const isFullMode = intel?.analysisMode === "full"

  const hasActionPlan = Array.isArray(intel?.actionPlan) && (isFullMode || intel!.actionPlan.length > 0)
  const hasSprintPlan = Array.isArray(intel?.sprintPlan) && (isFullMode || intel!.sprintPlan.length > 0)
  const hasBlockers   = Array.isArray(intel?.blockers)   && (isFullMode || intel!.blockers.length > 0)
  const hasWorkflow   = Array.isArray(intel?.workflow)   && (isFullMode || intel!.workflow.length > 0)
  const hasFollowUps  = Array.isArray(intel?.followUps)  && (isFullMode || intel!.followUps.length > 0)

  /**
   * Runtime stats derived from real intel data — mirrors the logic in RuntimeTab's
   * deriveEvents() so the header bar stays consistent with the tab content.
   */
  // const runtimeStats = useMemo(() => {
  //   if (!intel) return { success: 1, running: 0, failed: 0, partial: 0 }

  //   const agentResults = [
  //     "success" as const,                                                          // analysis agent always succeeds
  //     "success" as const,                                                          // blocker agent always returns something
  //     intel.sprintPlan?.length ? "success" : intel.analysisMode === "partial" ? "partial" : "success",
  //     intel.workflow?.length   ? "success" : intel.analysisMode === "partial" ? "partial" : "success",
  //     intel.actionPlan?.length ? "success" : intel.analysisMode === "partial" ? "partial" : "success",
  //     intel.followUps?.length  ? "success" : intel.analysisMode === "partial" ? "partial" : "success",
  //   ] as const

  //   return {
  //     success: agentResults.filter((s) => s === "success").length,
  //     running: 0,
  //     failed: 0,
  //     partial: agentResults.filter((s) => s === "partial").length,
  //   }
  // }, [intel])

  const tabs: Array<{ key: TabKey; label: string; visible: boolean; count?: number }> = [
    { key: "Summary",      label: "Summary",      visible: true },
    { key: "Action Items", label: "Action Items", visible: true,           count: analysis.actionItems.length },
    { key: "Action Plan",  label: "Action Plan",  visible: hasActionPlan,  count: intel?.actionPlan?.length },
    { key: "Sprint Plan",  label: "Sprint Plan",  visible: hasSprintPlan,  count: intel?.sprintPlan?.length },
    { key: "Blockers",     label: "Blockers",     visible: hasBlockers,    count: intel?.blockers?.length },
    { key: "Workflow",     label: "Workflow",     visible: hasWorkflow,    count: intel?.workflow?.length },
    { key: "Follow-ups",   label: "Follow-ups",   visible: hasFollowUps,   count: intel?.followUps?.length },
    { key: "Runtime",      label: "Runtime",      visible: true,           count: AGENT_COUNT },
    { key: "Decisions",    label: "Decisions",    visible: decisions.length > 0, count: decisions.length },
    { key: "Transcript",   label: "Transcript",   visible: true },
  ]

  const visibleTabs = tabs.filter((t) => t.visible)
  const currentTab = visibleTabs.some((t) => t.key === activeTab)
    ? activeTab
    : (visibleTabs[0]?.key ?? "Summary")

  const blockerCount = intel?.blockers?.length ?? 0

  const renderTabContent = () => {
    switch (currentTab) {
      case "Runtime":
        // RuntimeTab requires MeetingIntelligence; fall back to a message for basic analyses
        return intel
          ? <RuntimeTab analysis={intel} />
          : <EmptyState message="Runtime breakdown is only available for full analyses." />

      case "Summary":
        return (
          <div className="space-y-6">
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
              <StatCard label="Action Items" value={analysis.actionItems.length} />
              <StatCard label="Decisions"    value={decisions.length} />
              <StatCard label="Participants" value={participants.length} />
              <StatCard label="Agents"       value={AGENT_COUNT} accent />
            </div>

            {intel && (
              <div className="grid gap-3 grid-cols-3">
                <StatCard label="Sprints"    value={intel.sprintPlan?.length ?? 0} accent />
                <StatCard label="Blockers"   value={intel.blockers?.length ?? 0}   accent danger={!!intel.blockers?.length} />
                <StatCard label="Follow-ups" value={intel.followUps?.length ?? 0}  accent />
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-primary uppercase leading-tight">
              {title}
            </h1>

            <div className="rounded-2xl border border-white/10 bg-card/80 p-5 text-sm leading-7 text-muted-foreground">
              {summary}
            </div>
          </div>
        )

      case "Action Items":
        return (
          <ActionItems
            initial={analysis.actionItems}
            onChange={(items) => setAnalysis((a) => ({ ...a, actionItems: items }))}
          />
        )

      case "Action Plan":
        return intel
          ? <ActionPlanPanel actionPlan={intel.actionPlan} />
          : <EmptyState message="Action plan not available." />

      case "Sprint Plan":
        return intel
          ? <SprintBoard sprintPlan={intel.sprintPlan} actionItems={analysis.actionItems} />
          : <EmptyState message="Sprint plan not available." />

      case "Blockers":
        return intel
          ? <BlockerPanel blockers={intel.blockers} />
          : <EmptyState message="Blocker detection not available." />

      case "Workflow":
        return intel
          ? <WorkflowPanel workflow={intel.workflow} />
          : <EmptyState message="Workflow not available." />

      case "Follow-ups":
        return intel
          ? <FollowUpsPanel followUps={intel.followUps} meetingTitle={title} />
          : <EmptyState message="Follow-ups not available." />

      case "Decisions":
        return decisions.length === 0
          ? <EmptyState message="No decisions recorded." />
          : (
            <div className="grid gap-3 sm:grid-cols-2">
              {decisions.map((d, i) => (
                <div key={i} className="rounded-2xl bg-primary/5 border border-primary/10 px-4 py-3 text-sm">
                  {d}
                </div>
              ))}
            </div>
          )

      case "Transcript":
        return (
          <div className="max-h-[56vh] overflow-y-auto rounded-2xl border border-white/10 bg-background/70 p-5 text-sm leading-7 text-muted-foreground whitespace-pre-wrap">
            {transcript}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="container relative pb-32 pt-8">
      {/* ── Header ── */}
      <div className="mb-10 space-y-6">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm backdrop-blur">
          <Sparkles className="h-4 w-4 text-primary" />
          {intel?.analysisMode === "full"
            ? "Full autonomous agent analysis complete"
            : intel?.analysisMode === "partial"
            ? "Partial analysis — some agents failed"
            : "Analysis complete"}
        </div>

        {/* Pills + actions row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Pill label="Time"    value={`${processingTime}s`} />
            <Pill label="Tasks"   value={String(analysis.actionItems.length)} />
            <Pill label="People"  value={String(participants.length)} />
            <Pill label="Agents"  value={String(AGENT_COUNT)} />
            {blockerCount > 0 && (
              <div className="rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-2 text-sm">
                <span className="text-orange-400 font-medium">
                  {blockerCount} {blockerCount === 1 ? "blocker" : "blockers"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <ExportButton analysis={analysis} />
            <Link
              href="/integrations"
              className="flex items-center gap-2 rounded-2xl border bg-card/50 px-5 py-2.5 text-sm backdrop-blur transition-all hover:bg-card"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Integrations
            </Link>
            <Link
              href="/upload"
              className="flex items-center gap-2 rounded-2xl border bg-card/50 px-5 py-2.5 text-sm backdrop-blur transition-all hover:bg-card"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Analysis
            </Link>
          </div>
        </div>

        {/* Runtime overview bar */}
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-card/70 px-5 py-4 backdrop-blur max-w-md">
          <div className="flex items-center gap-2 shrink-0">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              Runtime
            </span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="flex flex-wrap gap-3">
            <RuntimeMetric label="Success" value={runtimeStats.success} />
            <RuntimeMetric label="Partial"  value={runtimeStats.partial} />
            <RuntimeMetric label="Failed"  value={runtimeStats.failed} />
          </div>
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="grid gap-8 xl:grid-cols-[1fr_auto] max-w-5xl">
        <div className="space-y-6">
          {/* Tab header */}
          <div className="flex flex-col items-start gap-1">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Workspace</p>
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              choose a view
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>

          {/* Tab nav */}
          <nav
            className="flex gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-muted/30 p-1.5 backdrop-blur-xl scrollbar-none"
            role="tablist"
          >
            {visibleTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                role="tab"
                aria-selected={currentTab === tab.key}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-medium transition-all whitespace-nowrap ${
                  currentTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] tabular-nums ${
                      currentTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Tab content panel */}
          <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-card/70 p-6 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
            {renderTabContent()}
          </section>
        </div>

        {/* Sidebar */}
        <div>
          <AnalysisChat
            analysis={analysis}
            onPatch={(patch) => setAnalysis((a) => ({ ...a, ...patch }))}
            meetingId={meetingId}
          />
        </div>
      </div>
    </div>
  )
}

// ── Inline runtime metric (header bar) ────────────────────────────────────────

function RuntimeMetric({ label, value }: { label: string; value: number }) {
  const accent =
    label === "Failed"  ? "text-red-400" :
    label === "Partial" ? "text-yellow-400" :
                          "text-emerald-400"

  return (
    <div className="flex items-baseline gap-2">
      <span className={`text-lg font-semibold tabular-nums ${accent}`}>{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  accent = false,
  danger = false,
}: {
  label: string
  value: number
  accent?: boolean
  danger?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        danger  ? "border-orange-500/20 bg-orange-500/5" :
        accent  ? "border-primary/10 bg-primary/5" :
                  "border-white/10 bg-background/70"
      }`}
    >
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</p>
      <p className={`mt-2.5 text-3xl font-semibold tabular-nums ${danger ? "text-orange-400" : ""}`}>
        {value}
      </p>
    </div>
  )
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border bg-card/50 px-3.5 py-1.5 text-xs backdrop-blur">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return <p className="py-6 text-sm text-muted-foreground">{message}</p>
}