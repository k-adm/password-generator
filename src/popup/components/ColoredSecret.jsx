import { cn } from "@/lib/utils";

const DIGIT = /[0-9]/;
const LETTER = /[A-Za-z]/;

/** Per-character color: letters neutral, digits and symbols each tinted. */
function charClass(ch) {
  if (DIGIT.test(ch)) return "text-chart-1";
  if (LETTER.test(ch)) return "text-foreground";
  return "text-chart-4"; // symbols and separators
}

export function ColoredSecret({ value, mode }) {
  // Passphrases wrap at word boundaries; random passwords may break anywhere.
  const wrap = mode === "passphrase" ? "break-words" : "break-all";
  return (
    <span
      className={cn("font-mono text-base leading-relaxed tracking-wide", wrap)}
    >
      {value.split("").map((ch, i) => (
        <span key={i} className={cn(charClass(ch))}>
          {ch}
        </span>
      ))}
    </span>
  );
}
