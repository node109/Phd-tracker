import { createClient } from "@/lib/supabase/server";
import type { Contact, Document, Interaction, Programme, ProgrammeWithRelations, Task } from "@/lib/types";

export async function getProgrammes(): Promise<Programme[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("programmes").select("*").order("deadline", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getInteractions(): Promise<Interaction[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("interactions").select("*").order("occurred_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDocuments(): Promise<Document[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("documents").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getContacts(): Promise<Contact[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("contacts").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getTasks(): Promise<Task[]> {
  const supabase = await createClient();
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

const SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour, regenerated on every page load

export async function getDocumentFileUrls(documents: Document[]): Promise<Record<string, string>> {
  const withFiles = documents.filter((d): d is Document & { file_path: string } => !!d.file_path);
  if (withFiles.length === 0) return {};

  const supabase = await createClient();
  const entries = await Promise.all(
    withFiles.map(async (doc) => {
      const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_path, SIGNED_URL_TTL_SECONDS);
      return [doc.id, data?.signedUrl] as const;
    })
  );
  return Object.fromEntries(entries.filter(([, url]) => !!url)) as Record<string, string>;
}

export async function getProgrammeWithRelations(id: string): Promise<ProgrammeWithRelations | null> {
  const supabase = await createClient();
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
