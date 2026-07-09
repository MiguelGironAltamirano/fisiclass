import { useState } from "react";
import { CURRENT_USER } from "../../data/mockData";
import { useToast } from "../ui/Toast";
import type { Role } from "../../types";


interface ProfileFormProps {
  readonly role: Role;
}

export function ProfileForm({ role }: ProfileFormProps) {
  const user = CURRENT_USER[role];
  const { showToast } = useToast();
  
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [title, setTitle] = useState(user.title);
  
  const [avatarError, setAvatarError] = useState(false);
  const [language, setLanguage] = useState("es");
  const hasChanges =
    name !== user.name || email !== user.email || title !== user.title;

  const save = () => {
    showToast("Perfil actualizado exitosamente", "success");
  };

  const cancel = () => {
    setName(user.name);
    setEmail(user.email);
    setTitle(user.title);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-gutter">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 flex flex-col items-center text-center h-fit">
        <img
          className="w-full h-full object-cover"
          src={avatarError ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff` : user.avatar}
          alt={user.name}
          onError={() => setAvatarError(true)}
        />
        <label className="font-label-md text-label-md text-primary-container hover:underline mb-1 cursor-pointer">
          Cambiar foto
          <input
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={() => showToast("Vista previa no disponible en este prototipo", "info")}
          />
        </label>
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
          <h4 className="font-label-md text-label-md text-on-surface mb-3 mt-4">Preferencias</h4>
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface-variant mb-1.5" htmlFor="language">
              Idioma
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full sm:w-64 border border-outline-variant rounded-lg px-3 py-2.5 font-body-sm text-body-sm bg-surface-container-lowest text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={save}
            disabled={!hasChanges}
            className="bg-primary-container text-white font-label-md text-label-md py-2.5 px-6 rounded-lg hover:bg-primary-container/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar cambios
          </button>
          {hasChanges && (
            <button
              onClick={cancel}
              className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface py-2.5 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}