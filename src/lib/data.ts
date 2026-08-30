import { createClient } from "@/lib/supabase";
import type { Contact, Document, Interaction, Programme, ProgrammeWithRelations, Task } from "@/lib/types";

export async function getProgrammes(): Promise<Programme[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("programmes").select("*").order("deadline", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getInteractions(): Promise<Interaction[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("interactions").select("*").order("occurred_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDocuments(): Promise<Document[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("documents").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getContacts(): Promise<Contact[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("contacts").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTasks(): Promise<Task[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDashboardData() {
  const [programmes, interactions, documents, contacts] = await Promise.all([
    getProgrammes(),
    getInteractions(),
    getDocuments(),
    getContacts(),
  ]);
  return { programmes, interactions, documents, contacts };
}

export async function getProgrammeWithRelations(id: string): Promise<ProgrammeWithRelations | null> {
  const supabase = createClient();
  const [{ data: programme, error: programmeError }, { data: contacts, error: contactsError }, { data: interactions, error: interactionsError }, { data: documents, error: documentsError }] =
    await Promise.all([
      supabase.from("programmes").select("*").eq("id", id).maybeSingle(),
      supabase.from("contacts").select("*").eq("programme_id", id).order("created_at", { ascending: true }),
      supabase.from("interactions").select("*").eq("programme_id", id).order("occurred_at", { ascending: false }),
      supabase.from("documents").select("*").eq("programme_id", id),
    ]);

  if (programmeError) throw new Error(programmeError.message);
  if (!programme) return null;
  if (contactsError) throw new Error(contactsError.message);
  if (interactionsError) throw new Error(interactionsError.message);
  if (documentsError) throw new Error(documentsError.message);

  return { ...programme, contacts: contacts ?? [], interactions: interactions ?? [], documents: documents ?? [] };
}
