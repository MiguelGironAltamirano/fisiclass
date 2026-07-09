import { AppShell } from "../../components/layout/AppShell";
import { MessagesPanel } from "../../components/ui/MessagesPanel";

export function MensajesInternos() {
  return (
    <AppShell role="estudiante" title="Mensajes">
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Mensajes Internos</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Comunícate con tus profesores y coordinación académica.
        </p>
      </div>
      <MessagesPanel />
    </AppShell>
  );
}
