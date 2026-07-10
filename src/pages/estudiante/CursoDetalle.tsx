import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { EmptyState } from "../../components/ui/EmptyState";
import { ProgressRing } from "../../components/ui/ProgressRing";
import { RoleChip } from "../../components/ui/RoleChip";
import { useModuleProgress } from "../../hooks/useModuleProgress";
import {
  ASSIGNMENTS,
  COURSE_ANNOUNCEMENTS,
  COURSE_MODULES,
  COURSE_PROGRESS,
  COURSE_SYLLABUS,
  ESTUDIANTE_COURSES,
  FORUM_THREADS,
  QUIZZES,
} from "../../data/mockData";
import type {
  Assignment,
  AssignmentStatus,
  Course,
  CourseAnnouncement,
  CourseModule,
  CourseProgressBreakdown,
  CourseSyllabus,
  ForumThread,
  ModuleItem,
  Quiz,
} from "../../types";

const TYPE_CONFIG: Record<ModuleItem["type"], { icon: string; label: string }> = {
  video: { icon: "play_circle", label: "Video" },
  pdf: { icon: "description", label: "Documento" },
  lectura: { icon: "menu_book", label: "Lectura" },
};

type TabId = "contenido" | "tareas" | "examenes" | "foros" | "anuncios" | "silabo";

interface TabDef {
  readonly id: TabId;
  readonly label: string;
  readonly icon: string;
}

const TABS: readonly TabDef[] = [
  { id: "contenido", label: "Contenido", icon: "view_module" },
  { id: "tareas", label: "Tareas", icon: "assignment" },
  { id: "examenes", label: "Exámenes", icon: "quiz" },
  { id: "foros", label: "Foros", icon: "forum" },
  { id: "anuncios", label: "Anuncios", icon: "campaign" },
  { id: "silabo", label: "Sílabo", icon: "menu_book" },
];

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

