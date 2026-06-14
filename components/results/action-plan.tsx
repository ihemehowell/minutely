import { ClipboardList, CalendarDays } from "lucide-react"
import type { ActionPlanItem } from "@/types/analysis"

interface Props {
  actionPlan: ActionPlanItem[]
}

export default function ActionPlanPanel({ actionPlan }: Props) {
  return (
    <div className="rounded-3xl border bg-card/70 p-7 backdrop-blur">
      <div className="mb-6 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Action Plan</h2>
          <p className="text-sm text-muted-foreground">Concrete next steps for follow-through.</p>
        </div>
      </div>

      <div className="space-y-4">
        {actionPlan.map((item) => (
          <div key={item.id} className="rounded-2xl border bg-background/80 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {item.status}
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    {item.priority}
                  </span>
                </div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
              <div className="flex flex-col gap-2 sm:items-end">
                <div className="flex items-center gap-2 rounded-2xl bg-primary/5 px-3 py-2 text-sm text-primary">
                  <CalendarDays className="h-4 w-4" />
                  <span>{item.due}</span>
                </div>
                <div className="rounded-2xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Owner: {item.owner}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
