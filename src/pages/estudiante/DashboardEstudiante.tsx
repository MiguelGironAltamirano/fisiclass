import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { StatCard } from "../../components/ui/StatCard";
import { CourseCard } from "../../components/ui/CourseCard";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { Sparkline, type SparklinePoint } from "../../components/ui/Sparkline";
import { Skeleton } from "../../components/ui/Skeleton";
import { ASSIGNMENTS, CURRENT_USER, ESTUDIANTE_COURSES, ESTUDIANTE_GRADES, STUDENT_GAMIFICATION } from "../../data/mockData";
import type { Assignment, AssignmentStatus } from "../../types";

const LOAD_DELAY_MS = 600;

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short" });
}

const DISTRIBUTION_CONFIG: Record<
  AssignmentStatus,
  { readonly label: string; readonly icon: string; readonly barClassName: string; readonly textClassName: string }
> = {
  pendiente: { label: "Por hacer", icon: "hourglass_empty", barClassName: "bg-warning", textClassName: "text-warning" },
  entregado: { label: "Entregadas", icon: "task_alt", barClassName: "bg-primary-container", textClassName: "text-primary-container" },
  calificado: { label: "Calificadas", icon: "grade", barClassName: "bg-success", textClassName: "text-success" },
};

const DISTRIBUTION_ORDER: readonly AssignmentStatus[] = ["pendiente", "entregado", "calificado"];

export function DashboardEstudiante() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const allAssignments = useMemo<readonly Assignment[]>(() => Object.values(ASSIGNMENTS).flat(), []);

  const pendingCount = allAssignments.filter((a) => a.status === "pendiente").length;

  const promedio = useMemo(() => {
    const graded = ESTUDIANTE_GRADES.filter((g) => g.score != null);
    if (graded.length === 0) return "—";
    return (graded.reduce((sum, g) => sum + (g.score ?? 0), 0) / graded.length).toFixed(1);
  }, []);

  const nextDueAssignment = useMemo(() => {
    return allAssignments
      .filter((a) => a.status === "pendiente")
      .slice()
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  }, [allAssignments]);

  const distribution = useMemo(() => {
    const counts: Record<AssignmentStatus, number> = { pendiente: 0, entregado: 0, calificado: 0 };
    allAssignments.forEach((a) => {
      counts[a.status] += 1;
    });
    const max = Math.max(...Object.values(counts), 1);
    return DISTRIBUTION_ORDER.map((status) => ({ status, count: counts[status], max }));
  }, [allAssignments]);

  const gradeTrend: readonly SparklinePoint[] = useMemo(() => {
    return ESTUDIANTE_GRADES.filter((g) => g.score != null).map((g) => ({
      value: g.score as number,
      label: `${g.assignment} · ${g.course}`,
    }));
  }, []);

  const { streakDays, cycleProgress, earnedBadges, upcomingBadges } = STUDENT_GAMIFICATION;
  const firstName = CURRENT_USER.estudiante.name.split(" ")[0];

  return (
    <AppShell role="estudiante" title="Dashboard">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Hola, {firstName} 👋</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Este es tu resumen académico de la semana.
        </p>
      </div>

      {loading ? (
        <DashboardSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
            <StatCard
              icon="assignment"
              iconBg="bg-warning/10"
              iconColor="text-warning"
              value={String(pendingCount)}
              label="Tareas pendientes por entregar"
              badge="Esta semana"
              actionLabel="Ver Tareas"
              actionIcon="arrow_forward"
              variant="primary"
              onAction={() => navigate("/estudiante/tareas")}
            />
            <StatCard
              icon="grade"
              iconBg="bg-primary-fixed"
              iconColor="text-on-primary-fixed"
              value={promedio}
              label="Promedio general del ciclo"
              actionLabel="Ver Calificaciones"
              actionIcon="grade"
              onAction={() => navigate("/estudiante/calificaciones")}
            />
            <StatCard
              icon="event_upcoming"
              iconBg="bg-success/10"
              iconColor="text-success"
              value={nextDueAssignment ? formatDate(nextDueAssignment.dueDate) : "—"}
              label={nextDueAssignment ? `Próxima entrega: ${nextDueAssignment.title}` : "Sin entregas pendientes"}
              actionLabel="Ver Calendario"
              actionIcon="calendar_today"
              variant="ghost"
              onAction={() => navigate("/estudiante/calendario")}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-8">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 flex flex-col items-center text-center">
              <h3 className="font-headline-sm text-headline-sm text-on-background self-start mb-4">Progreso del ciclo</h3>
              <ProgressRing value={cycleProgress} size={112} strokeWidth={10} />
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
                Has avanzado el {cycleProgress}% del ciclo académico actual.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-1">Tendencia de notas</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Últimas actividades calificadas</p>
              <div className="flex justify-center">
                <Sparkline data={gradeTrend} width={260} height={80} ariaLabel="Tendencia de notas del estudiante" />
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 flex flex-col">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-warning/10 text-warning flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    local_fire_department
                  </span>
                </div>
                <div>
                  <p className="font-headline-md text-headline-md text-on-background">{streakDays} días</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Racha de actividad</p>
                </div>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-4">
                Ingresa a la plataforma todos los días para mantener tu racha activa.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-8">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Distribución de tareas</h3>
              <div className="space-y-4">
                {distribution.map(({ status, count, max }) => {
                  const config = DISTRIBUTION_CONFIG[status];
                  const width = count === 0 ? 0 : Math.max(6, (count / max) * 100);
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-label-md text-label-md flex items-center gap-1.5 ${config.textClassName}`}>
                          <span className="material-symbols-outlined text-[18px]">{config.icon}</span>
                          {config.label}
                        </span>
                        <span className="font-label-md text-label-md text-on-surface">{count}</span>
                      </div>
                      <div className="w-full h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${config.barClassName} transition-[width] duration-500`}
                          style={{ width: `${width}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
              <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Insignias</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {earnedBadges.map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center text-center gap-1.5" title={badge.description}>
                    <div className="w-12 h-12 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {badge.icon}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{badge.name}</span>
                  </div>
                ))}
                {upcomingBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="flex flex-col items-center text-center gap-1.5 opacity-40"
                    title={badge.description}
                  >
                    <div className="relative w-12 h-12 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                      <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-[12px]">lock</span>
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

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
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {ESTUDIANTE_COURSES.map((c) => (
              <CourseCard key={c.id} course={c} onOpen={() => navigate(`/estudiante/cursos/${c.id}`)} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-8">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-8">
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    </>
  );
}
