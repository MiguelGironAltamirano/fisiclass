import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { EmptyState } from "../../components/ui/EmptyState";
import { Skeleton } from "../../components/ui/Skeleton";
import { ASSIGNMENTS, ESTUDIANTE_COURSES } from "../../data/mockData";
import type { Assignment, AssignmentStatus, Course } from "../../types";

const LOAD_DELAY_MS = 600;

interface EnrichedAssignment extends Assignment {
  readonly course?: Course;
}

interface ColumnDef {
  readonly status: AssignmentStatus;
  readonly title: string;
  readonly icon: string;
  readonly headerClassName: string;
}

const COLUMNS: readonly ColumnDef[] = [
  { status: "pendiente", title: "Por hacer", icon: "hourglass_empty", headerClassName: "text-warning" },
  { status: "entregado", title: "Entregado", icon: "task_alt", headerClassName: "text-primary-container" },
  { status: "calificado", title: "Calificado", icon: "grade", headerClassName: "text-success" },
];

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

/** Días restantes hasta la fecha límite (negativo si ya venció). */
function daysUntil(iso: string): number {
  const due = new Date(`${iso}T23:59:59`).getTime();
  return Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24));
}

export function TareasKanban() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), LOAD_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const assignments = useMemo<readonly EnrichedAssignment[]>(() => {
    return Object.entries(ASSIGNMENTS).flatMap(([courseId, list]) =>
      list.map((a) => ({ ...a, course: ESTUDIANTE_COURSES.find((c) => c.id === courseId) })),
    );
  }, []);

  const grouped = useMemo(() => {
    const map: Record<AssignmentStatus, EnrichedAssignment[]> = { pendiente: [], entregado: [], calificado: [] };
    assignments.forEach((a) => {
      map[a.status].push(a);
    });
    Object.values(map).forEach((list) => list.sort((a, b) => a.dueDate.localeCompare(b.dueDate)));
    return map;
  }, [assignments]);

  return (
    <AppShell role="estudiante" title="Tareas">
      <div className="mb-6">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Mis Tareas</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Todas tus tareas agrupadas por estado, de todos tus cursos.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {COLUMNS.map((col) => (
            <div key={col.status} className="space-y-3">
              <Skeleton className="h-9 rounded-lg" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-start">
          {COLUMNS.map((col) => {
            const items = grouped[col.status];
            return (
              <div key={col.status} className="bg-surface-container-low rounded-xl p-4">
                <div className={`flex items-center gap-2 mb-4 font-label-md text-label-md ${col.headerClassName}`}>
                  <span className="material-symbols-outlined text-[20px]">{col.icon}</span>
                  <span>{col.title}</span>
                  <span className="ml-auto bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full">
                    {items.length}
                  </span>
                </div>
                {items.length === 0 ? (
                  <EmptyState
                    icon={col.icon}
                    title="Sin tareas"
                    description={`No tienes tareas en estado "${col.title.toLowerCase()}".`}
                  />
                ) : (
                  <div className="space-y-3">
                    {items.map((a) => (
                      <AssignmentCard key={a.id} assignment={a} onOpen={() => navigate(`/estudiante/cursos/${a.courseId}/tarea/${a.id}`)} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

interface AssignmentCardProps {
  readonly assignment: EnrichedAssignment;
  readonly onOpen: () => void;
}

function AssignmentCard({ assignment, onOpen }: AssignmentCardProps) {
  const remaining = daysUntil(assignment.dueDate);
  const isOverdue = remaining < 0 && assignment.status === "pendiente";
  const isNear = remaining >= 0 && remaining <= 3 && assignment.status === "pendiente";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${assignment.course?.color ?? "bg-outline-variant"}`} />
        <span className="font-label-sm text-label-sm text-on-surface-variant truncate">
          {assignment.course?.name ?? "Curso"}
        </span>
      </div>
      <p className="font-label-md text-label-md text-on-surface mb-2 line-clamp-2">{assignment.title}</p>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 font-label-sm text-label-sm ${
            isOverdue ? "text-error" : isNear ? "text-warning" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">event</span>
          {formatDate(assignment.dueDate)}
          {isOverdue && " · Vencida"}
        </span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">{assignment.points} pts</span>
      </div>
      {assignment.status === "calificado" && assignment.grade && (
        <div className="mt-2 pt-2 border-t border-outline-variant/30 flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Nota</span>
          <span className="font-label-md text-label-md text-success">
            {assignment.grade.score}/{assignment.points}
          </span>
        </div>
      )}
    </button>
  );
}
