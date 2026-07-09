import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardDocente } from "./pages/docente/DashboardDocente";
import { GestionCursos } from "./pages/docente/GestionCursos";
import { CalendarioDocente } from "./pages/docente/CalendarioDocente";
import { PanelCalificaciones } from "./pages/docente/PanelCalificaciones";
import { MensajeriaAnuncios } from "./pages/docente/MensajeriaAnuncios";
import { ConfigPerfilDocente } from "./pages/docente/ConfigPerfilDocente";
import { DashboardEstudiante } from "./pages/estudiante/DashboardEstudiante";
import { MisCursos } from "./pages/estudiante/MisCursos";
import { CalendarioAcademico } from "./pages/estudiante/CalendarioAcademico";
import { MisCalificaciones } from "./pages/estudiante/MisCalificaciones";
import { MensajesInternos } from "./pages/estudiante/MensajesInternos";
import { ConfigPerfil } from "./pages/estudiante/ConfigPerfil";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route path="/docente/dashboard" element={<DashboardDocente />} />
      <Route path="/docente/cursos" element={<GestionCursos />} />
      <Route path="/docente/calendario" element={<CalendarioDocente />} />
      <Route path="/docente/calificaciones" element={<PanelCalificaciones />} />
      <Route path="/docente/mensajes" element={<MensajeriaAnuncios />} />
      <Route path="/docente/configuracion" element={<ConfigPerfilDocente />} />

      <Route path="/estudiante/dashboard" element={<DashboardEstudiante />} />
      <Route path="/estudiante/cursos" element={<MisCursos />} />
      <Route path="/estudiante/calendario" element={<CalendarioAcademico />} />
      <Route path="/estudiante/calificaciones" element={<MisCalificaciones />} />
      <Route path="/estudiante/mensajes" element={<MensajesInternos />} />
      <Route path="/estudiante/configuracion" element={<ConfigPerfil />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
