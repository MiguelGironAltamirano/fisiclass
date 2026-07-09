import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../hooks/useSidebar";
import type { Role } from "../../types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  readonly role: Role;
  readonly title: string;
  readonly children: ReactNode;
}

export function AppShell({ role, title, children }: AppShellProps) {
  const { collapsed, toggleCollapsed, mobileOpen, toggleMobile, closeMobile } = useSidebar();
  const navigate = useNavigate();
  const marginClass = collapsed ? "md:ml-sidebar-collapsed" : "md:ml-sidebar-expanded";

  return (
    <div className="flex bg-background min-h-screen text-on-background font-sans">
      <Sidebar
        role={role}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={closeMobile}
        onLogout={() => navigate("/")}
      />
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${marginClass}`}>
        <Header role={role} title={title} onToggleSidebar={toggleCollapsed} onToggleMobile={toggleMobile} />
        <main className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop space-y-gutter pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
