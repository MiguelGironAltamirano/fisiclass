import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

export function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("estudiante");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(role);
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex items-center justify-center p-margin-mobile relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed rounded-full mix-blend-multiply filter blur-[80px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary-fixed rounded-full mix-blend-multiply filter blur-[80px]" />
      </div>
      <main className="w-full max-w-[420px] bg-surface-container-lowest rounded-xl shadow-lg relative z-10 overflow-hidden">
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container mb-4 text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-4xl">school</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary mb-1">Aula Virtual</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Acceso a Educación Superior</p>
        </div>
        <div className="px-8 pb-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <span className="block font-label-md text-label-md text-on-surface mb-1.5">Ingresar como</span>
              <div className="grid grid-cols-2 gap-2 bg-surface-container-low rounded-lg p-1">
                {(["estudiante", "docente"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 rounded-md font-label-md text-label-md capitalize transition-colors ${
                      role === r ? "bg-primary-container text-white shadow-sm" : "text-on-surface-variant"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="email">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@institucion.edu"
                  className="block w-full pl-10 pr-3 py-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                  Contraseña
                </label>
                <a className="font-label-sm text-label-sm text-primary-container hover:text-primary transition-colors" href="#">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
                />
                <button
                  type="button"
                  aria-label="Mostrar contraseña"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-all duration-200"
              >
                Ingresar
              </button>
            </div>
          </form>
        </div>
        <div className="bg-surface-container-low px-8 py-4 border-t border-surface-variant text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            ¿Problemas técnicos? <a className="text-primary-container hover:underline" href="#">Soporte</a>
          </p>
        </div>
      </main>
    </div>
  );
}
