export const STAGES = [
  "researching",
  "found_advisor",
  "drafting_outreach",
  "emailed",
  "replied",
  "in_discussion",
  "preparing_application",
  "submitted",
  "interview",
  "decision",
] as const;

export type Stage = (typeof STAGES)[number];

export const STAGE_LABELS: Record<Stage, string> = {
  researching: "Researching",
  found_advisor: "Found Advisor",
  drafting_outreach: "Drafting Outreach",
  emailed: "Emailed",
  replied: "Replied",
  in_discussion: "In Discussion",
  preparing_application: "Preparing Application",
  submitted: "Submitted",
  interview: "Interview",
  decision: "Decision",
};

export const OUTCOMES = ["accepted", "rejected", "waitlisted", "withdrawn"] as const;
export type Outcome = (typeof OUTCOMES)[number];

export const PRIORITIES = ["low", "medium", "high"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CONTACT_ROLES = ["advisor", "pi", "coordinator", "other"] as const;
export type ContactRole = (typeof CONTACT_ROLES)[number];

export const INTERACTION_TYPES = [
  "research",
  "email_sent",
  "email_reply",
  "call",
  "meeting",
  "other",
] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

export const INTERACTION_LABELS: Record<InteractionType, string> = {
  research: "Research note",
  email_sent: "Email sent",
  email_reply: "Email reply received",
  call: "Call",
  meeting: "Meeting",
  other: "Other",
};

export const DOCUMENT_TYPES = [
  "sop",
  "research_proposal",
  "cv",
  "writing_sample",
  "recommendation",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  sop: "Statement of Purpose",
  research_proposal: "Research Proposal",
  cv: "CV / Resume",
  writing_sample: "Writing Sample",
  recommendation: "Recommendation Letter",
};

export const DOCUMENT_STATUSES = ["not_started", "drafting", "review", "final"] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  not_started: "Not started",
  drafting: "Drafting",
  review: "In review",
  final: "Final",
};

export interface Programme {
  id: string;
  university: string;
  programme: string;
  degree_type: string | null;
  country: string | null;
  deadline: string | null;
  website: string | null;
  priority: Priority;
  stage: Stage;
  outcome: Outcome | null;
  notes: string | null;
  created_at: string;
}

export interface Contact {
  id: string;
  programme_id: string;
  name: string;
  role: ContactRole;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export interface Interaction {
  id: string;
  programme_id: string;
  contact_id: string | null;
  type: InteractionType;
  note: string | null;
  occurred_at: string;
}

export interface Document {
  id: string;
  programme_id: string;
  type: DocumentType;
  status: DocumentStatus;
  notes: string | null;
  file_path: string | null;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  notes: string | null;
  created_at: string;
}

export interface ProgrammeWithRelations extends Programme {
  contacts: Contact[];
  interactions: Interaction[];
  documents: Document[];
}
