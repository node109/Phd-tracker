"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type {
  ContactRole,
  DocumentStatus,
  DocumentType,
  InteractionType,
  Outcome,
  Priority,
  Stage,
} from "@/lib/types";

function str(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string" || value.trim() === "") return null;
  return value.trim();
}

export async function createProgramme(formData: FormData) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("programmes")
    .insert({
      university: str(formData, "university"),
      programme: str(formData, "programme"),
      degree_type: str(formData, "degree_type"),
      country: str(formData, "country"),
      deadline: str(formData, "deadline"),
      website: str(formData, "website"),
      priority: (str(formData, "priority") ?? "medium") as Priority,
      notes: str(formData, "notes"),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const contactName = str(formData, "contact_name");
  if (contactName) {
    await supabase.from("contacts").insert({
      programme_id: data.id,
      name: contactName,
      role: (str(formData, "contact_role") ?? "advisor") as ContactRole,
      email: str(formData, "contact_email"),
    });
  }

  revalidatePath("/");
  revalidatePath("/board");
  redirect(`/programmes/${data.id}`);
}

export async function updateStage(programmeId: string, stage: Stage) {
  const supabase = createClient();
  const { error } = await supabase.from("programmes").update({ stage }).eq("id", programmeId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/board");
  revalidatePath(`/programmes/${programmeId}`);
}

export async function updateOutcome(programmeId: string, outcome: Outcome) {
  const supabase = createClient();
  const { error } = await supabase.from("programmes").update({ outcome }).eq("id", programmeId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/board");
  revalidatePath(`/programmes/${programmeId}`);
}

export async function updateProgramme(programmeId: string, formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase
    .from("programmes")
    .update({
      university: str(formData, "university"),
      programme: str(formData, "programme"),
      degree_type: str(formData, "degree_type"),
      country: str(formData, "country"),
      deadline: str(formData, "deadline"),
      website: str(formData, "website"),
      priority: (str(formData, "priority") ?? "medium") as Priority,
      notes: str(formData, "notes"),
    })
    .eq("id", programmeId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/board");
  revalidatePath(`/programmes/${programmeId}`);
}

export async function deleteProgramme(programmeId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("programmes").delete().eq("id", programmeId);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/board");
  redirect("/board");
}

export async function bulkDeleteProgrammes(programmeIds: string[]) {
  if (programmeIds.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("programmes").delete().in("id", programmeIds);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/board");
  revalidatePath("/documents");
}

export async function bulkUpdateStage(programmeIds: string[], stage: Stage) {
  if (programmeIds.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("programmes").update({ stage }).in("id", programmeIds);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/board");
}

export async function bulkUpdatePriority(programmeIds: string[], priority: Priority) {
  if (programmeIds.length === 0) return;
  const supabase = createClient();
  const { error } = await supabase.from("programmes").update({ priority }).in("id", programmeIds);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/board");
}

const QUICK_ACTIONS = {
  emailed: { stage: "emailed", interactionType: "email_sent" },
  replied: { stage: "replied", interactionType: "email_reply" },
} as const satisfies Record<string, { stage: Stage; interactionType: InteractionType }>;

export type QuickAction = keyof typeof QUICK_ACTIONS;

export async function logQuickInteraction(programmeId: string, action: QuickAction) {
  const { stage, interactionType } = QUICK_ACTIONS[action];
  const supabase = createClient();
  const { error: stageError } = await supabase.from("programmes").update({ stage }).eq("id", programmeId);
  if (stageError) throw new Error(stageError.message);
  const { error: interactionError } = await supabase
    .from("interactions")
    .insert({ programme_id: programmeId, type: interactionType });
  if (interactionError) throw new Error(interactionError.message);
  revalidatePath("/");
  revalidatePath("/board");
  revalidatePath(`/programmes/${programmeId}`);
}

export async function addContact(programmeId: string, formData: FormData) {
  const supabase = createClient();
  const name = str(formData, "name");
  if (!name) throw new Error("Contact name is required");
  const { error } = await supabase.from("contacts").insert({
    programme_id: programmeId,
    name,
    role: (str(formData, "role") ?? "advisor") as ContactRole,
    email: str(formData, "email"),
    notes: str(formData, "notes"),
  });
  if (error) throw new Error(error.message);
  revalidatePath(`/programmes/${programmeId}`);
}

export async function addInteraction(programmeId: string, formData: FormData) {
  const supabase = createClient();
  const type = str(formData, "type") as InteractionType | null;
  if (!type) throw new Error("Interaction type is required");
  const { error } = await supabase.from("interactions").insert({
    programme_id: programmeId,
    contact_id: str(formData, "contact_id"),
    type,
    note: str(formData, "note"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath(`/programmes/${programmeId}`);
}

export async function createTask(formData: FormData) {
  const title = str(formData, "title");
  if (!title) throw new Error("Task title is required");
  const supabase = createClient();
  const { error } = await supabase.from("tasks").insert({ title, notes: str(formData, "notes") });
  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
}

export async function toggleTask(taskId: string, done: boolean) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").update({ done }).eq("id", taskId);
  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
}

export async function deleteTask(taskId: string) {
  const supabase = createClient();
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);
  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
}

export async function upsertDocumentStatus(
  programmeId: string,
  type: DocumentType,
  status: DocumentStatus,
  notes?: string | null
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("documents")
    .upsert(
      { programme_id: programmeId, type, status, notes: notes ?? null, updated_at: new Date().toISOString() },
      { onConflict: "programme_id,type" }
    );
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/documents");
  revalidatePath(`/programmes/${programmeId}`);
}
