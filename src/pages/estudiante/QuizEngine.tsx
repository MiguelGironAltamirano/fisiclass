import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppShell } from "../../components/layout/AppShell";
import { Breadcrumbs } from "../../components/ui/Breadcrumbs";
import { EmptyState } from "../../components/ui/EmptyState";
import { ESTUDIANTE_COURSES, QUIZZES } from "../../data/mockData";
import type { Course, Quiz, QuizQuestion } from "../../types";

type Phase = "intro" | "exam" | "results";
type AnswerValue = string | boolean;

function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function QuizEngine() {
  const { courseId, quizId } = useParams<{ courseId: string; quizId: string }>();
  const navigate = useNavigate();

  const course = ESTUDIANTE_COURSES.find((c) => c.id === courseId);
  const quiz = courseId ? QUIZZES[courseId]?.find((q) => q.id === quizId) : undefined;

  if (!course || !quiz || !courseId) {
    return (
      <AppShell role="estudiante" title="Examen no encontrado">
        <Breadcrumbs items={[{ label: "Mis Cursos", to: "/estudiante/cursos" }, { label: "Examen no encontrado" }]} />
        <EmptyState
          icon="quiz"
          title="Examen no encontrado"
          description="Este examen no existe o ya no está disponible en tu curso."
          action={{
            label: "Volver al curso",
            onClick: () => navigate(courseId ? `/estudiante/cursos/${courseId}` : "/estudiante/cursos"),
          }}
        />
      </AppShell>
    );
  }

  return <QuizRunner course={course} quiz={quiz} courseId={courseId} />;
}

/* ------------------------------------------------------------------ */
/* Máquina de estados: intro -> exam -> results                        */
/* ------------------------------------------------------------------ */

