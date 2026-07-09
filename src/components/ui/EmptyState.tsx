interface EmptyStateProps {
  readonly icon: string;
  readonly title: string;
  readonly description: string;
  readonly action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-20 h-20 rounded-full bg-surface-container-low flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant">{icon}</span>
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-background mb-1">{title}</h3>
      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mb-4">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-primary-container text-white font-label-md text-label-md py-2.5 px-5 rounded-lg hover:bg-primary-container/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}