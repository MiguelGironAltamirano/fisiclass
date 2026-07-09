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

export interface GradeRow {
  readonly id: string;
  readonly student?: string;
  readonly course: string;
  readonly assignment: string;
  readonly score: number | null;
  readonly maxScore: number;
  readonly status: "calificado" | "pendiente" | "atrasado";
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
  duration?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  week: number;
  items: ModuleItem[];
}