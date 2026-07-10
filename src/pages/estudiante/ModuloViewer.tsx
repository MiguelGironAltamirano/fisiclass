import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { EmptyState } from "../../components/ui/EmptyState";
import { ESTUDIANTE_COURSES, COURSE_MODULES } from "../../data/mockData";
import { useModuleProgress } from "../../hooks/useModuleProgress";
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
  const { completedIds, markCompleted } = useModuleProgress(courseId ?? "", modules);

  // Marca automáticamente el ítem como completado en cuanto el estudiante lo visualiza.
  useEffect(() => {
    if (!current) return;
    markCompleted(current.id);
  }, [current?.id, markCompleted]);

  const selectItem = (item: ModuleItem, moduleId: string) => {
    setSelectedId(item.id);
    setExpandedWeek(moduleId);
    navigate(`/estudiante/cursos/${courseId}/modulo/${item.id}`, { replace: true });
  };

  if (!course) {
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

  if (!current) {
    return (
      <AppShell role="estudiante" title={course.name}>
        <Breadcrumbs
          items={[
            { label: "Mis Cursos", to: "/estudiante/cursos" },
            { label: course.name, to: `/estudiante/cursos/${courseId}` },
            { label: "Contenido" },
          ]}
        />
        <EmptyState
          icon="inventory_2"
          title="Sin contenido todavía"
          description="Este curso aún no tiene módulos publicados. Vuelve más adelante."
          action={{ label: "Volver al curso", onClick: () => navigate(`/estudiante/cursos/${courseId}`) }}
        />
      </AppShell>
    );
  }

  const isCompleted = completedIds.has(current.id);

  return (
    <AppShell role="estudiante" title={course.name}>
      <Breadcrumbs
        items={[
          { label: "Mis Cursos", to: "/estudiante/cursos" },
          { label: course.name, to: `/estudiante/cursos/${courseId}` },
          { label: current.title },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-gutter items-start">
        {/* Panel principal de contenido */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span className="inline-flex items-center gap-1.5 font-label-sm text-label-sm text-on-primary-fixed bg-primary-fixed px-2.5 py-1 rounded-full">
                <span className="material-symbols-outlined text-[16px]">{TYPE_CONFIG[current.type].icon}</span>
                {TYPE_CONFIG[current.type].label}
              </span>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-success bg-success/10 px-2.5 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Completado
                </span>
              )}
            </div>
            <h1 className="font-headline-md text-headline-md text-on-background mb-2">{current.title}</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant mb-6">
              {currentModule?.title}
              {current.duration && ` · ${current.duration}`}
              {current.estimatedMinutes && ` · ${current.estimatedMinutes} min estimados`}
            </p>

            <ModuleItemContent item={current} courseColor={course.color} />
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
                          const itemCompleted = completedIds.has(item.id);
                          return (
                            <li key={item.id}>
                              <button
                                onClick={() => selectItem(item, mod.id)}
                                className={`w-full flex items-center gap-2.5 pl-5 pr-4 py-2.5 text-left transition-colors ${
                                  isActive
                                    ? "bg-primary-fixed text-on-primary-fixed"
                                    : "hover:bg-surface-container-low text-on-surface"
                                }`}
                              >
                                <span
                                  className={`material-symbols-outlined text-[18px] shrink-0 ${
                                    isActive
                                      ? "text-on-primary-fixed"
                                      : itemCompleted
                                        ? "text-success"
                                        : "text-on-surface-variant"
                                  }`}
                                >
                                  {!isActive && itemCompleted ? "check_circle" : TYPE_CONFIG[item.type].icon}
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

/** Renderiza el contenido real del ítem según su tipo: video, pdf o lectura. */
function ModuleItemContent({ item, courseColor }: { item: ModuleItem; courseColor: string }) {
  if (item.type === "video" && item.videoUrl) {
    return (
      <div className={`rounded-lg overflow-hidden flex items-center justify-center ${courseColor}`}>
        <video controls className="w-full max-h-[480px] bg-black" src={item.videoUrl}>
          Tu navegador no soporta la reproducción de este video.
        </video>
      </div>
    );
  }

  if (item.type === "pdf" && item.pdfUrl) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-outline-variant/40 overflow-hidden">
          <iframe src={item.pdfUrl} title={item.title} className="w-full h-[65vh] bg-surface-container-low" />
        </div>
        <a
          href={item.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary-container hover:underline"
        >
          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          Abrir en pestaña nueva
        </a>
      </div>
    );
  }

  if (item.type === "lectura" && item.body) {
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-2">
        {item.body.split("\n\n").map((paragraph, idx) => (
          <p key={idx} className="font-body-md text-body-md text-on-surface leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-outline-variant/40 bg-surface-container-low p-10 flex flex-col items-center text-center">
      <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-3">
        {TYPE_CONFIG[item.type].icon}
      </span>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
        Este recurso no tiene contenido disponible por el momento.
      </p>
    </div>
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
