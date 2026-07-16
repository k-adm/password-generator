import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

/** Checkbox + label + optional right-aligned hint (e.g. "ABC", "123"). */
export function ToggleRow({ id, label, hint, checked, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(v) => onChange(v === true)}
      />
      <Label htmlFor={id} className="flex-1 cursor-pointer text-sm font-normal">
        {label}
      </Label>
      {hint ? (
        <span className="font-mono text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}
