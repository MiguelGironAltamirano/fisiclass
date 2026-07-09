import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_USER, NOTIFICATIONS } from "../../data/mockData";
import type { Role } from "../../types";

interface HeaderProps {
  readonly role: Role;
  readonly title: string;
  readonly onToggleSidebar: () => void;
  readonly onToggleMobile: () => void;
}

export function Header({ role, title, onToggleSidebar, onToggleMobile }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const user = CURRENT_USER[role];
  const navigate = useNavigate();

  return (
    <header className="relative flex justify-between items-center px-margin-mobile md:px-margin-desktop w-full bg-surface-container-lowest h-header-height border-b border-outline-variant shrink-0 z-30">
      <div className="flex items-center gap-3">
        <button
          className="md:hidden p-2 text-on-surface-variant"
          aria-label="Abrir menú"
          onClick={onToggleMobile}
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <button
          className="hidden md:flex p-2 text-on-surface-variant hover:text-primary transition-colors"
          aria-label="Colapsar menú"
          onClick={onToggleSidebar}
        >
          <span className="material-symbols-outlined">menu_open</span>
        </button>
        <h2 className="font-label-md text-label-md text-on-surface hidden sm:block">{title}</h2>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative">
          <button
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full relative"
            aria-label="Notificaciones"
            onClick={() => {
              setNotifOpen((v) => !v);
              setProfileOpen(false);
            }}
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/50 font-label-md text-label-md text-on-surface">
                Notificaciones
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {NOTIFICATIONS.map((n) => (
                  <li key={n.id} className="px-4 py-3 hover:bg-surface-container-low transition-colors border-b border-outline-variant/30 last:border-0">
                    <p className="font-body-sm text-body-sm text-on-surface">{n.text}</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">{n.time}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hidden sm:block" aria-label="Ayuda">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="relative">
          <button
            className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant cursor-pointer"
            aria-label="Perfil"
            onClick={() => {
              setProfileOpen((v) => !v);
              setNotifOpen(false);
            }}
          >
            <img className="w-full h-full object-cover" src={user.avatar} alt={user.name} />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/50 overflow-hidden">
              <div className="px-4 py-3 border-b border-outline-variant/50">
                <p className="font-label-md text-label-md text-on-surface truncate">{user.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{user.email}</p>
              </div>
              <button
                className="w-full text-left px-4 py-2.5 font-body-sm text-body-sm text-on-surface hover:bg-surface-container-low transition-colors flex items-center gap-2"
                onClick={() => {
                  setProfileOpen(false);
                  navigate(`/${role}/configuracion`);
                }}
              >
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Configuración
              </button>
              <button
                className="w-full text-left px-4 py-2.5 font-body-sm text-body-sm text-error hover:bg-surface-container-low transition-colors flex items-center gap-2"
                onClick={() => navigate("/")}
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
