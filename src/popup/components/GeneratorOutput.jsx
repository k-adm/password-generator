import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Check, Copy, RefreshCw } from "lucide-react";

import { copyToClipboard } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ColoredSecret } from "./ColoredSecret";

export function GeneratorOutput({ value, mode, onRegenerate }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleCopy() {
    if (!value) return;
    const ok = await copyToClipboard(value);
    if (ok) {
      setCopied(true);
      toast.success("Copied to clipboard");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1200);
    } else {
      toast.error("Could not copy");
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy generated value"
        title="Click to copy"
        className="flex min-h-16 w-full items-center rounded-lg border bg-muted/40 px-3 py-2.5 text-left transition-colors hover:bg-muted/70"
      >
        <ColoredSecret value={value} mode={mode} />
      </button>
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={handleCopy}>
          {copied ? <Check className="text-emerald-500" /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button className="flex-1" onClick={onRegenerate}>
          <RefreshCw /> Regenerate
        </Button>
      </div>
    </div>
  );
}
