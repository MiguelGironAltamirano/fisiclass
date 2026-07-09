# PLAN — Aula Virtual (fisiclass)

> Revisión integral del prototipo frente a `DESCRIPTION.md` / `DESIGN.md`, detección de fallas
> generales, imágenes faltantes y hoja de ruta para diferenciar la interfaz de Moodle.
> Fecha de revisión: **2026-07-08**.

---

## 1. Estado general del proyecto

Stack: **React 19 + Vite 8 + TypeScript + React Router 7 + Tailwind v4** (tema Material 3 vía tokens en `src/index.css`).

Lo construido hoy cubre una **cáscara de navegación (AppShell)** con 6 secciones por rol
(Dashboard, Cursos, Calendario, Calificaciones, Mensajes, Configuración) alimentadas por datos
`mock`. Es un prototipo navegable y consistente visualmente, **pero le falta el ~55% de las
pantallas** y **la mayoría de los flujos profundos** que exigen `DESCRIPTION.md` / `DESIGN.md`
(consumo de clase, entrega de tareas, exámenes, constructor de cursos, calificación con rúbrica,
foros, reportes).

Veredicto: **base sólida, alcance incompleto**. El drill-down de un curso (`CourseDetail →
ModuleViewer → AssignmentDetail → QuizEngine`) es el gran vacío y es justamente donde se
diferencia de Moodle.

---

## 2. Fallas generales detectadas

### 2.1 Imágenes faltantes / rotas
- [ ] **Avatar del estudiante roto** — en `src/data/mockData.ts` la URL del avatar de
  `estudiante` es un placeholder inventado (`...a6b7c8d9e0f1g2...`), no resuelve → imagen rota
  en `Header` y `ProfileForm`. Reemplazar por avatar real (p. ej. `https://i.pravatar.cc/...`).
- [ ] **`src/assets/hero.png`** existe pero no se usa en ninguna parte (resto del template Vite).
- [ ] **Login sin identidad visual** — solo un ícono `school`; no hay logo/isotipo ni la imagen
  de fondo "crema pastel" que menciona el `DESIGN.md` (el fondo real es blanco/gris).
- [ ] **`CourseCard` tapa la foto** — el overlay `opacity-70` sobre `course.color` cubre casi por
  completo la imagen del curso; se pierde el propósito de la foto. Bajar opacidad o usar gradiente.
- [ ] **Sin estados vacíos ilustrados** — ninguna vista tiene *empty state* con imagen/ilustración
  (bandeja vacía, sin cursos, sin calificaciones, sin eventos).
- [ ] **Dependencia de imágenes externas (Unsplash / pravatar / googleusercontent)** — sin
  fallback ni `onError`; si no hay red, todas las tarjetas y avatares quedan en blanco.

### 2.2 Bugs y elementos no funcionales
- [ ] **Recuperación de contraseña inexistente** — el enlace "¿Olvidaste tu contraseña?" es
  `href="#"`. Falta la pantalla `Auth_Recovery` (exigida por el inventario).
- [ ] **Login sin heurísticas del `DESIGN.md`** — el botón "Ingresar" está siempre habilitado
  (debería deshabilitarse hasta que correo+contraseña sean válidos), no hay *spinner* de carga,
  ni mensaje de error en línea, ni validación de formato.
- [ ] **Calendario estático** — los botones de mes anterior/siguiente (`chevron_left/right`) no
  hacen nada; el mes está fijo en "Julio 2026". Falta vista **semanal** (el `DESIGN` pide
  mensual/semanal).
- [ ] **Botones muertos**: "Cambiar foto" (perfil), "Soporte" (login), "Nuevo Curso" (gestión
  de cursos), botón de ayuda del header, campana de notificaciones (solo abre lista fija).
- [ ] **Modo oscuro / idioma no implementados** — el Flujo 2 exige preferencia de tema
  (claro/oscuro) e idioma; `ProfileForm` solo tiene toggles de notificación.
- [ ] **Sin guardas de ruta / autenticación real** — se puede entrar a `/docente/*` o
  `/estudiante/*` escribiendo la URL; el rol se infiere solo del path. `useAuth` mantiene el rol
  en estado local que se pierde al refrescar (aceptable para prototipo, pero a documentar).
