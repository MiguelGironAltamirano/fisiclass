import { AppShell } from "../../components/layout/AppShell";
import { GradeTable } from "../../components/ui/GradeTable";
import { EmptyState } from "../../components/ui/EmptyState";
import { ESTUDIANTE_GRADES } from "../../data/mockData";

export function MisCalificaciones() {
  const gradedScores = ESTUDIANTE_GRADES.filter((g) => g.score != null);
  const promedio = gradedScores.length
    ? (gradedScores.reduce((sum, g) => sum + (g.score ?? 0), 0) / gradedScores.length).toFixed(1)
    : "—";

  return (
    <AppShell role="estudiante" title="Mis Calificaciones">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Mis Calificaciones</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Consulta tus notas registradas por curso y actividad.
        </p>
      </div>

      {ESTUDIANTE_GRADES.length === 0 ? (
        <EmptyState
          icon="grade"
          title="Aún no tienes calificaciones"
          description="Cuando tus profesores registren notas de tus actividades, las verás reflejadas aquí."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-8">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Promedio general</p>
              <p className="font-headline-md text-headline-md text-on-background">{promedio}</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Actividades pendientes</p>
              <p className="font-headline-md text-headline-md text-warning">
                {ESTUDIANTE_GRADES.filter((g) => g.status === "pendiente").length}
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Entregas atrasadas</p>
              <p className="font-headline-md text-headline-md text-error">
                {ESTUDIANTE_GRADES.filter((g) => g.status === "atrasado").length}
              </p>
            </div>
          </div>
          <GradeTable rows={ESTUDIANTE_GRADES} showStudent={false} />
        </>
      )}
    </AppShell>
  );
}