# PLAN — Aula Virtual (fisiclass)

> Revisión integral del prototipo frente a `DESCRIPTION.md` / `DESIGN.md`, detección de fallas
> generales, imágenes faltantes y hoja de ruta para diferenciar la interfaz de Moodle.
> Fecha de revisión inicial: **2026-07-08**. **Actualizado: 2026-07-09** (estado real de
> Fases 0, 1, 2, 4 y 5; Fase 3 — docente — excluida del alcance por decisión del 2026-07-10).

---

## 1. Estado general del proyecto

Stack: **React 19 + Vite 8 + TypeScript + React Router 7 + Tailwind v4** (tema Material 3 vía tokens en `src/index.css`).

El prototipo cubre hoy la **cáscara de navegación (AppShell)** con 6-7 secciones por rol
(Dashboard, Cursos, Tareas —solo estudiante—, Calendario, Calificaciones, Mensajes, Configuración)
más el **drill-down completo del curso** (`CursoDetalle → ModuloViewer → TareaDetalle →
QuizEngine → ForoTopic`), que era el gran vacío detectado en la revisión inicial. Todo el lado
**estudiante** del inventario de `DESCRIPTION.md` / `DESIGN.md` está implementado con datos
`mock`, persistencia de sesión y guardas de ruta.

El lado **docente** (Fase 3: constructor de curso, creador de tareas/exámenes, panel de
calificación *split view*, roster de alumnos, reportes) queda **explícitamente fuera de
alcance** por decisión del 2026-07-10 — no se implementa en esta iteración del prototipo.

Veredicto: **núcleo del estudiante completo y pulido; lado docente pendiente y diferido a
propósito.**

---

## 2. Fallas generales detectadas (estado tras revisión 2026-07-09)

### 2.1 Imágenes faltantes / rotas
- [x] **Avatar del estudiante** — resuelto: `mockData.ts` usa URLs reales (`i.pravatar.cc`,
  `googleusercontent`), y `Header`/`ProfileForm` tienen fallback `onError` a `ui-avatars.com`.
- [x] **Restos del template Vite** (`hero.png`, `react.svg`, `vite.svg`, `App.css`) — eliminados;
  `src/assets` está vacío.
- [ ] **Login sin identidad visual fuerte** — sigue solo con ícono `school` + blobs decorativos
  (`bg-primary-fixed`/`bg-secondary-fixed`); no hay logo/isotipo institucional real. Pendiente,
  no crítico para el prototipo.
- [x] **`CourseCard` tapa la foto** — resuelto: el overlay ahora es `opacity-20` (antes `opacity-70`);
  la imagen del curso es visible.
- [x] **Estados vacíos** — implementados con `EmptyState` (icono + título + descripción + acción)
  en cursos, tareas, calificaciones, foros, calendario, etc. Son *icon-based*, no ilustraciones
  a medida — suficiente para el prototipo, se deja anotado por si se quiere pulir más adelante.
- [~] **Dependencia de imágenes externas** — mitigado parcialmente: avatares tienen `onError`
  fallback (`Header`, `ProfileForm`); las portadas de curso (`CourseCard`) siguen sin fallback
  explícito si la imagen no carga. Pendiente menor.

### 2.2 Bugs y elementos no funcionales
- [x] **Recuperación de contraseña** — implementada en `src/pages/RecoveryPage.tsx`
  (`/recuperar-password`), ya no es un enlace muerto.
- [ ] **Login: heurísticas del `DESIGN.md`** — sigue pendiente validar y deshabilitar el botón
  "Ingresar" hasta correo+contraseña válidos, *spinner* de carga y error en línea.
- [x] **Calendario** — `CalendarGrid` ya tiene navegación de mes (`chevron_left/right` funcional)
  y alterna entre vista **mensual** y **semanal** (`ViewMode`).