- [ ] **Perfil: sin "Cancelar/Deshacer"** — el `DESIGN` (Flujo 2) pide control para revertir
  cambios; solo existe "Guardar". Además usa texto inline en vez del *toast* especificado.
- [ ] **Bug visual menor en `CalendarGrid`** — los puntos de "Próximos eventos" usan
  `TYPE_STYLES[...].split(" ")[0]` que devuelve `bg-<color>/10` (10% de opacidad), por lo que
  los puntos quedan casi invisibles. Usar el color sólido.
- [ ] **Sin breadcrumbs** — el `DESIGN` los exige (Reconocimiento antes que recuerdo) en el
  visor de módulos; no existen en ninguna vista.
- [ ] **Sin toasts globales** — el sistema de *toast notification* prometido no existe.

### 2.3 Higiene del repositorio
- [ ] **`src/App.css`** — CSS del template Vite (`.hero`, `#next-steps`, etc.) sin uso. Eliminar.
- [ ] **`src/assets/react.svg`, `vite.svg`, `hero.png`** — restos del template.
- [ ] **`README.md`** — es el README por defecto de Vite; no describe el proyecto real.
- [x] **`.stitch` ahora ignorado en git** (añadido a `.gitignore`).
- [ ] **`DESCRIPTION.md` y `DESIGN.md` son idénticos** — mismo contenido byte a byte; se esperaría
  que `DESIGN.md` contenga sistema de diseño (colores, tipografía, componentes) y no el inventario.

---

## 3. Cobertura frente a `DESCRIPTION.md` / `DESIGN.md`

### 3.1 Inventario de Pantallas

**Vistas Comunes (Transversales)**

| Pantalla | Estado | Nota |
|---|---|---|
| Auth_Login | ✅ Hecho | Falta validación, spinner y errores en línea |
| Auth_Recovery | ❌ Falta | Solo enlace muerto `href="#"` |
| Global_Dashboard_Selector | ⚠️ Parcial | Se resuelve con toggle en el login, no hay pantalla dedicada |
| User_Profile | ✅ Hecho | Falta modo oscuro/idioma, foto, cancelar, toast |
| Global_Inbox | ✅ Hecho | `MessagesPanel` funcional (envía en local) |
| Global_Calendar | ⚠️ Parcial | Solo mensual y estático; falta semanal y navegación de mes |

**Vistas del Estudiante**

| Pantalla | Estado | Nota |
|---|---|---|
| Student_Dashboard | ✅ Hecho | |
| Student_CourseList | ✅ Hecho | `MisCursos` |
| Student_CourseDetail | ❌ Falta | "Ver curso" solo redirige a la lista; sin sílabo/anuncios/progreso |
| Student_ModuleViewer | ❌ Falta | Sin reproductor de video / visor PDF / lecturas / breadcrumbs |
| Student_AssignmentDetail | ❌ Falta | Sin instrucciones, rúbrica ni *drag & drop* de entrega |
| Student_QuizEngine | ❌ Falta | Sin temporizador, paginación ni autoguardado |
| Student_GradesBook | ⚠️ Parcial | Tabla de notas OK, pero sin detalle de *feedback* por tarea |
| Student_ForumTopic | ❌ Falta | Sin foros de discusión |

**Vistas del Docente**

| Pantalla | Estado | Nota |
|---|---|---|
| Teacher_Dashboard | ✅ Hecho | |
| Teacher_CourseList | ✅ Hecho | `GestionCursos` |
| Teacher_CourseBuilder | ❌ Falta | Sin edición *drag & drop* de módulos/materiales |
| Teacher_AssignmentCreator | ❌ Falta | Sin formulario de tareas (fechas, métodos, rúbrica) |
| Teacher_QuizBuilder | ❌ Falta | Sin banco de preguntas ni configuración |
| Teacher_GradingPanel | ⚠️ Parcial | Solo tabla editable; falta *split view* con PDF + rúbrica + feedback |
| Teacher_StudentRoster | ❌ Falta | Sin lista de alumnos, asistencia ni riesgo de abandono |
| Teacher_CourseReports | ❌ Falta | Solo 3 números; sin analíticas (promedios, preguntas con más fallos) |

