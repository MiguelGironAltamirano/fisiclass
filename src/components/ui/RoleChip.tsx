import type { ForumAuthorRole } from "../../types";

interface RoleChipProps {
  readonly role: ForumAuthorRole;
}

/** Chip de rol para foros: distingue visualmente a un docente de un estudiante. */
export function RoleChip({ role }: RoleChipProps) {
  const isDocente = role === "docente";
  return (
    <span
      className={`inline-flex items-center gap-1 font-label-sm text-label-sm px-2 py-0.5 rounded-full shrink-0 ${
        isDocente ? "bg-primary-container text-white" : "bg-surface-container-high text-on-surface-variant"
      }`}
    >
      {isDocente && (
        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          verified
        </span>
      )}
      {isDocente ? "Docente" : "Estudiante"}
    </span>
  );
}
