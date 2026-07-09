import { AppShell } from "../../components/layout/AppShell";
import { CourseCard } from "../../components/ui/CourseCard";
import { DOCENTE_COURSES } from "../../data/mockData";

export function GestionCursos() {
  return (
    <AppShell role="docente" title="Gestión de Cursos">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Gestión de Cursos</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Administra el contenido, estudiantes y actividades de tus cursos.
          </p>
        </div>
        <button className="bg-primary-container text-white font-label-md text-label-md py-2.5 px-5 rounded-lg hover:bg-primary-container/90 transition-colors flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Curso
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {DOCENTE_COURSES.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </AppShell>
  );
}
