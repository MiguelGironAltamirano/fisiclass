import { useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../hooks/useSidebar";
import type { Role } from "../../types";
import { CommandPalette } from "../ui/CommandPalette";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  readonly role: Role;
  readonly title: string;
  readonly children: ReactNode;
}

export function AppShell({ role, title, children }: AppShellProps) {
  const { collapsed, toggleCollapsed, mobileOpen, toggleMobile, closeMobile } = useSidebar();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const marginClass = collapsed ? "md:ml-sidebar-collapsed" : "md:ml-sidebar-expanded";

  return (
    <div className="flex bg-background min-h-screen text-on-background font-sans">
      <Sidebar
        role={role}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
        onLogout={() => {
          logout();
          navigate("/");
        }}
      />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${marginClass}`}>
        <Header
          role={role}
          title={title}
          onToggleSidebar={toggleCollapsed}
          onToggleMobile={toggleMobile}
          onOpenSearch={() => setPaletteOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop pb-24 md:pb-8">
          <div key={location.pathname} className="page-transition space-y-gutter">
            {children}
          </div>
        </main>
      </div>
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
