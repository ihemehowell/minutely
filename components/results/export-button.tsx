"use client"

import { useState } from "react"
import {
  Download, Copy, Check, ChevronDown, FileText,
  TableProperties, ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MeetingAnalysis, MeetingIntelligence } from "@/types/analysis"
import {
  downloadMarkdown, downloadPDF, downloadSprintCSV, downloadBlockersJSON,
  toMarkdown, copyToClipboard, toNotionClipboard,
} from "@/lib/export"

interface Props {
  analysis: MeetingAnalysis
}

function isIntelligence(a: MeetingAnalysis): a is MeetingIntelligence {
  return "blockers" in a
}

type CopiedKey = "markdown" | "notion"

export default function ExportButton({ analysis }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<CopiedKey | null>(null)

  const intel = isIntelligence(analysis) ? analysis : null
  const hasSprintPlan = !!intel?.sprintPlan?.length
  const hasBlockers = !!intel?.blockers?.length

  const handleCopy = async (type: CopiedKey) => {
    const text = type === "notion" ? toNotionClipboard(analysis) : toMarkdown(analysis)
    await copyToClipboard(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="rounded-2xl gap-2"
        onClick={() => setOpen((v) => !v)}
      >
        <Download className="h-4 w-4" />
        Export
        <ChevronDown className="h-3 w-3" />
      </Button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-20 w-56 rounded-2xl border bg-card/95 p-2 shadow-xl backdrop-blur">

            {/* Section: Downloads */}
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Download</p>

            <button
              onClick={() => { downloadPDF(analysis); setOpen(false) }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
            >
              <FileText className="h-4 w-4 text-primary" />
              Full report PDF
            </button>

            <button
              onClick={() => { downloadMarkdown(analysis); setOpen(false) }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
            >
              <Download className="h-4 w-4 text-primary" />
              Markdown (.md)
            </button>

            {hasSprintPlan && (
              <button
                onClick={() => { downloadSprintCSV(analysis); setOpen(false) }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
              >
                <TableProperties className="h-4 w-4 text-primary" />
                Sprint plan CSV
              </button>
            )}

            {hasBlockers && (
              <button
                onClick={() => { downloadBlockersJSON(analysis); setOpen(false) }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
              >
                <ShieldAlert className="h-4 w-4 text-orange-500" />
                Blockers JSON
              </button>
            )}

            {/* Divider */}
            <div className="my-1.5 border-t" />

            {/* Section: Copy */}
            <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground">Copy to clipboard</p>

            <button
              onClick={() => handleCopy("markdown")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
            >
              {copied === "markdown"
                ? <Check className="h-4 w-4 text-green-500" />
                : <Copy className="h-4 w-4 text-primary" />}
              Copy as Markdown
            </button>

            <button
              onClick={() => handleCopy("notion")}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-primary/10 transition-colors"
            >
              {copied === "notion"
                ? <Check className="h-4 w-4 text-green-500" />
                : <Copy className="h-4 w-4 text-primary" />}
              Copy for Notion
            </button>
          </div>
        </>
      )}
    </div>
  )
}