- [x] **Botones antes muertos** — "Cambiar foto" (perfil) sube y previsualiza un archivo real
  (con revocación de `blob:` URL); "Soporte" (login) abre `mailto:`; "Nuevo Curso" (docente)
  muestra un toast honesto ("aún no disponible en este prototipo") en vez de no hacer nada;
  el botón de ayuda del header abre una URL de soporte; la campana de notificaciones despliega
  la lista real y limpia el contador de no leídas al abrir.
- [x] **Modo oscuro/claro** — implementado (`useTheme`, toggle en `Header`, persistido en
  `localStorage`, respeta `prefers-color-scheme` como valor inicial).
- [~] **Idioma** — `ProfileForm` tiene selector de idioma (es/en) persistido en estado local del
  formulario; es un *mock* visual, no hay i18n real de textos de la app. Suficiente para el
  prototipo.
- [x] **Guardas de ruta / autenticación** — `PrivateRoute` protege `/docente/*` y `/estudiante/*`
  por rol; `useAuth` persiste el rol en `localStorage` (clave `aula-virtual-role`) y `logout()`
  la limpia correctamente, de modo que refrescar sin sesión en una ruta protegida redirige al
  login.
- [x] **Perfil: "Cancelar/Deshacer"** — implementado junto con el *toast* de guardado
  (`useToast`); ya no usa texto inline.
- [x] **Bug visual en `CalendarGrid`** (puntos de "Próximos eventos" casi invisibles) — corregido,
  usa color sólido (`TYPE_DOT_COLOR`) en vez del token con opacidad 10%.
- [x] **Breadcrumbs** — implementados (`Breadcrumbs`) en `ModuloViewer`, `CursoDetalle`,
  `TareaDetalle`, `QuizEngine`, `ForoTopic`.
- [x] **Toasts globales** — `ToastProvider`/`useToast` implementado y en uso (perfil, mensajes,
  anuncios, acciones docente stub).

### 2.3 Higiene del repositorio
- [x] **`src/App.css`, `react.svg`, `vite.svg`, `hero.png`** — eliminados.
- [x] **`README.md`** — reescrito, describe el proyecto real (LMS/aula virtual, stack, flujos).
- [x] **`.stitch` ignorado en git** (en `.gitignore`).
- [x] **`DESCRIPTION.md` y `DESIGN.md` diferenciados** — ya no son idénticos (127 vs. 156 líneas);
  `DESIGN.md` contiene el sistema de diseño.

---

## 3. Cobertura frente a `DESCRIPTION.md` / `DESIGN.md`

### 3.1 Inventario de Pantallas (actualizado 2026-07-09)

**Vistas Comunes (Transversales)**

| Pantalla | Estado | Nota |
|---|---|---|
| Auth_Login | ✅ Hecho | Falta validación de campos, botón deshabilitado y spinner |
| Auth_Recovery | ✅ Hecho | `RecoveryPage` (correo → confirmación) |
| Global_Dashboard_Selector | ✅ Decisión tomada | No hay pantalla dedicada a propósito: se resuelve con el toggle de rol en el login (no es un pendiente, es el diseño elegido) |
| User_Profile | ✅ Hecho | Falta i18n real (el selector de idioma es mock visual) |
| Global_Inbox | ✅ Hecho | `MessagesPanel` funcional (envía en local) |
| Global_Calendar | ✅ Hecho | Mensual + semanal, navegación de mes funcional |

**Vistas del Estudiante**

| Pantalla | Estado | Nota |
|---|---|---|
| Student_Dashboard | ✅ Hecho | Dataviz (ProgressRing, Sparkline, barras), gamificación, skeletons |
| Student_CourseList | ✅ Hecho | `MisCursos` |
| Student_CourseDetail | ✅ Hecho | `CursoDetalle`: sílabo, anuncios, progreso, acordeón de módulos, tabs |
| Student_ModuleViewer | ✅ Hecho | `ModuloViewer`: video, PDF, lectura + breadcrumbs + progreso persistido |
| Student_AssignmentDetail | ✅ Hecho | `TareaDetalle`: instrucciones, rúbrica, *drag & drop* de entrega |
| Student_QuizEngine | ✅ Hecho | `QuizEngine`: temporizador, navegador de preguntas, autoguardado simulado, alerta de faltantes |
| Student_GradesBook | ✅ Hecho | `MisCalificaciones` con `GradeTable` expandible (drill-down de feedback por criterio) |
| Student_ForumTopic | ✅ Hecho | `ForoTopic`: hilo con respuestas |

