import { useState } from "react";
import { useTheme } from "next-themes";
import { KeyRound } from "lucide-react";

import { useSettings } from "@/hooks/useSettings";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { PasswordControls } from "@/popup/components/PasswordControls";
import { PassphraseControls } from "@/popup/components/PassphraseControls";

export default function App() {
  const { theme, setTheme } = useTheme();
  const { settings, ready, updatePassword, updatePassphrase } = useSettings();
  // Local view tab: which defaults to edit. Decoupled from the persisted
  // `mode` so viewing a tab here never changes what the popup opens on.
  const [viewTab, setViewTab] = useState("password");

  if (!ready) return null;

  return (
    <div className="mx-auto min-h-screen max-w-xl bg-background px-6 py-8 text-foreground">
      <header className="mb-6 flex items-center gap-2">
        <KeyRound className="size-6 text-primary" />
        <h1 className="text-xl font-semibold">Password Generator</h1>
      </header>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription>
              Theme used by the popup and this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              <Label className="text-xs">Theme</Label>
              <Select value={theme ?? "system"} onValueChange={setTheme}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Default generator settings
            </CardTitle>
            <CardDescription>
              The options the popup opens with. Changes save automatically.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={viewTab} onValueChange={setViewTab}>
              <TabsList className="grid w-full max-w-xs grid-cols-2">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="passphrase">Passphrase</TabsTrigger>
              </TabsList>
              <TabsContent value="password" className="max-w-sm pt-4">
                <PasswordControls
                  options={settings.password}
                  onChange={updatePassword}
                />
              </TabsContent>
              <TabsContent value="passphrase" className="max-w-sm pt-4">
                <PassphraseControls
                  options={settings.passphrase}
                  onChange={updatePassphrase}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Toaster position="bottom-center" />
    </div>
  );
}
