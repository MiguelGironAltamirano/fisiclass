import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { ESTUDIANTE_COURSES, COURSE_MODULES } from "../../data/mockData";
import type { ModuleItem } from "../../types";

const TYPE_CONFIG: Record<ModuleItem["type"], { icon: string; label: string }> = {
  video: { icon: "play_circle", label: "Video" },
  pdf: { icon: "description", label: "Documento" },
  lectura: { icon: "menu_book", label: "Lectura" },
};

export function ModuloViewer() {
  const { courseId, itemId } = useParams<{ courseId: string; itemId: string }>();
  const navigate = useNavigate();

  const course = ESTUDIANTE_COURSES.find((c) => c.id === courseId);
  const modules = courseId ? COURSE_MODULES[courseId] ?? [] : [];
  const allItems = modules.flatMap((m) => m.items);

  const initialItem = allItems.find((i) => i.id === itemId) ?? allItems[0];
  const [selectedId, setSelectedId] = useState(initialItem?.id);
  const current = allItems.find((i) => i.id === selectedId) ?? initialItem;
  const currentModule = modules.find((m) => m.items.some((i) => i.id === current?.id));

  const [expandedWeek, setExpandedWeek] = useState<string | undefined>(currentModule?.id);

  const selectItem = (item: ModuleItem, moduleId: string) => {
    setSelectedId(item.id);
    setExpandedWeek(moduleId);
    navigate(`/estudiante/cursos/${courseId}/modulo/${item.id}`, { replace: true });
  };

  if (!course) {
    return (
      <AppShell role="estudiante" title="Curso no encontrado">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          No se encontró el curso solicitado.
        </p>
      </AppShell>
    );
  }

  if (!current) {
    return (
      <AppShell role="estudiante" title={course.name}>
        <Breadcrumbs items={[{ label: "Mis Cursos", to: "/estudiante/cursos" }, { label: course.name }]} />
        <div className="flex flex-col items-center justify-center text-center py-16">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">inventory_2</span>
          <h3 className="font-headline-sm text-headline-sm text-on-background mb-1">Sin contenido todavía</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm">
            Este curso aún no tiene módulos publicados. Vuelve más adelante.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="estudiante" title={course.name}>
      <Breadcrumbs
        items={[
          { label: "Mis Cursos", to: "/estudiante/cursos" },
          { label: course.name, to: "/estudiante/cursos" },
          { label: currentModule?.title ?? "Módulo" },
          { label: current.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-gutter items-start">
        {/* Panel principal de contenido */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-6 sm:p-8">
            <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-primary-container bg-primary-fixed px-2.5 py-1 rounded-full mb-4">
              <span className="material-symbols-outlined text-[16px]">{TYPE_CONFIG[current.type].icon}</span>
              {TYPE_CONFIG[current.type].label}
            </span>
            <h1 className="font-headline-md text-headline-md text-on-background mb-2">{current.title}</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-6">
              {currentModule?.title}
              {current.duration && ` · ${current.duration}`}
            </p>

            <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-10 flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">
                {TYPE_CONFIG[current.type].icon}
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                El contenido de este {TYPE_CONFIG[current.type].label.toLowerCase()} se mostrará aquí una vez conectado al material del curso.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between px-6 sm:px-8 py-4 border-t border-outline-variant/40 bg-surface-container-low">
            <NavButton
              direction="prev"
              items={allItems}
              currentId={current.id}
              onNavigate={(item) => {
                const mod = modules.find((m) => m.items.some((i) => i.id === item.id));
                if (mod) selectItem(item, mod.id);
              }}
            />
            <NavButton
              direction="next"
              items={allItems}
              currentId={current.id}
              onNavigate={(item) => {
                const mod = modules.find((m) => m.items.some((i) => i.id === item.id));
                if (mod) selectItem(item, mod.id);
              }}
            />
          </div>
        </div>

        {/* Panel lateral: semanas en acordeón */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant/40">
            <h3 className="font-label-md text-label-md text-on-surface">Contenido del curso</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
              {modules.length} {modules.length === 1 ? "semana" : "semanas"} · {allItems.length} recursos
            </p>
          </div>
          <div className="divide-y divide-outline-variant/30 max-h-[560px] overflow-y-auto">
            {modules.map((mod) => {
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
                          const isActive = current.id === item.id;
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
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

interface NavButtonProps {
  readonly direction: "prev" | "next";
  readonly items: readonly ModuleItem[];
  readonly currentId: string;
  readonly onNavigate: (item: ModuleItem) => void;
}

function NavButton({ direction, items, currentId, onNavigate }: NavButtonProps) {
  const idx = items.findIndex((i) => i.id === currentId);
  const target = direction === "prev" ? items[idx - 1] : items[idx + 1];

  if (!target) {
    return <div />;
  }

  return (
    <button
      onClick={() => onNavigate(target)}
      className={`flex items-center gap-1.5 font-label-md text-label-md text-on-surface hover:text-primary-container transition-colors ${
        direction === "next" ? "ml-auto" : ""
      }`}
    >
      {direction === "prev" && <span className="material-symbols-outlined text-[18px]">chevron_left</span>}
      <span className="truncate max-w-[160px]">{target.title}</span>
      {direction === "next" && <span className="material-symbols-outlined text-[18px]">chevron_right</span>}
    </button>
  );
}