export function CursoDetalle() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>("contenido");

  const course = ESTUDIANTE_COURSES.find((c) => c.id === courseId);

  if (!course || !courseId) {
    return (
      <AppShell role="estudiante" title="Curso no encontrado">
        <Breadcrumbs items={[{ label: "Mis Cursos", to: "/estudiante/cursos" }, { label: "Curso no encontrado" }]} />
        <EmptyState
          icon="school"
          title="Curso no encontrado"
          description="El curso que buscas no existe o ya no está disponible en tu matrícula."
          action={{ label: "Volver a Mis Cursos", onClick: () => navigate("/estudiante/cursos") }}
        />
      </AppShell>
    );
  }

  const modules = COURSE_MODULES[courseId] ?? [];
  const syllabus = COURSE_SYLLABUS[courseId];
  const announcements = COURSE_ANNOUNCEMENTS[courseId] ?? [];
  const threads = FORUM_THREADS[courseId] ?? [];
  const assignments = ASSIGNMENTS[courseId] ?? [];
  const quizzes = QUIZZES[courseId] ?? [];
  const progress = COURSE_PROGRESS[courseId];
  const { completedIds } = useModuleProgress(courseId, modules);
  const allModuleItems = modules.flatMap((m) => m.items);
  const modulesProgress =
    allModuleItems.length > 0
      ? Math.round(
          (allModuleItems.filter((i) => completedIds.has(i.id)).length / allModuleItems.length) * 100,
        )
      : undefined;

  return (
    <AppShell role="estudiante" title={course.name}>
      <Breadcrumbs items={[{ label: "Mis Cursos", to: "/estudiante/cursos" }, { label: course.name }]} />

      <CourseHeader course={course} syllabus={syllabus} progress={progress} modulesProgress={modulesProgress} />

      <div className="mt-6">
        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
        <div className="mt-5">
          {activeTab === "contenido" && (
            <ContentTab courseId={courseId} modules={modules} completedIds={completedIds} />
          )}
          {activeTab === "tareas" && <AssignmentsTab courseId={courseId} assignments={assignments} />}
          {activeTab === "examenes" && <QuizzesTab courseId={courseId} quizzes={quizzes} />}
          {activeTab === "foros" && <ForumsTab courseId={courseId} threads={threads} />}
          {activeTab === "anuncios" && <AnnouncementsTab announcements={announcements} />}
          {activeTab === "silabo" && <SyllabusTab syllabus={syllabus} />}
        </div>
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/* Cabecera del curso                                                  */
/* ------------------------------------------------------------------ */

interface CourseHeaderProps {
  readonly course: Course;
  readonly syllabus?: CourseSyllabus;
  readonly progress?: CourseProgressBreakdown;
  /** Porcentaje real de módulos completados, derivado del progreso guardado (no del mock estático). */
  readonly modulesProgress?: number;
}

function CourseHeader({ course, syllabus, progress, modulesProgress }: CourseHeaderProps) {
  const professor = syllabus?.professor ?? course.professor ?? "Docente por confirmar";

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm border border-outline-variant/30 bg-surface-container-lowest">
      <div className={`relative h-36 sm:h-44 ${course.color} flex items-end`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="relative z-10 p-6 sm:p-8 w-full min-w-0">
          <span className="inline-block font-label-sm text-label-sm text-white bg-white/15 px-2.5 py-1 rounded-full mb-2">
            {course.code}
          </span>
          <h1 className="font-headline-lg text-headline-lg text-white truncate">{course.name}</h1>
          <p className="font-body-sm text-body-sm text-white/85 mt-1 flex items-center gap-1.5 flex-wrap">
            <span className="material-symbols-outlined text-[16px]">person</span>
            {professor}
            <span className="mx-0.5">·</span>
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            {course.schedule}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-8 px-6 sm:px-8 py-5">
        <ProgressRing value={progress?.overall ?? course.progress} />
        <div className="flex flex-wrap gap-8">
          <MiniStat label="Módulos" value={modulesProgress} />
          <MiniStat label="Tareas" value={progress?.assignments} />
          <MiniStat label="Exámenes" value={progress?.quizzes} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value?: number }) {
  return (
    <div>
      <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
      <p className="font-headline-sm text-headline-sm text-on-background">{value != null ? `${value}%` : "—"}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

interface TabBarProps {
  readonly tabs: readonly TabDef[];
  readonly active: TabId;
  readonly onChange: (id: TabId) => void;
}

function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex gap-1 overflow-x-auto border-b border-outline-variant/40">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 font-label-md text-label-md whitespace-nowrap border-b-2 transition-colors shrink-0 ${
              isActive
                ? "border-primary-container text-primary-container"
                : "border-transparent text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Contenido                                                      */
/* ------------------------------------------------------------------ */

function ContentTab({
  courseId,
  modules,
  completedIds,
}: {
  courseId: string;
  modules: readonly CourseModule[];
  completedIds: ReadonlySet<string>;
}) {
  const [openWeek, setOpenWeek] = useState<string | undefined>(modules[0]?.id);

  if (modules.length === 0) {
    return (
      <EmptyState
        icon="inventory_2"
        title="Sin contenido todavía"
        description="Este curso aún no tiene módulos publicados. Vuelve más adelante."
      />
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/30">
      {modules.map((mod) => {
        const isOpen = openWeek === mod.id;
        const completedCount = mod.items.filter((i) => completedIds.has(i.id)).length;
        return (
          <div key={mod.id}>
            <button
              onClick={() => setOpenWeek(isOpen ? undefined : mod.id)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
            >
              <div className="min-w-0">
                <p className="font-label-md text-label-md text-on-surface">{mod.title}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  {completedCount}/{mod.items.length} completados
                </p>
              </div>
              <span
                className={`material-symbols-outlined text-on-surface-variant shrink-0 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <ul className="pb-2">
                  {mod.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/estudiante/cursos/${courseId}/modulo/${item.id}`}
                        className="flex items-center gap-3 pl-5 pr-5 py-3 hover:bg-surface-container-low transition-colors"
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] shrink-0 ${
                            completedIds.has(item.id) ? "text-success" : "text-on-surface-variant"
                          }`}
                        >
                          {completedIds.has(item.id) ? "check_circle" : TYPE_CONFIG[item.type].icon}
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface flex-1 truncate">{item.title}</span>
                        {(item.duration || item.estimatedMinutes) && (
                          <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">
                            {item.duration ?? `${item.estimatedMinutes} min`}
                          </span>
                        )}
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">
                          chevron_right
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Sílabo                                                         */
/* ------------------------------------------------------------------ */

function SyllabusTab({ syllabus }: { syllabus?: CourseSyllabus }) {
  if (!syllabus) {
    return (
      <EmptyState
        icon="menu_book"
        title="Sílabo no disponible"
        description="El sílabo de este curso aún no ha sido publicado."
      />
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8 max-w-3xl">
      <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">Descripción del curso</h3>
      <p className="font-body-md text-body-md text-on-surface-variant mb-6">{syllabus.description}</p>
      <h3 className="font-headline-sm text-headline-sm text-on-background mb-3">Objetivos de aprendizaje</h3>
      <ul className="space-y-2.5">
        {syllabus.objectives.map((obj, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] text-primary-container mt-0.5 shrink-0">
              task_alt
            </span>
            <span className="font-body-sm text-body-sm text-on-surface">{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Anuncios                                                       */
/* ------------------------------------------------------------------ */

function AnnouncementsTab({ announcements }: { announcements: readonly CourseAnnouncement[] }) {
  if (announcements.length === 0) {
    return (
      <EmptyState
        icon="campaign"
        title="Sin anuncios"
        description="Tu docente aún no ha publicado anuncios en este curso."
      />
    );
  }

  return (
    <div className="space-y-4">
      {announcements.map((a) => (
        <div key={a.id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
          <div className="flex justify-between items-start gap-3 mb-2">
            <h4 className="font-headline-sm text-headline-sm text-on-background">{a.title}</h4>
            <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">{a.date}</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">{a.body}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">person</span>
            {a.author}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Foros                                                          */
/* ------------------------------------------------------------------ */

function ForumsTab({ courseId, threads }: { courseId: string; threads: readonly ForumThread[] }) {
  const navigate = useNavigate();

  if (threads.length === 0) {
    return (
      <EmptyState
        icon="forum"
        title="Sin discusiones todavía"
        description="Aún no se ha abierto ningún hilo en el foro de este curso."
      />
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 divide-y divide-outline-variant/30 overflow-hidden">
      {threads.map((t) => (
        <button
          key={t.id}
          onClick={() => navigate(`/estudiante/cursos/${courseId}/foro/${t.id}`)}
          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant shrink-0">forum</span>
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-label-md text-on-surface truncate">{t.title}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1 flex items-center gap-1.5 flex-wrap">
              <RoleChip role={t.authorRole} />
              <span>{t.author}</span>
              <span>·</span>
              <span>{t.date}</span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-on-surface-variant shrink-0">
            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
            {t.replies.length}
          </div>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">chevron_right</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Tareas                                                         */
/* ------------------------------------------------------------------ */

const ASSIGNMENT_STATUS_STYLES: Record<AssignmentStatus, string> = {
  calificado: "bg-success/10 text-success",
  entregado: "bg-primary-fixed text-on-primary-fixed",
  pendiente: "bg-warning/10 text-warning",
};

const ASSIGNMENT_STATUS_LABEL: Record<AssignmentStatus, string> = {
  calificado: "Calificado",
  entregado: "Entregado",
  pendiente: "Pendiente",
};

function AssignmentsTab({ courseId, assignments }: { courseId: string; assignments: readonly Assignment[] }) {
  const navigate = useNavigate();

  if (assignments.length === 0) {
    return (
      <EmptyState
        icon="assignment"
        title="Sin tareas asignadas"
        description="Tu docente aún no ha publicado tareas en este curso."
      />
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 divide-y divide-outline-variant/30 overflow-hidden">
      {assignments.map((a) => (
        <button
          key={a.id}
          onClick={() => navigate(`/estudiante/cursos/${courseId}/tarea/${a.id}`)}
          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined text-[22px] text-on-surface-variant shrink-0">assignment</span>
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-label-md text-on-surface truncate">{a.title}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              Vence: {formatDate(a.dueDate)} · {a.points} pts
            </p>
          </div>
          <span
            className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full shrink-0 ${ASSIGNMENT_STATUS_STYLES[a.status]}`}
          >
            {ASSIGNMENT_STATUS_LABEL[a.status]}
          </span>
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">chevron_right</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tab: Exámenes                                                       */
/* ------------------------------------------------------------------ */

function QuizzesTab({ courseId, quizzes }: { courseId: string; quizzes: readonly Quiz[] }) {
  const navigate = useNavigate();

  if (quizzes.length === 0) {
    return (
      <EmptyState
        icon="quiz"
        title="Sin exámenes programados"
        description="Tu docente aún no ha publicado exámenes en este curso."
      />
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 divide-y divide-outline-variant/30 overflow-hidden">
      {quizzes.map((q) => {
        const totalPoints = q.questions.reduce((sum, question) => sum + question.points, 0);
        return (
          <button
            key={q.id}
            onClick={() => navigate(`/estudiante/cursos/${courseId}/quiz/${q.id}`)}
            className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[22px] text-on-surface-variant shrink-0">quiz</span>
            <div className="min-w-0 flex-1">
              <p className="font-label-md text-label-md text-on-surface truncate">{q.title}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                {q.durationMinutes} min · {q.questions.length} preguntas · {totalPoints} pts ·{" "}
                {q.attemptsAllowed} {q.attemptsAllowed === 1 ? "intento" : "intentos"}
              </p>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">chevron_right</span>
          </button>
        );
      })}
    </div>
  );
}