**Resumen:** 8 ✅ · 4 ⚠️ · 10 ❌ de 22 pantallas del inventario.

### 3.2 Flujos de Usuario

| # | Flujo | Estado | Falta |
|---|---|---|---|
| 1 | Acceso Seguro | ⚠️ | Spinner, botón deshabilitado, error en línea, recuperación, selector de rol |
| 2 | Actualización de Perfil | ⚠️ | Modo oscuro/idioma, cambiar foto real, cancelar/deshacer, toast |
| 3 | Consumo de Clase | ❌ | `CourseDetail` + `ModuleViewer` + breadcrumbs (núcleo del producto) |
| 4 | Entrega de Asignación | ❌ | `AssignmentDetail`, *drag & drop*, diálogo de confirmación, barra de progreso |
| 5 | Evaluación Síncrona | ❌ | `QuizEngine`, temporizador, autoguardado, alerta de preguntas en blanco |
| 6 | Consulta de Rendimiento | ⚠️ | Detalle de *feedback* por actividad |
| 7 | Diseño Curricular | ❌ | `CourseBuilder` con *drag & drop* y etiquetas Borrador/Publicado |
| 8 | Diseño de Evaluaciones | ❌ | `AssignmentCreator` / `QuizBuilder` con validación de fechas |
| 9 | Calificación Continua | ⚠️ | *Split view* con rúbrica, "Guardar borrador" vs "Publicar nota" |
| 10 | Moderación y Comunicación | ⚠️ | Anuncios masivos ✅; falta moderación de foros |

---

## 4. Mejoras de interactividad (diferenciación de Moodle) — CLAVE

Objetivo: que se sienta una app moderna y viva, no un LMS plano. Prioridad sobre lo puramente estético.

- [ ] **Constructor de curso *drag & drop*** (`Teacher_CourseBuilder`) con reordenamiento de
  módulos y materiales, y *chips* de estado "Borrador/Publicado". Es el diferenciador #1.
- [ ] **Zona de entrega *drag & drop*** con validación de formato en vivo, previsualización del
  archivo y **barra de progreso real** (0→100%).
- [ ] **Motor de examen inmersivo** (`QuizEngine`): temporizador fijo, navegador de preguntas
  numeradas, indicador "Guardado hace Xs / Sin conexión", modal de preguntas sin responder.
- [ ] **Panel de calificación *split view*** (PDF del alumno | rúbrica interactiva + feedback),
  con atajos de teclado para calificar rápido.
- [ ] **Dashboards con visualización de datos**: anillos de progreso, *sparklines* de tendencia
  de notas, barras de distribución — no solo números planos.
- [ ] **`CourseDetail` con acordeón de semanas/módulos** expandible + *breadcrumbs* persistentes.
- [ ] **Micro-interacciones y feedback**: *toasts* globales, *skeleton loaders*, transiciones de
  página, estados *hover/active*, animación en tarjetas.
- [ ] **Modo oscuro/claro** con conmutador (ya hay tokens de color; falta la variante oscura).
- [ ] **Búsqueda global / paleta de comandos** (⌘K) para saltar a cursos, tareas y alumnos.
- [ ] **Gamificación ligera** para estudiantes (rachas, insignias, progreso del ciclo) —
  aleja la percepción "Moodle".
- [ ] **Estados vacíos ilustrados** y **notificaciones en tiempo (mock)** con badge dinámico.
- [ ] **Vista Kanban de tareas** (Por hacer / Entregado / Calificado) para el estudiante.

---

## 5. Checklist ordenado de ejecución

### Fase 0 — Higiene y correcciones rápidas (baja dificultad)
- [x] Ignorar `.stitch` en `.gitignore`.
- [ ] Corregir avatar del estudiante roto en `mockData.ts`.
- [ ] Añadir `onError`/fallback a `<img>` (avatares y portadas de curso).
- [ ] Reducir opacidad del overlay en `CourseCard` para que se vea la foto.
- [ ] Arreglar color de los puntos en "Próximos eventos" (`CalendarGrid`).
- [ ] Eliminar restos del template: `App.css`, `assets/react.svg`, `vite.svg`, `hero.png`.
- [ ] Reescribir `README.md` describiendo el proyecto real.
- [ ] Diferenciar `DESIGN.md` (sistema de diseño) de `DESCRIPTION.md` (inventario/flujos).

