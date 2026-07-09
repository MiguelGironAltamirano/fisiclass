interface StatCardProps {
  readonly icon: string;
  readonly iconBg: string;
  readonly iconColor: string;
  readonly value: string;
  readonly label: string;
  readonly badge?: string;
  readonly actionLabel: string;
  readonly actionIcon: string;
  readonly onAction?: () => void;
  readonly variant?: "primary" | "outline" | "ghost";
}

export function StatCard({
  icon,
  iconBg,
  iconColor,
  value,
  label,
  badge,
  actionLabel,
  actionIcon,
  onAction,
  variant = "outline",
}: StatCardProps) {
  const buttonClass =
    variant === "primary"
      ? "bg-primary-container text-white hover:bg-primary-container/90"
      : variant === "outline"
        ? "bg-transparent border border-primary-container text-primary-container hover:bg-primary-fixed/30"
        : "bg-transparent border border-outline-variant text-on-surface-variant hover:bg-surface-container-high";

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 border border-outline-variant/30 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg ${iconBg} ${iconColor} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            {icon}
          </span>
        </div>
        {badge && (
          <span className="bg-warning text-white font-label-sm text-label-sm px-2 py-1 rounded-full">{badge}</span>
        )}
      </div>
      <div>
        <h3 className="font-headline-md text-headline-md text-on-background font-bold">{value}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">{label}</p>
      </div>
      <button
        onClick={onAction}
        className={`w-full font-label-md text-label-md py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 ${buttonClass}`}
      >
        <span>{actionLabel}</span>
        <span className="material-symbols-outlined text-sm">{actionIcon}</span>
      </button>
    </div>
  );
}