**Vistas del Docente**

| Pantalla | Estado | Nota |
|---|---|---|
| Teacher_Dashboard | ✅ Hecho | |
| Teacher_CourseList | ✅ Hecho | `GestionCursos` |
| Teacher_CourseBuilder | ❌ Falta — fuera de alcance (Fase 3, decisión 2026-07-10) | |
| Teacher_AssignmentCreator | ❌ Falta — fuera de alcance (Fase 3) | |
| Teacher_QuizBuilder | ❌ Falta — fuera de alcance (Fase 3) | |
| Teacher_GradingPanel | ⚠️ Parcial — fuera de alcance para completar (Fase 3) | Solo tabla editable; falta *split view* con PDF + rúbrica + feedback |
| Teacher_StudentRoster | ❌ Falta — fuera de alcance (Fase 3) | |
| Teacher_CourseReports | ❌ Falta — fuera de alcance (Fase 3) | Solo 3 números; sin analíticas |

**Resumen:** 14 ✅ (todo transversal + todo estudiante) · 1 ⚠️ · 5 ❌ de 22 pantallas del
inventario. El déficit restante es **enteramente docente (Fase 3)** y está diferido a propósito.

### 3.2 Flujos de Usuario (actualizado 2026-07-09)

| # | Flujo | Estado | Nota |
|---|---|---|---|
| 1 | Acceso Seguro | ✅ Hecho | Login + recuperación + persistencia de sesión + guardas de ruta. Falta solo validación en línea/spinner (menor) |
| 2 | Actualización de Perfil | ✅ Hecho | Modo oscuro/claro, cambiar foto real (con cleanup de `blob:`), cancelar/deshacer, toast. Idioma es mock visual |
| 3 | Consumo de Clase | ✅ Hecho | `CursoDetalle` + `ModuloViewer` + breadcrumbs + progreso persistido entre pantallas |
| 4 | Entrega de Asignación | ✅ Hecho | `TareaDetalle`, *drag & drop*, rúbrica, feedback |
| 5 | Evaluación Síncrona | ✅ Hecho | `QuizEngine`, temporizador, autoguardado simulado, alerta de preguntas en blanco |
| 6 | Consulta de Rendimiento | ✅ Hecho | Drill-down de *feedback* por actividad en `GradeTable` expandible |
| 7 | Diseño Curricular | ❌ Fuera de alcance (Fase 3) | `CourseBuilder` diferido |
| 8 | Diseño de Evaluaciones | ❌ Fuera de alcance (Fase 3) | `AssignmentCreator` / `QuizBuilder` diferidos |
| 9 | Calificación Continua | ⚠️ Fuera de alcance para completar (Fase 3) | *Split view* con rúbrica diferido |
| 10 | Moderación y Comunicación | ⚠️ Parcial | Anuncios masivos ✅ y foros con respuestas ✅; falta moderación (borrar/cerrar hilos) |

---

## 4. Mejoras de interactividad (diferenciación de Moodle) — CLAVE

Objetivo: que se sienta una app moderna y viva, no un LMS plano. Prioridad sobre lo puramente estético.

- [ ] **Constructor de curso *drag & drop*** (`Teacher_CourseBuilder`) — fuera de alcance (Fase 3).
- [x] **Zona de entrega *drag & drop*** con validación de formato en vivo y previsualización del
  archivo (`TareaDetalle`).
- [x] **Motor de examen inmersivo** (`QuizEngine`): temporizador fijo, navegador de preguntas
  numeradas, indicador "Guardado hace Xs", modal de preguntas sin responder.
- [ ] **Panel de calificación *split view*** (PDF del alumno | rúbrica interactiva + feedback) —
  fuera de alcance (Fase 3).
