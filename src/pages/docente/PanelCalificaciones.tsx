import { AppShell } from "../../components/layout/AppShell";
import { GradeTable } from "../../components/ui/GradeTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { DOCENTE_GRADES } from "../../data/mockData";

export function PanelCalificaciones() {
  return (
    <AppShell role="docente" title="Panel de Calificaciones">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Panel de Calificaciones y Reportes</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Registra notas pendientes y consulta el estado de tus cursos.
        </p>
      </div>

      {DOCENTE_GRADES.length === 0 ? (
        <EmptyState
          icon="grade"
          title="No hay calificaciones registradas"
          description="Cuando tus estudiantes entreguen actividades, aparecerán aquí para que las califiques."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-8">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Promedio general</p>
              <p className="font-headline-md text-headline-md text-on-background">16.4</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Notas pendientes</p>
              <p className="font-headline-md text-headline-md text-warning">3</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Entregas atrasadas</p>
              <p className="font-headline-md text-headline-md text-error">1</p>
            </div>
          </div>
          <GradeTable rows={DOCENTE_GRADES} showStudent editable />
        </>
      )}
    </AppShell>
  );
}