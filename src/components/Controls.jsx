import { useState } from 'react';

function Controls({ currentDate, viewMode, onViewModeChange, onDateChange, onToday, filters, onFiltersChange, teamLeaders }) {
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const jobTypes = [
    { id: 'install', label: 'Install' },
    { id: 'maintenance', label: 'Maintenance' }
  ];

  const getDateDisplay = () => {
    if (viewMode === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewMode === 'week') {
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      } else {
        return `${monthNames[weekStart.getMonth()]} ${weekStart.getDate()} - ${monthNames[weekEnd.getMonth()]} ${weekEnd.getDate()}, ${weekStart.getFullYear()}`;
      }
    } else {
      return `${dayNames[currentDate.getDay()]}, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    }
  };

  const handleTeamLeaderToggle = (leaderId) => {
    const newLeaders = filters.teamLeaders.includes(leaderId)
      ? filters.teamLeaders.filter(id => id !== leaderId)
      : [...filters.teamLeaders, leaderId];
    onFiltersChange({ ...filters, teamLeaders: newLeaders });
  };

  const handleJobTypeToggle = (typeId) => {
    const newTypes = filters.jobTypes.includes(typeId)
      ? filters.jobTypes.filter(id => id !== typeId)
      : [...filters.jobTypes, typeId];
    onFiltersChange({ ...filters, jobTypes: newTypes });
  };

  const activeFilterCount = filters.teamLeaders.length + filters.jobTypes.length;

  return (
    <div className="flex items-center justify-between px-8 py-6 bg-white dark:bg-background-dark border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-3">
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 relative"
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-slate-900 text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {showFilterDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 min-w-[280px]">
              <div className="p-4 space-y-4">
                {/* Team Leaders */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Team Leaders</h3>
                  <div className="space-y-2">
                    {teamLeaders.map(leader => (
                      <label key={leader.id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={filters.teamLeaders.includes(leader.id)}
                          onChange={() => handleTeamLeaderToggle(leader.id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <div className="flex items-center gap-2">
                          <div
                            className="size-6 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url('${leader.avatar}')` }}
                          />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{leader.name}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="h-[1px] bg-slate-200 dark:bg-slate-700"></div>

                {/* Job Types */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Job Type</h3>
                  <div className="space-y-2">
                    {jobTypes.map(type => (
                      <label key={type.id} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 p-2 rounded-lg">
                        <input
                          type="checkbox"
                          checked={filters.jobTypes.includes(type.id)}
                          onChange={() => handleJobTypeToggle(type.id)}
                          className="rounded border-slate-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <>
                    <div className="h-[1px] bg-slate-200 dark:bg-slate-700"></div>
                    <button
                      onClick={() => onFiltersChange({ teamLeaders: [], jobTypes: [] })}
                      className="w-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1"></div>

        {/* View Mode Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowViewDropdown(!showViewDropdown)}
            className="flex items-center gap-2 px-5 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-semibold"
          >
            {viewMode === 'month' && 'Month'}
            {viewMode === 'week' && 'Week'}
            {viewMode === 'day' && 'Day'}
            <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>

          {showViewDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => {
                  onViewModeChange('month');
                  setShowViewDropdown(false);
                }}
                className={`w-full px-6 py-3 text-left text-sm font-medium transition-colors ${
                  viewMode === 'month'
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => {
                  onViewModeChange('week');
                  setShowViewDropdown(false);
                }}
                className={`w-full px-6 py-3 text-left text-sm font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => {
                  onViewModeChange('day');
                  setShowViewDropdown(false);
                }}
                className={`w-full px-6 py-3 text-left text-sm font-medium transition-colors ${
                  viewMode === 'day'
                    ? 'bg-primary/10 text-primary'
                    : 'text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Day View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center - Date Display */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onDateChange('prev')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white min-w-[240px] text-center">
          {getDateDisplay()}
        </h2>
        <button
          onClick={() => onDateChange('next')}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      {/* Right - Today Button */}
      <div className="flex items-center gap-6">
        <button
          onClick={onToday}
          className="px-5 py-2 text-sm font-semibold text-primary border border-primary/30 rounded-full hover:bg-primary/10"
        >
          Today
        </button>
      </div>
    </div>
  );
}

export default Controls;
