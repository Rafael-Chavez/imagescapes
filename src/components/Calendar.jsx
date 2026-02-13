import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useState } from 'react';
import CalendarCell from './CalendarCell';
import JobCard from './JobCard';

function Calendar({ currentDate, jobs, onJobMove, onJobClick }) {
  const [activeJob, setActiveJob] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Convert Sunday (0) to 7, and shift Monday to 0
    const adjustedStartDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    return { daysInMonth, startingDayOfWeek: adjustedStartDay };
  };

  const renderCalendarDays = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      days.push(
        <CalendarCell
          key={`prev-${day}`}
          day={day}
          isCurrentMonth={false}
          isToday={false}
          date={new Date(year, month - 1, day)}
          jobs={[]}
          onJobClick={onJobClick}
        />
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const dayJobs = jobs.filter(job => {
        const jobDate = new Date(job.date);
        return jobDate.getDate() === day &&
               jobDate.getMonth() === month &&
               jobDate.getFullYear() === year;
      });

      days.push(
        <CalendarCell
          key={`current-${day}`}
          day={day}
          isCurrentMonth={true}
          isToday={isToday}
          date={date}
          jobs={dayJobs}
          onJobClick={onJobClick}
        />
      );
    }

    // Next month's leading days
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        days.push(
          <CalendarCell
            key={`next-${day}`}
            day={day}
            isCurrentMonth={false}
            isToday={false}
            date={new Date(year, month + 1, day)}
            jobs={[]}
            onJobClick={onJobClick}
          />
        );
      }
    }

    return days;
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
      <div className="w-full max-w-[1600px] mx-auto p-8">
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          {/* Day Names */}
          <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <div className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Mon</div>
            <div className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Tue</div>
            <div className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Wed</div>
            <div className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Thu</div>
            <div className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Fri</div>
            <div className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Sat</div>
            <div className="py-3 px-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">Sun</div>
          </div>

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="calendar-grid bg-white dark:bg-background-dark">
              {renderCalendarDays()}
            </div>

            <DragOverlay>
              {activeJob ? (
                <div className="cursor-grabbing opacity-80">
                  <JobCard job={activeJob} isDragging={true} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {/* Calendar Legend */}
        <div className="flex flex-wrap items-center gap-6 mt-8 px-2">
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-status-scheduled"></div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-primary/30"></div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-status-inprogress"></div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-status-completed"></div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-3 rounded-full bg-status-urgent"></div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgent</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Calendar;
