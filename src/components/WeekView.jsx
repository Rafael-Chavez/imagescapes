import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';

function WeekJobCard({ job, onClick }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getStatusClasses = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-status-scheduled text-status-scheduled-text border-status-scheduled-text';
      case 'confirmed':
        return 'bg-primary/20 text-slate-800 border-primary';
      case 'inprogress':
        return 'bg-status-inprogress text-status-inprogress-text border-status-inprogress-text';
      case 'completed':
        return 'bg-status-completed text-status-completed-text border-status-completed-text';
      case 'urgent':
        return 'bg-status-urgent text-status-urgent-text border-red-500';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <div className={`p-1.5 sm:p-2 rounded-lg border-l-4 shadow-sm hover:shadow-md transition-all mb-1.5 sm:mb-2 ${getStatusClasses(job.status)}`}>
        <div className="flex items-center gap-1 sm:gap-2 mb-1">
          <div
            className="size-4 sm:size-5 rounded-full bg-cover bg-center flex-shrink-0 border border-white"
            style={{ backgroundImage: `url('${job.avatar}')` }}
          />
          <span className="text-[10px] sm:text-xs font-bold truncate">{job.title}</span>
        </div>
        {job.teamLeader && (
          <div className="flex items-center gap-1 mt-1">
            <span className="material-symbols-outlined text-[10px] sm:text-[12px] text-slate-500">person</span>
            <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-400 truncate">{job.teamLeader.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function WeekDayColumn({ date, jobs, onJobClick }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `cell-${date.getTime()}`,
    data: { date }
  });

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 border-r border-slate-200 dark:border-slate-700 last:border-r-0 min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] transition-colors ${
        isOver ? 'bg-primary/10' : ''
      } ${isToday ? 'bg-primary/5' : ''}`}
    >
      <div className={`p-1 sm:p-2 lg:p-3 border-b border-slate-200 dark:border-slate-700 text-center ${isToday ? 'bg-primary/10' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
        <div className="text-[9px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
          <span className="sm:hidden">{dayNamesShort[date.getDay()]}</span>
          <span className="hidden sm:inline">{dayNames[date.getDay()]}</span>
        </div>
        <div className={`text-sm sm:text-base lg:text-lg font-bold mt-0.5 sm:mt-1 ${isToday ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
          {date.getDate()}
        </div>
      </div>
      <div className="p-1 sm:p-2">
        {jobs.map(job => (
          <WeekJobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
        ))}
      </div>
    </div>
  );
}

function WeekView({ currentDate, jobs, onJobMove, onJobClick }) {
  const [activeJob, setActiveJob] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get the week start (Sunday) and create array of 7 days
  const getWeekDays = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const getJobsForDay = (date) => {
    return jobs.filter(job => {
      const jobDate = new Date(job.date);
      return jobDate.toDateString() === date.toDateString();
    });
  };

  const handleDragStart = (event) => {
    const job = jobs.find(j => j.id === event.active.id);
    setActiveJob(job);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const jobId = active.id;
      const newDate = over.data.current.date;
      onJobMove(jobId, newDate);
    }

    setActiveJob(null);
  };

  const handleDragCancel = () => {
    setActiveJob(null);
  };

  return (
    <main className="flex-1 bg-white dark:bg-background-dark overflow-auto">
      <div className="w-full max-w-[1600px] mx-auto p-2 sm:p-4 lg:p-8">
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-2xl overflow-hidden shadow-sm">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="flex overflow-x-auto">
              {weekDays.map(day => (
                <WeekDayColumn
                  key={day.toISOString()}
                  date={day}
                  jobs={getJobsForDay(day)}
                  onJobClick={onJobClick}
                />
              ))}
            </div>

            <DragOverlay>
              {activeJob ? (
                <div className="cursor-grabbing opacity-80">
                  <WeekJobCard job={activeJob} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </main>
  );
}

export default WeekView;
