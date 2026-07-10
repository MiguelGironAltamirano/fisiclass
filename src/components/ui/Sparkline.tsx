import { useMemo, useRef, useState } from "react";

export interface SparklinePoint {
  readonly value: number;
  /** Etiqueta corta mostrada en el tooltip, ej. nombre de la actividad. */
  readonly label: string;
}

interface SparklineProps {
  readonly data: readonly SparklinePoint[];
  readonly width?: number;
  readonly height?: number;
  /** Clase de color (texto) aplicada a la línea, el punto final y el área. Serie única: un solo matiz. */
  readonly colorClassName?: string;
  readonly showArea?: boolean;
  readonly ariaLabel: string;
}

const PADDING_X = 6;
const PADDING_Y = 8;

export function Sparkline({
  data,
  width = 280,
  height = 72,
  colorClassName = "text-primary-container",
  showArea = true,
  ariaLabel,
}: SparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = useMemo(() => {
    if (data.length === 0) return [];
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const innerWidth = width - PADDING_X * 2;
    const innerHeight = height - PADDING_Y * 2;
    const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;

    return data.map((d, i) => ({
      x: PADDING_X + step * i,
      y: PADDING_Y + innerHeight * (1 - (d.value - min) / range),
      value: d.value,
      label: d.label,
    }));
  }, [data, width, height]);

  if (points.length === 0) {
    return (
      <div
        className="flex items-center justify-center font-body-sm text-body-sm text-on-surface-variant"
        style={{ width, height }}
      >
        Sin datos suficientes
      </div>
    );
  }

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${height - PADDING_Y} L${points[0].x},${height - PADDING_Y} Z`;
  const last = points[points.length - 1];
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  function handleMove(clientX: number) {
    const svg = svgRef.current;
    if (!svg || points.length === 0) return;
    const rect = svg.getBoundingClientRect();
    const relativeX = ((clientX - rect.left) / rect.width) * width;
    let nearest = 0;
    let nearestDist = Infinity;
    points.forEach((p, i) => {
      const dist = Math.abs(p.x - relativeX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  return (
    <div className="relative" style={{ width, height }}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={ariaLabel}
        className="block"
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {showArea && (
          <path d={areaPath} fill="currentColor" opacity={0.1} className={colorClassName} />
        )}
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className={colorClassName}
        />
        {hovered && (
          <line
            x1={hovered.x}
            x2={hovered.x}
            y1={PADDING_Y}
            y2={height - PADDING_Y}
            className="stroke-outline-variant"
            strokeWidth={1}
          />
        )}
        {/* Punto final destacado */}
        <circle
          cx={last.x}
          cy={last.y}
          r={5}
          fill="currentColor"
          className={`stroke-surface-container-lowest ${colorClassName}`}
          strokeWidth={2}
        />
        {hovered && hoverIndex !== points.length - 1 && (
          <circle
            cx={hovered.x}
            cy={hovered.y}
            r={4}
            fill="currentColor"
            className={`stroke-surface-container-lowest ${colorClassName}`}
            strokeWidth={2}
          />
        )}
      </svg>
      {hovered && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-surface-container-highest px-2.5 py-1.5 shadow-md border border-outline-variant/40 whitespace-nowrap z-10"
          style={{ left: hovered.x, top: Math.max(0, hovered.y - 10) }}
        >
          <p className="font-label-sm text-label-sm text-on-surface">{hovered.value}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant truncate max-w-[160px]">{hovered.label}</p>
        </div>
      )}
    </div>
  );
}
