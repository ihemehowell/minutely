import { Mail, Clock3, User, MessageCircle } from "lucide-react"
import type { FollowUp } from "@/types/analysis"

interface Props {
  followUps: FollowUp[]
}

export default function FollowUpsPanel({ followUps }: Props) {
  return (
    <div className="rounded-3xl border bg-card/70 p-7 backdrop-blur">
      <div className="mb-6 flex items-center gap-2">
        <Mail className="h-5 w-5 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Follow-up Drafts</h2>
          <p className="text-sm text-muted-foreground">Messages your team can send after the meeting.</p>
        </div>
      </div>

      <div className="space-y-4">
        {followUps.map((message) => (
          <div key={message.id} className="rounded-3xl border bg-background/80 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {message.channel}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5" />
                    {message.urgency}
                  </span>
                </div>
                <h3 className="text-base font-semibold">{message.subject}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{message.body}</p>
              </div>
              <div className="text-sm text-right text-muted-foreground">
                <div className="mb-2">Recipient: {message.recipient}</div>
                <div>Tasks: {message.tasks.length ? message.tasks.join(", ") : "None"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
