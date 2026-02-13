import { useDroppable } from '@dnd-kit/core';
import JobCard from './JobCard';

function CalendarCell({ day, isCurrentMonth, isToday, date, jobs, onJobClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${date.getTime()}`,
    data: { date }
  });

  return (
    <div
      ref={setNodeRef}
      className={`calendar-cell p-1 sm:p-2 lg:p-3 min-h-[80px] sm:min-h-[120px] lg:min-h-[140px] transition-colors ${
        !isCurrentMonth ? 'bg-slate-50/50 dark:bg-slate-900/20' : ''
      } ${isToday ? 'bg-primary/5' : ''} ${isOver ? 'bg-primary/10' : ''}`}
    >
      <span
        className={`text-[10px] sm:text-xs lg:text-sm font-bold ${
          !isCurrentMonth
            ? 'text-slate-400'
            : isToday
            ? 'text-primary'
            : 'text-slate-900 dark:text-white'
        }`}
      >
        {day}
      </span>

      <div className="space-y-1 sm:space-y-2 mt-1 sm:mt-2">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => onJobClick(job)}
          />
        ))}
      </div>
    </div>
  );
}

export default CalendarCell;
