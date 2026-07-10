import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ASSIGNMENTS, ESTUDIANTE_COURSES, NAV_ITEMS } from "../../data/mockData";

interface CommandItem {
  readonly id: string;
  readonly group: string;
  readonly label: string;
  readonly sublabel?: string;
  readonly icon: string;
  readonly path: string;
}

/** Entrada adicional del estudiante: vive solo en el shell de navegación, no en NAV_ITEMS (mockData es de solo lectura). */
const STUDENT_EXTRA_SCREEN: CommandItem = {
  id: "screen-tareas",
  group: "Pantallas",
  label: "Tareas",
  icon: "assignment",
  path: "/estudiante/tareas",
};

interface CommandPaletteProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: readonly CommandItem[] = useMemo(() => {
    if (!role) return [];

    const screens: CommandItem[] = NAV_ITEMS[role].map((item) => ({
      id: `screen-${item.path}`,
      group: "Pantallas",
      label: item.label,
      icon: item.icon,
      path: item.path,
    }));

    if (role === "estudiante") {
      // Inserta "Tareas" justo después de Dashboard, igual que en Sidebar.tsx.
      screens.splice(1, 0, STUDENT_EXTRA_SCREEN);

      const courses: CommandItem[] = ESTUDIANTE_COURSES.map((course) => ({
        id: `curso-${course.id}`,
        group: "Cursos",
        label: course.name,
        sublabel: course.code,
        icon: "school",
        path: `/estudiante/cursos/${course.id}`,
      }));

      const tasks: CommandItem[] = Object.values(ASSIGNMENTS)
        .flat()
        .map((assignment) => {
          const course = ESTUDIANTE_COURSES.find((c) => c.id === assignment.courseId);
          return {
            id: `tarea-${assignment.id}`,
            group: "Tareas",
            label: assignment.title,
            sublabel: course?.name,
            icon: "assignment_turned_in",
            path: `/estudiante/cursos/${assignment.courseId}/tarea/${assignment.id}`,
          };
        });

      return [...screens, ...courses, ...tasks];
    }

    return screens;
  }, [role]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) => item.label.toLowerCase().includes(q) || item.sublabel?.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  useEffect(() => {
    if (open) {
      setQuery("");
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  function commit(item: CommandItem) {
    onOpenChange(false);
    navigate(item.path);
  }

  function handleDialogKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length === 0 ? 0 : (i + 1) % filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (filtered.length === 0 ? 0 : (i - 1 + filtered.length) % filtered.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) commit(item);
    }
  }

  if (!open) return null;

  let groupCursor = "";
  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] bg-black/40 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Paleta de comandos"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleDialogKeyDown}
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-outline-variant/40">
          <span className="material-symbols-outlined text-on-surface-variant shrink-0">search</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar pantallas, cursos o tareas…"
            className="flex-1 bg-transparent outline-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant"
          />
          <kbd className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-high px-1.5 py-0.5 rounded shrink-0">
            Esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-1">
          {filtered.length === 0 && (
            <p className="px-4 py-8 text-center font-body-sm text-body-sm text-on-surface-variant">
              No se encontraron resultados para &ldquo;{query}&rdquo;.
            </p>
          )}
          {filtered.map((item) => {
            flatIndex += 1;
            const isNewGroup = item.group !== groupCursor;
            groupCursor = item.group;
            const isActive = flatIndex === activeIndex;
            return (
              <div key={item.id}>
                {isNewGroup && (
                  <p className="px-4 pt-2.5 pb-1 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
                    {item.group}
                  </p>
                )}
                <button
                  type="button"
                  onMouseEnter={() => setActiveIndex(flatIndex)}
                  onClick={() => commit(item)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    isActive ? "bg-surface-container-high" : "hover:bg-surface-container-low"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px] text-on-surface-variant shrink-0">
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-label-md text-label-md text-on-surface truncate">{item.label}</span>
                    {item.sublabel && (
                      <span className="block font-label-sm text-label-sm text-on-surface-variant truncate">
                        {item.sublabel}
                      </span>
                    )}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
