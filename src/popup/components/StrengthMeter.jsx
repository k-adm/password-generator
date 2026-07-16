import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const STYLES = {
  "Very weak": {
    bar: "bg-destructive",
    badge: "border-transparent bg-destructive text-white",
  },
  Weak: {
    bar: "bg-destructive",
    badge: "border-transparent bg-destructive text-white",
  },
  Fair: {
    bar: "bg-amber-500",
    badge: "border-transparent bg-amber-500 text-black",
  },
  Strong: {
    bar: "bg-emerald-500",
    badge: "border-transparent bg-emerald-500 text-white",
  },
  "Very strong": {
    bar: "bg-emerald-600",
    badge: "border-transparent bg-emerald-600 text-white",
  },
};

export function StrengthMeter({ strength }) {
  const s = STYLES[strength.label] ?? STYLES.Strong;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Badge className={cn(s.badge)}>{strength.label}</Badge>
        <span className="text-xs text-muted-foreground">
          {strength.crackTime} to crack
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            s.bar,
          )}
          style={{ width: `${Math.max(6, Math.round(strength.score * 100))}%` }}
        />
      </div>
    </div>
  );
}
