import type {
  Announcement,
  Assignment,
  CalendarEvent,
  ChatMessage,
  Course,
  CourseAnnouncement,
  CourseProgressBreakdown,
  CourseSyllabus,
  ForumThread,
  GradeRow,
  MessageThread,
  NavItem,
  Quiz,
  Role,
  StudentGamification,
} from "../types";
import type { CourseModule } from "../types";

/** Videos libres (Google Sample Video Bucket) usados como contenido embebible de "video". */
const SAMPLE_VIDEO_URLS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
] as const;

/** PDF público, real y estable usado como contenido embebible de "pdf". */
const SAMPLE_PDF_URL =
  "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export const NAV_ITEMS: Record<Role, readonly NavItem[]> = {
  docente: [
    { label: "Dashboard", icon: "dashboard", path: "/docente/dashboard" },
    { label: "Cursos", icon: "school", path: "/docente/cursos" },
    { label: "Calendario", icon: "calendar_today", path: "/docente/calendario" },
    { label: "Calificaciones", icon: "grade", path: "/docente/calificaciones" },
    { label: "Mensajes", icon: "mail", path: "/docente/mensajes" },
    { label: "Configuración", icon: "settings", path: "/docente/configuracion" },
  ],
  estudiante: [
    { label: "Dashboard", icon: "dashboard", path: "/estudiante/dashboard" },
    { label: "Mis Cursos", icon: "school", path: "/estudiante/cursos" },
    { label: "Calendario", icon: "calendar_today", path: "/estudiante/calendario" },
    { label: "Calificaciones", icon: "grade", path: "/estudiante/calificaciones" },
    { label: "Mensajes", icon: "mail", path: "/estudiante/mensajes" },
    { label: "Configuración", icon: "settings", path: "/estudiante/configuracion" },
  ],
};

export const CURRENT_USER: Record<Role, { name: string; email: string; title: string; avatar: string }> = {
  docente: {
    name: "Dra. Elena Vargas",
    email: "elena.vargas@institucion.edu",
    title: "Profesora Titular - Facultad de Ingeniería",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFOzyWCJoQSBmC_Tld_eYVHBRl6Xnm0YgvVkgPRmlne-q2wiR9dWCOvSKX9gbYfdQzmrfoqVTf_3TWkQ0lJXkWXGlMNbFZRiuRaGOtpDh9ZwrciVBKKXNaycAbrSa8TlvpEhOry6bSnAp7ZSuYDXFul81H5hW_9otAtD1gfwfSsNbCkhuC04gUZviF_afX37O1VacIC7r3AbcoVW8I5fn2qlWTzg_QBXZTP8Ngc60n0pZs0a6My62cRYovXEvJc-8yYjPYV0Wxaw",
  },
  estudiante: {
    name: "Nicola Porchella",
    email: "nicola.porchella@institucion.edu",
    title: "Estudiante - Ingeniería de Sistemas, 6to ciclo",
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-MPErq_OmoX1K143bfT5cSMdHGe_0BcRN3UmY6g7vD7p3ijxiz8wleoA&s=10",
  },
};

