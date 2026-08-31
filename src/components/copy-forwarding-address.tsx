"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyForwardingAddress({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted px-3 py-2 font-mono text-sm">
      <span className="flex-1 break-all">{address}</span>
      <Button type="button" variant="ghost" size="icon" onClick={copy} aria-label="Copy forwarding address">
        {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
