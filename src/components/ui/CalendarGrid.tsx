import { useMemo, useState } from "react";
import { CALENDAR_EVENTS } from "../../data/mockData";
import type { CalendarEvent } from "../../types";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const TYPE_STYLES: Record<CalendarEvent["type"], string> = {
  examen: "bg-error/10 text-error",
  entrega: "bg-warning/10 text-warning",
  clase: "bg-primary-fixed text-primary-container",
  evento: "bg-success/10 text-success",
};

const TYPE_LABEL: Record<CalendarEvent["type"], string> = {
  examen: "Examen",
  entrega: "Entrega",
  clase: "Clase",
  evento: "Evento",
};

export function CalendarGrid() {
  const [monthLabel] = useState("Julio 2026");
  const [selectedDay, setSelectedDay] = useState<number | null>(3);

  const daysInMonth = 31;
  const firstWeekday = 2; // miércoles = index 2 (0=lunes)

  const grid = useMemo(() => {
    const cells: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, []);

  const eventsForDay = (day: number) => CALENDAR_EVENTS.filter((e) => e.day === day);
  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-gutter">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-sm text-headline-sm text-on-background">{monthLabel}</h3>
          <div className="flex gap-1">
            <button className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors" aria-label="Mes anterior">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors" aria-label="Mes siguiente">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center font-label-sm text-label-sm text-on-surface-variant py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((day, idx) => {
            const events = day ? eventsForDay(day) : [];
            return (
              <button
                key={idx}
                disabled={!day}
                onClick={() => day && setSelectedDay(day)}
                className={`aspect-square rounded-lg p-1.5 text-left flex flex-col transition-colors ${
                  !day
                    ? "invisible"
                    : selectedDay === day
                      ? "bg-primary-container text-on-primary"
                      : "hover:bg-surface-container-low text-on-surface"
                }`}
              >
                <span className="font-label-sm text-label-sm">{day}</span>
                {events.length > 0 && (
                  <span
                    className={`mt-auto w-1.5 h-1.5 rounded-full ${
                      selectedDay === day ? "bg-white" : "bg-primary-container"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-4">
          {selectedDay ? `Eventos del ${selectedDay}` : "Selecciona un día"}
        </h3>
        {selectedEvents.length === 0 && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">Sin eventos programados.</p>
        )}
        <ul className="space-y-3">
          {selectedEvents.map((ev) => (
            <li key={ev.id} className="flex items-start gap-3">
              <span className={`font-label-sm text-label-sm px-2 py-1 rounded-full shrink-0 ${TYPE_STYLES[ev.type]}`}>
                {TYPE_LABEL[ev.type]}
              </span>
              <div className="min-w-0">
                <p className="font-body-sm text-body-sm text-on-surface">{ev.title}</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">{ev.time}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 pt-4 border-t border-outline-variant/50">
          <h4 className="font-label-md text-label-md text-on-surface mb-3">Próximos eventos</h4>
          <ul className="space-y-2">
            {CALENDAR_EVENTS.slice(0, 4).map((ev) => (
              <li key={ev.id} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_STYLES[ev.type].split(" ")[0]}`} />
                <p className="font-label-sm text-label-sm text-on-surface-variant truncate">
                  {ev.day} jul · {ev.title}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
