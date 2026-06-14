// ─── Primitives ───────────────────────────────────────────────────────────────

export type Priority = "High" | "Medium" | "Low"

export type BlockerSeverity = "Critical" | "High" | "Medium"

export type WorkflowStatus = "blocked" | "ready" | "in-progress" | "done"

// ─── Existing core types (unchanged — backward compat) ────────────────────────

export interface ActionItem {
  id: string
  task: string
  assignee: string
  due: string
  priority: Priority
  // Extended fields — optional so all existing components still compile
  sprintId?: string        // links to SprintItem.id
  storyPoints?: number     // Fibonacci: 1 | 2 | 3 | 5 | 8
  status?: WorkflowStatus
  dependencies?: string[]  // ActionItem ids this is blocked by
}

export interface Participant {
  name: string
  role: string
}

export interface MeetingAnalysis {
  title: string
  summary: string
  processingTime: number   // seconds
  actionItems: ActionItem[]
  decisions: string[]
  participants: Participant[]
  transcript: string
}

// ─── Agentic output types ─────────────────────────────────────────────────────

/** A risk or blocker surfaced by the Blocker Detection agent */
export interface Blocker {
  id: string                    // "bl-1", "bl-2", …
  description: string
  severity: BlockerSeverity
  affectedTasks: string[]       // ActionItem ids this blocker impacts
  owner: string                 // person responsible for resolution
  suggestedResolution: string   // AI-generated fix
}

/** A sprint bucket with capacity and assigned tasks */
export interface SprintItem {
  id: string              // "sprint-1", "sprint-2", …
  name: string            // "Sprint 1 — Auth & Notifications"
  startDate: string       // relative or ISO, e.g. "Week 1" or "2025-06-16"
  endDate: string
  capacity: number        // total story points budgeted
  tasks: string[]         // ActionItem ids assigned here
  goals: string[]         // 1–3 sprint goals inferred from tasks
}

/** A node in the autonomous workflow DAG */
export interface WorkflowNode {
  id: string              // "wf-1", "wf-2", …
  title: string
  assignee: string
  dependsOn: string[]     // WorkflowNode ids that must complete first
  estimatedDays: number
  status: WorkflowStatus
  actionItemId?: string   // back-reference to ActionItem if applicable
}

export interface ActionPlanItem {
  id: string
  title: string
  description: string
  owner: string
  due: string
  priority: Priority
  status: "Immediate" | "Short-term" | "Follow-up"
}

/** A ready-to-send follow-up draft per participant */
export interface FollowUp {
  id: string
  recipient: string
  channel: "email" | "slack" | "whatsapp"
  subject: string
  body: string            // full draft, ready to send
  tasks: string[]         // ActionItem ids referenced
  urgency: Priority
}

// ─── Full intelligence result ─────────────────────────────────────────────────

/**
 * MeetingIntelligence IS a MeetingAnalysis — every existing component
 * that receives MeetingAnalysis will still work without modification.
 */
export interface MeetingIntelligence extends MeetingAnalysis {
  blockers: Blocker[]
  sprintPlan: SprintItem[]
  workflow: WorkflowNode[]
  followUps: FollowUp[]
  actionPlan: ActionPlanItem[]
  agentVersion: string            // "1.0.0" — for future migrations
  analysisMode: "full" | "partial" | "legacy"
}

// ─── Per-agent I/O contracts ──────────────────────────────────────────────────

export interface AgentResult<T> {
  agent: string
  success: boolean
  data: T | null
  error?: string
  durationMs: number
}

export interface AnalysisAgentOutput {
  title: string
  summary: string
  actionItems: ActionItem[]
  decisions: string[]
  participants: Participant[]
}

export interface BlockerAgentOutput {
  blockers: Blocker[]
}

export interface SprintAgentOutput {
  sprintPlan: SprintItem[]
}

export interface WorkflowAgentOutput {
  workflow: WorkflowNode[]
}

export interface ActionPlanAgentOutput {
  actionPlan: ActionPlanItem[]
}

export interface FollowUpAgentOutput {
  followUps: FollowUp[]
}