import { requireAdmin } from "@/lib/authorization";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/sign-out";
import { CreateHostForm } from "./create-host-form";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  // Der Admin sieht bewusst NUR Metadaten zur Verwaltung — keine
  // Dinner-Inhalte, keine Charaktere, keine Spielerdaten (Prinzip der
  // minimal notwendigen Rechte, Abschnitt 6).
  const hosts = await db.user.findMany({
    where: { role: "HOST" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { dinners: true } } },
  });

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line bg-paper-raised">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-display italic text-sm text-brass-strong">Dossier</p>
            <p className="text-sm text-ink-soft">
              Plattform-Administration · {session.user.name}
            </p>
          </div>
          <form action={signOutAction}>
            <Button variant="ghost" size="sm" type="submit">
              Abmelden
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="font-display text-3xl text-ink">Hosts</h1>
        <p className="mt-1 text-sm text-ink-soft">
          {hosts.length} registrierte Host-Konten. Kein Zugriff auf Dinner-
          oder Spielerinhalte einzelner Hosts.
        </p>

        <div className="mt-6">
          <CreateHostForm />
        </div>

        <ul className="mt-6 divide-y divide-line rounded-md border border-line bg-paper-raised">
          {hosts.map((host) => (
            <li key={host.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-ink">{host.name}</p>
                <p className="text-xs text-ink-soft">{host.email}</p>
              </div>
              <p className="text-xs uppercase tracking-wide text-ink-soft">
                {host._count.dinners} Dinner · {host.isActive ? "aktiv" : "gesperrt"}
              </p>
            </li>
          ))}
          {hosts.length === 0 ? (
            <li className="px-5 py-8 text-center text-sm text-ink-soft">
              Noch keine Hosts angelegt.
            </li>
          ) : null}
        </ul>
      </div>
    </main>
  );
}
