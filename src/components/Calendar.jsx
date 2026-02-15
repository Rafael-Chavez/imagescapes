import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useState } from 'react';
import CalendarCell from './CalendarCell';
import JobCard from './JobCard';

function Calendar({ currentDate, jobs, onJobMove, onJobClick }) {
  const [activeJob, setActiveJob] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-status-scheduled';
      case 'confirmed':
        return 'bg-primary';
      case 'inprogress':
        return 'bg-status-inprogress';
      case 'completed':
        return 'bg-status-completed';
      case 'urgent':
        return 'bg-status-urgent';
      default:
        return 'bg-slate-400';
    }
  };

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

  const getJobsForDate = (date) => {
    return jobs.filter(job => {
      const jobDate = new Date(job.date);
      return jobDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const selectedDateJobs = selectedDate ? getJobsForDate(selectedDate) : [];
  const today = new Date();

  const renderMobileCalendar = () => {
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(year, month - 1, day);
      days.push(
        <button
          key={`prev-${day}`}
          onClick={() => handleDateClick(date)}
          className="bg-white dark:bg-slate-900 p-1 flex flex-col items-center justify-between min-h-[50px]"
        >
          <span className="text-xs text-slate-300 dark:text-slate-600">{day}</span>
        </button>
      );
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const dayJobs = getJobsForDate(date);

      days.push(
        <button
          key={`current-${day}`}
          onClick={() => handleDateClick(date)}
          className={`bg-white dark:bg-slate-900 p-1 flex flex-col items-center justify-between min-h-[50px] ${
            isSelected ? 'bg-primary/10 dark:bg-primary/20' : ''
          } ${isToday ? 'ring-2 ring-primary ring-inset ring-offset-1 ring-offset-white dark:ring-offset-slate-900' : ''}`}
        >
          <span className={`text-xs font-medium ${isToday ? 'text-primary font-bold' : ''}`}>{day}</span>
          {dayJobs.length > 0 && (
            <div className="flex flex-wrap gap-0.5 justify-center">
              {dayJobs.slice(0, 3).map((job, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full ${getStatusColor(job.status)}`}></div>
              ))}
            </div>
          )}
        </button>
      );
    }

    // Next month's leading days
    const remainingDays = 7 - (days.length % 7);
    if (remainingDays < 7) {
      for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        days.push(
          <button
            key={`next-${day}`}
            onClick={() => handleDateClick(date)}
            className="bg-white dark:bg-slate-900 p-1 flex flex-col items-center justify-between min-h-[50px]"
          >
            <span className="text-xs text-slate-300 dark:text-slate-600">{day}</span>
          </button>
        );
      }
    }

    return days;
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <main className="flex-1 bg-white dark:bg-background-dark overflow-auto flex flex-col">
      {/* Desktop View */}
      <div className="hidden lg:block w-full max-w-[1600px] mx-auto p-2 sm:p-4 lg:p-8">
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-2xl overflow-hidden shadow-sm">
          {/* Day Names */}
          <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <div className="py-2 px-1 sm:py-3 sm:px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">M</div>
            <div className="py-2 px-1 sm:py-3 sm:px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">T</div>
            <div className="py-2 px-1 sm:py-3 sm:px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">W</div>
            <div className="py-2 px-1 sm:py-3 sm:px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">T</div>
            <div className="py-2 px-1 sm:py-3 sm:px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">F</div>
            <div className="py-2 px-1 sm:py-3 sm:px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">S</div>
            <div className="py-2 px-1 sm:py-3 sm:px-4 text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">S</div>
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
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 sm:mt-8 px-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="size-2.5 sm:size-3 rounded-full bg-status-scheduled"></div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Scheduled</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="size-2.5 sm:size-3 rounded-full bg-primary"></div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="size-2.5 sm:size-3 rounded-full bg-status-inprogress"></div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="size-2.5 sm:size-3 rounded-full bg-status-completed"></div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="size-2.5 sm:size-3 rounded-full bg-status-urgent"></div>
            <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Urgent</span>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex flex-col flex-1 overflow-hidden">
        <div className="px-4 py-2 flex-1 flex flex-col overflow-hidden">
          {/* Weekdays Header */}
          <div className="grid grid-cols-7 mb-1">
            <div className="text-center text-[10px] font-bold text-slate-400 uppercase">S</div>
            <div className="text-center text-[10px] font-bold text-slate-400 uppercase">M</div>
            <div className="text-center text-[10px] font-bold text-slate-400 uppercase">T</div>
            <div className="text-center text-[10px] font-bold text-slate-400 uppercase">W</div>
            <div className="text-center text-[10px] font-bold text-slate-400 uppercase">T</div>
            <div className="text-center text-[10px] font-bold text-slate-400 uppercase">F</div>
            <div className="text-center text-[10px] font-bold text-slate-400 uppercase">S</div>
          </div>

          {/* Grid Body */}
          <div className="grid grid-cols-7 gap-px bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 flex-1">
            {renderMobileCalendar()}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-status-scheduled"></div>
            <span className="text-[9px] uppercase font-bold text-slate-500">Sched</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
            <span className="text-[9px] uppercase font-bold text-slate-500">Conf</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-status-inprogress"></div>
            <span className="text-[9px] uppercase font-bold text-slate-500">In Prog</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-status-completed"></div>
            <span className="text-[9px] uppercase font-bold text-slate-500">Done</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-status-urgent"></div>
            <span className="text-[9px] uppercase font-bold text-slate-500">Urgent</span>
          </div>
        </div>

        {/* Selected Day Panel */}
        {selectedDate && (
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold">
                {dayNames[selectedDate.getDay()].substring(0, 3)}, {monthNames[selectedDate.getMonth()].substring(0, 3)} {selectedDate.getDate()}
              </h3>
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                {selectedDateJobs.length} {selectedDateJobs.length === 1 ? 'JOB' : 'JOBS'}
              </span>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {selectedDateJobs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No jobs scheduled</p>
              ) : (
                selectedDateJobs.map((job) => (
                  <button
                    key={job.id}
                    onClick={() => onJobClick(job)}
                    className="w-full flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow"
                  >
                    {job.time && (
                      <div className="text-[10px] font-bold text-slate-500 w-12 text-right leading-none">
                        {job.time}
                      </div>
                    )}
                    <div className={`w-1 h-6 rounded-full ${getStatusColor(job.status)}`}></div>
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="text-xs font-bold truncate">{job.title}</p>
                      <p className="text-[10px] text-slate-400 truncate">{job.customer}</p>
                    </div>
                    <span className={`material-symbols-outlined text-lg ${
                      job.status === 'urgent' ? 'text-status-urgent' :
                      job.status === 'inprogress' ? 'text-status-inprogress' :
                      job.status === 'completed' ? 'text-status-completed' :
                      job.status === 'confirmed' ? 'text-primary' : 'text-status-scheduled'
                    }`}>
                      {job.status === 'urgent' ? 'error' :
                       job.status === 'inprogress' ? 'pending' :
                       job.status === 'completed' ? 'check_circle' :
                       job.status === 'confirmed' ? 'check_circle' : 'schedule'}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Calendar;
