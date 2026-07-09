import { useState } from "react";
import type { GradeRow } from "../../types";

interface GradeTableProps {
  readonly rows: readonly GradeRow[];
  readonly showStudent: boolean;
  readonly editable?: boolean;
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

export function GradeTable({ rows, showStudent, editable = false }: GradeTableProps) {
  const [scores, setScores] = useState<Record<string, number | null>>(
    Object.fromEntries(rows.map((r) => [r.id, r.score])),
  );

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
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low/50 transition-colors">
              {showStudent && (
                <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface">{row.student}</td>
              )}
              <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface-variant">{row.course}</td>
              <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface">{row.assignment}</td>
              <td className="px-5 py-3 font-body-sm text-body-sm text-on-surface">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
