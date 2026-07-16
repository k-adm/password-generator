import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PASSPHRASE_WORDS_MIN,
  PASSPHRASE_WORDS_MAX,
  SEPARATOR_OPTIONS,
} from "@/lib/passphrase";
import { ToggleRow } from "./ToggleRow";

export function PassphraseControls({ options, onChange }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm">Words</Label>
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {options.words}
          </span>
        </div>
        <Slider
          aria-label="Number of words"
          value={[options.words]}
          min={PASSPHRASE_WORDS_MIN}
          max={PASSPHRASE_WORDS_MAX}
          step={1}
          onValueChange={([v]) => onChange({ words: v })}
        />
      </div>

      <div className="space-y-2.5">
        <ToggleRow
          id="pp-capitalize"
          label="Capital letters"
          hint="ABC"
          checked={options.capitalize}
          onChange={(v) => onChange({ capitalize: v })}
        />
        <ToggleRow
          id="pp-numbers"
          label="Numbers"
          hint="123"
          checked={options.numbers}
          onChange={(v) => onChange({ numbers: v })}
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-sm">Separator</Label>
        <Select
          value={options.separator}
          onValueChange={(v) => onChange({ separator: v })}
        >
          <SelectTrigger aria-label="Word separator">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SEPARATOR_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
