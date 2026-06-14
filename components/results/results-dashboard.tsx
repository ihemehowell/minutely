"use client"

import { useState } from "react"
import { Sparkles, RotateCcw, AlertTriangle } from "lucide-react"
import type { MeetingAnalysis, MeetingIntelligence } from "@/types/analysis"
import ActionItems from "@/components/results/action-items"
import WorkflowPanel from "./workflow-panel"
import FollowUpsPanel from "./follow-ups"
import AnalysisChat from "@/components/chat/analysis-chat"
import ExportButton from "@/components/results/export-button"
import BlockerPanel from "@/components/results/blocker-panel"
import SprintBoard from "./sprint-board"
import ActionPlanPanel from "./action-plan"
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
  | "Decisions"
  | "Transcript"

export default function ResultsDashboard({ analysis: initial, meetingId }: Props) {
  const [analysis, setAnalysis] = useState<MeetingAnalysis | MeetingIntelligence>(initial)
  const [activeTab, setActiveTab] = useState<TabKey>("Summary")


  if (!analysis) return null

  const { title, summary, processingTime, decisions, participants, transcript } = analysis
  const intel = isIntelligence(analysis) ? analysis : null

  const isFullMode = intel?.analysisMode === "full"

  const hasActionPlan = Array.isArray(intel?.actionPlan)  && (isFullMode || (intel!.actionPlan.length  > 0))
  const hasSprintPlan = Array.isArray(intel?.sprintPlan)  && (isFullMode || (intel!.sprintPlan.length  > 0))
  const hasBlockers   = Array.isArray(intel?.blockers)    && (isFullMode || (intel!.blockers.length    > 0))
  const hasWorkflow   = Array.isArray(intel?.workflow)    && (isFullMode || (intel!.workflow.length    > 0))
  const hasFollowUps  = Array.isArray(intel?.followUps)   && (isFullMode || (intel!.followUps.length   > 0))

  const tabs: Array<{ key: TabKey; label: string; visible: boolean; count?: number }> = [
    { key: "Summary",      label: "Summary",     visible: true },
    { key: "Action Items", label: "Action Items", visible: true,          count: analysis.actionItems.length },
    { key: "Action Plan",  label: "Action Plan",  visible: hasActionPlan, count: intel?.actionPlan?.length },
    { key: "Sprint Plan",  label: "Sprint Plan",  visible: hasSprintPlan, count: intel?.sprintPlan?.length },
    { key: "Blockers",     label: "Blockers",     visible: hasBlockers,   count: intel?.blockers?.length },
    { key: "Workflow",     label: "Workflow",     visible: hasWorkflow,   count: intel?.workflow?.length },
    { key: "Follow-ups",   label: "Follow-ups",   visible: hasFollowUps,  count: intel?.followUps?.length },
    { key: "Decisions",    label: "Decisions",    visible: decisions.length > 0, count: decisions.length },
    { key: "Transcript",   label: "Transcript",   visible: true },
  ]

  const visibleTabs = tabs.filter((t) => t.visible)

  const currentTab = visibleTabs.some((t) => t.key === activeTab)
    ? activeTab
    : (visibleTabs[0]?.key ?? "Summary")

  const renderTabContent = () => {
    switch (currentTab) {
      case "Summary":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard label="Action Items" value={analysis.actionItems.length} />
              <StatCard label="Decisions" value={decisions.length} />
              <StatCard label="Participants" value={participants.length} />
            </div>
            {intel && (
              <div className="grid gap-4 sm:grid-cols-3">
                <StatCard label="Sprints"     value={intel.sprintPlan?.length ?? 0} accent />
                <StatCard label="Blockers"    value={intel.blockers?.length ?? 0}   accent danger={!!intel.blockers?.length} />
                <StatCard label="Follow-ups"  value={intel.followUps?.length ?? 0}  accent />
              </div>
            )}
            <div className="rounded-3xl border border-white/10 bg-card/80 p-6 text-sm leading-7 text-muted-foreground">
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
          ? <FollowUpsPanel followUps={intel.followUps} />
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
          <div className="max-h-[56vh] overflow-y-auto rounded-3xl border border-white/10 bg-background/70 p-5 text-sm leading-7 text-muted-foreground whitespace-pre-wrap">
            {transcript}
          </div>
        )

      default:
        return null
    }
  }

  const blockerCount = intel?.blockers?.length ?? 0

  return (
    <div className="container relative pb-32 pt-8">

      {/* Header */}
      <div className="mb-14">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm backdrop-blur">
          <Sparkles className="h-4 w-4 text-primary" />
          {intel?.analysisMode === "full"
            ? "Full agent analysis complete"
            : intel?.analysisMode === "partial"
            ? "Partial analysis — some agents failed"
            : "Analysis complete"}
        </div>

        <h1 className="mt-6 max-w-4xl text-2xl font-bold tracking-tight md:text-4xl leading-[1.1]">
          {title}
        </h1>

        <p className="mt-6 max-w-3xl text-md leading-8 text-muted-foreground font-semibold">
          {summary}
        </p>

        <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Pill label="Time"   value={`${processingTime}s`} />
            <Pill label="Tasks"  value={String(analysis.actionItems.length)} />
            <Pill label="People" value={String(participants.length)} />
            {blockerCount > 0 && (
              <div className="rounded-full border border-orange-500/20 bg-orange-500/5 px-4 py-2 text-sm backdrop-blur">
                <span className="text-orange-400 font-medium">
                  {blockerCount} {blockerCount === 1 ? "blocker" : "blockers"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">

            <ExportButton analysis={analysis} />
            <Link
              href="/upload"
              className="flex items-center gap-2 rounded-2xl border bg-card/50 px-5 py-2.5 text-sm backdrop-blur transition-all hover:bg-card"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Analysis
            </Link>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-8 xl:grid-cols-[1fr_380px]">

        {/* Left — tab workspace */}
        <div className="space-y-10">
          <div className="flex flex-col gap-6">
            <div className="flex gap-2 items-center justify-start w-full">
              <p className="text-xl uppercase tracking-[0.3em] text-primary">Workspace</p>
              <h2 className="text-xl uppercase font-semibold tracking-tight">Choose a view</h2>
            </div>

            <nav
              className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-muted/30 p-1.5 backdrop-blur-xl"
              role="tablist"
            >
              {visibleTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  role="tab"
                  aria-selected={currentTab === tab.key}
                  className={`relative rounded-xl px-4 py-2 text-xs font-medium transition-all ${
                    currentTab === tab.key
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                      currentTab === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-card/70 p-6 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            {renderTabContent()}
          </section>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">

          {/* Participants */}
          <div className="rounded-3xl border bg-card/70 p-6 backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold">Participants</h2>
            <div className="space-y-4">
              {participants.length === 0 ? (
                <p className="text-sm text-muted-foreground">No participants detected.</p>
              ) : (
                participants.map((p) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.role}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Inline AI chat */}
          <AnalysisChat
            analysis={analysis}
            onPatch={(patch) => setAnalysis((a) => ({ ...a, ...patch }))}
            meetingId={meetingId}
          />

          {/* Partial analysis warning */}
          {intel?.analysisMode === "partial" && (
            <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 px-4 py-3">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400">Partial analysis</p>
              </div>
              <p className="text-xs text-muted-foreground">
                One or more agents timed out or returned no data. Some tabs may be empty.
              </p>
            </div>
          )}

          {/* Agent outputs debug card */}
          {intel && (
            <div className="rounded-2xl border bg-card/50 px-4 py-3 text-xs text-muted-foreground space-y-1">
              <p className="font-medium text-foreground mb-2">Agent outputs</p>
              <AgentStat label="Action items"    count={intel.actionItems.length} />
              <AgentStat label="Blockers"        count={intel.blockers?.length ?? 0} />
              <AgentStat label="Sprints"         count={intel.sprintPlan?.length ?? 0} />
              <AgentStat label="Workflow nodes"  count={intel.workflow?.length ?? 0} />
              <AgentStat label="Action plan"     count={intel.actionPlan?.length ?? 0} />
              <AgentStat label="Follow-ups"      count={intel.followUps?.length ?? 0} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({ label, value, accent = false, danger = false }: {
  label: string; value: number; accent?: boolean; danger?: boolean
}) {
  return (
    <div className={`rounded-3xl border p-5 text-sm ${
      danger  ? "border-orange-500/20 bg-orange-500/5" :
      accent  ? "border-primary/10 bg-primary/5" :
                "border-white/10 bg-background/70"
    }`}>
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
      <p className={`mt-3 text-3xl font-semibold ${danger ? "text-orange-400" : "text-muted-foreground"}`}>
        {value}
      </p>
    </div>
  )
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-full border bg-card/50 px-4 py-2 text-sm backdrop-blur">
      <span className="text-muted-foreground">{label}: </span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function AgentStat({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className={count > 0 ? "text-primary font-medium" : ""}>{count}</span>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground py-4">{message}</p>
}