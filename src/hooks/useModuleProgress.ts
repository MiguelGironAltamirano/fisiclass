import { useCallback, useEffect, useState } from "react";
import type { CourseModule } from "../types";

const STORAGE_PREFIX = "aula-virtual-progress-";

function getStorageKey(courseId: string): string {
  return `${STORAGE_PREFIX}${courseId}`;
}

function getDefaultCompleted(modules: readonly CourseModule[]): Set<string> {
  const defaults = modules.flatMap((m) => m.items).filter((i) => i.completed).map((i) => i.id);
  return new Set(defaults);
}

function getInitialCompleted(courseId: string, modules: readonly CourseModule[]): Set<string> {
  const stored = localStorage.getItem(getStorageKey(courseId));
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as unknown;
      if (Array.isArray(parsed)) return new Set(parsed as string[]);
    } catch {
      // Almacenamiento corrupto: se ignora y se usa el valor por defecto de mockData.
    }
  }
  return getDefaultCompleted(modules);
}

/**
 * Progreso de módulos respaldado por localStorage, compartido entre ModuloViewer
 * (marca ítems como completados al visualizarlos) y CursoDetalle (lee el conteo
 * real de completados para el acordeón de contenido). Se inicializa con los
 * ítems `completed: true` de mockData la primera vez que se usa cada curso.
 */
export function useModuleProgress(courseId: string, modules: readonly CourseModule[]) {
  const [completedIds, setCompletedIds] = useState<Set<string>>(() =>
    getInitialCompleted(courseId, modules),
  );

  useEffect(() => {
    localStorage.setItem(getStorageKey(courseId), JSON.stringify(Array.from(completedIds)));
  }, [courseId, completedIds]);

  const markCompleted = useCallback((itemId: string) => {
    setCompletedIds((prev) => {
      if (prev.has(itemId)) return prev;
      const next = new Set(prev);
      next.add(itemId);
      return next;
    });
  }, []);

  const isCompleted = useCallback((itemId: string) => completedIds.has(itemId), [completedIds]);

  return { completedIds, markCompleted, isCompleted };
}
