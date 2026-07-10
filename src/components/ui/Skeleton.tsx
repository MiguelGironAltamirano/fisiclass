interface SkeletonProps {
  /** Controla tamaño, forma y radio — debe imitar la geometría del contenido real. */
  readonly className?: string;
}

/** Bloque de carga con pulso sutil. El consumidor define ancho/alto/radio vía className. */
export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-lg bg-surface-container-high ${className}`} aria-hidden="true" />;
}
