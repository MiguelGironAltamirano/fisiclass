import { useState } from "react";
import type { Course } from "../../types";

interface NuevoCursoModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onCreate: (course: Course) => void;
}

const COLOR_OPTIONS = [
  { value: "bg-primary-container", label: "Primario" },
  { value: "bg-tertiary", label: "Terciario" },
  { value: "bg-success", label: "Éxito" },
  { value: "bg-warning", label: "Advertencia" },
];

export function NuevoCursoModal({ isOpen, onClose, onCreate }: NuevoCursoModalProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [schedule, setSchedule] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim() || !schedule.trim()) return;

    const newCourse: Course = {
      id: `c${Date.now()}`,
      name: name.trim(),
      code: code.trim(),
      students: 0,
      progress: 0,
      color,
      schedule: schedule.trim(),
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
    };

    onCreate(newCourse);
    setName("");
    setCode("");
    setSchedule("");
    setColor(COLOR_OPTIONS[0].value);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/40 flex items-center justify-between">
          <h2 className="font-headline-sm text-headline-sm text-on-background">Nuevo Curso</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
              Nombre del curso
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Estructura de Datos y Algoritmos"
              className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
              Código del curso
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: ISI-204"
              className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
              Horario
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Ej: Lun / Mié 08:00 - 10:00"
              className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant/40 rounded-lg font-body-sm text-body-sm text-on-background placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary-container transition-colors"
              required
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5">
              Color
            </label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setColor(opt.value)}
                  className={`flex-1 py-2 rounded-lg font-label-sm text-label-sm transition-all ${
                    color === opt.value
                      ? `${opt.value} text-white ring-2 ring-primary ring-offset-2`
                      : "bg-surface-container-high text-on-surface hover:bg-surface-container-highest"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-surface-container-high text-on-surface font-label-md text-label-md rounded-lg hover:bg-surface-container-highest transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-primary-container text-white font-label-md text-label-md rounded-lg hover:bg-primary-container/90 transition-colors"
            >
              Crear Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
