import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { ASSIGNMENTS } from "../../data/mockData";
import type { GradeRow } from "../../types";

interface GradeTableProps {
  readonly rows: readonly GradeRow[];
  readonly showStudent: boolean;
  readonly editable?: boolean;
  /** Habilita filas expandibles con feedback y desglose por criterio (uso: vista de estudiante). */
  readonly expandable?: boolean;
}

const STATUS_STYLES: Record<GradeRow["status"], string> = {
  calificado: "bg-success/10 text-success",
  pendiente: "bg-warning/10 text-warning",
  atrasado: "bg-error/10 text-error",
};

const STATUS_LABEL: Record<GradeRow["status"], string> = {
  calificado: "Calificado",
  pendiente: "Pendiente",
  atrasado: "Atrasado",
};

/** Busca en qué curso vive una tarea a partir de su id, para poder enlazar "Ver tarea". */
function findAssignmentCourseId(assignmentId: string): string | undefined {
  for (const [courseId, list] of Object.entries(ASSIGNMENTS)) {
    if (list.some((a) => a.id === assignmentId)) return courseId;
  }
  return undefined;
}

export function GradeTable({ rows, showStudent, editable = false, expandable = false }: GradeTableProps) {
  const [scores, setScores] = useState<Record<string, number | null>>(
    Object.fromEntries(rows.map((r) => [r.id, r.score])),
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const columnCount = (showStudent ? 1 : 0) + 4 + (expandable ? 1 : 0);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-surface-container-low border-b border-outline-variant/50">
          <tr>
            {showStudent && (
              <th className="px-5 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Estudiante</th>
            )}
            <th className="px-5 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Curso</th>
            <th className="px-5 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Actividad</th>
            <th className="px-5 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Nota</th>
            <th className="px-5 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Estado</th>
            {expandable && <th className="px-5 py-3" aria-hidden="true" />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const canExpand = expandable && Boolean(row.feedback || (row.criteria && row.criteria.length > 0));
            const isExpanded = expandable && expandedId === row.id;
            const rowCourseId = row.assignmentId ? findAssignmentCourseId(row.assignmentId) : undefined;

            return (
              <Fragment key={row.id}>
                <tr
                  onClick={canExpand ? () => setExpandedId(isExpanded ? null : row.id) : undefined}
                  className={`border-b border-outline-variant/30 last:border-0 transition-colors ${
                    canExpand ? "cursor-pointer hover:bg-surface-container-low" : "hover:bg-surface-container-low/50"
                  }`}
                >
                  {showStudent && (
                    <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface">{row.student}</td>
                  )}
                  <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface-variant">{row.course}</td>
                  <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface">{row.assignment}</td>
                  <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface" onClick={(e) => e.stopPropagation()}>
                    {editable && scores[row.id] == null ? (
                      <input
                        type="number"
                        min={0}
                        max={row.maxScore}
                        placeholder="—"
                        className="w-16 rounded-md border border-outline-variant px-2 py-1 text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
                        onBlur={(e) => {
                          const val = e.target.value === "" ? null : Number(e.target.value);
                          setScores((prev) => ({ ...prev, [row.id]: val }));
                        }}
                      />
                    ) : (
                      <span>
                        {scores[row.id] ?? "—"}
                        <span className="text-on-surface-variant"> / {row.maxScore}</span>
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`font-label-sm text-label-sm px-2.5 py-1 rounded-full ${STATUS_STYLES[row.status]}`}>
                      {scores[row.id] != null ? STATUS_LABEL.calificado : STATUS_LABEL[row.status]}
                    </span>
                  </td>
                  {expandable && (
                    <td className="px-5 py-3 text-right">
                      {canExpand && (
                        <span
                          className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          expand_more
                        </span>
                      )}
                    </td>
                  )}
                </tr>
                {isExpanded && (
                  <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 last:border-0">
                    <td colSpan={columnCount} className="px-5 py-4">
                      <div className="space-y-3">
                        {row.feedback && (
                          <p className="font-body-sm text-body-sm text-on-surface leading-relaxed">{row.feedback}</p>
                        )}
                        {row.criteria && row.criteria.length > 0 && (
                          <div className="space-y-2">
                            {row.criteria.map((c, idx) => (
                              <div
                                key={idx}
                                className="flex items-start justify-between gap-4 bg-surface-container-lowest rounded-lg border border-outline-variant/30 px-3 py-2.5"
                              >
                                <div className="min-w-0">
                                  <p className="font-label-sm text-label-sm text-on-surface">{c.criterion}</p>
                                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{c.comment}</p>
                                </div>
                                <span className="font-label-md text-label-md text-on-background shrink-0">
                                  {c.score}/{c.maxScore}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {row.assignmentId && rowCourseId && (
                          <Link
                            to={`/estudiante/cursos/${rowCourseId}/tarea/${row.assignmentId}`}
                            className="inline-flex items-center gap-1.5 font-label-md text-label-md text-primary-container hover:underline"
                          >
                            <span className="material-symbols-outlined text-[18px]">assignment</span>
                            Ver tarea
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