export const DOCENTE_COURSES: readonly Course[] = [
  {
    id: "c1",
    name: "Estructura de Datos y Algoritmos",
    code: "ISI-204",
    students: 42,
    progress: 68,
    color: "bg-primary-container",
    schedule: "Lun / Mié 08:00 - 10:00",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
  {
    id: "c2",
    name: "Bases de Datos Avanzadas",
    code: "ISI-310",
    students: 35,
    progress: 45,
    color: "bg-tertiary",
    schedule: "Mar / Jue 10:00 - 12:00",
    image:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&q=80",
  },
  {
    id: "c3",
    name: "Ingeniería de Software",
    code: "ISI-405",
    students: 28,
    progress: 82,
    color: "bg-success",
    schedule: "Vie 14:00 - 18:00",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
  },
  {
    id: "c4",
    name: "Inteligencia Artificial",
    code: "ISI-501",
    students: 30,
    progress: 20,
    color: "bg-warning",
    schedule: "Lun 16:00 - 19:00",
    image:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400&q=80",
  },
];

export const ESTUDIANTE_COURSES: readonly Course[] = [
  {
    id: "c1",
    name: "Estructura de Datos y Algoritmos",
    code: "ISI-204",
    professor: "Dra. Elena Vargas",
    progress: 68,
    color: "bg-primary-container",
    schedule: "Lun / Mié 08:00 - 10:00",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
  },
  {
    id: "c2",
    name: "Cálculo Diferencial",
    code: "MAT-201",
    professor: "Ing. Roberto Salas",
    progress: 90,
    color: "bg-tertiary",
    schedule: "Mar / Jue 10:00 - 12:00",
    image:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80",
  },
  {
    id: "c3",
    name: "Ingeniería de Software",
    code: "ISI-405",
    professor: "Dra. Elena Vargas",
    progress: 55,
    color: "bg-success",
    schedule: "Vie 14:00 - 18:00",
    image:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
  },
  {
    id: "c4",
    name: "Economía General",
    code: "ECO-110",
    professor: "Mg. Patricia Ruiz",
    progress: 33,
    color: "bg-warning",
    schedule: "Mié 16:00 - 18:00",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80",
  },
];

export const DOCENTE_GRADES: readonly GradeRow[] = [
  { id: "g1", student: "Ana Torres", course: "ISI-204", assignment: "Práctica 3", score: 18, maxScore: 20, status: "calificado" },
  { id: "g2", student: "Luis Ramírez", course: "ISI-204", assignment: "Práctica 3", score: null, maxScore: 20, status: "pendiente" },
  { id: "g3", student: "María Chávez", course: "ISI-310", assignment: "Proyecto Final", score: 15, maxScore: 20, status: "calificado" },
  { id: "g4", student: "Jorge Peña", course: "ISI-405", assignment: "Sprint Review 2", score: null, maxScore: 20, status: "atrasado" },
  { id: "g5", student: "Sofía León", course: "ISI-501", assignment: "Ensayo IA Ética", score: 19, maxScore: 20, status: "calificado" },
  { id: "g6", student: "Diego Vera", course: "ISI-204", assignment: "Práctica 3", score: null, maxScore: 20, status: "pendiente" },
];

export const ESTUDIANTE_GRADES: readonly GradeRow[] = [
  {
    id: "g1",
    course: "ISI-204",
    assignment: "Práctica 1",
    score: 18,
    maxScore: 20,
    status: "calificado",
    assignmentId: "asn-c1-1",
    feedback:
      "Muy buen análisis de complejidad temporal. Cuida la notación asintótica en el caso promedio: la justificaste bien para el peor caso, pero faltó detallar el promedio.",
    criteria: [
      { criterion: "Correctitud del algoritmo", score: 9, maxScore: 10, comment: "Implementación correcta y bien probada con casos borde." },
      { criterion: "Análisis de complejidad", score: 5, maxScore: 6, comment: "Big-O correcto; faltó justificar el caso promedio con más detalle." },
      { criterion: "Claridad y documentación", score: 4, maxScore: 4, comment: "Código limpio y bien comentado." },
    ],
  },
  {
    id: "g2",
    course: "ISI-204",
    assignment: "Práctica 2",
    score: 16,
    maxScore: 20,
    status: "calificado",
    assignmentId: "asn-c1-2",
    feedback:
      "La solución recursiva funciona, pero el backtracking no siempre poda el árbol de búsqueda de forma óptima. Revisa la condición de corte en el caso 3.",
    criteria: [
      { criterion: "Correctitud del algoritmo", score: 8, maxScore: 10, comment: "Falla en un caso borde con conjuntos vacíos." },
      { criterion: "Análisis de complejidad", score: 4, maxScore: 6, comment: "La poda podría reducir la complejidad práctica; no se aplicó del todo." },
      { criterion: "Claridad y documentación", score: 4, maxScore: 4, comment: "Buena documentación de la recursión." },
    ],
  },
  {
    id: "g3",
    course: "ISI-204",
    assignment: "Práctica 3",
    score: null,
    maxScore: 20,
    status: "pendiente",
    assignmentId: "asn-c1-3",
  },
  {
    id: "g4",
    course: "MAT-201",
    assignment: "Examen Parcial",
    score: 17,
    maxScore: 20,
    status: "calificado",
    assignmentId: "asn-c2-2",
    feedback:
      "Buen dominio de reglas de derivación. En el problema de optimización te faltó verificar el punto crítico con la segunda derivada.",
    criteria: [
      { criterion: "Planteamiento del problema", score: 5, maxScore: 5, comment: "Modelaste correctamente cada situación física." },
      { criterion: "Cálculo de derivadas", score: 8, maxScore: 9, comment: "Un error de signo en la regla de la cadena del ejercicio 4." },
      { criterion: "Interpretación de resultados", score: 4, maxScore: 6, comment: "Falta verificar máximos/mínimos con criterio de la segunda derivada." },
    ],
  },
  { id: "g5", course: "ISI-405", assignment: "Sprint Review 2", score: null, maxScore: 20, status: "atrasado", assignmentId: "asn-c3-1" },
  {
    id: "g6",
    course: "ECO-110",
    assignment: "Control de Lectura",
    score: 14,
    maxScore: 20,
    status: "calificado",
    assignmentId: "asn-c4-1",
    feedback:
      "Identificas bien los desplazamientos de la curva de demanda, pero el análisis de elasticidad-precio es superficial. Profundiza con ejemplos numéricos.",
    criteria: [
      { criterion: "Comprensión de conceptos", score: 6, maxScore: 8, comment: "Conceptos correctos, ejemplos poco desarrollados." },
      { criterion: "Análisis crítico", score: 5, maxScore: 8, comment: "Falta comparar con datos reales del mercado peruano." },
      { criterion: "Redacción y estructura", score: 3, maxScore: 4, comment: "Bien organizado." },
    ],
  },
];

export const MESSAGE_THREADS: readonly MessageThread[] = [
  { id: "m1", name: "Ana Torres", role: "Estudiante · ISI-204", avatar: "https://i.pravatar.cc/80?img=47", preview: "Profesora, ¿podría revisar mi entrega?", time: "09:12", unread: true },
  { id: "m2", name: "Luis Ramírez", role: "Estudiante · ISI-204", avatar: "https://i.pravatar.cc/80?img=12", preview: "Gracias por la retroalimentación", time: "Ayer", unread: false },
  { id: "m3", name: "Coordinación Académica", role: "Administración", avatar: "https://i.pravatar.cc/80?img=5", preview: "Recordatorio: entrega de actas el viernes", time: "Lun", unread: true },
  { id: "m4", name: "María Chávez", role: "Estudiante · ISI-310", avatar: "https://i.pravatar.cc/80?img=32", preview: "¿Hay clase de recuperación?", time: "Lun", unread: false },
];

export const CHAT_MESSAGES: readonly ChatMessage[] = [
  { id: "c1", from: "them", text: "Buenos días, profesora. ¿Podría revisar mi entrega de la Práctica 3?", time: "09:10" },
  { id: "c2", from: "me", text: "Claro Ana, la reviso hoy en la tarde y te dejo la nota en el sistema.", time: "09:11" },
  { id: "c3", from: "them", text: "Muchas gracias, quedo atenta.", time: "09:12" },
];

export const ANNOUNCEMENTS: readonly Announcement[] = [
  { id: "a1", title: "Cambio de aula - ISI-204", body: "La clase del miércoles se dictará en el laboratorio 3.", course: "ISI-204", date: "08 jul" },
  { id: "a2", title: "Fecha límite Proyecto Final", body: "Recuerden subir el proyecto antes del domingo 23:59.", course: "ISI-310", date: "07 jul" },
  { id: "a3", title: "Clase de repaso", body: "Se dictará una sesión extra de repaso antes del examen.", course: "ISI-501", date: "05 jul" },
];

export const CALENDAR_EVENTS: readonly CalendarEvent[] = [
  { id: "e1", day: 3, title: "Entrega Práctica 3 - ISI-204", type: "entrega", time: "23:59" },
  { id: "e2", day: 8, title: "Clase en vivo - ISI-310", type: "clase", time: "10:00" },
  { id: "e3", day: 12, title: "Examen Parcial - MAT-201", type: "examen", time: "08:00" },
  { id: "e4", day: 15, title: "Sprint Review 2 - ISI-405", type: "entrega", time: "18:00" },
  { id: "e5", day: 22, title: "Feria de Proyectos", type: "evento", time: "09:00" },
  { id: "e6", day: 28, title: "Examen Final - ISI-501", type: "examen", time: "14:00" },
];

export const NOTIFICATIONS = [
  { id: "n1", text: "Ana Torres envió un mensaje nuevo", time: "hace 5 min" },
  { id: "n2", text: "Se aproxima la entrega de Sprint Review 2", time: "hace 1 h" },
  { id: "n3", text: "Coordinación Académica publicó un anuncio", time: "hace 3 h" },
];

export const COURSE_MODULES: Record<string, readonly CourseModule[]> = {
  c1: [
    {
      id: "c1-w1",
      title: "Semana 1: Introducción",
      week: 1,
      items: [
        {
          id: "c1-w1-v1",
          type: "video",
          title: "Bienvenida al curso",
          duration: "8:32",
          estimatedMinutes: 9,
          completed: true,
          videoUrl: SAMPLE_VIDEO_URLS[0],
        },
        {
          id: "c1-w1-p1",
          type: "pdf",
          title: "Sílabo del curso",
          duration: "—",
          estimatedMinutes: 10,
          completed: true,
          pdfUrl: SAMPLE_PDF_URL,
        },
        {
          id: "c1-w1-l1",
          type: "lectura",
          title: "Lectura: ¿Por qué importa la complejidad algorítmica?",
          duration: "6 min",
          estimatedMinutes: 6,
          completed: true,
          body:
            "La complejidad algorítmica mide cómo crecen el tiempo de ejecución y el uso de memoria de un algoritmo a medida que aumenta el tamaño de la entrada. No se trata de medir segundos en un computador específico, sino de entender el comportamiento asintótico: qué pasa cuando n crece sin límite.\n\n" +
            "La notación Big-O (O grande) nos permite comparar algoritmos de forma independiente del hardware. Un algoritmo O(n) siempre escalará mejor que uno O(n²) para entradas suficientemente grandes, aunque en la práctica, para valores pequeños de n, el de mayor complejidad podría incluso ser más rápido por constantes ocultas.\n\n" +
            "En estructuras de datos, la elección correcta puede significar la diferencia entre un sistema que responde en milisegundos y uno que colapsa con miles de usuarios. Por ejemplo, buscar en una lista no ordenada es O(n), mientras que en un árbol binario de búsqueda balanceado es O(log n).\n\n" +
            "A lo largo de este curso analizaremos algoritmos de ordenamiento, búsqueda, recorrido de árboles y grafos, siempre preguntándonos: ¿cuál es el peor caso?, ¿cuál es el caso promedio?, ¿existe una cota inferior teórica para este problema?\n\n" +
            "Comprender esto no es un ejercicio académico abstracto: es la base para tomar decisiones de ingeniería informadas cuando el volumen de datos de un sistema real crece varios órdenes de magnitud.",
        },
      ],
    },
    {
      id: "c1-w2",
      title: "Semana 2: Pilas, Colas y Listas Enlazadas",
      week: 2,
      items: [
        {
          id: "c1-w2-v1",
          type: "video",
          title: "Pilas y colas: implementación y aplicaciones",
          duration: "17:05",
          estimatedMinutes: 17,
          completed: true,
          videoUrl: SAMPLE_VIDEO_URLS[1],
        },
        {
          id: "c1-w2-p1",
          type: "pdf",
          title: "Guía de ejercicios: listas enlazadas",
          duration: "—",
          estimatedMinutes: 15,
          completed: false,
          pdfUrl: SAMPLE_PDF_URL,
        },
      ],
    },
    {
      id: "c1-w3",
      title: "Semana 3: Árboles y Grafos",
      week: 3,
      items: [
        {
          id: "c1-w3-v1",
          type: "video",
          title: "Árboles binarios de búsqueda",
          duration: "22:10",
          estimatedMinutes: 22,
          completed: false,
          videoUrl: SAMPLE_VIDEO_URLS[2],
        },
        {
          id: "c1-w3-l1",
          type: "lectura",
          title: "Lectura: Recorridos en grafos",
          duration: "8 min",
          estimatedMinutes: 8,
          completed: false,
          body:
            "Un grafo es una estructura de datos compuesta por vértices (o nodos) y aristas que representan relaciones entre ellos. A diferencia de los árboles, los grafos pueden tener ciclos y no requieren una raíz definida, lo que los hace ideales para modelar redes sociales, mapas de carreteras o dependencias entre tareas.\n\n" +
            "Existen dos estrategias fundamentales para recorrer un grafo: BFS (Breadth-First Search, o búsqueda en anchura) y DFS (Depth-First Search, o búsqueda en profundidad). BFS explora nivel por nivel usando una cola, y es la estrategia natural cuando se busca el camino más corto en un grafo no ponderado.\n\n" +
            "DFS, en cambio, se sumerge lo más posible por una rama antes de retroceder (backtrack), típicamente implementado con una pila o recursión. Es especialmente útil para detectar ciclos, encontrar componentes conexas y resolver problemas de ordenamiento topológico.\n\n" +
            "La complejidad de ambos recorridos es O(V + E), donde V es el número de vértices y E el número de aristas, siempre que el grafo se represente con listas de adyacencia. Si se usa una matriz de adyacencia, la complejidad espacial sube a O(V²), lo cual es ineficiente para grafos dispersos.\n\n" +
            "En la práctica de esta semana implementaremos ambos recorridos sobre un grafo dirigido que representa las dependencias entre módulos de un sistema de software, y usaremos DFS para detectar si existen dependencias circulares.",
        },
        {
          id: "c1-w3-p1",
          type: "pdf",
          title: "Guía de práctica 3",
          duration: "—",
          estimatedMinutes: 20,
          completed: false,
          pdfUrl: SAMPLE_PDF_URL,
        },
      ],
    },
  ],
  c2: [
    {
      id: "c2-w1",
      title: "Semana 1: Límites",
      week: 1,
      items: [
        {
          id: "c2-w1-v1",
          type: "video",
          title: "Introducción a límites",
          duration: "15:00",
          estimatedMinutes: 15,
          completed: true,
          videoUrl: SAMPLE_VIDEO_URLS[3],
        },
        {
          id: "c2-w1-l1",
          type: "lectura",
          title: "Lectura: La idea intuitiva de límite",
          duration: "5 min",
          estimatedMinutes: 5,
          completed: true,
          body:
            "El concepto de límite es la piedra angular sobre la que se construye todo el cálculo diferencial e integral. Intuitivamente, el límite de una función f(x) cuando x se aproxima a un valor a describe el comportamiento de f cerca de a, sin necesariamente evaluarla exactamente en a.\n\n" +
            "Esto es crucial porque muchas funciones importantes en física no están definidas en el punto de interés. Por ejemplo, la velocidad instantánea se define como el límite de la velocidad media cuando el intervalo de tiempo tiende a cero: v = lim(Δt→0) Δx/Δt.\n\n" +
            "Formalmente, decimos que el límite de f(x) cuando x tiende a a es L si, para todo ε > 0, existe un δ > 0 tal que |f(x) − L| < ε siempre que 0 < |x − a| < δ. Esta definición épsilon-delta, aunque abstracta, garantiza rigor matemático donde la intuición geométrica puede fallar.\n\n" +
            "Los límites laterales (por la izquierda y por la derecha) permiten analizar funciones con discontinuidades, como las funciones a trozos. Un límite existe si y solo si ambos límites laterales existen y son iguales.\n\n" +
            "Esta semana trabajaremos con límites algebraicos, límites al infinito y la relación entre continuidad y límite, sentando las bases para introducir la derivada en la siguiente semana.",
        },
      ],
    },
    {
      id: "c2-w2",
      title: "Semana 2: La Derivada y su Interpretación Física",
      week: 2,
      items: [
        {
          id: "c2-w2-v1",
          type: "video",
          title: "La derivada como razón de cambio instantánea",
          duration: "19:40",
          estimatedMinutes: 20,
          completed: true,
          videoUrl: SAMPLE_VIDEO_URLS[4],
        },
        {
          id: "c2-w2-p1",
          type: "pdf",
          title: "Tabla de derivadas y ejercicios resueltos",
          duration: "—",
          estimatedMinutes: 12,
          completed: true,
          pdfUrl: SAMPLE_PDF_URL,
        },
        {
          id: "c2-w2-l1",
          type: "lectura",
          title: "Lectura: De la velocidad media a la velocidad instantánea",
          duration: "7 min",
          estimatedMinutes: 7,
          completed: false,
          body:
            "En física, la posición de un objeto en movimiento se describe con una función x(t). La velocidad media entre dos instantes t₁ y t₂ es simplemente el cambio de posición dividido entre el cambio de tiempo: v_media = (x(t₂) − x(t₁)) / (t₂ − t₁).\n\n" +
            "Pero esta velocidad media oculta información: no nos dice qué tan rápido se movía el objeto en un instante exacto. Para obtener la velocidad instantánea, hacemos que el intervalo de tiempo se reduzca hasta casi desaparecer, es decir, tomamos el límite cuando Δt tiende a cero. Ese límite es, por definición, la derivada de x(t) respecto a t.\n\n" +
            "De la misma manera, la aceleración instantánea es la derivada de la velocidad respecto al tiempo, o la segunda derivada de la posición. Esta cadena de derivadas (posición → velocidad → aceleración) es uno de los ejemplos más claros de cómo el cálculo describe el movimiento real.\n\n" +
            "Newton desarrolló buena parte del cálculo diferencial precisamente para resolver problemas de mecánica: necesitaba una herramienta matemática que capturara el cambio instantáneo, no solo el cambio promedio en un intervalo.\n\n" +
            "Practicaremos calculando derivadas de funciones polinómicas, trigonométricas y exponenciales, y las interpretaremos siempre en términos de razón de cambio: ¿qué significa esta derivada en el contexto del problema?",
        },
      ],
    },
  ],
  c3: [
    {
      id: "c3-w1",
      title: "Semana 1: Introducción a la Ingeniería de Software",
      week: 1,
      items: [
        {
          id: "c3-w1-v1",
          type: "video",
          title: "El ciclo de vida del software",
          duration: "14:20",
          estimatedMinutes: 14,
          completed: true,
          videoUrl: SAMPLE_VIDEO_URLS[5],
        },
        {
          id: "c3-w1-l1",
          type: "lectura",
          title: "Lectura: Modelos de proceso de software",
          duration: "6 min",
          estimatedMinutes: 6,
          completed: true,
          body:
            "La ingeniería de software estudia cómo construir sistemas de software de forma sistemática, disciplinada y medible. A diferencia de la programación aislada, involucra procesos, roles, herramientas y prácticas de gestión que escalan a equipos grandes y proyectos de larga duración.\n\n" +
            "El modelo en cascada, uno de los primeros formalizados, propone fases secuenciales: análisis, diseño, implementación, pruebas y mantenimiento. Su rigidez lo hace poco adecuado para proyectos con requerimientos cambiantes, pero sigue siendo útil en contextos regulados donde el alcance es fijo desde el inicio.\n\n" +
            "Como respuesta a esa rigidez surgieron los modelos iterativos e incrementales, y más adelante las metodologías ágiles, que priorizan entregas frecuentes de software funcional y retroalimentación continua del cliente por encima de la documentación exhaustiva.\n\n" +
            "Elegir un modelo de proceso no es una decisión trivial: depende de la estabilidad de los requerimientos, el tamaño del equipo, el nivel de riesgo del proyecto y las restricciones contractuales o regulatorias.\n\n" +
            "En este curso usaremos Scrum como marco de trabajo principal para nuestro proyecto final, complementado con prácticas de ingeniería como integración continua y revisión de código entre pares.",
        },
      ],
    },
    {
      id: "c3-w2",
      title: "Semana 2: Metodologías Ágiles",
      week: 2,
      items: [
        {
          id: "c3-w2-v1",
          type: "video",
          title: "Scrum en la práctica",
          duration: "18:45",
          estimatedMinutes: 19,
          completed: false,
          videoUrl: SAMPLE_VIDEO_URLS[6],
        },
        {
          id: "c3-w2-p1",
          type: "pdf",
          title: "Plantilla de Sprint Review",
          duration: "—",
          estimatedMinutes: 10,
          completed: false,
          pdfUrl: SAMPLE_PDF_URL,
        },
      ],
    },
  ],
  c4: [
    {
      id: "c4-w1",
      title: "Semana 1: Introducción a la Microeconomía",
      week: 1,
      items: [
        {
          id: "c4-w1-v1",
          type: "video",
          title: "Oferta, demanda y equilibrio de mercado",
          duration: "16:15",
          estimatedMinutes: 16,
          completed: true,
          videoUrl: SAMPLE_VIDEO_URLS[7],
        },
        {
          id: "c4-w1-l1",
          type: "lectura",
          title: "Lectura: Oferta, demanda y elasticidad-precio",
          duration: "6 min",
          estimatedMinutes: 6,
          completed: true,
          body:
            "La curva de demanda describe la cantidad de un bien que los consumidores están dispuestos a comprar a distintos niveles de precio, manteniendo todo lo demás constante. Su pendiente negativa refleja la ley de la demanda: a mayor precio, menor cantidad demandada.\n\n" +
            "La curva de oferta, en cambio, tiene pendiente positiva: los productores están dispuestos a ofrecer más unidades cuanto mayor sea el precio de venta, ya que se vuelve más rentable producir. El punto donde ambas curvas se cruzan determina el precio y la cantidad de equilibrio de mercado.\n\n" +
            "La elasticidad-precio de la demanda mide qué tan sensible es la cantidad demandada ante cambios en el precio. Se calcula como el cambio porcentual en la cantidad demandada dividido entre el cambio porcentual en el precio. Bienes con pocos sustitutos (como la gasolina) suelen tener demanda inelástica.\n\n" +
            "Los desplazamientos de las curvas (distintos de los movimientos a lo largo de ellas) ocurren cuando cambian factores externos: el ingreso de los consumidores, el precio de bienes relacionados, las expectativas o los costos de producción.\n\n" +
            "Comprender estos desplazamientos es esencial para analizar políticas públicas, como el efecto de un impuesto o un subsidio sobre el precio y la cantidad de equilibrio en un mercado real, como el peruano.",
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Detalle de curso: sílabo, anuncios y progreso desglosado           */
/* ------------------------------------------------------------------ */

export const COURSE_SYLLABUS: Record<string, CourseSyllabus> = {
  c1: {
    professor: "Dra. Elena Vargas",
    description:
      "Curso introductorio a las estructuras de datos fundamentales (listas, pilas, colas, árboles y grafos) y a las técnicas de análisis de algoritmos que permiten evaluar su eficiencia. Se combina teoría con práctica intensiva de programación en un lenguaje de propósito general.",
    objectives: [
      "Analizar la complejidad temporal y espacial de un algoritmo usando notación asintótica.",
      "Implementar y aplicar correctamente listas enlazadas, pilas, colas, árboles binarios y grafos.",
      "Seleccionar la estructura de datos adecuada según las restricciones de un problema real.",
      "Diseñar algoritmos recursivos y de backtracking para problemas de búsqueda y optimización.",
    ],
  },
  c2: {
    professor: "Ing. Roberto Salas",
    description:
      "Curso de cálculo diferencial de una variable orientado a estudiantes de ingeniería, con énfasis en la interpretación física de los conceptos: límites, continuidad, derivadas y sus aplicaciones a problemas de razón de cambio, optimización y movimiento.",
    objectives: [
      "Calcular límites de funciones algebraicas, trigonométricas y exponenciales.",
      "Determinar la continuidad de una función en un punto y en un intervalo.",
      "Calcular derivadas usando las reglas de derivación y aplicarlas a problemas de razón de cambio.",
      "Resolver problemas de optimización y modelar fenómenos físicos con herramientas del cálculo diferencial.",
    ],
  },
  c3: {
    professor: "Dra. Elena Vargas",
    description:
      "Curso aplicado sobre el ciclo de vida del desarrollo de software, con foco en metodologías ágiles (Scrum), buenas prácticas de ingeniería (integración continua, revisión de código) y gestión de un proyecto de software real en equipo durante todo el ciclo académico.",
    objectives: [
      "Aplicar el marco de trabajo Scrum en un proyecto de software real en equipo.",
      "Redactar historias de usuario y criterios de aceptación claros y verificables.",
      "Practicar integración continua y revisión de código entre pares.",
      "Evaluar críticamente la calidad de un producto de software mediante métricas y retrospectivas.",
    ],
  },
  c4: {
    professor: "Mg. Patricia Ruiz",
    description:
      "Introducción a los principios de la microeconomía: comportamiento de consumidores y empresas, formación de precios en mercados competitivos, elasticidades y una primera aproximación a la macroeconomía peruana (inflación, PBI y política monetaria).",
    objectives: [
      "Explicar la formación del precio y la cantidad de equilibrio en un mercado competitivo.",
      "Calcular e interpretar elasticidades de demanda y oferta.",
      "Analizar el efecto de impuestos, subsidios y controles de precio sobre el bienestar.",
      "Relacionar los conceptos microeconómicos con la coyuntura económica peruana actual.",
    ],
  },
};

export const COURSE_ANNOUNCEMENTS: Record<string, readonly CourseAnnouncement[]> = {
  c1: [
    {
      id: "ca1-1",
      title: "Cambio de aula para la clase del miércoles",
      body: "La clase del miércoles se dictará en el Laboratorio de Cómputo 3 debido a mantenimiento del Aula 204.",
      author: "Dra. Elena Vargas",
      date: "08 jul 2026",
    },
    {
      id: "ca1-2",
      title: "Publicada la guía de la Práctica 3",
      body: "Ya está disponible en el módulo de Semana 3 la guía completa de la Práctica 3 sobre árboles y grafos. Revisen los criterios de evaluación antes de empezar.",
      author: "Dra. Elena Vargas",
      date: "05 jul 2026",
    },
    {
      id: "ca1-3",
      title: "Horario de asesoría extendido",
      body: "Este ciclo tendré una hora adicional de asesoría los viernes de 15:00 a 16:00 en la oficina 4B, además del horario habitual.",
      author: "Dra. Elena Vargas",
      date: "01 jul 2026",
    },
  ],
  c2: [
    {
      id: "ca2-1",
      title: "Resultados del Examen Parcial disponibles",
      body: "Ya pueden revisar sus notas y la retroalimentación detallada del Examen Parcial en la sección de Calificaciones.",
      author: "Ing. Roberto Salas",
      date: "07 jul 2026",
    },
    {
      id: "ca2-2",
      title: "Material adicional de derivadas",
      body: "Subí una tabla de derivadas con ejercicios resueltos paso a paso a la Semana 2. Les recomiendo repasarla antes del taller.",
      author: "Ing. Roberto Salas",
      date: "03 jul 2026",
    },
  ],
  c3: [
    {
      id: "ca3-1",
      title: "Recordatorio: Sprint Review 2 esta semana",
      body: "El Sprint Review 2 vence el 15 de julio. Todos los equipos deben presentar el incremento funcional en la sesión sincrónica.",
      author: "Dra. Elena Vargas",
      date: "09 jul 2026",
    },
    {
      id: "ca3-2",
      title: "Nueva plantilla de retrospectiva",
      body: "Actualicé la plantilla de Sprint Review con una sección de métricas de velocidad del equipo. Úsenla desde este sprint.",
      author: "Dra. Elena Vargas",
      date: "02 jul 2026",
    },
  ],
  c4: [
    {
      id: "ca4-1",
      title: "Foro sobre inflación en el Perú habilitado",
      body: "Abrí un hilo en el foro del curso para discutir las cifras de inflación publicadas este mes por el BCRP. Participen antes del viernes.",
      author: "Mg. Patricia Ruiz",
      date: "06 jul 2026",
    },
    {
      id: "ca4-2",
      title: "Fecha límite del Ensayo sobre inflación",
      body: "Recuerden que el ensayo sobre inflación en el Perú se entrega el 20 de julio a través de la plataforma. No se aceptan entregas por correo.",
      author: "Mg. Patricia Ruiz",
      date: "04 jul 2026",
    },
  ],
};

export const COURSE_PROGRESS: Record<string, CourseProgressBreakdown> = {
  c1: { overall: 68, modules: 60, assignments: 67, quizzes: 80 },
  c2: { overall: 90, modules: 100, assignments: 100, quizzes: 70 },
  c3: { overall: 55, modules: 50, assignments: 50, quizzes: 60 },
  c4: { overall: 33, modules: 40, assignments: 50, quizzes: 0 },
};

/* ------------------------------------------------------------------ */
/* Tareas / Assignments                                               */
/* ------------------------------------------------------------------ */

export const ASSIGNMENTS: Record<string, readonly Assignment[]> = {
  c1: [
    {
      id: "asn-c1-1",
      courseId: "c1",
      title: "Práctica 1: Complejidad Algorítmica",
      instructions:
        "Analiza la complejidad temporal y espacial de los cinco algoritmos de búsqueda y ordenamiento proporcionados en el enunciado adjunto.\n\n" +
        "Para cada algoritmo debes: (1) determinar su complejidad en el mejor caso, caso promedio y peor caso usando notación Big-O; (2) justificar matemáticamente tu análisis mostrando el conteo de operaciones; (3) implementar el algoritmo en el lenguaje visto en clase y medir su tiempo de ejecución real con al menos tres tamaños de entrada distintos.\n\n" +
        "Se evaluará tanto la correctitud de la implementación como el rigor del análisis teórico. No se aceptan análisis basados únicamente en la ejecución empírica: deben sustentar con las herramientas matemáticas vistas en clase.",
      dueDate: "2026-06-20",
      points: 20,
      status: "calificado",
      acceptedFormats: ["pdf", "docx", "zip"],
      rubric: [
        { id: "r1", name: "Correctitud del algoritmo", points: 10, levels: [
          { label: "Excelente", points: 10, description: "Implementación correcta en todos los casos, incluidos casos borde." },
          { label: "Bueno", points: 7, description: "Implementación correcta con fallas menores en casos borde." },
          { label: "Insuficiente", points: 3, description: "Implementación con errores que afectan el resultado." },
        ] },
        { id: "r2", name: "Análisis de complejidad", points: 6, levels: [
          { label: "Excelente", points: 6, description: "Análisis riguroso y correcto para los tres casos." },
          { label: "Bueno", points: 4, description: "Análisis correcto pero incompleto en algún caso." },
          { label: "Insuficiente", points: 1, description: "Análisis ausente o incorrecto." },
        ] },
        { id: "r3", name: "Claridad y documentación", points: 4, levels: [
          { label: "Excelente", points: 4, description: "Código limpio, bien comentado y de fácil lectura." },
          { label: "Insuficiente", points: 1, description: "Código difícil de seguir o sin comentarios." },
        ] },
      ],
      grade: {
        score: 18,
        feedback:
          "Muy buen análisis de complejidad temporal. Cuida la notación asintótica en el caso promedio: la justificaste bien para el peor caso, pero faltó detallar el promedio.",
        criteria: [
          { criterionId: "r1", score: 9, comment: "Implementación correcta y bien probada con casos borde." },
          { criterionId: "r2", score: 5, comment: "Big-O correcto; faltó justificar el caso promedio con más detalle." },
          { criterionId: "r3", score: 4, comment: "Código limpio y bien comentado." },
        ],
      },
    },
    {
      id: "asn-c1-2",
      courseId: "c1",
      title: "Práctica 2: Recursividad y Backtracking",
      instructions:
        "Implementa una solución recursiva con backtracking para el problema de las N-Reinas y para el problema de subconjuntos con suma objetivo (subset sum).\n\n" +
        "Tu solución debe incluir una función de poda que evite explorar ramas del árbol de búsqueda que ya no pueden llevar a una solución válida. Documenta explícitamente en el código dónde ocurre la poda y por qué es correcta.\n\n" +
        "Adjunta además un diagrama (a mano o digital) del árbol de recursión para una entrada pequeña (N=4 en el caso de las N-Reinas), señalando qué ramas fueron podadas.",
      dueDate: "2026-06-27",
      points: 20,
      status: "calificado",
      acceptedFormats: ["pdf", "zip"],
      rubric: [
        { id: "r1", name: "Correctitud del algoritmo", points: 10, levels: [
          { label: "Excelente", points: 10, description: "Encuentra todas las soluciones válidas sin duplicados." },
          { label: "Bueno", points: 7, description: "Encuentra la mayoría de soluciones con algún caso borde fallido." },
          { label: "Insuficiente", points: 3, description: "Falla en casos generales." },
        ] },
        { id: "r2", name: "Análisis de complejidad", points: 6, levels: [
          { label: "Excelente", points: 6, description: "Identifica correctamente el efecto de la poda en la complejidad práctica." },
          { label: "Bueno", points: 4, description: "Análisis parcial de la poda." },
          { label: "Insuficiente", points: 1, description: "No analiza el efecto de la poda." },
        ] },
        { id: "r3", name: "Claridad y documentación", points: 4, levels: [
          { label: "Excelente", points: 4, description: "Diagrama claro y código bien documentado." },
          { label: "Insuficiente", points: 1, description: "Sin diagrama o documentación insuficiente." },
        ] },
      ],
      grade: {
        score: 16,
        feedback:
          "La solución recursiva funciona, pero el backtracking no siempre poda el árbol de búsqueda de forma óptima. Revisa la condición de corte en el caso 3.",
        criteria: [
          { criterionId: "r1", score: 8, comment: "Falla en un caso borde con conjuntos vacíos." },
          { criterionId: "r2", score: 4, comment: "La poda podría reducir la complejidad práctica; no se aplicó del todo." },
          { criterionId: "r3", score: 4, comment: "Buena documentación de la recursión." },
        ],
      },
    },
    {
      id: "asn-c1-3",
      courseId: "c1",
      title: "Práctica 3: Árboles y Grafos",
      instructions:
        "Implementa un árbol binario de búsqueda (BST) con operaciones de inserción, eliminación y los tres recorridos clásicos (in-order, pre-order, post-order).\n\n" +
        "Luego, usando una lista de adyacencia, implementa un grafo dirigido y aplica BFS y DFS para: (1) determinar si existe un camino entre dos nodos dados, y (2) detectar si el grafo contiene ciclos.\n\n" +
        "Como caso de aplicación, modela las dependencias entre los módulos de un sistema de software ficticio (proporcionado en el anexo) y determina si es posible compilarlos en algún orden válido (ordenamiento topológico).",
      dueDate: "2026-07-18",
      points: 20,
      status: "pendiente",
      acceptedFormats: ["pdf", "zip"],
      rubric: [
        { id: "r1", name: "Correctitud del algoritmo", points: 10, levels: [
          { label: "Excelente", points: 10, description: "BST y grafo correctamente implementados con todos los casos." },
          { label: "Insuficiente", points: 3, description: "Implementación incompleta o con errores graves." },
        ] },
        { id: "r2", name: "Análisis de complejidad", points: 6, levels: [
          { label: "Excelente", points: 6, description: "Complejidad correcta para BST balanceado y no balanceado, y para BFS/DFS." },
          { label: "Insuficiente", points: 1, description: "Sin análisis o incorrecto." },
        ] },
        { id: "r3", name: "Claridad y documentación", points: 4, levels: [
          { label: "Excelente", points: 4, description: "Código legible con comentarios claros sobre cada recorrido." },
          { label: "Insuficiente", points: 1, description: "Código desordenado o sin comentarios." },
        ] },
      ],
    },
  ],
  c2: [
    {
      id: "asn-c2-1",
      courseId: "c2",
      title: "Taller de Límites y Continuidad",
      instructions:
        "Resuelve los 12 ejercicios del taller adjunto sobre cálculo de límites algebraicos, límites al infinito y análisis de continuidad de funciones a trozos.\n\n" +
        "Para cada ejercicio de continuidad, indica explícitamente si la función es continua en el punto analizado y, en caso de no serlo, clasifica el tipo de discontinuidad (evitable, de salto o infinita).\n\n" +
        "El ejercicio 12 requiere aplicar el teorema del valor intermedio para demostrar la existencia de una raíz en un intervalo dado: justifica cada hipótesis del teorema antes de aplicarlo.",
      dueDate: "2026-07-05",
      points: 15,
      status: "entregado",
      acceptedFormats: ["pdf"],
      rubric: [
        { id: "r1", name: "Planteamiento del problema", points: 5, levels: [
          { label: "Excelente", points: 5, description: "Identifica correctamente la técnica adecuada para cada límite." },
          { label: "Insuficiente", points: 1, description: "Confunde técnicas o no plantea el problema." },
        ] },
        { id: "r2", name: "Cálculo de derivadas", points: 6, levels: [
          { label: "Excelente", points: 6, description: "Cálculos algebraicos correctos y bien justificados." },
          { label: "Insuficiente", points: 2, description: "Errores algebraicos frecuentes." },
        ] },
        { id: "r3", name: "Interpretación de resultados", points: 4, levels: [
          { label: "Excelente", points: 4, description: "Clasifica correctamente discontinuidades e interpreta resultados." },
          { label: "Insuficiente", points: 1, description: "No interpreta o clasifica incorrectamente." },
        ] },
      ],
    },
    {
      id: "asn-c2-2",
      courseId: "c2",
      title: "Examen Parcial: Derivadas",
      instructions:
        "Examen individual sobre reglas de derivación (potencia, producto, cociente, cadena) y sus aplicaciones a problemas de razón de cambio y optimización.\n\n" +
        "Incluye problemas de física: velocidad y aceleración instantánea a partir de una función de posición, y un problema de optimización de área/volumen con restricciones.\n\n" +
        "Debes mostrar todo el procedimiento algebraico; las respuestas sin desarrollo no recibirán puntaje, incluso si el resultado final es correcto.",
      dueDate: "2026-06-28",
      points: 20,
      status: "calificado",
      acceptedFormats: ["pdf"],
      rubric: [
        { id: "r1", name: "Planteamiento del problema", points: 5, levels: [
          { label: "Excelente", points: 5, description: "Modela correctamente cada situación física u óptima." },
          { label: "Insuficiente", points: 1, description: "Modelo incorrecto o ausente." },
        ] },
        { id: "r2", name: "Cálculo de derivadas", points: 9, levels: [
          { label: "Excelente", points: 9, description: "Aplica correctamente todas las reglas de derivación." },
          { label: "Insuficiente", points: 3, description: "Errores frecuentes en las reglas de derivación." },
        ] },
        { id: "r3", name: "Interpretación de resultados", points: 6, levels: [
          { label: "Excelente", points: 6, description: "Verifica máximos/mínimos con el criterio de la segunda derivada." },
          { label: "Insuficiente", points: 2, description: "No verifica la naturaleza del punto crítico." },
        ] },
      ],
      grade: {
        score: 17,
        feedback:
          "Buen dominio de reglas de derivación. En el problema de optimización te faltó verificar el punto crítico con la segunda derivada.",
        criteria: [
          { criterionId: "r1", score: 5, comment: "Modelaste correctamente cada situación física." },
          { criterionId: "r2", score: 8, comment: "Un error de signo en la regla de la cadena del ejercicio 4." },
          { criterionId: "r3", score: 4, comment: "Falta verificar máximos/mínimos con criterio de la segunda derivada." },
        ],
      },
    },
  ],
  c3: [
    {
      id: "asn-c3-1",
      courseId: "c3",
      title: "Sprint Review 2: Documentación del Incremento",
      instructions:
        "Presenta la documentación del incremento funcional del Sprint 2: historias de usuario completadas, criterios de aceptación verificados y evidencia de pruebas ejecutadas.\n\n" +
        "Incluye el burndown chart del sprint y una breve reflexión del equipo sobre qué historias no se completaron y por qué, alineada con la retrospectiva del sprint.\n\n" +
        "La entrega debe estar firmada por todos los integrantes del equipo, indicando el rol y las tareas específicas que cada uno desarrolló durante el sprint.",
      dueDate: "2026-06-30",
      points: 20,
      status: "pendiente",
      acceptedFormats: ["pdf", "docx"],
      rubric: [
        { id: "r1", name: "Cumplimiento del sprint", points: 8, levels: [
          { label: "Excelente", points: 8, description: "Todas las historias comprometidas fueron completadas y verificadas." },
          { label: "Insuficiente", points: 2, description: "Menos de la mitad de las historias comprometidas se completaron." },
        ] },
        { id: "r2", name: "Calidad de la documentación", points: 7, levels: [
          { label: "Excelente", points: 7, description: "Documentación completa, clara y con evidencia de pruebas." },
          { label: "Insuficiente", points: 2, description: "Documentación incompleta o sin evidencia." },
        ] },
        { id: "r3", name: "Reflexión y mejora continua", points: 5, levels: [
          { label: "Excelente", points: 5, description: "Reflexión honesta y propuestas concretas de mejora." },
          { label: "Insuficiente", points: 1, description: "Reflexión superficial o ausente." },
        ] },
      ],
    },
    {
      id: "asn-c3-2",
      courseId: "c3",
      title: "Retrospectiva de Sprint",
      instructions:
        "Documenta la retrospectiva del equipo usando la técnica 'Empezar / Parar / Continuar', identificando al menos tres acciones concretas para el próximo sprint.\n\n" +
        "Adjunta las notas del tablero colaborativo utilizado durante la sesión (captura de pantalla o exportación) y un resumen de los acuerdos tomados por el equipo.\n\n" +
        "Cada acción de mejora propuesta debe tener un responsable asignado y un criterio claro para verificar si se cumplió en el siguiente sprint.",
      dueDate: "2026-07-02",
      points: 10,
      status: "entregado",
      acceptedFormats: ["pdf", "docx"],
      rubric: [
        { id: "r1", name: "Cumplimiento del sprint", points: 3, levels: [
          { label: "Excelente", points: 3, description: "Técnica aplicada correctamente con participación de todo el equipo." },
          { label: "Insuficiente", points: 1, description: "Aplicación superficial de la técnica." },
        ] },
        { id: "r2", name: "Calidad de la documentación", points: 4, levels: [
          { label: "Excelente", points: 4, description: "Evidencia clara y bien organizada." },
          { label: "Insuficiente", points: 1, description: "Evidencia incompleta." },
        ] },
        { id: "r3", name: "Reflexión y mejora continua", points: 3, levels: [
          { label: "Excelente", points: 3, description: "Acciones concretas, medibles y con responsable asignado." },
          { label: "Insuficiente", points: 1, description: "Acciones vagas o sin responsable." },
        ] },
      ],
    },
  ],
  c4: [
    {
      id: "asn-c4-1",
      courseId: "c4",
      title: "Control de Lectura: Oferta y Demanda",
      instructions:
        "Lee el capítulo 3 del texto guía sobre oferta, demanda y equilibrio de mercado, y responde el cuestionario de 8 preguntas adjunto.\n\n" +
        "Se te pedirá explicar, con tus propias palabras, la diferencia entre un movimiento a lo largo de la curva de demanda y un desplazamiento de la curva completa, usando un ejemplo real del mercado peruano.\n\n" +
        "Además, deberás calcular la elasticidad-precio de la demanda para el caso numérico presentado en la pregunta 7 e interpretar el resultado.",
      dueDate: "2026-06-25",
      points: 20,
      status: "calificado",
      acceptedFormats: ["pdf", "docx"],
      rubric: [
        { id: "r1", name: "Comprensión de conceptos", points: 8, levels: [
          { label: "Excelente", points: 8, description: "Explica correctamente todos los conceptos con ejemplos propios." },
          { label: "Insuficiente", points: 2, description: "Conceptos confundidos o sin ejemplos." },
        ] },
        { id: "r2", name: "Análisis crítico", points: 8, levels: [
          { label: "Excelente", points: 8, description: "Compara con datos reales del mercado peruano de forma rigurosa." },
          { label: "Insuficiente", points: 2, description: "Sin análisis crítico ni datos reales." },
        ] },
        { id: "r3", name: "Redacción y estructura", points: 4, levels: [
          { label: "Excelente", points: 4, description: "Redacción clara, ordenada y sin errores." },
          { label: "Insuficiente", points: 1, description: "Redacción confusa o desordenada." },
        ] },
      ],
      grade: {
        score: 14,
        feedback:
          "Identificas bien los desplazamientos de la curva de demanda, pero el análisis de elasticidad-precio es superficial. Profundiza con ejemplos numéricos.",
        criteria: [
          { criterionId: "r1", score: 6, comment: "Conceptos correctos, ejemplos poco desarrollados." },
          { criterionId: "r2", score: 5, comment: "Falta comparar con datos reales del mercado peruano." },
          { criterionId: "r3", score: 3, comment: "Bien organizado." },
        ],
      },
    },
    {
      id: "asn-c4-2",
      courseId: "c4",
      title: "Ensayo: Inflación en el Perú",
      instructions:
        "Redacta un ensayo de 1500 a 2000 palabras analizando la evolución de la inflación en el Perú durante los últimos 24 meses, usando datos oficiales del BCRP y del INEI.\n\n" +
        "Tu ensayo debe explicar al menos dos causas de la inflación observada (por ejemplo, choques de oferta, expansión monetaria o expectativas) y evaluar la efectividad de las medidas de política monetaria adoptadas.\n\n" +
        "Se exige el uso de al menos cuatro fuentes citadas correctamente en formato APA, y al menos un gráfico propio elaborado a partir de datos oficiales.",
      dueDate: "2026-07-20",
      points: 20,
      status: "pendiente",
      acceptedFormats: ["pdf", "docx"],
      rubric: [
        { id: "r1", name: "Comprensión de conceptos", points: 6, levels: [
          { label: "Excelente", points: 6, description: "Explica correctamente los mecanismos inflacionarios discutidos." },
          { label: "Insuficiente", points: 2, description: "Conceptos macroeconómicos confundidos." },
        ] },
        { id: "r2", name: "Análisis crítico", points: 10, levels: [
          { label: "Excelente", points: 10, description: "Análisis riguroso con datos oficiales y evaluación crítica de la política monetaria." },
          { label: "Insuficiente", points: 3, description: "Sin datos oficiales ni evaluación crítica." },
        ] },
        { id: "r3", name: "Redacción y estructura", points: 4, levels: [
          { label: "Excelente", points: 4, description: "Ensayo bien estructurado, citado en APA y sin errores." },
          { label: "Insuficiente", points: 1, description: "Estructura deficiente o citas incorrectas." },
        ] },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Exámenes / Quizzes                                                  */
/* ------------------------------------------------------------------ */

export const QUIZZES: Record<string, readonly Quiz[]> = {
  c1: [
    {
      id: "quiz-c1-1",
      courseId: "c1",
      title: "Examen Parcial 1: Fundamentos y Física-Matemática Básica",
      durationMinutes: 60,
      attemptsAllowed: 2,
      questions: [
        { id: "q1", type: "opcion_multiple", points: 2, text: "¿Cuál es la complejidad en el peor caso de la búsqueda binaria sobre un arreglo ordenado de n elementos?",
          options: [{ id: "a", text: "O(1)" }, { id: "b", text: "O(log n)" }, { id: "c", text: "O(n)" }, { id: "d", text: "O(n log n)" }],
          correctOptionId: "b" },
        { id: "q2", type: "verdadero_falso", points: 1, text: "Un algoritmo con complejidad O(n²) siempre es más lento en la práctica que uno O(n) para cualquier tamaño de entrada.",
          correctAnswer: false },
        { id: "q3", type: "opcion_multiple", points: 2, text: "Un objeto cae libremente desde el reposo. Si la aceleración de la gravedad es g = 9.8 m/s², ¿qué velocidad alcanza tras 3 segundos?",
          options: [{ id: "a", text: "9.8 m/s" }, { id: "b", text: "19.6 m/s" }, { id: "c", text: "29.4 m/s" }, { id: "d", text: "44.1 m/s" }],
          correctOptionId: "c" },
        { id: "q4", type: "opcion_multiple", points: 2, text: "¿Cuál es la derivada de f(x) = 3x² + 5x?",
          options: [{ id: "a", text: "6x + 5" }, { id: "b", text: "3x + 5" }, { id: "c", text: "6x" }, { id: "d", text: "x² + 5" }],
          correctOptionId: "a" },
        { id: "q5", type: "verdadero_falso", points: 1, text: "En un árbol binario de búsqueda balanceado, la búsqueda de un elemento tiene complejidad O(log n).",
          correctAnswer: true },
        { id: "q6", type: "opcion_multiple", points: 2, text: "Según la segunda ley de Newton, si una fuerza neta de 20 N actúa sobre una masa de 4 kg, ¿cuál es su aceleración?",
          options: [{ id: "a", text: "80 m/s²" }, { id: "b", text: "5 m/s²" }, { id: "c", text: "0.2 m/s²" }, { id: "d", text: "4 m/s²" }],
          correctOptionId: "b" },
        { id: "q7", type: "opcion_multiple", points: 2, text: "¿Cuál de las siguientes estructuras de datos sigue el principio LIFO (last in, first out)?",
          options: [{ id: "a", text: "Cola" }, { id: "b", text: "Pila" }, { id: "c", text: "Árbol binario" }, { id: "d", text: "Grafo dirigido" }],
          correctOptionId: "b" },
        { id: "q8", type: "verdadero_falso", points: 1, text: "El límite de sen(x)/x cuando x tiende a 0 es igual a 1.",
          correctAnswer: true },
        { id: "q9", type: "opcion_multiple", points: 2, text: "Un recorrido BFS (búsqueda en anchura) de un grafo utiliza principalmente una:",
          options: [{ id: "a", text: "Pila" }, { id: "b", text: "Cola" }, { id: "c", text: "Tabla hash" }, { id: "d", text: "Matriz triangular" }],
          correctOptionId: "b" },
        { id: "q10", type: "opcion_multiple", points: 2, text: "La energía cinética de un cuerpo de masa m que se mueve con velocidad v se calcula como:",
          options: [{ id: "a", text: "E = mv" }, { id: "b", text: "E = ½mv²" }, { id: "c", text: "E = mgh" }, { id: "d", text: "E = m/v" }],
          correctOptionId: "b" },
      ],
    },
  ],
  c2: [
    {
      id: "quiz-c2-1",
      courseId: "c2",
      title: "Práctica Calificada: Límites, Derivadas y Cinemática",
      durationMinutes: 45,
      attemptsAllowed: 1,
      questions: [
        { id: "q1", type: "opcion_multiple", points: 2, text: "¿Cuál es el límite de (x² − 4)/(x − 2) cuando x tiende a 2?",
          options: [{ id: "a", text: "0" }, { id: "b", text: "2" }, { id: "c", text: "4" }, { id: "d", text: "No existe" }],
          correctOptionId: "c" },
        { id: "q2", type: "verdadero_falso", points: 1, text: "Toda función continua en un punto es también derivable en ese punto.",
          correctAnswer: false },
        { id: "q3", type: "opcion_multiple", points: 2, text: "La posición de una partícula está dada por x(t) = 2t³ − 3t². ¿Cuál es su velocidad en t = 2 s?",
          options: [{ id: "a", text: "12 m/s" }, { id: "b", text: "18 m/s" }, { id: "c", text: "24 m/s" }, { id: "d", text: "6 m/s" }],
          correctOptionId: "b" },
        { id: "q4", type: "opcion_multiple", points: 2, text: "¿Cuál es la derivada de f(x) = sen(x)·cos(x)?",
          options: [{ id: "a", text: "cos²(x) − sen²(x)" }, { id: "b", text: "−sen(x)cos(x)" }, { id: "c", text: "sen(2x)" }, { id: "d", text: "cos(x)" }],
          correctOptionId: "a" },
        { id: "q5", type: "verdadero_falso", points: 1, text: "Si la derivada de una función es cero en un punto, ese punto necesariamente es un máximo local.",
          correctAnswer: false },
        { id: "q6", type: "opcion_multiple", points: 2, text: "Un cuerpo se lanza verticalmente hacia arriba con v₀ = 20 m/s. Usando g = 10 m/s², ¿cuánto tiempo tarda en alcanzar su altura máxima?",
          options: [{ id: "a", text: "1 s" }, { id: "b", text: "2 s" }, { id: "c", text: "4 s" }, { id: "d", text: "20 s" }],
          correctOptionId: "b" },
        { id: "q7", type: "opcion_multiple", points: 2, text: "¿Cuál es la derivada de f(x) = eˣ · x²?",
          options: [{ id: "a", text: "eˣ(x² + 2x)" }, { id: "b", text: "2xeˣ" }, { id: "c", text: "eˣ·x" }, { id: "d", text: "eˣ + 2x" }],
          correctOptionId: "a" },
        { id: "q8", type: "verdadero_falso", points: 1, text: "La aceleración es la segunda derivada de la posición respecto al tiempo.",
          correctAnswer: true },
      ],
    },
  ],
  c3: [
    {
      id: "quiz-c3-1",
      courseId: "c3",
      title: "Quiz: Fundamentos de Ingeniería de Software y Razonamiento Cuantitativo",
      durationMinutes: 30,
      attemptsAllowed: 3,
      questions: [
        { id: "q1", type: "opcion_multiple", points: 2, text: "En Scrum, ¿quién es responsable de maximizar el valor del producto resultante del trabajo del equipo de desarrollo?",
          options: [{ id: "a", text: "Scrum Master" }, { id: "b", text: "Product Owner" }, { id: "c", text: "Stakeholder" }, { id: "d", text: "Tech Lead" }],
          correctOptionId: "b" },
        { id: "q2", type: "verdadero_falso", points: 1, text: "Un sprint en Scrum puede extenderse si el equipo no termina las historias comprometidas.",
          correctAnswer: false },
        { id: "q3", type: "opcion_multiple", points: 2, text: "Si un equipo completa en promedio 40 puntos de historia por sprint de 2 semanas, ¿cuántos puntos se espera completar en 6 semanas?",
          options: [{ id: "a", text: "80" }, { id: "b", text: "100" }, { id: "c", text: "120" }, { id: "d", text: "160" }],
          correctOptionId: "c" },
        { id: "q4", type: "opcion_multiple", points: 2, text: "Un cuerpo con masa de 10 kg experimenta una fuerza de fricción constante de 15 N. ¿Cuál es su desaceleración?",
          options: [{ id: "a", text: "0.67 m/s²" }, { id: "b", text: "1.5 m/s²" }, { id: "c", text: "10 m/s²" }, { id: "d", text: "15 m/s²" }],
          correctOptionId: "b" },
        { id: "q5", type: "verdadero_falso", points: 1, text: "La integración continua busca detectar errores de integración lo antes posible mediante builds y pruebas automáticas frecuentes.",
          correctAnswer: true },
        { id: "q6", type: "opcion_multiple", points: 2, text: "¿Cuál es el resultado de resolver la ecuación 2x + 6 = 0?",
          options: [{ id: "a", text: "x = 3" }, { id: "b", text: "x = -3" }, { id: "c", text: "x = 6" }, { id: "d", text: "x = -6" }],
          correctOptionId: "b" },
        { id: "q7", type: "opcion_multiple", points: 2, text: "En una retrospectiva de sprint, ¿cuál es el objetivo principal?",
          options: [{ id: "a", text: "Planificar el siguiente sprint" }, { id: "b", text: "Presentar el incremento al cliente" }, { id: "c", text: "Identificar mejoras en el proceso del equipo" }, { id: "d", text: "Estimar historias de usuario" }],
          correctOptionId: "c" },
        { id: "q8", type: "verdadero_falso", points: 1, text: "La velocidad promedio de un objeto en movimiento rectilíneo uniforme es constante durante todo el recorrido.",
          correctAnswer: true },
      ],
    },
  ],
  c4: [
    {
      id: "quiz-c4-1",
      courseId: "c4",
      title: "Quiz: Conceptos Económicos y Razonamiento Matemático",
      durationMinutes: 40,
      attemptsAllowed: 2,
      questions: [
        { id: "q1", type: "opcion_multiple", points: 2, text: "Si el precio de un bien sube y la cantidad demandada cae en mayor proporción, la demanda de ese bien es:",
          options: [{ id: "a", text: "Perfectamente inelástica" }, { id: "b", text: "Inelástica" }, { id: "c", text: "Elástica" }, { id: "d", text: "Unitaria" }],
          correctOptionId: "c" },
        { id: "q2", type: "verdadero_falso", points: 1, text: "Un desplazamiento de la curva de demanda hacia la derecha siempre reduce el precio de equilibrio.",
          correctAnswer: false },
        { id: "q3", type: "opcion_multiple", points: 2, text: "Si el PBI de un país crece 4% y la inflación es 3%, ¿cuál es aproximadamente el crecimiento real?",
          options: [{ id: "a", text: "7%" }, { id: "b", text: "1%" }, { id: "c", text: "3%" }, { id: "d", text: "12%" }],
          correctOptionId: "b" },
        { id: "q4", type: "opcion_multiple", points: 2, text: "Resuelve: si 3x − 9 = 0, ¿cuál es el valor de x?",
          options: [{ id: "a", text: "x = 3" }, { id: "b", text: "x = -3" }, { id: "c", text: "x = 9" }, { id: "d", text: "x = 27" }],
          correctOptionId: "a" },
        { id: "q5", type: "verdadero_falso", points: 1, text: "Un impuesto sobre un bien siempre es pagado en su totalidad por el productor, sin afectar al consumidor.",
          correctAnswer: false },
        { id: "q6", type: "opcion_multiple", points: 2, text: "Un auto se mueve a velocidad constante de 20 m/s durante 5 segundos. ¿Qué distancia recorre?",
          options: [{ id: "a", text: "4 m" }, { id: "b", text: "25 m" }, { id: "c", text: "100 m" }, { id: "d", text: "125 m" }],
          correctOptionId: "c" },
        { id: "q7", type: "opcion_multiple", points: 2, text: "La elasticidad-precio de la demanda se calcula como:",
          options: [{ id: "a", text: "%ΔP / %ΔQ" }, { id: "b", text: "%ΔQ / %ΔP" }, { id: "c", text: "ΔQ · ΔP" }, { id: "d", text: "ΔQ + ΔP" }],
          correctOptionId: "b" },
        { id: "q8", type: "verdadero_falso", points: 1, text: "En un mercado en equilibrio, la cantidad ofrecida es igual a la cantidad demandada.",
          correctAnswer: true },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Foros de discusión                                                   */
/* ------------------------------------------------------------------ */

export const FORUM_THREADS: Record<string, readonly ForumThread[]> = {
  c1: [
    {
      id: "forum-c1-1",
      courseId: "c1",
      title: "¿Cuándo usar una tabla hash en vez de un árbol binario de búsqueda?",
      author: "Diego Vera",
      authorRole: "estudiante",
      date: "06 jul 2026",
      body:
        "Estaba resolviendo la práctica y me pregunto: si una tabla hash tiene búsqueda O(1) en el caso promedio, ¿por qué seguimos usando árboles binarios de búsqueda si son O(log n)? ¿En qué escenario conviene más un BST?",
      replies: [
        { id: "r1", author: "Ana Torres", authorRole: "estudiante", date: "06 jul 2026", body: "Yo entiendo que los BST mantienen el orden de los elementos, entonces si necesitas recorrer todo en orden o hacer búsquedas por rango, un hash no te sirve.", likes: 4 },
        { id: "r2", author: "Dra. Elena Vargas", authorRole: "docente", date: "07 jul 2026", body: "Exacto, Ana. Además, el O(1) de la tabla hash es un promedio amortizado que depende de una buena función de hash y de manejar bien las colisiones; en el peor caso puede degradar a O(n). Los BST balanceados garantizan O(log n) siempre.", likes: 9 },
        { id: "r3", author: "Luis Ramírez", authorRole: "estudiante", date: "07 jul 2026", body: "¿Entonces para la práctica 3 nos conviene usar BST porque necesitamos los recorridos in-order?", likes: 2 },
        { id: "r4", author: "Dra. Elena Vargas", authorRole: "docente", date: "08 jul 2026", body: "Correcto, Luis. La práctica pide explícitamente recorridos ordenados, así que un BST es la estructura natural. Guarden la tabla hash para cuando solo necesiten búsquedas puntuales.", likes: 6 },
      ],
    },
  ],
  c2: [
    {
      id: "forum-c2-1",
      courseId: "c2",
      title: "Duda con el límite de sen(x)/x",
      author: "María Chávez",
      authorRole: "estudiante",
      date: "04 jul 2026",
      body:
        "No logro entender por qué el límite de sen(x)/x cuando x tiende a 0 es 1, si al reemplazar x=0 nos da 0/0. ¿Alguien puede explicarlo de forma intuitiva antes de la demostración formal?",
      replies: [
        { id: "r1", author: "Ing. Roberto Salas", authorRole: "docente", date: "04 jul 2026", body: "Buena pregunta, María. 0/0 es una forma indeterminada, no significa que el límite no exista. Geométricamente, para ángulos pequeños, sen(x) y x son casi idénticos: por eso el cociente se acerca a 1.", likes: 8 },
        { id: "r2", author: "Sofía León", authorRole: "estudiante", date: "05 jul 2026", body: "A mí me ayudó graficarlo en una calculadora: mientras más cerca de 0 está x, más se acerca sen(x)/x a 1 por ambos lados.", likes: 5 },
        { id: "r3", author: "Ing. Roberto Salas", authorRole: "docente", date: "05 jul 2026", body: "Así es, Sofía. Ese límite es además la base para derivar sen(x) usando la definición de derivada por límites, lo veremos la próxima semana.", likes: 3 },
      ],
    },
  ],
  c3: [
    {
      id: "forum-c3-1",
      courseId: "c3",
      title: "¿Cómo estimar puntos de historia de forma más consistente en el equipo?",
      author: "Jorge Peña",
      authorRole: "estudiante",
      date: "03 jul 2026",
      body:
        "En nuestro equipo cada integrante estima distinto para historias similares. ¿Alguna técnica que recomienden para converger más rápido en el Sprint Planning?",
      replies: [
        { id: "r1", author: "Dra. Elena Vargas", authorRole: "docente", date: "03 jul 2026", body: "Les recomiendo Planning Poker: cada integrante estima en privado con cartas de Fibonacci y luego se discuten solo las estimaciones muy distantes entre sí.", likes: 7 },
        { id: "r2", author: "Ana Torres", authorRole: "estudiante", date: "04 jul 2026", body: "Nosotros probamos eso el sprint pasado y funcionó bastante bien, las discusiones fueron más cortas.", likes: 3 },
        { id: "r3", author: "Jorge Peña", authorRole: "estudiante", date: "04 jul 2026", body: "Gracias, lo probaremos este sprint. ¿Conviene tener una historia de referencia ya estimada para calibrar al resto?", likes: 1 },
        { id: "r4", author: "Dra. Elena Vargas", authorRole: "docente", date: "05 jul 2026", body: "Sí, es justo la técnica del 'baseline story'. Elijan una historia sencilla que todos entiendan bien y a partir de ahí comparen relativamente el tamaño de las demás.", likes: 5 },
      ],
    },
    {
      id: "forum-c3-2",
      courseId: "c3",
      title: "Retro del Sprint 1: lecciones aprendidas",
      author: "Dra. Elena Vargas",
      authorRole: "docente",
      date: "28 jun 2026",
      body:
        "Abro este hilo para que cada equipo comparta una lección aprendida de su primera retrospectiva. Puede ser sobre proceso, comunicación o herramientas.",
      replies: [
        { id: "r1", author: "María Chávez", authorRole: "estudiante", date: "29 jun 2026", body: "Aprendimos que subestimamos el tiempo de pruebas manuales; para el siguiente sprint vamos a reservar tiempo explícito para eso.", likes: 6 },
        { id: "r2", author: "Diego Vera", authorRole: "estudiante", date: "29 jun 2026", body: "En nuestro equipo el problema fue comunicación async: cambiamos a hacer daily de 10 minutos por videollamada en vez de solo por chat.", likes: 4 },
      ],
    },
  ],
  c4: [
    {
      id: "forum-c4-1",
      courseId: "c4",
      title: "Discusión: cifras de inflación de este mes",
      author: "Mg. Patricia Ruiz",
      authorRole: "docente",
      date: "06 jul 2026",
      body:
        "El BCRP publicó las cifras de inflación de junio. Quiero que comenten: ¿qué sectores explican la variación y les parece que la meta de inflación (entre 1% y 3%) se está cumpliendo?",
      replies: [
        { id: "r1", author: "Luis Ramírez", authorRole: "estudiante", date: "06 jul 2026", body: "Según el reporte, el mayor impacto vino de alimentos y energía, que son justo los componentes más volátiles del índice.", likes: 5 },
        { id: "r2", author: "Sofía León", authorRole: "estudiante", date: "07 jul 2026", body: "Sí, y me llama la atención que la inflación subyacente (sin alimentos ni energía) está más cerca del centro del rango meta.", likes: 4 },
        { id: "r3", author: "Mg. Patricia Ruiz", authorRole: "docente", date: "07 jul 2026", body: "Excelente observación, Sofía. Esa distinción entre inflación general y subyacente es clave para entender si el Banco Central debería o no ajustar la tasa de referencia.", likes: 8 },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Gamificación                                                        */
/* ------------------------------------------------------------------ */

export const STUDENT_GAMIFICATION: StudentGamification = {
  streakDays: 12,
  cycleProgress: 62,
  earnedBadges: [
    {
      id: "badge-1",
      name: "Racha de Fuego",
      icon: "local_fire_department",
      description: "Mantuviste una racha de 10 días consecutivos de actividad en la plataforma.",
      dateEarned: "2026-07-02",
    },
    {
      id: "badge-2",
      name: "Primera Entrega",
      icon: "task_alt",
      description: "Entregaste tu primera tarea antes de la fecha límite.",
      dateEarned: "2026-06-15",
    },
    {
      id: "badge-3",
      name: "Mente Analítica",
      icon: "psychology",
      description: "Obtuviste una nota igual o superior a 18 en una práctica calificada.",
      dateEarned: "2026-06-22",
    },
  ],
  upcomingBadges: [
    {
      id: "badge-4",
      name: "Maratonista Académico",
      icon: "military_tech",
      description: "Alcanza una racha de 30 días consecutivos de actividad.",
    },
    {
      id: "badge-5",
      name: "Voz del Foro",
      icon: "forum",
      description: "Publica 10 respuestas útiles (con al menos 3 likes) en los foros de discusión.",
    },
    {
      id: "badge-6",
      name: "Ciclo Perfecto",
      icon: "workspace_premium",
      description: "Termina el ciclo académico con el 100% de las actividades calificadas y sin entregas atrasadas.",
    },
  ],
};
