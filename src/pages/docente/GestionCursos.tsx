import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { CourseCard } from "../../components/ui/CourseCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { NuevoCursoModal } from "../../components/ui/NuevoCursoModal";
import { DOCENTE_COURSES } from "../../data/mockData";
import { useToast } from "../../components/ui/Toast";
import type { Course } from "../../types";

export function GestionCursos() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([...DOCENTE_COURSES]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCourse = (newCourse: Course) => {
    setCourses((prev) => [...prev, newCourse]);
    showToast("Curso creado exitosamente", "success");
  };

  return (
    <AppShell role="docente" title="Gestión de Cursos">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Gestión de Cursos</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Administra el contenido, estudiantes y actividades de tus cursos.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary-container text-white font-label-md text-label-md py-2.5 px-5 rounded-lg hover:bg-primary-container/90 transition-colors flex items-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Curso
        </button>
      </div>
      {courses.length === 0 ? (
        <EmptyState
          icon="school"
          title="Todavía no gestionas ningún curso"
          description="Crea tu primer curso para empezar a subir contenido y gestionar estudiantes."
          action={{ label: "Nuevo Curso", onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {courses.map((c) => (
            <CourseCard
              key={c.id}
              course={c}
              onOpen={() => navigate(`/docente/cursos/${c.id}`)}
            />
          ))}
        </div>
      )}

      <NuevoCursoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCourse}
      />
    </AppShell>
  );
}
