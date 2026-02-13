import { useState } from 'react';

function TableView({ jobs, onJobClick }) {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedJobs = [...jobs].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case 'date':
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
        break;
      case 'time':
        aValue = a.time || '00:00';
        bValue = b.time || '00:00';
        break;
      case 'customer':
        aValue = a.customer.toLowerCase();
        bValue = b.customer.toLowerCase();
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'jobType':
        aValue = a.jobType;
        bValue = b.jobType;
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

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
        return 'bg-status-urgent text-status-urgent-text';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <span className="material-symbols-outlined text-[16px] text-slate-400">unfold_more</span>;
    }
    return (
      <span className="material-symbols-outlined text-[16px] text-primary">
        {sortDirection === 'asc' ? 'arrow_upward' : 'arrow_downward'}
      </span>
    );
  };

  return (
    <main className="flex-1 bg-white dark:bg-background-dark overflow-auto">
      <div className="w-full max-w-[1800px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {sortedJobs.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
              <span className="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-3 block">
                search_off
              </span>
              <h3 className="text-lg font-bold text-slate-400 dark:text-slate-500 mb-2">No Jobs Found</h3>
              <p className="text-sm text-slate-400 dark:text-slate-500">Try adjusting your filters</p>
            </div>
          ) : (
            sortedJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => onJobClick(job)}
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm active:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="size-12 rounded-full bg-cover bg-center flex-shrink-0 border-2 border-slate-100"
                    style={{ backgroundImage: `url('${job.avatar}')` }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{job.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{job.customer}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-semibold rounded-full ${getStatusClasses(job.status)}`}>
                    {job.status === 'inprogress' ? 'In Progress' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">event</span>
                    <span>{new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {job.time && (
                      <>
                        <span className="material-symbols-outlined text-[16px] ml-2">schedule</span>
                        <span>{job.time}</span>
                      </>
                    )}
                  </div>

                  {job.phone && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">call</span>
                      <span>{job.phone}</span>
                    </div>
                  )}

                  {job.address && (
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      <span className="truncate">{job.address}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="px-2.5 py-1 text-[10px] font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                      {job.jobType}
                    </span>
                    {job.teamLeader && (
                      <div className="flex items-center gap-1.5">
                        <div
                          className="size-5 rounded-full bg-cover bg-center border border-white"
                          style={{ backgroundImage: `url('${job.teamLeader.avatar}')` }}
                        />
                        <span className="text-[10px] text-slate-600 dark:text-slate-400">{job.teamLeader.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Date
                      <SortIcon field="date" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('time')}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Time
                      <SortIcon field="time" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('customer')}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Customer
                      <SortIcon field="customer" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Contact</div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Job Details</div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('jobType')}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Type
                      <SortIcon field="jobType" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Team</div>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {sortedJobs.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-16 text-center">
                      <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4 block">
                        search_off
                      </span>
                      <h3 className="text-xl font-bold text-slate-400 dark:text-slate-500 mb-2">No Jobs Found</h3>
                      <p className="text-slate-400 dark:text-slate-500">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  sortedJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => onJobClick(job)}
                    >
                      {/* Date */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900 dark:text-white">
                          {new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(job.date).toLocaleDateString('en-US', { year: 'numeric' })}
                        </div>
                      </td>

                      {/* Time */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          {job.time || 'Not set'}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="size-10 rounded-full bg-cover bg-center flex-shrink-0 border-2 border-slate-100"
                            style={{ backgroundImage: `url('${job.avatar}')` }}
                          />
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">{job.customer}</div>
                            <div className="text-xs text-slate-500 truncate max-w-[200px]">{job.address}</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                          <span className="material-symbols-outlined text-[16px]">call</span>
                          {job.phone}
                        </div>
                      </td>

                      {/* Job Details */}
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-slate-900 dark:text-white max-w-[250px]">
                          {job.title}
                        </div>
                      </td>

                      {/* Job Type */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                          {job.jobType}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClasses(job.status)}`}>
                          {job.status === 'inprogress' ? 'In Progress' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </span>
                      </td>

                      {/* Team */}
                      <td className="px-4 py-4">
                        {job.teamLeader ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="size-6 rounded-full bg-cover bg-center border border-white"
                              style={{ backgroundImage: `url('${job.teamLeader.avatar}')` }}
                              title={job.teamLeader.name}
                            />
                            <span className="text-xs text-slate-600 dark:text-slate-400">{job.teamLeader.name}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Not assigned</span>
                        )}
                        {job.employees && job.employees.length > 0 && (
                          <div className="flex items-center -space-x-2 mt-1">
                            {job.employees.slice(0, 3).map((employee) => (
                              <div
                                key={employee.id}
                                className="size-5 rounded-full bg-cover bg-center border-2 border-white"
                                style={{ backgroundImage: `url('${employee.avatar}')` }}
                                title={employee.name}
                              />
                            ))}
                            {job.employees.length > 3 && (
                              <div className="size-5 rounded-full bg-slate-700 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                                +{job.employees.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onJobClick(job);
                          }}
                          className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px] text-slate-600 dark:text-slate-400">
                            edit
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        {sortedJobs.length > 0 && (
          <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-slate-500 mb-1">Total Jobs</div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{sortedJobs.length}</div>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-slate-500 mb-1">Scheduled</div>
              <div className="text-xl sm:text-2xl font-bold text-status-scheduled-text">
                {sortedJobs.filter(j => j.status === 'scheduled').length}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-slate-500 mb-1">In Progress</div>
              <div className="text-xl sm:text-2xl font-bold text-status-inprogress-text">
                {sortedJobs.filter(j => j.status === 'inprogress').length}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="text-xs sm:text-sm text-slate-500 mb-1">Completed</div>
              <div className="text-xl sm:text-2xl font-bold text-status-completed-text">
                {sortedJobs.filter(j => j.status === 'completed').length}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default TableView;
