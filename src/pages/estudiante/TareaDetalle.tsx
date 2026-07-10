import { useEffect, useRef, useState, type DragEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { EmptyState } from "../../components/ui/EmptyState";
import { useToast } from "../../components/ui/Toast";
import { ASSIGNMENTS, ESTUDIANTE_COURSES } from "../../data/mockData";
import type { AssignmentGrade, AssignmentStatus, RubricCriterion } from "../../types";

const STATUS_STYLES: Record<AssignmentStatus, string> = {
  calificado: "bg-success/10 text-success",
  entregado: "bg-primary-fixed text-on-primary-fixed",
  pendiente: "bg-warning/10 text-warning",
};

const STATUS_LABEL: Record<AssignmentStatus, string> = {
  calificado: "Calificado",
  entregado: "Entregado",
  pendiente: "Pendiente",
};

const EXT_ICONS: Record<string, string> = {
  pdf: "picture_as_pdf",
  doc: "description",
  docx: "description",
  zip: "folder_zip",
  rar: "folder_zip",
  ppt: "slideshow",
  pptx: "slideshow",
  xls: "table_chart",
  xlsx: "table_chart",
};

function getExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(idx + 1).toLowerCase() : "";
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" });
}

/** Días restantes hasta la fecha límite (negativo si ya venció). */
function daysUntil(iso: string): number {
  const due = new Date(`${iso}T23:59:59`).getTime();
  return Math.ceil((due - Date.now()) / (1000 * 60 * 60 * 24));
}

