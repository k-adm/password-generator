import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { PASSWORD_LENGTH_MIN, PASSWORD_LENGTH_MAX } from "@/lib/password";
import { ToggleRow } from "./ToggleRow";

const TOGGLES = [
  { key: "upper", label: "Capital letters", hint: "ABC" },
  { key: "numbers", label: "Numbers", hint: "123" },
  { key: "symbols", label: "Symbols", hint: "!&*" },
];

export function PasswordControls({ options, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Length</Label>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {options.length}
          </span>
        </div>
        <Slider
          aria-label="Password length"
          value={[options.length]}
          min={PASSWORD_LENGTH_MIN}
          max={PASSWORD_LENGTH_MAX}
          step={1}
          onValueChange={([v]) => onChange({ length: v })}
        />
      </div>

      <div className="space-y-2.5">
        {TOGGLES.map((t) => (
          <ToggleRow
            key={t.key}
            id={`pw-${t.key}`}
            label={t.label}
            hint={t.hint}
            checked={options[t.key]}
            onChange={(v) => onChange({ [t.key]: v })}
          />
        ))}
        <ToggleRow
          id="pw-exclude"
          label="Exclude look-alike characters"
          hint="0/O l/I"
          checked={options.excludeSimilar}
          onChange={(v) => onChange({ excludeSimilar: v })}
        />
      </div>
    </div>
  );
}
