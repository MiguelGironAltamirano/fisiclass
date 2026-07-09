import { useMemo, useState } from "react";
import { CALENDAR_EVENTS } from "../../data/mockData";
import type { CalendarEvent } from "../../types";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const TYPE_STYLES: Record<CalendarEvent["type"], string> = {
  examen: "bg-error/10 text-error",
  entrega: "bg-warning/10 text-warning",
  clase: "bg-primary-fixed text-primary-container",
  evento: "bg-success/10 text-success",
};

// Colores sólidos para indicadores pequeños (puntos), separados del estilo de las píldoras
const TYPE_DOT_COLOR: Record<CalendarEvent["type"], string> = {
  examen: "bg-error",
  entrega: "bg-warning",
  clase: "bg-primary-container",
  evento: "bg-success",
};

const TYPE_LABEL: Record<CalendarEvent["type"], string> = {
  examen: "Examen",
  entrega: "Entrega",
  clase: "Clase",
  evento: "Evento",
};

type ViewMode = "mensual" | "semanal";

export function CalendarGrid() {
  // NOTA: los eventos mock están fijos en julio 2026; se mantiene ese mes/año como punto de partida.
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Julio 2026
  const [selectedDay, setSelectedDay] = useState<number | null>(3);
  const [viewMode, setViewMode] = useState<ViewMode>("mensual");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // getDay(): 0=domingo..6=sábado → convertir a 0=lunes..6=domingo
  const jsFirstWeekday = new Date(year, month, 1).getDay();
  const firstWeekday = jsFirstWeekday === 0 ? 6 : jsFirstWeekday - 1;

  const grid = useMemo(() => {
    const cells: (number | null)[] = Array(firstWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [firstWeekday, daysInMonth]);

  const goToPreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  // Semana actual (basada en selectedDay o el día 1 si no hay selección) — vista simplificada
  const weekDays = useMemo(() => {
    if (viewMode !== "semanal") return [];
    const base = selectedDay ?? 1;
    const baseDate = new Date(year, month, base);
    const baseWeekday = baseDate.getDay() === 0 ? 6 : baseDate.getDay() - 1;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - baseWeekday);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }, [viewMode, selectedDay, year, month]);

  const eventsForDay = (day: number) => CALENDAR_EVENTS.filter((e) => e.day === day);
  const selectedEvents = selectedDay ? eventsForDay(selectedDay) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-gutter">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-headline-sm text-headline-sm text-on-background">{monthLabel}</h3>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-low rounded-lg p-0.5">
              {(["mensual", "semanal"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded-md font-label-sm text-label-sm capitalize transition-colors ${
                    viewMode === mode ? "bg-primary-container text-white" : "text-on-surface-variant"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={goToPreviousMonth}
                className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors"
                aria-label="Mes anterior"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={goToNextMonth}
                className="p-1.5 rounded-full hover:bg-surface-container-low transition-colors"
                aria-label="Mes siguiente"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center font-label-sm text-label-sm text-on-surface-variant py-1">
              {d}
            </div>
          ))}
        </div>

        {viewMode === "mensual" ? (
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
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((d, idx) => {
              const day = d.getMonth() === month ? d.getDate() : null;
              const events = day ? eventsForDay(day) : [];
              return (
                <button
                  key={idx}
                  onClick={() => day && setSelectedDay(day)}
                  className={`aspect-square rounded-lg p-1.5 text-left flex flex-col transition-colors ${
                    selectedDay === day && day
                      ? "bg-primary-container text-on-primary"
                      : "hover:bg-surface-container-low text-on-surface"
                  }`}
                >
                  <span className="font-label-sm text-label-sm">{d.getDate()}</span>
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
        )}
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
                <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_DOT_COLOR[ev.type]}`} />
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