import { useEffect, useMemo, useState } from "react";
import { KeyRound, Settings } from "lucide-react";

import { useSettings } from "@/hooks/useSettings";
import { generatePassword } from "@/lib/password";
import { generatePassphrase } from "@/lib/passphrase";
import {
  passwordEntropyBits,
  passphraseEntropyBits,
  strengthFromBits,
} from "@/lib/entropy";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { GeneratorOutput } from "./components/GeneratorOutput";
import { StrengthMeter } from "./components/StrengthMeter";
import { PasswordControls } from "./components/PasswordControls";
import { PassphraseControls } from "./components/PassphraseControls";

function openOptions() {
  if (typeof chrome !== "undefined" && chrome.runtime?.openOptionsPage) {
    chrome.runtime.openOptionsPage();
  } else {
    window.open("options.html", "_blank");
  }
}

function generate(mode, pw, pp) {
  return mode === "password" ? generatePassword(pw) : generatePassphrase(pp);
}

// Signature of only the ACTIVE mode's inputs, so editing the inactive mode
// (e.g. from the options page) never regenerates the shown secret.
function activeSignature(mode, pw, pp) {
  return mode === "password"
    ? `p:${pw.length}:${pw.upper}:${pw.numbers}:${pw.symbols}:${pw.excludeSimilar}`
    : `f:${pp.words}:${pp.capitalize}:${pp.numbers}:${pp.separator}`;
}

export default function App() {
  const { settings, ready, updatePassword, updatePassphrase, setMode } =
    useSettings();
  const [value, setValue] = useState("");
  const { mode, password: pw, passphrase: pp } = settings;
  const sig = activeSignature(mode, pw, pp);

  // Regenerate once settings are loaded and whenever the active inputs change.
  useEffect(() => {
    if (!ready) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(generate(mode, pw, pp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, sig]);

  const strength = useMemo(() => {
    const bits =
      mode === "password" ? passwordEntropyBits(pw) : passphraseEntropyBits(pp);
    return strengthFromBits(bits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  // Gate on `ready` so we never flash default settings / an empty secret box.
  if (!ready) return null;

  return (
    <div className="flex flex-col bg-background text-foreground">
      <header className="flex items-center gap-2 border-b px-3 py-2.5">
        <KeyRound className="size-5 text-primary" />
        <h1 className="flex-1 text-sm font-semibold">Password Generator</h1>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          title="Settings"
          onClick={openOptions}
        >
          <Settings />
        </Button>
      </header>

      <div className="space-y-4 p-3">
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="passphrase">Passphrase</TabsTrigger>
          </TabsList>
        </Tabs>

        <GeneratorOutput
          value={value}
          mode={mode}
          onRegenerate={() => setValue(generate(mode, pw, pp))}
        />
        <StrengthMeter strength={strength} />

        <Card>
          <CardContent className="p-4">
            {mode === "password" ? (
              <PasswordControls options={pw} onChange={updatePassword} />
            ) : (
              <PassphraseControls options={pp} onChange={updatePassphrase} />
            )}
          </CardContent>
        </Card>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}
