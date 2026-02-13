import { useState } from 'react';

function JobModal({ job, teamLeaders, employees, onClose, onUpdate, onDelete }) {
  const [editedJob, setEditedJob] = useState(job);
  const [showTeamLeaderDropdown, setShowTeamLeaderDropdown] = useState(false);
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  const handleStatusChange = (status) => {
    setEditedJob({ ...editedJob, status });
  };

  const handleTeamLeaderSelect = (leader) => {
    setEditedJob({ ...editedJob, teamLeader: leader });
    setShowTeamLeaderDropdown(false);
  };

  const handleEmployeeToggle = (employee) => {
    const employees = editedJob.employees || [];
    const isSelected = employees.find(e => e.id === employee.id);

    if (isSelected) {
      setEditedJob({
        ...editedJob,
        employees: employees.filter(e => e.id !== employee.id)
      });
    } else {
      setEditedJob({
        ...editedJob,
        employees: [...employees, employee]
      });
    }
  };

  const handleSave = () => {
    onUpdate(editedJob);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      onDelete(job.id);
    }
  };

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: 'bg-status-scheduled text-status-scheduled-text' },
    { value: 'confirmed', label: 'Confirmed', color: 'bg-primary/20 text-slate-800' },
    { value: 'inprogress', label: 'In Progress', color: 'bg-status-inprogress text-status-inprogress-text' },
    { value: 'completed', label: 'Completed', color: 'bg-status-completed text-status-completed-text' },
    { value: 'urgent', label: 'Urgent', color: 'bg-status-urgent text-status-urgent-text' }
  ];

  const jobTypeOptions = [
    { value: 'install', label: 'Install' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Job Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Job Info */}
          <div className="flex items-start gap-4">
            <div
              className="size-16 rounded-full bg-cover bg-center border-2 border-slate-200 flex-shrink-0"
              style={{ backgroundImage: `url('${job.avatar}')` }}
            />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Customer: {job.customer}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Date: {new Date(job.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                {job.time && ` at ${job.time}`}
              </p>
              {job.phone && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {job.phone}
                </p>
              )}
              {job.address && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  {job.address}
                </p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={editedJob.phone || ''}
                onChange={(e) => setEditedJob({ ...editedJob, phone: e.target.value })}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Time
              </label>
              <input
                type="time"
                value={editedJob.time || ''}
                onChange={(e) => setEditedJob({ ...editedJob, time: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Address
            </label>
            <input
              type="text"
              value={editedJob.address || ''}
              onChange={(e) => setEditedJob({ ...editedJob, address: e.target.value })}
              placeholder="123 Main St, City, State ZIP"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Job Type
            </label>
            <div className="flex flex-wrap gap-2">
              {jobTypeOptions.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setEditedJob({ ...editedJob, jobType: type.value })}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    editedJob.jobType === type.value
                      ? 'bg-primary text-slate-900 ring-2 ring-offset-2 ring-primary'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => handleStatusChange(status.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    editedJob.status === status.value
                      ? status.color + ' ring-2 ring-offset-2 ring-slate-400'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Team Leader */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Team Leader
            </label>
            <div className="relative">
              <button
                onClick={() => setShowTeamLeaderDropdown(!showTeamLeaderDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                {editedJob.teamLeader ? (
                  <div className="flex items-center gap-3">
                    <div
                      className="size-8 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${editedJob.teamLeader.avatar}')` }}
                    />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {editedJob.teamLeader.name}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-500">Select a team leader</span>
                )}
                <span className="material-symbols-outlined text-slate-400">expand_more</span>
              </button>

              {showTeamLeaderDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-10 overflow-hidden">
                  <button
                    onClick={() => {
                      setEditedJob({ ...editedJob, teamLeader: null });
                      setShowTeamLeaderDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                  >
                    No team leader
                  </button>
                  {teamLeaders.map((leader) => (
                    <button
                      key={leader.id}
                      onClick={() => handleTeamLeaderSelect(leader)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                    >
                      <div
                        className="size-8 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${leader.avatar}')` }}
                      />
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {leader.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Employees */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Assigned Employees
            </label>

            {/* Selected Employees */}
            {editedJob.employees && editedJob.employees.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {editedJob.employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-full"
                  >
                    <div
                      className="size-6 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${employee.avatar}')` }}
                    />
                    <span className="text-xs font-medium text-slate-900 dark:text-white">
                      {employee.name}
                    </span>
                    <button
                      onClick={() => handleEmployeeToggle(employee)}
                      className="ml-1 text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="relative">
              <button
                onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                <span className="text-sm text-slate-500">Add employees</span>
                <span className="material-symbols-outlined text-slate-400">expand_more</span>
              </button>

              {showEmployeeDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                  {employees.map((employee) => {
                    const isSelected = editedJob.employees?.find(e => e.id === employee.id);
                    return (
                      <button
                        key={employee.id}
                        onClick={() => handleEmployeeToggle(employee)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="size-8 rounded-full bg-cover bg-center"
                            style={{ backgroundImage: `url('${employee.avatar}')` }}
                          />
                          <span className="text-sm font-medium text-slate-900 dark:text-white">
                            {employee.name}
                          </span>
                        </div>
                        {isSelected && (
                          <span className="material-symbols-outlined text-primary">check</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between gap-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Delete Job
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-semibold bg-primary text-slate-900 rounded-lg hover:opacity-90 transition-all shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobModal;
