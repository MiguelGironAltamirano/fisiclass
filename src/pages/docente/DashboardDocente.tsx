import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { StatCard } from "../../components/ui/StatCard";
import { DOCENTE_COURSES } from "../../data/mockData";
import { CourseCard } from "../../components/ui/CourseCard";

export function DashboardDocente() {
  const navigate = useNavigate();

  return (
    <AppShell role="docente" title="Dashboard">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Panel de Control - Docente</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Resumen de actividad y tareas pendientes para el día de hoy.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
        <StatCard
          icon="assignment_late"
          iconBg="bg-warning/10"
          iconColor="text-warning"
          value="24"
          label="Entregas pendientes de calificar"
          badge="Urgente"
          actionLabel="Ir a Calificaciones"
          actionIcon="arrow_forward"
          variant="primary"
          onAction={() => navigate("/docente/calificaciones")}
        />
        <StatCard
          icon="mark_email_unread"
          iconBg="bg-primary-fixed"
          iconColor="text-on-primary-fixed"
          value="12"
          label="Mensajes de alumnos no leídos"
          actionLabel="Revisar Bandeja"
          actionIcon="mail"
          onAction={() => navigate("/docente/mensajes")}
        />
        <StatCard
          icon="group"
          iconBg="bg-success/10"
          iconColor="text-success"
          value="85%"
          label="Asistencia promedio última semana"
          actionLabel="Ver Reporte"
          actionIcon="bar_chart"
          variant="ghost"
          onAction={() => navigate("/docente/calificaciones")}
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-headline-sm text-headline-sm text-on-background">Mis Cursos</h3>
          <button
            onClick={() => navigate("/docente/cursos")}
            className="font-label-md text-label-md text-primary-container hover:underline"
          >
            Ver todos
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {DOCENTE_COURSES.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={() => navigate("/docente/cursos")} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
