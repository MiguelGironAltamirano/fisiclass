import { useState } from "react";
import { CURRENT_USER } from "../../data/mockData";
import type { Role } from "../../types";

interface ProfileFormProps {
  readonly role: Role;
}

export function ProfileForm({ role }: ProfileFormProps) {
  const user = CURRENT_USER[role];
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-gutter">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 flex flex-col items-center text-center h-fit">
        <img src={user.avatar} alt={name} className="w-24 h-24 rounded-full object-cover mb-4 border border-outline-variant" />
        <button className="font-label-md text-label-md text-primary-container hover:underline mb-1">Cambiar foto</button>
        <p className="font-label-sm text-label-sm text-on-surface-variant">JPG o PNG, máx. 2MB</p>
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 space-y-5">
        <h3 className="font-headline-sm text-headline-sm text-on-background">Información Personal</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">Nombre completo</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">Correo electrónico</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
        </div>
        <div>
          <label className="block font-label-md text-label-md text-on-surface mb-1">
            {role === "docente" ? "Cargo / Facultad" : "Programa académico"}
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
        </div>
        <div className="pt-2 border-t border-outline-variant/50">
          <h4 className="font-label-md text-label-md text-on-surface mb-3 mt-4">Notificaciones</h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-body-sm text-body-sm text-on-surface">Notificarme por correo electrónico</span>
              <input
                type="checkbox"
                checked={notifEmail}
                onChange={(e) => setNotifEmail(e.target.checked)}
                className="w-5 h-5 rounded accent-primary-container"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="font-body-sm text-body-sm text-on-surface">Notificaciones push en el navegador</span>
              <input
                type="checkbox"
                checked={notifPush}
                onChange={(e) => setNotifPush(e.target.checked)}
                className="w-5 h-5 rounded accent-primary-container"
              />
            </label>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            className="bg-primary-container text-white font-label-md text-label-md py-2.5 px-6 rounded-lg hover:bg-primary-container/90 transition-colors"
          >
            Guardar cambios
          </button>
          {saved && <span className="font-label-sm text-label-sm text-success">Cambios guardados</span>}
        </div>
      </div>
    </div>
  );
}
