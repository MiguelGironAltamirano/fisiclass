import { Link } from "react-router-dom";

interface Crumb {
  label: string;
  to?: string;
}

interface BreadcrumbsProps {
  readonly items: readonly Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center flex-wrap gap-1 font-label-sm text-label-sm text-on-surface-variant">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1">
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-on-surface font-medium" : ""}>{item.label}</span>
              )}
              {!isLast && <span className="material-symbols-outlined text-[16px]">chevron_right</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}