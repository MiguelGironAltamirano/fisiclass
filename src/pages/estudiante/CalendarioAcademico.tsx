import { AppShell } from "../../components/layout/AppShell";
import { CalendarGrid } from "../../components/ui/CalendarGrid";

export function CalendarioAcademico() {
  return (
    <AppShell role="estudiante" title="Calendario Académico">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Calendario Académico</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Exámenes, entregas y eventos de tus cursos matriculados.
        </p>
      </div>
      <CalendarGrid />
    </AppShell>
  );
}
