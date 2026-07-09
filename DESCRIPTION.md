web application/stitch/projects/530048268269728490/screens/5607175521263968762
## 1. Inventario de Pantallas (Vistas)

Estas son todas las interfaces que compondrán la aplicación, organizadas por el tipo de usuario que accederá a ellas.

**Vistas Comunes (Transversales)**

- **Auth_Login:** Pantalla de inicio de sesión.
- **Auth_Recovery:** Flujo de recuperación de contraseña.
- **Global_Dashboard_Selector:** (Opcional) Pantalla de selección de rol si un usuario es docente y estudiante a la vez.
- **User_Profile:** Configuración de perfil, avatar y preferencias de notificaciones.
- **Global_Inbox:** Bandeja de mensajería interna directa.
- **Global_Calendar:** Vista de calendario (mensual/semanal) con eventos consolidados.

**Vistas del Estudiante**

- **Student_Dashboard:** Resumen general (clases del día, tareas próximas a vencer, notificaciones recientes).
- **Student_CourseList:** Cuadrícula o lista de cursos matriculados en el ciclo actual.
- **Student_CourseDetail:** Home del curso con el sílabo, anuncios y progreso general.
- **Student_ModuleViewer:** Interfaz de consumo de contenido (reproductor de video, visor de PDF, lecturas).
- **Student_AssignmentDetail:** Pantalla con las instrucciones de la tarea, rúbrica y la zona de subida de archivos (`Drag & Drop`).
- **Student_QuizEngine:** Interfaz aislada para la toma de exámenes (con temporizador, paginación de preguntas y estado de conexión).
- **Student_GradesBook:** Historial de calificaciones filtrable por curso y periodo académico.
- **Student_ForumTopic:** Vista de un hilo de discusión para leer y responder.

**Vistas del Docente**

- **Teacher_Dashboard:** Panel de control con alertas críticas (entregas pendientes de calificar, mensajes no leídos, accesos recientes).
- **Teacher_CourseList:** Cursos asignados para la enseñanza en el ciclo.
- **Teacher_CourseBuilder:** Interfaz de edición drag-and-drop para estructurar módulos, subir archivos y reorganizar el sílabo.
- **Teacher_AssignmentCreator:** Formulario avanzado para crear tareas (fechas de corte, métodos de entrega, creación de rúbricas).
- **Teacher_QuizBuilder:** Creador de evaluaciones (banco de preguntas, configuración de aleatoriedad, peso de las notas).
- **Teacher_GradingPanel:** Interfaz de calificación (vista dividida: trabajo del alumno a la izquierda, rúbrica y caja de feedback a la derecha).
- **Teacher_StudentRoster:** Lista de alumnos matriculados, seguimiento de asistencia (si aplica) y métricas de riesgo de abandono.
- **Teacher_CourseReports:** Panel de analíticas del curso (promedios, preguntas con mayor tasa de fallo).

## 2. Inventario de Flujos de Usuario Principales

Estos son los caminos lógicos que los usuarios recorrerán interactuando con las pantallas anteriores.

**Flujos de Autenticación y Configuración**

1. **Flujo de Acceso Seguro:** Desde el ingreso de credenciales hasta la redirección al Dashboard correspondiente (incluye recuperación de contraseña).
2. **Flujo de Actualización de Perfil:** Modificación de datos de contacto y preferencias de interfaz (modo oscuro/claro, idioma).

**Flujos del Estudiante**
3.  **Flujo de Consumo de Clase:** Navegación desde el Dashboard > Selección de Curso > Módulo Específico > Visualización del material de estudio.
4.  **Flujo de Entrega de Asignación:** Revisión de instrucciones > Subida de archivo(s) > Confirmación de envío > Recepción de comprobante.
5.  **Flujo de Evaluación Síncrona:** Ingreso al examen > Resolución de preguntas > Guardado automático > Envío final de evaluación.
6.  **Flujo de Consulta de Rendimiento:** Acceso al libro de calificaciones > Revisión de feedback detallado de una tarea específica.

**Flujos del Docente**
7.  **Flujo de Diseño Curricular:** Acceso al curso > Creación de nuevo módulo > Subida de material multimedia > Publicación para los estudiantes.
8.  **Flujo de Diseño de Evaluaciones:** Creación de tarea/examen > Configuración de parámetros de calificación > Programación de disponibilidad.
9.  **Flujo de Calificación Continua:** Acceso a entregas pendientes > Uso de rúbrica para evaluar > Ingreso de comentarios > Publicación de notas al estudiante.
10. **Flujo de Moderación y Comunicación:** Envío de anuncio masivo al curso o respuesta a foros de dudas.

## 1. Flujos de Autenticación y Configuración

### Flujo 1: Acceso Seguro

- **Transición:** `Auth_Login` → `Global_Dashboard_Selector` (si aplica) → `Student_Dashboard` o `Teacher_Dashboard`.
- **Descripción:** El usuario ingresa sus credenciales en un formulario limpio sobre fondo crema pastel. Al hacer clic en "Ingresar" (botón azul oscuro), el sistema valida la información.
- **Heurísticas Aplicadas:**
    - *Visibilidad del estado del sistema:* Al hacer clic, el botón muestra un *spinner* de carga para indicar que la petición está en proceso.
    - *Prevención de errores:* El botón de "Ingresar" se mantiene deshabilitado hasta que ambos campos (correo y contraseña) tengan formato válido.
    - *Ayudar a reconocer y recuperar errores:* Si la contraseña es incorrecta, se muestra un mensaje de error en línea (texto en rojo suave) debajo del campo, no un pop-up genérico.

