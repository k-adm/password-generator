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
  // Passphrases still prefer to break at a separator, random passwords may
  // break anywhere. Both must let the browser count mid-word breaks towards
  // the intrinsic size: this span is a flex item of the output box, and a flex
  // item will not shrink below its min-content width. Plain `break-words`
  // (overflow-wrap: break-word) does not lower min-content, so a phrase joined
  // by separators that offer no break opportunity - periods, commas,
  // underscores, or the random digit/symbol ones - stayed one unbreakable
  // token and pushed the popup out to ~1000px wide.
  const wrap = mode === "passphrase" ? "wrap-anywhere" : "break-all";
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
