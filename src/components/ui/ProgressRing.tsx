import type { ReactNode } from "react";

interface ProgressRingProps {
  /** Progreso 0-100. Valores fuera de rango se recortan. */
  readonly value: number;
  /** Diámetro total del anillo en px. */
  readonly size?: number;
  /** Grosor del trazo en px. */
  readonly strokeWidth?: number;
  /** Contenido del centro. Por defecto muestra "{value}%". */
  readonly label?: ReactNode;
  /** Clase de color (texto) para el riel de fondo. */
  readonly trackClassName?: string;
  /** Clase de color (texto) para el arco de progreso. */
  readonly valueClassName?: string;
  /** Clase tipográfica/color para el label central. */
  readonly labelClassName?: string;
}

export function ProgressRing({
  value,
  size = 76,
  strokeWidth = 7,
  label,
  trackClassName = "text-surface-container-high",
  valueClassName = "text-primary-container",
  labelClassName = "font-label-md text-label-md text-on-background",
}: ProgressRingProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${valueClassName} transition-[stroke-dashoffset] duration-500`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={labelClassName}>{label ?? `${clamped}%`}</span>
      </div>
    </div>
  );
}
