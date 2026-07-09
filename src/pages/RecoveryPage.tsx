import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RecoveryPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const isValid = EMAIL_REGEX.test(email);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setError("");
    setLoading(true);
    // Simulación de llamada al backend — reemplazar por la petición real
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-margin-mobile bg-[#FDF6E9]">
      <main className="w-full max-w-[420px] bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden">
        <div className="px-8 pt-10 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container mb-4 text-white">
            <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-primary mb-1">Recuperar contraseña</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <div className="px-8 pb-10">
          {sent ? (
            <div className="text-center space-y-4">
              <p className="font-body-sm text-body-sm text-on-surface">
                Si el correo <strong>{email}</strong> está registrado, recibirás un enlace de recuperación en unos minutos.
              </p>
              <Link
                to="/"
                className="inline-block font-label-md text-label-md text-primary-container hover:underline"
              >
                Volver a Iniciar Sesión
              </Link>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1" htmlFor="recovery-email">
                  Correo Electrónico
                </label>
                <input
                  id="recovery-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="tu@institucion.edu"
                  className="block w-full px-3 py-2.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all"
                />
                {error && <p className="font-label-sm text-label-sm text-error mt-1">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={!isValid || loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-lg shadow-sm font-label-md text-label-md text-on-primary bg-primary-container hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-container"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>
              <Link
                to="/"
                className="block text-center font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                Volver a Iniciar Sesión
              </Link>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}