### Fase 1 — Completar flujos transversales
- [ ] `Auth_Recovery`: pantalla de recuperación de contraseña (correo → confirmación).
- [ ] Login: validación de campos, botón deshabilitado, *spinner*, error en línea.
- [ ] Sistema de **toasts** global reutilizable.
- [ ] Perfil: subida real de foto (preview), "Cancelar/Deshacer", toast de guardado.
- [ ] **Modo oscuro/claro** + selector de idioma en Configuración.
- [ ] Calendario: navegación de meses funcional + **vista semanal**.
- [ ] `Global_Dashboard_Selector` (opcional) para usuarios con doble rol.

### Fase 2 — Núcleo del estudiante (consumo y evaluación)
- [ ] `Student_CourseDetail`: home del curso (sílabo, anuncios, progreso, acordeón de módulos).
- [ ] `Student_ModuleViewer`: reproductor de video, visor de PDF, lecturas + **breadcrumbs**.
- [ ] `Student_AssignmentDetail`: instrucciones + rúbrica + **drag & drop** + confirmación + progreso.
- [ ] `Student_QuizEngine`: temporizador, navegador de preguntas, autoguardado, alerta de faltantes.
- [ ] `Student_ForumTopic`: hilo de discusión (leer/responder).
- [ ] `Student_GradesBook`: detalle de *feedback* por actividad (drill-down desde la tabla).

### Fase 3 — Núcleo del docente (autoría y calificación)
- [ ] `Teacher_CourseBuilder`: edición **drag & drop** de módulos/materiales, estados Borrador/Publicado.
- [ ] `Teacher_AssignmentCreator`: formulario con fechas (bloqueo de fechas pasadas, cierre ≥ inicio) y rúbrica.
- [ ] `Teacher_QuizBuilder`: banco de preguntas, aleatoriedad, ponderación.
- [ ] `Teacher_GradingPanel`: **split view** (trabajo | rúbrica + feedback), "Guardar borrador" / "Publicar".
- [ ] `Teacher_StudentRoster`: lista de alumnos, asistencia y métricas de riesgo de abandono.
- [ ] `Teacher_CourseReports`: analíticas (promedios, preguntas con mayor tasa de fallo) con gráficos.
- [ ] Moderación de foros para el docente.

### Fase 4 — Diferenciación e interactividad (ver §4)
- [ ] Visualización de datos en dashboards (anillos, sparklines, barras).
- [ ] Micro-interacciones: skeletons, transiciones de página, animaciones de tarjeta.
- [ ] Búsqueda global / paleta de comandos (⌘K).
- [ ] Gamificación ligera (rachas, insignias) y estados vacíos ilustrados.
- [ ] Vista Kanban de tareas del estudiante.

### Fase 5 — Robustez (opcional prototipo → producto)
- [ ] Guardas de ruta y contexto de autenticación persistente.
- [ ] Accesibilidad (focus visible, roles ARIA, contraste en modo oscuro).
- [ ] Responsividad fina de las nuevas vistas complejas (split view, builder).
- [ ] Pruebas de los flujos críticos.

---

## 6. Ya implementado (referencia)

- [x] Ruteo y `AppShell` (sidebar colapsable + header con notificaciones y menú de perfil).
- [x] Login con selector de rol y redirección por rol (`useAuth`).
- [x] Dashboards de estudiante y docente con `StatCard` + `CourseCard`.
- [x] Listas de cursos (estudiante y docente).
- [x] Calendario mensual con eventos y panel de detalle del día.
- [x] Calificaciones: tabla del estudiante y panel editable del docente (`GradeTable`).
- [x] Mensajería interna (`MessagesPanel`) con envío en local.
- [x] Anuncios del docente (`AnnouncementsPanel`) con publicación en local.
- [x] Configuración de perfil (datos + toggles de notificación).
- [x] Sistema de tokens de diseño (Material 3) en `index.css`.