- [x] **Dashboards con visualización de datos**: `ProgressRing`, `Sparkline` de tendencia de
  notas, barras de distribución de tareas, streak de gamificación.
- [x] **`CursoDetalle` con acordeón de semanas/módulos** expandible + *breadcrumbs* persistentes,
  con contador real de completados sincronizado con `ModuloViewer`.
- [x] **Micro-interacciones y feedback**: *toasts* globales, *skeleton loaders* (dashboard,
  cursos), transiciones de página (`page-transition`, respeta `prefers-reduced-motion`),
  estados *hover/active*.
- [x] **Modo oscuro/claro** con conmutador persistido.
- [x] **Búsqueda global / paleta de comandos** (⌘K) — `CommandPalette` (pantallas, cursos, tareas).
- [x] **Gamificación ligera** para estudiantes (racha, progreso de ciclo, insignias ganadas/por
  ganar) — `STUDENT_GAMIFICATION`.
- [x] **Estados vacíos** (icon-based) y notificaciones con badge dinámico en `Header`.
- [x] **Vista Kanban de tareas** (`TareasKanban`: Por hacer / Entregado / Calificado).

---

## 5. Checklist ordenado de ejecución (estado 2026-07-09)

### Fase 0 — Higiene y correcciones rápidas ✅ Completa
- [x] Ignorar `.stitch` en `.gitignore`.
- [x] Corregir avatar del estudiante roto en `mockData.ts`.
- [x] Añadir `onError`/fallback a `<img>` de avatares (Header, ProfileForm).
- [x] Reducir opacidad del overlay en `CourseCard` para que se vea la foto.
- [x] Arreglar color de los puntos en "Próximos eventos" (`CalendarGrid`).
- [x] Eliminar restos del template: `App.css`, `assets/react.svg`, `vite.svg`, `hero.png`.
- [x] Reescribir `README.md` describiendo el proyecto real.
- [x] Diferenciar `DESIGN.md` (sistema de diseño) de `DESCRIPTION.md` (inventario/flujos).

### Fase 1 — Completar flujos transversales ✅ Completa (con una decisión de diseño)
- [x] `Auth_Recovery`: pantalla de recuperación de contraseña (correo → confirmación).
- [ ] Login: validación de campos, botón deshabilitado, *spinner*, error en línea. (pendiente menor)
- [x] Sistema de **toasts** global reutilizable.
- [x] Perfil: subida real de foto (preview), "Cancelar/Deshacer", toast de guardado.
- [x] **Modo oscuro/claro** + selector de idioma en Configuración.
- [x] Calendario: navegación de meses funcional + **vista semanal**.
- [x] **Decisión (no pendiente):** `Global_Dashboard_Selector` se resuelve con el toggle de rol
  en el login en vez de una pantalla dedicada — decisión de diseño, no una tarea abierta.

### Fase 2 — Núcleo del estudiante (consumo y evaluación) ✅ Completa
- [x] `Student_CourseDetail`: home del curso (sílabo, anuncios, progreso, acordeón de módulos).
- [x] `Student_ModuleViewer`: reproductor de video, visor de PDF, lecturas + **breadcrumbs** +
  progreso persistido (`useModuleProgress`, sincronizado con `CursoDetalle`).
- [x] `Student_AssignmentDetail`: instrucciones + rúbrica + **drag & drop** + feedback.
- [x] `Student_QuizEngine`: temporizador, navegador de preguntas, autoguardado, alerta de faltantes.
- [x] `Student_ForumTopic`: hilo de discusión (leer/responder).
- [x] `Student_GradesBook`: detalle de *feedback* por actividad (drill-down desde la tabla).

