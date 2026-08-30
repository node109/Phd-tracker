"use client";

import { useTransition } from "react";
import { Paperclip } from "lucide-react";
import { upsertDocumentStatus, uploadDocumentFile } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOCUMENT_STATUSES, DOCUMENT_STATUS_LABELS, DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, type Document, type DocumentStatus } from "@/lib/types";

interface DocumentChecklistProps {
  programmeId: string;
  documents: Document[];
  fileUrls: Record<string, string>;
}

export function DocumentChecklist({ programmeId, documents, fileUrls }: DocumentChecklistProps) {
  const byType = new Map(documents.map((d) => [d.type, d]));
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      {DOCUMENT_TYPES.map((type) => {
        const doc = byType.get(type);
        const fileUrl = doc ? fileUrls[doc.id] : undefined;

        return (
          <div key={type} className="space-y-2 rounded-md border border-border p-2.5 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span>{DOCUMENT_TYPE_LABELS[type]}</span>
              <Select
                value={doc?.status ?? "not_started"}
                disabled={isPending}
                onValueChange={(value) =>
                  startTransition(() => upsertDocumentStatus(programmeId, type, value as DocumentStatus))
                }
              >
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {DOCUMENT_STATUS_LABELS[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              {fileUrl && (
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Paperclip className="h-3 w-3" />
                  View file
                </a>
              )}
              <form action={uploadDocumentFile.bind(null, programmeId, type)} className="flex flex-1 items-center gap-2">
                <input
                  type="file"
                  name="file"
                  required
                  className="flex-1 text-xs text-muted-foreground file:mr-2 file:rounded-md file:border-0 file:bg-muted file:px-2 file:py-1 file:text-xs"
                />
                <Button type="submit" size="sm" variant="outline" className="h-7 text-xs">
                  {fileUrl ? "Replace" : "Upload"}
                </Button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
