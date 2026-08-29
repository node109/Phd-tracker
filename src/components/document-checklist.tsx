"use client";

import { useTransition } from "react";
import { upsertDocumentStatus } from "@/app/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DOCUMENT_STATUSES, DOCUMENT_STATUS_LABELS, DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS, type Document, type DocumentStatus } from "@/lib/types";

export function DocumentChecklist({ programmeId, documents }: { programmeId: string; documents: Document[] }) {
  const byType = new Map(documents.map((d) => [d.type, d]));
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-2">
      {DOCUMENT_TYPES.map((type) => {
        const doc = byType.get(type);
        return (
          <div key={type} className="flex items-center justify-between gap-3 rounded-md border border-border p-2.5 text-sm">
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
        );
      })}
    </div>
  );
}