### Fase 3 — Núcleo del docente (autoría y calificación) — ❌ EXCLUIDA DEL ALCANCE
> Decisión del 2026-07-10: esta fase queda explícitamente **fuera de alcance** del prototipo
> actual. Ninguno de los ítems siguientes se implementa en esta iteración.
- [ ] `Teacher_CourseBuilder`: edición **drag & drop** de módulos/materiales, estados Borrador/Publicado.
- [ ] `Teacher_AssignmentCreator`: formulario con fechas (bloqueo de fechas pasadas, cierre ≥ inicio) y rúbrica.
- [ ] `Teacher_QuizBuilder`: banco de preguntas, aleatoriedad, ponderación.
- [ ] `Teacher_GradingPanel`: **split view** (trabajo | rúbrica + feedback), "Guardar borrador" / "Publicar".
- [ ] `Teacher_StudentRoster`: lista de alumnos, asistencia y métricas de riesgo de abandono.
- [ ] `Teacher_CourseReports`: analíticas (promedios, preguntas con mayor tasa de fallo) con gráficos.
- [ ] Moderación de foros para el docente.

### Fase 4 — Diferenciación e interactividad (ver §4) ✅ Completa
- [x] Visualización de datos en dashboards (anillos, sparklines, barras).
- [x] Micro-interacciones: skeletons, transiciones de página, animaciones de tarjeta.
- [x] Búsqueda global / paleta de comandos (⌘K).
- [x] Gamificación ligera (rachas, insignias) y estados vacíos.
- [x] Vista Kanban de tareas del estudiante.

### Fase 5 — Robustez (prototipo → producto) — Parcial
- [x] Guardas de ruta (`PrivateRoute`) y contexto de autenticación persistente (`useAuth` +
  `localStorage`, con `logout()` limpiando la clave correctamente).
- [~] Accesibilidad — parcial: `prefers-reduced-motion` respetado en transiciones de página;
  contraste AA verificado en modo oscuro para los pares `bg-primary-fixed`/`text-*` (se usa
  `text-on-primary-fixed`, contraste ~13:1 contra `#d5e3ff`). Falta una auditoría completa de
  roles ARIA y foco visible en todos los componentes interactivos.
- [ ] Responsividad fina de las nuevas vistas complejas (queda pendiente revisar en profundidad).
- [ ] **Pruebas de los flujos críticos — sigue pendiente.** No hay suite de tests automatizados.

---

## 6. Ya implementado (referencia, actualizado 2026-07-09)

- [x] Ruteo y `AppShell` (sidebar colapsable + header con notificaciones y menú de perfil).
- [x] Guardas de ruta por rol (`PrivateRoute`) y persistencia de sesión en `localStorage`.
- [x] Login con selector de rol y redirección por rol (`useAuth`), logout que limpia la sesión.
- [x] Recuperación de contraseña (`RecoveryPage`).
- [x] Dashboards de estudiante y docente con `StatCard`, `CourseCard`, dataviz y gamificación.
- [x] Listas de cursos (estudiante y docente).
- [x] Drill-down completo de curso: `CursoDetalle` → `ModuloViewer` → `TareaDetalle` /
  `QuizEngine` / `ForoTopic`, con breadcrumbs y progreso de módulos persistido y compartido
  (`useModuleProgress`).
- [x] Kanban de tareas del estudiante (`TareasKanban`).
- [x] Calendario mensual y semanal con navegación y panel de detalle del día.
- [x] Calificaciones: tabla expandible con drill-down de feedback (estudiante) y panel editable
  del docente (`GradeTable`, `PanelCalificaciones`).
- [x] Mensajería interna (`MessagesPanel`) con envío en local.
- [x] Anuncios del docente (`AnnouncementsPanel`) con publicación en local.
- [x] Configuración de perfil (foto real con preview, datos, cancelar, modo oscuro, idioma mock,
  toggles de notificación).
- [x] Sistema de tokens de diseño (Material 3) en `index.css`, con `on-primary-fixed` verificado
  en AA para modo oscuro.
- [x] Modo oscuro/claro persistido (`useTheme`).
- [x] Paleta de comandos ⌘K (`CommandPalette`).
- [x] Sistema de toasts global (`ToastProvider`/`useToast`).

**Pendiente real (fuera de Fase 3):** validación/spinner del login, i18n real, auditoría completa
de accesibilidad (ARIA/foco), responsividad fina de vistas complejas, y **pruebas automatizadas**.
