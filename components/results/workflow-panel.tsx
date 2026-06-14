import { Layers, Clock3, User, ArrowRight } from "lucide-react"
import type { WorkflowNode } from "@/types/analysis"

interface Props {
  workflow: WorkflowNode[]
}

const statusConfig: Record<WorkflowNode["status"], { label: string; className: string }> = {
  blocked: { label: "Blocked", className: "bg-red-500/10 text-red-500" },
  ready: { label: "Ready", className: "bg-emerald-500/10 text-emerald-500" },
  "in-progress": { label: "In progress", className: "bg-blue-500/10 text-blue-500" },
  done: { label: "Done", className: "bg-slate-500/10 text-slate-500" },
}

export default function WorkflowPanel({ workflow }: Props) {
  return (
    <div className="rounded-3xl border bg-card/70 p-7 backdrop-blur">
      <div className="mb-6 flex items-center gap-2">
        <Layers className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Workflow</h2>
          <p className="text-sm text-muted-foreground">Execution nodes and dependencies inferred from the meeting.</p>
        </div>
      </div>

      <div className="space-y-4">
        {workflow.map((node) => {
          const status = statusConfig[node.status]
          return (
            <div key={node.id} className="rounded-3xl border bg-background/80 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
                      <ArrowRight className="h-3.5 w-3.5" />
                      {status.label}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                      <Clock3 className="h-3.5 w-3.5" />
                      {node.estimatedDays}d
                    </span>
                  </div>
                  <h3 className="text-base font-semibold">{node.title}</h3>
                  <p className="text-sm text-muted-foreground">Assigned to {node.assignee}</p>
                </div>
                <div className="flex flex-col gap-2 text-right text-sm text-muted-foreground">
                  <div>Action item: {node.actionItemId ?? "N/A"}</div>
                  <div>Depends on: {node.dependsOn.length ? node.dependsOn.join(", ") : "None"}</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
