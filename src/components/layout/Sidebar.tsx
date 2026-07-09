import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "../../data/mockData";
import type { Role } from "../../types";

interface SidebarProps {
  readonly role: Role;
  readonly collapsed: boolean;
  readonly mobileOpen: boolean;
  readonly onCloseMobile: () => void;
  readonly onLogout: () => void;
}

export function Sidebar({ role, collapsed, mobileOpen, onCloseMobile, onLogout }: SidebarProps) {
  const items = NAV_ITEMS[role];
  const width = collapsed ? "w-sidebar-collapsed" : "w-sidebar-expanded";

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onCloseMobile}
        />
      )}
      <nav
        className={`fixed left-0 top-0 z-50 flex h-screen flex-col bg-primary-container shadow-md transition-all duration-300 ${width} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-3 p-6 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
              school
            </span>
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="font-headline-md text-headline-md text-on-primary truncate">Aula Virtual</h1>
              <p className="font-label-sm text-label-sm text-on-primary-container truncate">Educación Superior</p>
            </div>
          )}
        </div>
        <ul className="flex flex-col gap-1 flex-1 px-4 overflow-y-auto">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg mx-2 my-1 transition-colors ${
                    isActive
                      ? "bg-primary text-on-primary"
                      : "text-on-primary-container hover:bg-on-primary-container/10"
                  }`
                }
              >
                <span className="material-symbols-outlined shrink-0">{item.icon}</span>
                {!collapsed && <span className="font-label-md text-label-md truncate">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="p-4 mt-auto">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-4 py-3 text-on-primary-container hover:bg-on-primary-container/10 rounded-lg mx-2 my-1 transition-colors"
          >
            <span className="material-symbols-outlined shrink-0">logout</span>
            {!collapsed && <span className="font-label-md text-label-md">Cerrar Sesión</span>}
          </button>
        </div>
      </nav>
    </>
  );
}