export function TareaDetalle() {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const course = ESTUDIANTE_COURSES.find((c) => c.id === courseId);
  const assignment = courseId ? ASSIGNMENTS[courseId]?.find((a) => a.id === assignmentId) : undefined;

  const [status, setStatus] = useState<AssignmentStatus | undefined>(assignment?.status);
  const [submittedFile, setSubmittedFile] = useState<{ name: string; size: number; date: string } | null>(null);

  if (!course || !assignment || !courseId) {
    return (
      <AppShell role="estudiante" title="Tarea no encontrada">
        <Breadcrumbs items={[{ label: "Mis Cursos", to: "/estudiante/cursos" }, { label: "Tarea no encontrada" }]} />
        <EmptyState
          icon="assignment"
          title="Tarea no encontrada"
          description="Esta tarea no existe o ya no está disponible en tu curso."
          action={{
            label: "Volver al curso",
            onClick: () => navigate(courseId ? `/estudiante/cursos/${courseId}` : "/estudiante/cursos"),
          }}
        />
      </AppShell>
    );
  }

  const remaining = daysUntil(assignment.dueDate);
  const isOverdue = remaining < 0;
  const isNear = remaining >= 0 && remaining <= 3;
  const effectiveStatus = status ?? assignment.status;

  return (
    <AppShell role="estudiante" title={course.name}>
      <Breadcrumbs
        items={[
          { label: "Mis Cursos", to: "/estudiante/cursos" },
          { label: course.name, to: `/estudiante/cursos/${courseId}` },
          { label: assignment.title },
        ]}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <h1 className="font-headline-md text-headline-md text-on-background">{assignment.title}</h1>
          <span
            className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full shrink-0 ${STATUS_STYLES[effectiveStatus]}`}
          >
            {STATUS_LABEL[effectiveStatus]}
          </span>
        </div>
        <div className="flex items-center gap-4 flex-wrap font-body-sm text-body-sm">
          <span
            className={`inline-flex items-center gap-1.5 ${
              isOverdue ? "text-error" : isNear ? "text-warning" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">event</span>
            Vence: {formatDate(assignment.dueDate)}
            {isOverdue && " · Vencida"}
            {isNear && !isOverdue && " · Próxima a vencer"}
          </span>
          <span className="inline-flex items-center gap-1.5 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">grade</span>
            {assignment.points} pts
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-gutter items-start">
        <div className="space-y-5">
          <InstructionsCard instructions={assignment.instructions} />

          {effectiveStatus === "pendiente" && (
            <SubmissionZone
              acceptedFormats={assignment.acceptedFormats}
              onSubmitted={(file) => {
                setSubmittedFile({
                  name: file.name,
                  size: file.size,
                  date: new Date().toLocaleDateString("es-PE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                });
                setStatus("entregado");
                showToast("Entrega enviada correctamente", "success");
              }}
            />
          )}

          {effectiveStatus === "entregado" && <SubmittedSummary file={submittedFile} />}

          {effectiveStatus === "calificado" && assignment.grade && (
            <GradeSummary grade={assignment.grade} rubric={assignment.rubric} maxPoints={assignment.points} />
          )}
        </div>

        <RubricPanel rubric={assignment.rubric} />
      </div>
    </AppShell>
  );
}

/* ------------------------------------------------------------------ */
/* Instrucciones                                                       */
/* ------------------------------------------------------------------ */

function InstructionsCard({ instructions }: { instructions: string }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8">
      <h2 className="font-headline-sm text-headline-sm text-on-background mb-3">Instrucciones</h2>
      <div className="space-y-3">
        {instructions.split("\n\n").map((paragraph, idx) => (
          <p key={idx} className="font-body-md text-body-md text-on-surface leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Rúbrica                                                              */
/* ------------------------------------------------------------------ */

function RubricPanel({ rubric }: { rubric: readonly RubricCriterion[] }) {
  if (rubric.length === 0) return null;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
      <div className="px-5 py-4 border-b border-outline-variant/40">
        <h3 className="font-label-md text-label-md text-on-surface">Rúbrica de evaluación</h3>
      </div>
      <div className="divide-y divide-outline-variant/30">
        {rubric.map((crit) => (
          <div key={crit.id} className="px-5 py-4">
            <div className="flex items-center justify-between mb-2.5">
              <p className="font-label-md text-label-md text-on-surface">{crit.name}</p>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{crit.points} pts</span>
            </div>
            <ul className="space-y-2">
              {crit.levels.map((level, idx) => (
                <li key={idx} className="flex items-start gap-2.5 bg-surface-container-low rounded-lg px-3 py-2">
                  <span className="font-label-sm text-label-sm text-primary-container shrink-0 w-6 text-right">
                    {level.points}
                  </span>
                  <div className="min-w-0">
                    <p className="font-label-sm text-label-sm text-on-surface">{level.label}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{level.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Zona de entrega drag & drop                                         */
/* ------------------------------------------------------------------ */

interface SubmissionZoneProps {
  readonly acceptedFormats: readonly string[];
  readonly onSubmitted: (file: File) => void;
}

function SubmissionZone({ acceptedFormats, onSubmitted }: SubmissionZoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Limpieza del intervalo de progreso simulado si el componente se desmonta a mitad de la subida.
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const validate = (candidate: File): string | null => {
    const ext = getExtension(candidate.name);
    if (!acceptedFormats.includes(ext)) {
      return `Formato no permitido (.${ext || "?"}). Formatos aceptados: ${acceptedFormats
        .map((f) => `.${f}`)
        .join(", ")}.`;
    }
    return null;
  };

  const handleFile = (candidate: File) => {
    const validationError = validate(candidate);
    if (validationError) {
      setError(validationError);
      setFile(null);
      return;
    }
    setError(null);
    setFile(candidate);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const startUpload = () => {
    if (!file) return;
    setProgress(0);
    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev === null) return prev;
        const next = prev + 10;
        if (next >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          onSubmitted(file);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8">
      <h2 className="font-headline-sm text-headline-sm text-on-background mb-1">Entrega tu trabajo</h2>
      <p className="font-label-sm text-label-sm text-on-surface-variant mb-4">
        Formatos aceptados: {acceptedFormats.map((f) => `.${f}`).join(", ")}
      </p>

      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl py-12 px-6 cursor-pointer transition-colors ${
            dragOver
              ? "border-primary-container bg-primary-fixed/40"
              : "border-outline-variant hover:border-primary-container/60 hover:bg-surface-container-low"
          }`}
        >
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">upload_file</span>
          <p className="font-label-md text-label-md text-on-surface">Arrastra tu archivo aquí o haz clic para elegirlo</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
            {acceptedFormats.map((f) => `.${f}`).join(" · ")}
          </p>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];
              if (selected) handleFile(selected);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {error && (
        <p className="mt-3 flex items-center gap-1.5 font-body-sm text-body-sm text-error">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </p>
      )}

      {file && (
        <div className="border border-outline-variant/40 rounded-xl p-4 flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl text-primary-container shrink-0">
            {EXT_ICONS[getExtension(file.name)] ?? "insert_drive_file"}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-label-md text-label-md text-on-surface truncate">{file.name}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">{formatFileSize(file.size)}</p>
            {progress !== null && (
              <div className="mt-2">
                <div className="h-1.5 w-full rounded-full bg-surface-container-high overflow-hidden">
                  <div
                    className="h-full bg-primary-container transition-[width] duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
                  {progress < 100 ? `Subiendo... ${progress}%` : "Entrega completa"}
                </p>
              </div>
            )}
          </div>
          {progress === null && (
            <button
              onClick={() => {
                setFile(null);
                setError(null);
              }}
              className="p-1.5 rounded-full hover:bg-surface-container-low text-on-surface-variant shrink-0"
              aria-label="Quitar archivo"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>
      )}

      {file && progress === null && (
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 bg-primary-container text-white font-label-md text-label-md py-2.5 px-5 rounded-lg hover:bg-primary-container/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Enviar entrega
          </button>
        </div>
      )}

      {showConfirm && (
        <ConfirmDialog
          title="¿Enviar entrega?"
          message="No podrás modificarla después de enviarla."
          confirmLabel="Enviar"
          onConfirm={() => {
            setShowConfirm(false);
            startUpload();
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: {
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onCancel}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-6 max-w-sm w-full"
      >
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-2">{title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="font-label-md text-label-md text-on-surface-variant px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="bg-primary-container text-white font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container/90 transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Estados: entregado / calificado                                     */
/* ------------------------------------------------------------------ */

function SubmittedSummary({ file }: { file: { name: string; size: number; date: string } | null }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="material-symbols-outlined text-success text-[22px]">check_circle</span>
        <h2 className="font-headline-sm text-headline-sm text-on-background">Entrega registrada</h2>
      </div>
      {file ? (
        <div className="flex items-center gap-3 border border-outline-variant/40 rounded-xl p-4">
          <span className="material-symbols-outlined text-3xl text-primary-container shrink-0">
            {EXT_ICONS[getExtension(file.name)] ?? "insert_drive_file"}
          </span>
          <div className="min-w-0">
            <p className="font-label-md text-label-md text-on-surface truncate">{file.name}</p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              {formatFileSize(file.size)} · Enviado el {file.date}
            </p>
          </div>
        </div>
      ) : (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Tu entrega fue registrada correctamente. Está a la espera de calificación por parte del docente.
        </p>
      )}
    </div>
  );
}

function GradeSummary({
  grade,
  rubric,
  maxPoints,
}: {
  readonly grade: AssignmentGrade;
  readonly rubric: readonly RubricCriterion[];
  readonly maxPoints: number;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8">
      <div className="flex items-center gap-4 mb-4">
        <p className="font-headline-lg text-headline-lg text-on-background shrink-0">
          {grade.score}
          <span className="font-label-md text-label-md text-on-surface-variant">/{maxPoints}</span>
        </p>
        <div>
          <h2 className="font-headline-sm text-headline-sm text-on-background">Calificación</h2>
          <p className="font-label-sm text-label-sm text-on-surface-variant">Retroalimentación del docente</p>
        </div>
      </div>
      <p className="font-body-md text-body-md text-on-surface leading-relaxed mb-5">{grade.feedback}</p>
      <div className="space-y-2.5">
        {grade.criteria.map((fc) => {
          const crit = rubric.find((r) => r.id === fc.criterionId);
          return (
            <div
              key={fc.criterionId}
              className="flex items-start justify-between gap-4 bg-surface-container-low rounded-lg px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-label-md text-label-md text-on-surface">{crit?.name ?? fc.criterionId}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{fc.comment}</p>
              </div>
              <span className="font-label-md text-label-md text-on-background shrink-0">
                {fc.score}/{crit?.points ?? "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
