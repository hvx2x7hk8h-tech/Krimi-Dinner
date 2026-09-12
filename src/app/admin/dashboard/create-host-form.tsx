"use client";

import { useActionState, useState } from "react";
import { createHostAction, type AdminCreateHostResult } from "@/lib/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export function CreateHostForm() {
  const [result, formAction, pending] = useActionState<AdminCreateHostResult | null, FormData>(
    createHostAction,
    null
  );
  const [copied, setCopied] = useState(false);

  return (
    <div className="rounded-md border border-line bg-paper-raised p-6">
      <h2 className="font-display text-xl text-ink">Neuen Host anlegen</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Es wird automatisch ein Einmal-Passwort erzeugt, das du dem Host sicher
        übermittelst.
      </p>

      <form action={formAction} className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end">
        <Field label="Name" htmlFor="host-name">
          <Input id="host-name" name="name" required />
        </Field>
        <Field label="E-Mail-Adresse" htmlFor="host-email">
          <Input id="host-email" name="email" type="email" required />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Wird angelegt …" : "Host anlegen"}
        </Button>
      </form>

      {result && !result.ok ? (
        <p className="mt-4 rounded-sm bg-signal-soft px-3 py-2 text-sm text-signal">
          {result.error}
        </p>
      ) : null}

      {result && result.ok ? (
        <div className="mt-4 rounded-sm border border-ok/30 bg-ok-soft p-4">
          <p className="text-sm font-medium text-ok">Host-Konto angelegt.</p>
          <p className="mt-1 text-sm text-ink-soft">
            Bitte gib diese Zugangsdaten jetzt sicher an den Host weiter — das
            Passwort wird nicht erneut angezeigt.
          </p>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-ink-soft">E-Mail</dt>
            <dd className="font-mono text-ink">{result.email}</dd>
            <dt className="text-ink-soft">Passwort</dt>
            <dd className="font-mono text-ink">{result.temporaryPassword}</dd>
          </dl>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={async () => {
              await navigator.clipboard.writeText(
                `E-Mail: ${result.email}\nPasswort: ${result.temporaryPassword}`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? "Kopiert ✓" : "In Zwischenablage kopieren"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
