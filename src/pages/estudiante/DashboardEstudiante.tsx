import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { StatCard } from "../../components/ui/StatCard";
import { CourseCard } from "../../components/ui/CourseCard";
import { ESTUDIANTE_COURSES } from "../../data/mockData";

export function DashboardEstudiante() {
  const navigate = useNavigate();

  return (
    <AppShell role="estudiante" title="Dashboard">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Hola, Carlos 👋</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Este es tu resumen académico de la semana.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
        <StatCard
          icon="assignment"
          iconBg="bg-warning/10"
          iconColor="text-warning"
          value="3"
          label="Tareas pendientes por entregar"
          badge="Esta semana"
          actionLabel="Ver Tareas"
          actionIcon="arrow_forward"
          variant="primary"
          onAction={() => navigate("/estudiante/calificaciones")}
        />
        <StatCard
          icon="grade"
          iconBg="bg-primary-fixed"
          iconColor="text-primary-container"
          value="16.8"
          label="Promedio general del ciclo"
          actionLabel="Ver Calificaciones"
          actionIcon="grade"
          onAction={() => navigate("/estudiante/calificaciones")}
        />
        <StatCard
          icon="event_upcoming"
          iconBg="bg-success/10"
          iconColor="text-success"
          value="12 jul"
          label="Próximo examen: Cálculo Diferencial"
          actionLabel="Ver Calendario"
          actionIcon="calendar_today"
          variant="ghost"
          onAction={() => navigate("/estudiante/calendario")}
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline-sm text-headline-sm text-on-background">Mis Cursos</h3>
          <button
            onClick={() => navigate("/estudiante/cursos")}
            className="font-label-md text-label-md text-primary-container hover:underline"
          >
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {ESTUDIANTE_COURSES.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={() => navigate("/estudiante/cursos")} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
