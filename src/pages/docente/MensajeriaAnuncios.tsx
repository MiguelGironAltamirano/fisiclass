import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import { AnnouncementsPanel } from "../../components/ui/AnnouncementsPanel";
import { MessagesPanel } from "../../components/ui/MessagesPanel";

const TABS = [
  { id: "mensajes", label: "Mensajes" },
  { id: "anuncios", label: "Anuncios" },
] as const;

export function MensajeriaAnuncios() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("mensajes");

  return (
    <AppShell role="docente" title="Mensajería y Anuncios">
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Mensajería y Anuncios</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Comunícate con tus estudiantes y publica anuncios para tus cursos.
        </p>
      </div>
      <div className="flex gap-2 mb-6 border-b border-outline-variant/50">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 font-label-md text-label-md border-b-2 transition-colors -mb-px ${
              tab === t.id
                ? "border-primary-container text-primary-container"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "mensajes" ? <MessagesPanel /> : <AnnouncementsPanel />}
    </AppShell>
  );
}
