import type { Course } from "../../types";

interface CourseCardProps {
  readonly course: Course;
  readonly onOpen?: () => void;
}

export function CourseCard({ course, onOpen }: CourseCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      <div className="h-32 relative">
        <img src={course.image} alt={course.name} className="w-full h-full object-cover" />
        <div className={`absolute inset-0 ${course.color} opacity-70`} />
        <span className="absolute bottom-2 left-3 font-label-sm text-label-sm text-white bg-black/30 px-2 py-0.5 rounded-full">
          {course.code}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-headline-sm text-headline-sm text-on-background mb-1">{course.name}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
          {course.professor ?? `${course.students} estudiantes`}
        </p>
        <p className="font-label-sm text-label-sm text-on-surface-variant mb-2 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">schedule</span>
          {course.schedule}
        </p>
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Progreso</span>
            <span className="font-label-sm text-label-sm text-on-surface">{course.progress}%</span>
          </div>
          <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full bg-primary-container rounded-full" style={{ width: `${course.progress}%` }} />
          </div>
          <button
            onClick={onOpen}
            className="w-full mt-4 bg-primary-container text-white font-label-md text-label-md py-2 rounded-lg hover:bg-primary-container/90 transition-colors"
          >
            Ver curso
          </button>
        </div>
      </div>
    </div>
  );
}
