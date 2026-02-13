import { useDraggable } from '@dnd-kit/core';

function JobCard({ job, onClick, isDragging = false }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: job.id,
  });

  const style = transform && !isDragging ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getStatusClasses = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-status-scheduled text-status-scheduled-text';
      case 'confirmed':
        return 'bg-primary/20 text-slate-800';
      case 'inprogress':
        return 'bg-status-inprogress text-status-inprogress-text';
      case 'completed':
        return 'bg-status-completed text-status-completed-text';
      case 'urgent':
        return 'bg-status-urgent text-status-urgent-text ring-1 ring-red-500/50';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick();
      }}
    >
      <div
        className={`flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-full shadow-sm hover:shadow-md transition-all ${getStatusClasses(
          job.status
        )}`}
      >
        <div
          className="size-4 sm:size-6 rounded-full bg-cover bg-center border border-white flex-shrink-0"
          style={{ backgroundImage: `url('${job.avatar}')` }}
        />
        <span className="text-[9px] sm:text-[11px] font-bold truncate pr-1 sm:pr-2">{job.title}</span>
      </div>
    </div>
  );
}

export default JobCard;
