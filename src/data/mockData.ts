import type {
  Announcement,
  CalendarEvent,
  ChatMessage,
  Course,
  GradeRow,
  MessageThread,
  NavItem,
  Role,
} from "../types";
import type { CourseModule } from "../types";

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
  { id: "g1", course: "ISI-204", assignment: "Práctica 1", score: 18, maxScore: 20, status: "calificado" },
  { id: "g2", course: "ISI-204", assignment: "Práctica 2", score: 16, maxScore: 20, status: "calificado" },
  { id: "g3", course: "ISI-204", assignment: "Práctica 3", score: null, maxScore: 20, status: "pendiente" },
  { id: "g4", course: "MAT-201", assignment: "Examen Parcial", score: 17, maxScore: 20, status: "calificado" },
  { id: "g5", course: "ISI-405", assignment: "Sprint Review 2", score: null, maxScore: 20, status: "atrasado" },
  { id: "g6", course: "ECO-110", assignment: "Control de Lectura", score: 14, maxScore: 20, status: "calificado" },
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
        { id: "c1-w1-v1", type: "video", title: "Bienvenida al curso", duration: "8:32" },
        { id: "c1-w1-p1", type: "pdf", title: "Silabo del curso" },
      ],
    },
    {
      id: "c1-w3",
      title: "Semana 3: Árboles y Grafos",
      week: 3,
      items: [
        { id: "c1-w3-v1", type: "video", title: "Árboles binarios de búsqueda", duration: "22:10" },
        { id: "c1-w3-l1", type: "lectura", title: "Lectura: Recorridos en grafos" },
        { id: "c1-w3-p1", type: "pdf", title: "Guía de práctica 3" },
      ],
    },
  ],
  c2: [
    {
      id: "c2-w1",
      title: "Semana 1: Límites",
      week: 1,
      items: [{ id: "c2-w1-v1", type: "video", title: "Introducción a límites", duration: "15:00" }],
    },
  ],
  c3: [
    {
      id: "c3-w2",
      title: "Semana 2: Metodologías Ágiles",
      week: 2,
      items: [
        { id: "c3-w2-v1", type: "video", title: "Scrum en la práctica", duration: "18:45" },
        { id: "c3-w2-p1", type: "pdf", title: "Plantilla de Sprint Review" },
      ],
    },
  ],
  c4: [
    {
      id: "c4-w1",
      title: "Semana 1: Fundamentos de IA",
      week: 1,
      items: [{ id: "c4-w1-l1", type: "lectura", title: "Historia de la Inteligencia Artificial" }],
    },
  ],
};
