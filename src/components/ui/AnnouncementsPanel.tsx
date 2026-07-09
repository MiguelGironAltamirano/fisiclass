import { useState } from "react";
import { ANNOUNCEMENTS, DOCENTE_COURSES } from "../../data/mockData";
import type { Announcement } from "../../types";

export function AnnouncementsPanel() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([...ANNOUNCEMENTS]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [course, setCourse] = useState(DOCENTE_COURSES[0]?.code ?? "");

  const publish = () => {
    if (!title.trim() || !body.trim()) return;
    setAnnouncements((prev) => [
      { id: `local-${Date.now()}`, title: title.trim(), body: body.trim(), course, date: "hoy" },
      ...prev,
    ]);
    setTitle("");
    setBody("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-gutter">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5 h-fit">
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">Nuevo Anuncio</h3>
        <div className="space-y-4">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">Curso</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="w-full border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
            >
              {DOCENTE_COURSES.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Cambio de aula"
              className="w-full border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
          </div>
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">Mensaje</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              placeholder="Escribe el contenido del anuncio..."
              className="w-full border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
            />
          </div>
          <button
            onClick={publish}
            className="w-full bg-primary-container text-white font-label-md text-label-md py-2.5 rounded-lg hover:bg-primary-container/90 transition-colors flex justify-center items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">campaign</span>
            Publicar Anuncio
          </button>
        </div>
      </div>
      <div className="space-y-4">
        {announcements.map((a) => (
          <div key={a.id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="font-label-sm text-label-sm px-2 py-1 rounded-full bg-primary-fixed text-primary-container">
                {a.course}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{a.date}</span>
            </div>
            <h4 className="font-headline-sm text-headline-sm text-on-background mb-1">{a.title}</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
