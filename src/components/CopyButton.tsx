"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy command"
      className={`
        w-9 flex items-center justify-center text-sm transition-all duration-150
        opacity-0 group-hover/row:opacity-100
        ${copied ? "text-green-400 pop" : "text-[var(--dim)] hover:text-[#58a6ff]"}
      `}
    >
      {copied ? "✓" : "⧉"}
    </button>
  );
}
