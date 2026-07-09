import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { Role } from "../types";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("estudiante");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEmailValid = EMAIL_REGEX.test(email);
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setLoading(true);
    // Simulación de validación con backend — reemplazar por la petición real de autenticación
    setTimeout(() => {
      setLoading(false);
      login(role);
    }, 900);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile relative overflow-hidden bg-[#FDF6E9]">
      <div className="absolute inset-0 pointer-events-none opacity-50">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed rounded-full mix-blend-multiply filter blur-[80px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary-fixed rounded-full mix-blend-multiply filter blur-[80px]" />
      </div>
      <main className="w-full max-w-[420px] bg-surface-container-lowest rounded-xl shadow-lg relative z-10 overflow-hidden">
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container mb-4 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-9 h-9 text-white" fill="currentColor" aria-hidden="true">
              <path d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Zm0 8.18L4.24 8 12 4.82 19.76 8 12 11.18ZM5 12.18V16c0 2.21 3.13 4 7 4s7-1.79 7-4v-3.82l-7 3.18-7-3.18Z" />
            </svg>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary mb-1">Aula Virtual</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Acceso a Educación Superior</p>
        </div>
        <div className="px-8 pb-10">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="tu@institucion.edu"
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-primary-container outline-none transition-all ${
                    email && !isEmailValid ? "border-error focus:border-error" : "border-outline-variant focus:border-primary-container"
                  }`}
                />
              </div>
              {email && !isEmailValid && (
                <p className="font-label-sm text-label-sm text-error mt-1">Ingresa un correo válido.</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">
                  Contraseña
                </label>
                <Link
                  className="font-label-sm text-label-sm text-primary-container hover:text-primary transition-colors"
                  to="/recuperar-password"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-primary-container outline-none transition-all ${
                    password && !isPasswordValid ? "border-error focus:border-error" : "border-outline-variant focus:border-primary-container"
                  }`}
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
              {password && !isPasswordValid && (
                <p className="font-label-sm text-label-sm text-error mt-1">Mínimo 6 caracteres.</p>
              )}
            </div>

            {error && (
              <p className="font-label-sm text-label-sm text-error bg-error/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isFormValid || loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-container"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </div>
          </form>
        </div>
        <div className="bg-surface-container-low px-8 py-4 border-t border-surface-variant text-center">
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            ¿Problemas técnicos? <a className="text-primary-container hover:underline" href="mailto:soporte@institucion.edu">Soporte</a>
          </p>
        </div>
      </main>
    </div>
  );
}