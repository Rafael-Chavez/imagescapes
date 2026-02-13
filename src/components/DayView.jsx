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
      <div className={`p-4 rounded-xl border-l-4 shadow-sm hover:shadow-lg transition-all mb-3 ${getStatusClasses(job.status)}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div
              className="size-12 rounded-full bg-cover bg-center flex-shrink-0 border-2 border-white shadow-sm"
              style={{ backgroundImage: `url('${job.avatar}')` }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-base font-bold">{job.title}</h3>
                {job.time && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-white/50 rounded-full">
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {job.time}
                  </span>
                )}
              </div>
              <p className="text-sm opacity-80 mb-1">Customer: {job.customer}</p>
              {job.phone && (
                <p className="text-sm opacity-80 flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-[14px]">call</span>
                  {job.phone}
                </p>
              )}
              {job.address && (
                <p className="text-sm opacity-80 flex items-center gap-1 mb-2">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  {job.address}
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-semibold px-2 py-1 bg-white/50 rounded-full">
                  {job.jobType === 'install' ? 'Install' : 'Maintenance'}
                </span>
                <span className="text-xs font-semibold px-2 py-1 bg-white/50 rounded-full capitalize">
                  {job.status.replace('inprogress', 'In Progress')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {job.teamLeader && (
          <div className="mt-3 pt-3 border-t border-white/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] opacity-60">person</span>
              <span className="text-sm font-semibold">Team Leader:</span>
              <div className="flex items-center gap-2">
                <div
                  className="size-6 rounded-full bg-cover bg-center border border-white"
                  style={{ backgroundImage: `url('${job.teamLeader.avatar}')` }}
                />
                <span className="text-sm">{job.teamLeader.name}</span>
              </div>
            </div>
          </div>
        )}

        {job.employees && job.employees.length > 0 && (
          <div className="mt-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] opacity-60">groups</span>
              <span className="text-sm font-semibold">Team:</span>
              <div className="flex items-center -space-x-2">
                {job.employees.slice(0, 5).map((employee, idx) => (
                  <div
                    key={employee.id}
                    className="size-6 rounded-full bg-cover bg-center border-2 border-white"
                    style={{ backgroundImage: `url('${employee.avatar}')` }}
                    title={employee.name}
                  />
                ))}
                {job.employees.length > 5 && (
                  <div className="size-6 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
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
      <div className="w-full max-w-[1200px] mx-auto p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {dayNames[currentDate.getDay()]}, {monthNames[currentDate.getMonth()]} {currentDate.getDate()}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            {dayJobs.length} {dayJobs.length === 1 ? 'job' : 'jobs'} scheduled
          </p>
        </div>

        <div className="space-y-3">
          {dayJobs.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
              <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">event_available</span>
              <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500 mb-2">No Jobs Scheduled</h3>
              <p className="text-slate-400 dark:text-slate-500">
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
