import { AppShell } from "../../components/layout/AppShell";
import { CourseCard } from "../../components/ui/CourseCard";
import { ESTUDIANTE_COURSES } from "../../data/mockData";

export function MisCursos() {
  return (
    <AppShell role="estudiante" title="Mis Cursos">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Mis Cursos</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Cursos matriculados en el ciclo académico actual.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {ESTUDIANTE_COURSES.map((c) => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </AppShell>
  );
}
