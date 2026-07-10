import { AppShell } from "../../components/layout/AppShell";
import { CourseCard } from "../../components/ui/CourseCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { ESTUDIANTE_COURSES } from "../../data/mockData";

import { useNavigate } from "react-router-dom";

export function MisCursos() {
  const navigate = useNavigate();

  return (
    <AppShell role="estudiante" title="Mis Cursos">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Mis Cursos</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Cursos matriculados en el ciclo académico actual.
        </p>
      </div>
      {ESTUDIANTE_COURSES.length === 0 ? (
        <EmptyState
          icon="school"
          title="Aún no tienes cursos matriculados"
          description="Cuando te matricules en un curso, aparecerá aquí junto con tu progreso y horario."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {ESTUDIANTE_COURSES.map((c) => (
            <CourseCard key={c.id} course={c} onOpen={() => navigate(`/estudiante/cursos/${c.id}`)} />
          ))}
        </div>
      )}
    </AppShell>
  );
}