### Flujo 2: Actualización de Perfil

- **Transición:** Cualquier pantalla (vía menú lateral o header) → `User_Profile`.
- **Descripción:** El usuario modifica su foto o correo de contacto.
- **Heurísticas Aplicadas:**
    - *Control y libertad del usuario:* Si el usuario cambia una foto pero se arrepiente, tiene un botón claro de "Cancelar" o "Deshacer" antes de guardar los cambios.
    - *Visibilidad del estado del sistema:* Al guardar, aparece un *toast notification* en la esquina superior confirmando "Perfil actualizado exitosamente".

## 2. Flujos del Estudiante

### Flujo 3: Consumo de Clase

- **Transición:** `Student_Dashboard` → `Student_CourseList` → `Student_CourseDetail` → `Student_ModuleViewer`.
- **Descripción:** El alumno usa el menú lateral colapsable para ir a sus cursos. Entra al curso deseado, ve el sílabo y abre el módulo de la semana.
- **Heurísticas Aplicadas:**
    - *Reconocimiento antes que recuerdo:* En la parte superior de `Student_ModuleViewer`, se usan **Breadcrumbs** (Ej: *Cursos > Matemáticas > Semana 3 > Video*). El alumno siempre sabe dónde está sin tener que memorizar su ruta.
    - *Consistencia y estándares:* Los íconos de los materiales siempre usan el mismo lenguaje visual (un ícono de "reproductor" azul oscuro siempre es un video; un ícono de "documento" es un PDF).

### Flujo 4: Entrega de Asignación

- **Transición:** `Student_CourseDetail` → `Student_AssignmentDetail`.
- **Descripción:** El estudiante lee las instrucciones, arrastra su archivo al área designada y envía su trabajo.
- **Heurísticas Aplicadas:**
    - *Prevención de errores:* Antes de procesar el envío, salta un **diálogo de confirmación** ("¿Estás seguro de enviar esta tarea? Solo tienes 1 intento"). Además, el área de *Drag & Drop* rechaza visualmente archivos que no coinciden con el formato permitido (ej. sube un `.exe` cuando se pide `.pdf`).
    - *Visibilidad del estado del sistema:* Durante la subida del archivo, aparece una barra de progreso real (0% a 100%).

### Flujo 5: Evaluación Síncrona

- **Transición:** `Student_CourseDetail` → `Student_QuizEngine`.
- **Descripción:** El alumno inicia un examen. Responde pregunta por pregunta, el sistema guarda automáticamente y envía la evaluación.
- **Heurísticas Aplicadas:**
    - *Visibilidad del estado del sistema:* Un temporizador fijo en la pantalla y un indicador de "Guardado hace 10 segundos" o "Sin conexión" mantienen al alumno informado.
    - *Flexibilidad y eficiencia de uso:* Un panel lateral o inferior permite saltar rápidamente entre preguntas numeradas.
    - *Prevención de errores:* Si el alumno intenta enviar el examen con preguntas en blanco, una alerta modal le avisa de las preguntas exactas que le faltan.

## 3. Flujos del Docente

### Flujo 6: Diseño Curricular y Subida de Material

- **Transición:** `Teacher_Dashboard` → `Teacher_CourseList` → `Teacher_CourseBuilder`.
- **Descripción:** El profesor entra al modo edición del curso, crea una nueva "Semana 4" y arrastra recursos (PDFs, enlaces) dentro de ella.
- **Heurísticas Aplicadas:**
    - *Flexibilidad y eficiencia de uso:* La capacidad de reordenar módulos arrastrándolos (*Drag & Drop*) acelera el trabajo para usuarios expertos.
    - *Visibilidad del estado del sistema:* Los módulos tienen etiquetas visuales claras ("Borrador" en gris o "Publicado" en azul oscuro) para que el profesor sepa instantáneamente qué ven los alumnos.

### Flujo 7: Diseño de Evaluaciones

- **Transición:** `Teacher_CourseBuilder` → `Teacher_AssignmentCreator`.
- **Descripción:** El docente llena un formulario para crear una tarea, estableciendo fechas y rúbricas.
- **Heurísticas Aplicadas:**
    - *Prevención de errores:* El calendario bloquea (deshabilita) las fechas pasadas. Además, la "Fecha de cierre" no puede ser lógicamente anterior a la "Fecha de inicio".
    - *Relación entre el sistema y el mundo real:* El uso de términos educativos estándar (Rúbrica, Plazo de gracia, Ponderación) en lugar de jerga de base de datos.

### Flujo 8: Calificación Continua

- **Transición:** `Teacher_Dashboard` (clic en notificación de "10 entregas pendientes") → `Teacher_GradingPanel`.
- **Descripción:** El docente entra a la vista dividida. A la izquierda ve el PDF del alumno; a la derecha, la rúbrica y la caja de comentarios.
- **Heurísticas Aplicadas:**
    - *Reconocimiento antes que recuerdo:* El docente no tiene que abrir el PDF en una ventana y la rúbrica en otra; la vista dividida (*Split View*) mantiene toda la información contextual a la vista.
    - *Control y libertad del usuario:* Botones para "Guardar borrador" (si el docente no ha terminado de evaluar) y "Publicar nota".