function QuizRunner({ course, quiz, courseId }: { readonly course: Course; readonly quiz: Quiz; readonly courseId: string }) {
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [secondsLeft, setSecondsLeft] = useState(quiz.durationMinutes * 60);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [savedSecondsAgo, setSavedSecondsAgo] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Temporizador del examen: arranca solo al entrar a "exam" y no se reinicia al cambiar de pregunta,
  // porque depende únicamente de `phase`. El updater solo decrementa (sin setState anidado).
  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [phase]);

  // Al llegar a 0 durante el examen, envía automáticamente una sola vez.
  useEffect(() => {
    if (phase !== "exam" || secondsLeft !== 0) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setPhase("results");
  }, [phase, secondsLeft]);

  // Indicador de autoguardado simulado: recalcula "hace Xs" cada segundo desde la última respuesta.
  useEffect(() => {
    if (phase !== "exam" || savedAt === null) return;
    saveTickRef.current = setInterval(() => {
      setSavedSecondsAgo(Math.floor((Date.now() - savedAt) / 1000));
    }, 1000);
    return () => {
      if (saveTickRef.current) clearInterval(saveTickRef.current);
      saveTickRef.current = null;
    };
  }, [phase, savedAt]);

  const answerQuestion = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setSavedAt(Date.now());
    setSavedSecondsAgo(0);
  };

  const unansweredQuestions = quiz.questions.filter((q) => answers[q.id] === undefined);

  const attemptFinish = () => {
    if (unansweredQuestions.length > 0) {
      setShowFinishModal(true);
      return;
    }
    setPhase("results");
  };

  if (phase === "intro") {
    return (
      <AppShell role="estudiante" title={course.name}>
        <Breadcrumbs
          items={[
            { label: "Mis Cursos", to: "/estudiante/cursos" },
            { label: course.name, to: `/estudiante/cursos/${courseId}` },
            { label: quiz.title },
          ]}
        />
        <QuizIntro quiz={quiz} onStart={() => setPhase("exam")} />
      </AppShell>
    );
  }

  if (phase === "results") {
    return (
      <AppShell role="estudiante" title={course.name}>
        <Breadcrumbs
          items={[
            { label: "Mis Cursos", to: "/estudiante/cursos" },
            { label: course.name, to: `/estudiante/cursos/${courseId}` },
            { label: quiz.title },
          ]}
        />
        <QuizResults quiz={quiz} answers={answers} onBack={() => navigate(`/estudiante/cursos/${courseId}`)} />
      </AppShell>
    );
  }

  // phase === "exam": layout inmersivo, sin sidebar/header estándar.
  return (
    <>
      <QuizExamLayout
        quiz={quiz}
        secondsLeft={secondsLeft}
        savedSecondsAgo={savedSecondsAgo}
        hasSaved={savedAt !== null}
        currentIndex={currentIndex}
        answers={answers}
        onAnswer={answerQuestion}
        onNavigate={setCurrentIndex}
        onFinish={attemptFinish}
      />
      {showFinishModal && (
        <UnansweredModal
          unanswered={unansweredQuestions}
          questions={quiz.questions}
          onReview={(idx) => {
            setCurrentIndex(idx);
            setShowFinishModal(false);
          }}
          onForceSubmit={() => {
            setShowFinishModal(false);
            setPhase("results");
          }}
          onClose={() => setShowFinishModal(false)}
        />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Pantalla de inicio                                                  */
/* ------------------------------------------------------------------ */

function QuizIntro({ quiz, onStart }: { readonly quiz: Quiz; readonly onStart: () => void }) {
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="max-w-xl mx-auto bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-8 sm:p-10 text-center">
      <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-fixed text-on-primary-fixed mb-4">
        <span className="material-symbols-outlined text-3xl">quiz</span>
      </span>
      <h1 className="font-headline-md text-headline-md text-on-background mb-2">{quiz.title}</h1>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
        Revisa los detalles antes de comenzar. Una vez iniciado, el temporizador no se detiene.
      </p>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <IntroStat icon="timer" label="Duración" value={`${quiz.durationMinutes} min`} />
        <IntroStat icon="checklist" label="Preguntas" value={`${quiz.questions.length}`} />
        <IntroStat icon="repeat" label="Intentos" value={`${quiz.attemptsAllowed}`} />
      </div>
      <p className="font-label-sm text-label-sm text-on-surface-variant mb-6">Puntaje total: {totalPoints} pts</p>
      <button
        onClick={onStart}
        className="inline-flex items-center gap-2 bg-primary-container text-white font-label-md text-label-md py-3 px-8 rounded-lg hover:bg-primary-container/90 transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">play_arrow</span>
        Comenzar examen
      </button>
    </div>
  );
}

function IntroStat({ icon, label, value }: { readonly icon: string; readonly label: string; readonly value: string }) {
  return (
    <div className="bg-surface-container-low rounded-xl py-4">
      <span className="material-symbols-outlined text-on-surface-variant text-[22px]">{icon}</span>
      <p className="font-headline-sm text-headline-sm text-on-background mt-1">{value}</p>
      <p className="font-label-sm text-label-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Modo examen: layout inmersivo                                       */
/* ------------------------------------------------------------------ */

interface QuizExamLayoutProps {
  readonly quiz: Quiz;
  readonly secondsLeft: number;
  readonly savedSecondsAgo: number;
  readonly hasSaved: boolean;
  readonly currentIndex: number;
  readonly answers: Record<string, AnswerValue>;
  readonly onAnswer: (questionId: string, value: AnswerValue) => void;
  readonly onNavigate: (index: number) => void;
  readonly onFinish: () => void;
}

function QuizExamLayout({
  quiz,
  secondsLeft,
  savedSecondsAgo,
  hasSaved,
  currentIndex,
  answers,
  onAnswer,
  onNavigate,
  onFinish,
}: QuizExamLayoutProps) {
  const question = quiz.questions[currentIndex];
  const isLow = secondsLeft <= 60;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-surface-container-lowest border-b border-outline-variant/40 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">
        <p className="font-label-md text-label-md text-on-surface truncate max-w-[240px] sm:max-w-md">{quiz.title}</p>
        <div className="flex items-center gap-4">
          <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${hasSaved ? "bg-success" : "bg-outline-variant"}`} />
            {hasSaved ? `Guardado hace ${savedSecondsAgo}s` : "Sin cambios aún"}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 font-headline-sm text-headline-sm px-3 py-1 rounded-full ${
              isLow ? "bg-error/10 text-error" : "bg-primary-fixed text-on-primary-fixed"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">timer</span>
            {formatClock(secondsLeft)}
          </span>
        </div>
      </header>

      <div className="flex-1 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-gutter p-4 sm:p-8 items-start">
        <QuestionNavigator questions={quiz.questions} currentIndex={currentIndex} answers={answers} onNavigate={onNavigate} />

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 sm:p-8">
          <p className="font-label-sm text-label-sm text-on-surface-variant mb-3">
            Pregunta {currentIndex + 1} de {quiz.questions.length} · {question.points} {question.points === 1 ? "pt" : "pts"}
          </p>
          <h2 className="font-headline-sm text-headline-sm text-on-background mb-6">{question.text}</h2>

          <QuestionOptions question={question} selected={answers[question.id]} onSelect={(value) => onAnswer(question.id, value)} />

          <div className="flex items-center justify-between mt-8 pt-5 border-t border-outline-variant/40">
            <button
              onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface disabled:text-disabled disabled:cursor-not-allowed hover:text-primary-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              Anterior
            </button>

            <button
              onClick={onFinish}
              className="inline-flex items-center gap-1.5 bg-error/10 text-error font-label-md text-label-md py-2 px-4 rounded-lg hover:bg-error/20 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">flag</span>
              Finalizar
            </button>

            <button
              onClick={() => onNavigate(Math.min(quiz.questions.length - 1, currentIndex + 1))}
              disabled={currentIndex === quiz.questions.length - 1}
              className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface disabled:text-disabled disabled:cursor-not-allowed hover:text-primary-container transition-colors"
            >
              Siguiente
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionNavigator({
  questions,
  currentIndex,
  answers,
  onNavigate,
}: {
  readonly questions: readonly QuizQuestion[];
  readonly currentIndex: number;
  readonly answers: Record<string, AnswerValue>;
  readonly onNavigate: (index: number) => void;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-4">
      <p className="font-label-sm text-label-sm text-on-surface-variant mb-3">Preguntas</p>
      <div className="grid grid-cols-5 lg:grid-cols-4 gap-2">
        {questions.map((q, idx) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => onNavigate(idx)}
              className={`w-9 h-9 rounded-lg font-label-sm text-label-sm flex items-center justify-center transition-colors ${
                isCurrent
                  ? "ring-2 ring-primary-container text-on-primary-fixed bg-primary-fixed"
                  : isAnswered
                    ? "bg-primary-container text-white"
                    : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-4 space-y-1.5">
        <LegendItem swatchClass="bg-primary-container" label="Respondida" />
        <LegendItem swatchClass="ring-2 ring-primary-container" label="Actual" />
        <LegendItem swatchClass="border border-outline-variant" label="Sin responder" />
      </div>
    </div>
  );
}

function LegendItem({ swatchClass, label }: { readonly swatchClass: string; readonly label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3.5 h-3.5 rounded ${swatchClass}`} />
      <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
    </div>
  );
}

function QuestionOptions({
  question,
  selected,
  onSelect,
}: {
  readonly question: QuizQuestion;
  readonly selected: AnswerValue | undefined;
  readonly onSelect: (value: AnswerValue) => void;
}) {
  if (question.type === "verdadero_falso") {
    const options: { readonly value: boolean; readonly label: string }[] = [
      { value: true, label: "Verdadero" },
      { value: false, label: "Falso" },
    ];
    return (
      <div className="space-y-2.5">
        {options.map((opt) => (
          <OptionRow key={String(opt.value)} label={opt.label} isSelected={selected === opt.value} onClick={() => onSelect(opt.value)} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {question.options?.map((opt) => (
        <OptionRow key={opt.id} label={opt.text} isSelected={selected === opt.id} onClick={() => onSelect(opt.id)} />
      ))}
    </div>
  );
}

function OptionRow({ label, isSelected, onClick }: { readonly label: string; readonly isSelected: boolean; readonly onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg border transition-colors ${
        isSelected ? "border-primary-container bg-primary-fixed" : "border-outline-variant hover:bg-surface-container-low"
      }`}
    >
      <span
        className={`w-[18px] h-[18px] rounded-full border-2 shrink-0 flex items-center justify-center ${
          isSelected ? "border-primary-container" : "border-outline-variant"
        }`}
      >
        {isSelected && <span className="w-2 h-2 rounded-full bg-primary-container" />}
      </span>
      <span className="font-body-sm text-body-sm text-on-surface">{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Modal de preguntas sin responder                                     */
/* ------------------------------------------------------------------ */

function UnansweredModal({
  unanswered,
  questions,
  onReview,
  onForceSubmit,
  onClose,
}: {
  readonly unanswered: readonly QuizQuestion[];
  readonly questions: readonly QuizQuestion[];
  readonly onReview: (index: number) => void;
  readonly onForceSubmit: () => void;
  readonly onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 p-6 max-w-sm w-full">
        <div className="flex items-center gap-2 mb-2">
          <span className="material-symbols-outlined text-warning text-[22px]">warning</span>
          <h3 className="font-headline-sm text-headline-sm text-on-background">Preguntas sin responder</h3>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
          Tienes {unanswered.length} {unanswered.length === 1 ? "pregunta" : "preguntas"} sin responder:
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {unanswered.map((q) => {
            const idx = questions.findIndex((question) => question.id === q.id);
            return (
              <button
                key={q.id}
                onClick={() => onReview(idx)}
                className="w-8 h-8 rounded-lg border border-warning/50 text-warning font-label-sm text-label-sm hover:bg-warning/10 transition-colors"
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onForceSubmit}
            className="font-label-md text-label-md text-on-surface-variant px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Enviar de todas formas
          </button>
          <button
            onClick={onClose}
            className="bg-primary-container text-white font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container/90 transition-colors"
          >
            Revisar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Resultados                                                           */
/* ------------------------------------------------------------------ */

function formatAnswerLabel(question: QuizQuestion, value: AnswerValue | undefined): string {
  if (value === undefined) return "Sin responder";
  if (question.type === "verdadero_falso") return value ? "Verdadero" : "Falso";
  const opt = question.options?.find((o) => o.id === value);
  return opt?.text ?? "—";
}

function QuizResults({
  quiz,
  answers,
  onBack,
}: {
  readonly quiz: Quiz;
  readonly answers: Record<string, AnswerValue>;
  readonly onBack: () => void;
}) {
  const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const earnedPoints = quiz.questions.reduce((sum, q) => {
    const given = answers[q.id];
    const correct = q.type === "opcion_multiple" ? q.correctOptionId : q.correctAnswer;
    return given !== undefined && given === correct ? sum + q.points : sum;
  }, 0);
  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-8 sm:p-10 text-center">
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-2">Resultado del examen</p>
        <p className="font-headline-lg text-headline-lg text-on-background">
          {earnedPoints}
          <span className="text-on-surface-variant">/{totalPoints}</span>
        </p>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">{percentage}% de aciertos</p>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 divide-y divide-outline-variant/30 overflow-hidden">
        {quiz.questions.map((q, idx) => {
          const given = answers[q.id];
          const correctValue = q.type === "opcion_multiple" ? q.correctOptionId : q.correctAnswer;
          const isCorrect = given !== undefined && given === correctValue;
          const givenLabel = formatAnswerLabel(q, given);
          const correctLabel = formatAnswerLabel(q, correctValue);
          return (
            <div key={q.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className={`material-symbols-outlined text-[20px] mt-0.5 shrink-0 ${isCorrect ? "text-success" : "text-error"}`}>
                  {isCorrect ? "check_circle" : "cancel"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-label-md text-label-md text-on-surface">
                    {idx + 1}. {q.text}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1.5">
                    Tu respuesta: <span className={isCorrect ? "text-success" : "text-error"}>{givenLabel}</span>
                  </p>
                  {!isCorrect && (
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Respuesta correcta: <span className="text-success">{correctLabel}</span>
                    </p>
                  )}
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant shrink-0">
                  {isCorrect ? q.points : 0}/{q.points} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-primary-container text-white font-label-md text-label-md py-2.5 px-5 rounded-lg hover:bg-primary-container/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al curso
        </button>
      </div>
    </div>
  );
}
