"use client"

import { useState } from "react"
import { AlertTriangle, ChevronDown, ChevronUp, User, Lightbulb, ShieldAlert } from "lucide-react"
import type { Blocker, BlockerSeverity } from "@/types/analysis"

interface Props {
  blockers: Blocker[]
}

const severityConfig: Record<BlockerSeverity, {
  label: string
  dotClass: string
  badgeClass: string
  borderClass: string
}> = {
  Critical: {
    label: "Critical",
    dotClass: "bg-red-500",
    badgeClass: "bg-red-500/10 text-red-500",
    borderClass: "border-red-500/20",
  },
  High: {
    label: "High",
    dotClass: "bg-orange-500",
    badgeClass: "bg-orange-500/10 text-orange-500",
    borderClass: "border-orange-500/20",
  },
  Medium: {
    label: "Medium",
    dotClass: "bg-yellow-500",
    badgeClass: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    borderClass: "border-yellow-500/20",
  },
}

const SEVERITY_ORDER: BlockerSeverity[] = ["Critical", "High", "Medium"]

export default function BlockerPanel({ blockers }: Props) {
  const [expanded, setExpanded] = useState<string | null>(
    blockers.find((b) => b.severity === "Critical")?.id ??
    blockers[0]?.id ??
    null
  )

  if (!blockers.length) return null

  // Sort: Critical → High → Medium
  const sorted = [...blockers].sort(
    (a, b) =>
      SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
  )

  const counts = SEVERITY_ORDER.reduce<Record<BlockerSeverity, number>>(
    (acc, s) => {
      acc[s] = blockers.filter((b) => b.severity === s).length
      return acc
    },
    { Critical: 0, High: 0, Medium: 0 }
  )

  return (
    <div className="rounded-3xl border bg-card/70 p-7 backdrop-blur">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <h2 className="text-xl font-semibold">Blockers & Risks</h2>
        </div>
        {/* Severity summary pills */}
        <div className="flex items-center gap-2">
          {SEVERITY_ORDER.map((s) =>
            counts[s] > 0 ? (
              <span
                key={s}
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${severityConfig[s].badgeClass}`}
              >
                {counts[s]} {s}
              </span>
            ) : null
          )}
        </div>
      </div>

      {/* Blocker list */}
      <div className="space-y-3">
        {sorted.map((blocker) => {
          const cfg = severityConfig[blocker.severity]
          const isOpen = expanded === blocker.id

          return (
            <div
              key={blocker.id}
              className={`rounded-2xl border bg-background/60 overflow-hidden ${cfg.borderClass}`}
            >
              {/* Row header */}
              <button
                onClick={() => setExpanded(isOpen ? null : blocker.id)}
                className="w-full flex items-start gap-3 px-5 py-4 hover:bg-orange-500/5 transition-colors text-left"
              >
                {/* Severity dot */}
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.dotClass}`} />

                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug">
                    {blocker.description}
                  </p>
                  {!isOpen && (
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      Owner: {blocker.owner}
                    </p>
                  )}
                </div>

                {/* Severity badge + toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${cfg.badgeClass}`}>
                    {cfg.label}
                  </span>
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </button>

              {/* Expanded body */}
              {isOpen && (
                <div className="border-t border-dashed px-5 pb-5 pt-4 space-y-4">

                  {/* Owner */}
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Owner</p>
                      <p className="text-sm">{blocker.owner}</p>
                    </div>
                  </div>

                  {/* Affected tasks */}
                  {blocker.affectedTasks.length > 0 && (
                    <div className="flex items-start gap-2">
                      <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Affected tasks</p>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {blocker.affectedTasks.map((id) => (
                            <span
                              key={id}
                              className="rounded-lg bg-muted px-2 py-0.5 text-xs font-mono"
                            >
                              {id}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Suggested resolution */}
                  <div className="flex items-start gap-2 rounded-xl bg-primary/5 border border-primary/10 px-4 py-3">
                    <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
                    <div>
                      <p className="text-xs font-medium text-primary mb-1">Suggested resolution</p>
                      <p className="text-sm leading-relaxed">{blocker.suggestedResolution}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state — only shown if array was non-empty but got filtered (shouldn't happen, defensive) */}
      {sorted.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No blockers detected.
        </p>
      )}
    </div>
  )
}