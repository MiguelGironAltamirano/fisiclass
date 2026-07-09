import { useState } from "react";
import { CHAT_MESSAGES, MESSAGE_THREADS } from "../../data/mockData";
import type { ChatMessage } from "../../types";

export function MessagesPanel() {
  const [activeId, setActiveId] = useState(MESSAGE_THREADS[0]?.id);
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({
    [MESSAGE_THREADS[0]?.id ?? ""]: [...CHAT_MESSAGES],
  });
  const [draft, setDraft] = useState("");

  const active = MESSAGE_THREADS.find((t) => t.id === activeId);
  const activeMessages = messagesByThread[activeId ?? ""] ?? [];

  const sendMessage = () => {
    if (!draft.trim() || !activeId) return;
    const newMsg: ChatMessage = {
      id: `local-${Date.now()}`,
      from: "me",
      text: draft.trim(),
      time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessagesByThread((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }));
    setDraft("");
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden grid grid-cols-1 md:grid-cols-[300px_1fr] h-[600px]">
      <aside className="border-b md:border-b-0 md:border-r border-outline-variant/50 overflow-y-auto">
        {MESSAGE_THREADS.map((thread) => (
          <button
            key={thread.id}
            onClick={() => setActiveId(thread.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-outline-variant/30 transition-colors ${
              thread.id === activeId ? "bg-primary-fixed/30" : "hover:bg-surface-container-low"
            }`}
          >
            <img src={thread.avatar} alt={thread.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-baseline">
                <p className="font-label-md text-label-md text-on-surface truncate">{thread.name}</p>
                <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0 ml-2">{thread.time}</span>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{thread.role}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{thread.preview}</p>
            </div>
            {thread.unread && <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />}
          </button>
        ))}
      </aside>
      <section className="flex flex-col">
        {active ? (
          <>
            <div className="flex items-center gap-3 px-5 py-3 border-b border-outline-variant/50">
              <img src={active.avatar} alt={active.name} className="w-9 h-9 rounded-full object-cover" />
              <div>
                <p className="font-label-md text-label-md text-on-surface">{active.name}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{active.role}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {activeMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                      msg.from === "me"
                        ? "bg-primary-container text-on-primary"
                        : "bg-surface-container-low text-on-surface"
                    }`}
                  >
                    <p className="font-body-sm text-body-sm">{msg.text}</p>
                    <p
                      className={`font-label-sm text-label-sm mt-1 ${
                        msg.from === "me" ? "text-on-primary/70" : "text-on-surface-variant"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 p-4 border-t border-outline-variant/50">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Escribe un mensaje..."
                className="flex-1 border border-outline-variant rounded-full px-4 py-2 font-body-sm text-body-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
              <button
                onClick={sendMessage}
                aria-label="Enviar"
                className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-on-surface-variant">Selecciona una conversación</div>
        )}
      </section>
    </div>
  );
}
