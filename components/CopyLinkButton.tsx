"use client";

import { useState } from "react";

// The only interactive client bit on group pages: copy an invite link to the
// clipboard. WhatsApp "Share" is a plain wa.me link rendered server-side.
export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (e.g. insecure context), no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium hover:border-saffron"
    >
      {copied ? "Copied!" : "Copy link"}
    </button>
  );
}
