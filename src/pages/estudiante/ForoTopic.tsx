import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { EmptyState } from "../../components/ui/EmptyState";
import { RoleChip } from "../../components/ui/RoleChip";
import { CURRENT_USER, ESTUDIANTE_COURSES, FORUM_THREADS } from "../../data/mockData";
import type { ForumAuthorRole, ForumReply } from "../../types";

export function ForoTopic() {
  const { courseId, threadId } = useParams<{ courseId: string; threadId: string }>();
  const navigate = useNavigate();

  const course = ESTUDIANTE_COURSES.find((c) => c.id === courseId);
  const thread = courseId ? FORUM_THREADS[courseId]?.find((t) => t.id === threadId) : undefined;

  const [replies, setReplies] = useState<ForumReply[]>(() => (thread ? [...thread.replies] : []));
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [draft, setDraft] = useState("");

  const toggleLike = (replyId: string) => {
    const alreadyLiked = likedIds.has(replyId);
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (alreadyLiked) {
        next.delete(replyId);
      } else {
        next.add(replyId);
      }
      return next;
    });
    setReplies((prev) =>
      prev.map((r) => (r.id === replyId ? { ...r, likes: r.likes + (alreadyLiked ? -1 : 1) } : r)),
    );
  };

  const publishReply = () => {
    if (!draft.trim()) return;
    const newReply: ForumReply = {
      id: `local-${Date.now()}`,
      author: CURRENT_USER.estudiante.name,
      authorRole: "estudiante",
      date: new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" }),
      body: draft.trim(),
      likes: 0,
    };
    setReplies((prev) => [...prev, newReply]);
    setDraft("");
  };

  if (!course || !thread || !courseId) {
    return (
      <AppShell role="estudiante" title="Foro">
        <Breadcrumbs items={[{ label: "Mis Cursos", to: "/estudiante/cursos" }, { label: "Hilo no encontrado" }]} />
        <EmptyState
          icon="forum"
          title="Hilo no encontrado"
          description="Este hilo del foro no existe o fue eliminado."
          action={{
            label: "Volver al curso",
            onClick: () => navigate(courseId ? `/estudiante/cursos/${courseId}` : "/estudiante/cursos"),
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell role="estudiante" title={course.name}>
      <Breadcrumbs
        items={[
          { label: "Mis Cursos", to: "/estudiante/cursos" },
          { label: course.name, to: `/estudiante/cursos/${courseId}` },
          { label: thread.title },
        ]}
      />

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8 mb-5">
        <h1 className="font-headline-md text-headline-md text-on-background mb-3">{thread.title}</h1>
        <div className="flex items-center gap-2.5 flex-wrap mb-4">
          <AuthorAvatar name={thread.author} role={thread.authorRole} />
          <span className="font-label-md text-label-md text-on-surface">{thread.author}</span>
          <RoleChip role={thread.authorRole} />
          <span className="font-label-sm text-label-sm text-on-surface-variant">{thread.date}</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface leading-relaxed whitespace-pre-line">{thread.body}</p>
      </div>

      <h2 className="font-headline-sm text-headline-sm text-on-background mb-3">
        {replies.length} {replies.length === 1 ? "respuesta" : "respuestas"}
      </h2>

      <div className="space-y-3 mb-5">
        {replies.map((reply) => {
          const isLiked = likedIds.has(reply.id);
          return (
            <div
              key={reply.id}
              className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5"
            >
              <div className="flex items-center gap-2.5 flex-wrap mb-2">
                <AuthorAvatar name={reply.author} role={reply.authorRole} />
                <span className="font-label-md text-label-md text-on-surface">{reply.author}</span>
                <RoleChip role={reply.authorRole} />
                <span className="font-label-sm text-label-sm text-on-surface-variant">{reply.date}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface leading-relaxed mb-3">{reply.body}</p>
              <button
                onClick={() => toggleLike(reply.id)}
                className={`inline-flex items-center gap-1.5 font-label-sm text-label-sm transition-colors ${
                  isLiked ? "text-primary-container" : "text-on-surface-variant hover:text-primary-container"
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={isLiked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  thumb_up
                </span>
                {reply.likes}
              </button>
            </div>
          );
        })}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
        <h3 className="font-label-md text-label-md text-on-surface mb-2">Responder</h3>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Escribe tu respuesta..."
          className="w-full border border-outline-variant rounded-lg px-3 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container resize-none mb-3"
        />
        <div className="flex justify-end">
          <button
            onClick={publishReply}
            className="inline-flex items-center gap-2 bg-primary-container text-white font-label-md text-label-md py-2.5 px-5 rounded-lg hover:bg-primary-container/90 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Publicar respuesta
          </button>
        </div>
      </div>
    </AppShell>
  );
}

function AuthorAvatar({ name, role }: { name: string; role: ForumAuthorRole }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center font-label-sm text-label-sm shrink-0 ${
        role === "docente" ? "bg-primary-container text-white" : "bg-surface-container-high text-on-surface"
      }`}
    >
      {initial}
    </div>
  );
}
