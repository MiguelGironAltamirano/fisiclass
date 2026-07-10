export type Role = "docente" | "estudiante";

export interface NavItem {
  readonly label: string;
  readonly icon: string;
  readonly path: string;
}

export interface Course {
  readonly id: string;
  readonly name: string;
  readonly code: string;
  readonly professor?: string;
  readonly students?: number;
  readonly progress: number;
  readonly color: string;
  readonly schedule: string;
  readonly image: string;
}

/** Desglose de un criterio de rúbrica ya calificado, anclado a la nota de una actividad. */
export interface GradeFeedbackCriterion {
  readonly criterion: string;
  readonly score: number;
  readonly maxScore: number;
  readonly comment: string;
}

export interface GradeRow {
  readonly id: string;
  readonly student?: string;
  readonly course: string;
  readonly assignment: string;
  readonly score: number | null;
  readonly maxScore: number;
  readonly status: "calificado" | "pendiente" | "atrasado";
  /** Enlaza esta fila con la tarea/quiz de origen (ver Assignment.id / Quiz.id) cuando aplica. */
  readonly assignmentId?: string;
  /** Comentario general del docente sobre la calificación. */
  readonly feedback?: string;
  /** Desglose por criterio de rúbrica, cuando la actividad calificada tuvo una. */
  readonly criteria?: readonly GradeFeedbackCriterion[];
}

export interface MessageThread {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly avatar: string;
  readonly preview: string;
  readonly time: string;
  readonly unread: boolean;
}

export interface ChatMessage {
  readonly id: string;
  readonly from: "me" | "them";
  readonly text: string;
  readonly time: string;
}

export interface CalendarEvent {
  readonly id: string;
  readonly day: number;
  readonly title: string;
  readonly type: "examen" | "entrega" | "clase" | "evento";
  readonly time: string;
}

export interface Announcement {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly course: string;
  readonly date: string;
}
export interface ModuleItem {
  id: string;
  type: "video" | "pdf" | "lectura";
  title: string;
  /** Etiqueta corta ya formateada para UI, ej. "8:32". Se conserva por compatibilidad. */
  duration?: string;
  /** Minutos estimados de estudio/visionado, usado para calcular progreso. */
  estimatedMinutes?: number;
  /** Si el estudiante ya marcó este ítem como completado. */
  completed?: boolean;
  /** URL embebible (YouTube /embed/... o .mp4 libre) — solo para type "video". */
  videoUrl?: string;
  /** URL pública y estable de un PDF — solo para type "pdf". */
  pdfUrl?: string;
  /** Cuerpo de texto markdown-ish — solo para type "lectura". */
  body?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  week: number;
  items: ModuleItem[];
}

/* ------------------------------------------------------------------ */
/* Detalle de curso: sílabo, anuncios y progreso desglosado           */
/* ------------------------------------------------------------------ */

export interface CourseSyllabus {
  readonly description: string;
  readonly objectives: readonly string[];
  readonly professor: string;
}

export interface CourseAnnouncement {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  readonly author: string;
  readonly date: string;
}

export interface CourseProgressBreakdown {
  readonly overall: number;
  readonly modules: number;
  readonly assignments: number;
  readonly quizzes: number;
}

/* ------------------------------------------------------------------ */
/* Tareas / Assignments (detalle, rúbrica y calificación por criterio) */
/* ------------------------------------------------------------------ */

export type AssignmentStatus = "pendiente" | "entregado" | "calificado";

export interface RubricLevel {
  readonly label: string;
  readonly points: number;
  readonly description: string;
}

export interface RubricCriterion {
  readonly id: string;
  readonly name: string;
  readonly points: number;
  readonly levels: readonly RubricLevel[];
}

export interface AssignmentFeedbackCriterion {
  readonly criterionId: string;
  readonly score: number;
  readonly comment: string;
}

export interface AssignmentGrade {
  readonly score: number;
  readonly feedback: string;
  readonly criteria: readonly AssignmentFeedbackCriterion[];
}

export interface Assignment {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  /** Instrucciones ricas: varios párrafos, puede incluir saltos de línea markdown-ish. */
  readonly instructions: string;
  readonly dueDate: string;
  readonly points: number;
  readonly status: AssignmentStatus;
  readonly acceptedFormats: readonly string[];
  readonly rubric: readonly RubricCriterion[];
  /** Presente únicamente cuando status === "calificado". */
  readonly grade?: AssignmentGrade;
}

/* ------------------------------------------------------------------ */
/* Exámenes / Quizzes                                                  */
/* ------------------------------------------------------------------ */

export type QuizQuestionType = "opcion_multiple" | "verdadero_falso";

export interface QuizOption {
  readonly id: string;
  readonly text: string;
}

export interface QuizQuestion {
  readonly id: string;
  readonly type: QuizQuestionType;
  readonly text: string;
  readonly points: number;
  /** Cuatro alternativas — solo para type "opcion_multiple". */
  readonly options?: readonly QuizOption[];
  /** Id de la alternativa correcta — solo para type "opcion_multiple". */
  readonly correctOptionId?: string;
  /** Respuesta correcta — solo para type "verdadero_falso". */
  readonly correctAnswer?: boolean;
}

export interface Quiz {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly durationMinutes: number;
  readonly attemptsAllowed: number;
  readonly questions: readonly QuizQuestion[];
}

/* ------------------------------------------------------------------ */
/* Foros de discusión                                                  */
/* ------------------------------------------------------------------ */

export type ForumAuthorRole = "docente" | "estudiante";

export interface ForumReply {
  readonly id: string;
  readonly author: string;
  readonly authorRole: ForumAuthorRole;
  readonly date: string;
  readonly body: string;
  readonly likes: number;
}

export interface ForumThread {
  readonly id: string;
  readonly courseId: string;
  readonly title: string;
  readonly author: string;
  readonly authorRole: ForumAuthorRole;
  readonly date: string;
  readonly body: string;
  readonly replies: readonly ForumReply[];
}

/* ------------------------------------------------------------------ */
/* Gamificación                                                        */
/* ------------------------------------------------------------------ */

export interface Badge {
  readonly id: string;
  readonly name: string;
  /** Nombre de ícono Material Symbols, ej. "military_tech". */
  readonly icon: string;
  readonly description: string;
  /** Fecha ISO-ish en que se obtuvo. Ausente si aún no se gana (ver StudentGamification.upcomingBadges). */
  readonly dateEarned?: string;
}

export interface StudentGamification {
  readonly streakDays: number;
  /** Progreso del ciclo académico actual, 0-100. */
  readonly cycleProgress: number;
  readonly earnedBadges: readonly Badge[];
  /** Insignias aún no ganadas, mostradas como meta/próximo logro. */
  readonly upcomingBadges: readonly Badge[];
}