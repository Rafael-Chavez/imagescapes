import { useDraggable } from '@dnd-kit/core';

function DayJobCard({ job, onClick }) {
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
        return 'bg-status-urgent text-status-urgent-text border-red-500 ring-2 ring-red-500/50';
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
      <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-l-4 shadow-sm hover:shadow-lg transition-all mb-2 sm:mb-3 ${getStatusClasses(job.status)}`}>
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex items-start gap-2 sm:gap-3 flex-1">
            <div
              className="size-10 sm:size-12 rounded-full bg-cover bg-center flex-shrink-0 border-2 border-white shadow-sm"
              style={{ backgroundImage: `url('${job.avatar}')` }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 sm:mb-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold">{job.title}</h3>
                {job.time && (
                  <span className="flex items-center gap-1 text-[10px] sm:text-xs font-semibold px-2 py-1 bg-white/50 rounded-full">
                    <span className="material-symbols-outlined text-[12px] sm:text-[14px]">schedule</span>
                    {job.time}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm opacity-80 mb-1">Customer: {job.customer}</p>
              {job.phone && (
                <p className="text-xs sm:text-sm opacity-80 flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-[12px] sm:text-[14px]">call</span>
                  <span className="truncate">{job.phone}</span>
                </p>
              )}
              {job.address && (
                <p className="text-xs sm:text-sm opacity-80 flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-[12px] sm:text-[14px]">location_on</span>
                  <span className="truncate">{job.address}</span>
                </p>
              )}
              <div className="flex items-center gap-1.5 sm:gap-2 mt-2 flex-wrap">
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-1 bg-white/50 rounded-full">
                  {job.jobType === 'install' ? 'Install' : 'Maintenance'}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-1 bg-white/50 rounded-full capitalize">
                  {job.status.replace('inprogress', 'In Progress')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {job.teamLeader && (
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/30">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] opacity-60">person</span>
              <span className="text-xs sm:text-sm font-semibold">Team Leader:</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div
                  className="size-5 sm:size-6 rounded-full bg-cover bg-center border border-white"
                  style={{ backgroundImage: `url('${job.teamLeader.avatar}')` }}
                />
                <span className="text-xs sm:text-sm">{job.teamLeader.name}</span>
              </div>
            </div>
          </div>
        )}

        {job.employees && job.employees.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="material-symbols-outlined text-[16px] sm:text-[18px] opacity-60">groups</span>
              <span className="text-xs sm:text-sm font-semibold">Team:</span>
              <div className="flex items-center -space-x-1.5 sm:-space-x-2">
                {job.employees.slice(0, 5).map((employee, idx) => (
                  <div
                    key={employee.id}
                    className="size-5 sm:size-6 rounded-full bg-cover bg-center border-2 border-white"
                    style={{ backgroundImage: `url('${employee.avatar}')` }}
                    title={employee.name}
                  />
                ))}
                {job.employees.length > 5 && (
                  <div className="size-5 sm:size-6 rounded-full bg-slate-700 text-white text-[9px] sm:text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    +{job.employees.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DayView({ currentDate, jobs, onJobClick }) {
  const dayJobs = jobs.filter(job => {
    const jobDate = new Date(job.date);
    return jobDate.toDateString() === currentDate.toDateString();
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <main className="flex-1 bg-white dark:bg-background-dark overflow-auto">
      <div className="w-full max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
            {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
            {dayJobs.length} {dayJobs.length === 1 ? 'job' : 'jobs'} scheduled
          </p>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {dayJobs.length === 0 ? (
            <div className="text-center py-12 sm:py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-2xl">
              <span className="material-symbols-outlined text-4xl sm:text-5xl lg:text-6xl text-slate-300 dark:text-slate-600 mb-3 sm:mb-4">event_available</span>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-400 dark:text-slate-500 mb-1 sm:mb-2">No Jobs Scheduled</h3>
              <p className="text-xs sm:text-sm lg:text-base text-slate-400 dark:text-slate-500">
                There are no jobs scheduled for this day
              </p>
            </div>
          ) : (
            dayJobs.map(job => (
              <DayJobCard key={job.id} job={job} onClick={() => onJobClick(job)} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default DayView;
