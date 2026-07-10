import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_USER, NOTIFICATIONS } from "../../data/mockData";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import type { Role } from "../../types";

interface HeaderProps {
  readonly role: Role;
  readonly title: string;
  readonly onToggleSidebar: () => void;
  readonly onToggleMobile: () => void;
  readonly onOpenSearch: () => void;
}

export function Header({ role, title, onToggleSidebar, onToggleMobile, onOpenSearch }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [unreadCount, setUnreadCount] = useState(NOTIFICATIONS.length);
  const user = CURRENT_USER[role];
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();

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
      <div className="flex-1 flex justify-center px-4">
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Buscar"
          className="hidden sm:flex items-center gap-2 w-full max-w-72 px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] shrink-0">search</span>
          <span className="font-body-sm text-body-sm truncate">Buscar…</span>
          <kbd className="ml-auto font-label-sm text-label-sm bg-surface-container-high px-1.5 py-0.5 rounded shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button
          className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full"
          aria-label={theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
          onClick={toggleTheme}
        >
          <span className="material-symbols-outlined">
            {theme === "light" ? "dark_mode" : "light_mode"}
          </span>
        </button>
        <div className="relative">
          <button
            className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full relative"
            aria-label="Notificaciones"
            onClick={() => {
              setNotifOpen((v) => {
                const next = !v;
                if (next) setUnreadCount(0);
                return next;
              });
              setProfileOpen(false);
            }}
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center bg-error text-on-error font-label-sm text-[10px] leading-none rounded-full">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
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
        <button
          className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hidden sm:block"
          aria-label="Ayuda"
          onClick={() => window.open("https://soporte.institucion.edu", "_blank", "noopener,noreferrer")}
        >
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
            <img
              className="w-full h-full object-cover"
              src={avatarError ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff` : user.avatar}
              alt={user.name}
              onError={() => setAvatarError(true)}
            />
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
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                  navigate("/");
                }}
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