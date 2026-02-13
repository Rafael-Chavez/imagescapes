function Header({ onNewJob, activeView, onViewChange }) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-100 dark:border-slate-800 px-8 py-4">
      <div className="flex items-center gap-4 text-slate-900 dark:text-white">
        <div className="bg-primary p-2 rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-white">grid_view</span>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-tight">Imagescapes</h2>
      </div>
      <div className="flex flex-1 justify-end gap-6 items-center">
        <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full">
          <button
            onClick={() => onViewChange('calendar')}
            className={`flex items-center px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeView === 'calendar'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => onViewChange('table')}
            className={`flex items-center px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeView === 'table'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            Table
          </button>
          <button
            onClick={() => onViewChange('current')}
            className={`flex items-center px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeView === 'current'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            Current Jobs
          </button>
          <button
            onClick={() => onViewChange('completed')}
            className={`flex items-center px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeView === 'completed'
                ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
            }`}
          >
            Completed
          </button>
        </nav>
        <button
          onClick={onNewJob}
          className="flex min-w-[120px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-10 px-5 bg-primary text-slate-900 text-sm font-bold shadow-sm hover:opacity-90 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="truncate">New Job</span>
        </button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-slate-100"
          style={{backgroundImage: 'url("https://i.pravatar.cc/150?img=60")'}}
        />
      </div>
    </header>
  );
}

export default Header;
