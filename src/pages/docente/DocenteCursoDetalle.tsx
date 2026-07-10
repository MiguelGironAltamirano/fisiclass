import { useState } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { DOCENTE_COURSES, COURSE_MODULES } from "../../data/mockData";
import type { ModuleItem } from "../../types";

const TYPE_CONFIG: Record<ModuleItem["type"], { icon: string; label: string }> = {
  video: { icon: "play_circle", label: "Video" },
  pdf: { icon: "description", label: "Documento" },
  lectura: { icon: "menu_book", label: "Lectura" },
};

export function DocenteCursoDetalle() {
  const { courseId } = useParams<{ courseId: string }>();

  const course = DOCENTE_COURSES.find((c) => c.id === courseId);
  const modules = courseId ? COURSE_MODULES[courseId] ?? [] : [];
  const allItems = modules.flatMap((m) => m.items);

  const [selectedId, setSelectedId] = useState<string | undefined>(allItems[0]?.id);
  const current = allItems.find((i) => i.id === selectedId) ?? allItems[0];
  const currentModule = modules.find((m) => m.items.some((i) => i.id === current?.id));

  const [expandedWeek, setExpandedWeek] = useState<string | undefined>(currentModule?.id);

  const selectItem = (item: ModuleItem, moduleId: string) => {
    setSelectedId(item.id);
    setExpandedWeek(moduleId);
  };

  if (!course) {
    return (
      <AppShell role="docente" title="Curso no encontrado">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          No se encontró el curso solicitado.
        </p>
      </AppShell>
    );
  }

  return (
    <AppShell role="docente" title={course.name}>
      <Breadcrumbs
        items={[
          { label: "Cursos", to: "/docente/cursos" },
          { label: course.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-gutter items-start">
        {/* Panel principal */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-primary-container bg-primary-fixed px-2.5 py-1 rounded-full mb-2">
                  {course.code}
                </span>
                <h1 className="font-headline-md text-headline-md text-on-background">{course.name}</h1>
              </div>
              <button className="flex items-center gap-1.5 font-label-md text-label-md text-on-surface hover:text-primary-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Editar
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-surface-container-low rounded-lg p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Estudiantes</p>
                <p className="font-headline-sm text-headline-sm text-on-background">{course.students}</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Progreso</p>
                <p className="font-headline-sm text-headline-sm text-on-background">{course.progress}%</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Horario</p>
                <p className="font-label-sm text-label-sm text-on-background">{course.schedule}</p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3">
                <p className="font-label-sm text-label-sm text-on-surface-variant mb-1">Módulos</p>
                <p className="font-headline-sm text-headline-sm text-on-background">{modules.length}</p>
              </div>
            </div>

            {current ? (
              <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-10 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">
                  {TYPE_CONFIG[current.type].icon}
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  {current.title}
                  {current.duration && ` · ${current.duration}`}
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-10 flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">inventory_2</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  Este curso aún no tiene módulos publicados.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel lateral: semanas en acordeón */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/40 flex items-center justify-between">
            <div>
              <h3 className="font-label-md text-label-md text-on-surface">Contenido del curso</h3>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                {modules.length} {modules.length === 1 ? "semana" : "semanas"} · {allItems.length} recursos
              </p>
            </div>
            <button className="flex items-center gap-1 font-label-sm text-label-sm text-primary-container hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[16px]">add</span>
              Agregar
            </button>
          </div>
          <div className="divide-y divide-outline-variant/30 max-h-[560px] overflow-y-auto">
            {modules.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">folder_open</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  No hay módulos todavía
                </p>
              </div>
            ) : (
              modules.map((mod) => {
                const isOpen = expandedWeek === mod.id;
                return (
                  <div key={mod.id}>
                    <button
                      onClick={() => setExpandedWeek(isOpen ? undefined : mod.id)}
                      className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-surface-container-low transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md text-on-surface truncate">{mod.title}</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                          {mod.items.length} {mod.items.length === 1 ? "recurso" : "recursos"}
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
                          {mod.items.map((item) => {
                            const isActive = current?.id === item.id;
                            return (
                              <li key={item.id}>
                                <button
                                  onClick={() => selectItem(item, mod.id)}
                                  className={`w-full flex items-center gap-2.5 pl-5 pr-4 py-2.5 text-left transition-colors ${
                                    isActive
                                      ? "bg-primary-fixed text-primary-container"
                                      : "hover:bg-surface-container-low text-on-surface"
                                  }`}
                                >
                                  <span
                                    className={`material-symbols-outlined text-[18px] shrink-0 ${
                                      isActive ? "text-primary-container" : "text-on-surface-variant"
                                    }`}
                                  >
                                    {TYPE_CONFIG[item.type].icon}
                                  </span>
                                  <span className="font-body-sm text-body-sm truncate flex-1">{item.title}</span>
                                  {item.duration && (
                                    <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">
                                      {item.duration}
                                    </span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
