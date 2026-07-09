import { AppShell } from "../../components/layout/AppShell";
import { ProfileForm } from "../../components/ui/ProfileForm";

export function ConfigPerfilDocente() {
  return (
    <AppShell role="docente" title="Configuración de Perfil">
      <div className="mb-8">
        <h2 className="font-headline-lg text-headline-lg text-on-background mb-2">Configuración de Perfil</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Actualiza tu información personal y preferencias de notificación.
        </p>
      </div>
      <ProfileForm role="docente" />
    </AppShell>
  );
}
