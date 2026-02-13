import { useState } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import Calendar from './components/Calendar';
import WeekView from './components/WeekView';
import DayView from './components/DayView';
import TableView from './components/TableView';
import JobModal from './components/JobModal';
import NewJobModal from './components/NewJobModal';

// Get current date in Eastern Time
const getEasternDate = () => {
  const now = new Date();
  const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return easternTime;
};

function App() {
  const [currentDate, setCurrentDate] = useState(getEasternDate());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [activeView, setActiveView] = useState('calendar'); // 'calendar', 'table', 'current', 'completed'
  const [filters, setFilters] = useState({
    teamLeaders: [],
    jobTypes: []
  });

  const [jobs, setJobs] = useState([
    {
      id: 1,
      date: new Date(2024, 7, 1),
      time: '09:00',
      title: 'Mow + Edge – Johnson',
      status: 'scheduled',
      customer: 'Johnson',
      phone: '(555) 123-4567',
      address: '123 Oak Street, Springfield, IL 62701',
      jobType: 'maintenance',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCo8gYqFBdslEedoo1Wk6yUOUu_KIV3LRquXkMLHvppwD166gf3VMqBhTLXvr3bB6KkXLyAXV4Awi28BHgNbC9dRcm8SiMJxjM_HrUGwg3OrjAR8HFu_ang9HJVYrOaG6a0j67rg_7dZvFYksFWH1tfKyjkgfgtKBdOu8AX1GvJlOUoyM984UAolCV5QsGv1oCinArS3W8jPsi6s5b6cHBSkS_Uxb-tOeNgtCRbd95r-Stpr9OufY20sch1vgRO76o9DrQQsb0EC8',
      teamLeader: null,
      employees: []
    },
    {
      id: 2,
      date: new Date(2024, 7, 6),
      time: '10:30',
      title: 'Mulch Install – Smith',
      status: 'confirmed',
      customer: 'Smith',
      phone: '(555) 234-5678',
      address: '456 Maple Avenue, Springfield, IL 62702',
      jobType: 'install',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWAFRWk3meHtC7ExeVPqpqXkYo2z7bc4ybm7hGOCEKAq_vJLpYEk4gosnVHkOQMLg9dehUMp4Ebr9iFWw2lHJ5tOxsz_xeF8qAiAwGvuUEbbpl8XmLyNUcrsCbhCMYJVnTycUDkbZOGLJI1Yy6E6LbpmCqB-kR6a8i9jtJV5_7nHU3YLh1s5Snpazn7JuEmQZ22IeRCdRFPwafzqc-OZTCOFi48LDhnU8RMqyinPQf0zZfS72Qj2e6SAXWkc2iR9po7fkM1uOy7Io',
      teamLeader: null,
      employees: []
    },
    {
      id: 3,
      date: new Date(2024, 7, 9),
      time: '08:00',
      title: 'Urgent: Tree Fall',
      status: 'urgent',
      customer: 'Emergency',
      phone: '(555) 345-6789',
      address: '789 Elm Drive, Springfield, IL 62703',
      jobType: 'maintenance',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5PRdbkjc8zayBVolG-chdZzaCaiXKc3f7oGxBhsEUw1l4ke6gm9Wdj7oZZcCGcjATlcplNU9ffYyDfnXGZYsUNFTSb6nNT3NEDJpXeLXapH4-mU9WYMSkEGpYAxMBEP7eRbYNek1GokzmDwGHB8dvQcs5OfHtDs_6Oy0Ly6xnsXYtF3zek_o3qXJ9OUCD9KwiibN-i9lSNFIJMJ393d3NkO34En9Ed5vE0LO7esycFLwjObXvtIbIiQArCT9rwdumMT3RD0RSNJA',
      teamLeader: null,
      employees: []
    },
    {
      id: 4,
      date: new Date(2024, 7, 12),
      time: '13:00',
      title: 'Irrigation Repair',
      status: 'inprogress',
      customer: 'Wilson',
      phone: '(555) 456-7890',
      address: '321 Pine Road, Springfield, IL 62704',
      jobType: 'maintenance',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYQqIZ9TUAEHJ5ukj25HQrNn7bGNwKt20CMzWqDRXgkI2Eex0OPnvPLX5Y9ya5VunNJPE4xYbLVA8WPl4d8s6lYrsorku6YadCOygDuFq9odA5IslRRclXmQPnZKhR38jxQiHygdsk_0Cm1OQbA3e2roglq3svXAFa5NXHOLSvstQ64xacVruBGuNz_WXfq-p373axMtMF_DDAqtZpGoOVuvUXjTSY9ZEOdodxo9bixf5_T56wXnbaR2gSRQB2Q5GBmXMpBHzV9IE',
      teamLeader: null,
      employees: []
    },
    {
      id: 5,
      date: new Date(2024, 7, 20),
      time: '11:00',
      title: 'Cleanup – Oak St',
      status: 'completed',
      customer: 'Oak St HOA',
      phone: '(555) 567-8901',
      address: '654 Cedar Lane, Springfield, IL 62705',
      jobType: 'maintenance',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBh6OxugI-gZ-QcUkroE87A7HSqX4I6_maL619-dEyBfuIPIzr6Of569pKmDoi3oj7Rl_ZCYgn3tOUf6sTJHjG2VlgabL4IGAZqizBQi61-xkyHdf-WskvquZiZD1aziK9Bia7Pf4dnCM2FH90eZ8wbhMpE-PoCdPy5zksHpAAhwBziq6ZmVwD4Vo5ALt2o28SuhNTAngECLtEbNNpLephxQLqL5848RvR8kvTu50GIZGaT-sbFE6whBNYctmgUlbG1I4IEycNHEII',
      teamLeader: null,
      employees: []
    }
  ]);

  const [teamLeaders] = useState([
    { id: 1, name: 'Mike Stevens', avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: 2, name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/150?img=45' },
    { id: 3, name: 'Tom Rodriguez', avatar: 'https://i.pravatar.cc/150?img=33' }
  ]);

  const [employees] = useState([
    { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: 3, name: 'Bob Wilson', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: 4, name: 'Alice Brown', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: 5, name: 'Charlie Davis', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: 6, name: 'Eva Martinez', avatar: 'https://i.pravatar.cc/150?img=20' }
  ]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [showNewJobModal, setShowNewJobModal] = useState(false);

  const handleDateChange = (direction) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
    } else if (viewMode === 'week') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
    } else if (viewMode === 'day') {
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
    }
    setCurrentDate(newDate);
  };

  const handleJobMove = (jobId, newDate) => {
    setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, date: newDate } : job
    ));
  };

  const handleUpdateJob = (updatedJob) => {
    setJobs(jobs.map(job =>
      job.id === updatedJob.id ? updatedJob : job
    ));
  };

  const handleAddJob = (newJob) => {
    const job = {
      ...newJob,
      id: Math.max(...jobs.map(j => j.id), 0) + 1,
      avatar: 'https://i.pravatar.cc/150?img=' + Math.floor(Math.random() * 70)
    };
    setJobs([...jobs, job]);
  };

  const handleDeleteJob = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    setSelectedJob(null);
  };

  // Filter jobs based on selected filters
  const filteredJobs = jobs.filter(job => {
    if (filters.teamLeaders.length > 0) {
      if (!job.teamLeader || !filters.teamLeaders.includes(job.teamLeader.id)) {
        return false;
      }
    }
    if (filters.jobTypes.length > 0) {
      if (!filters.jobTypes.includes(job.jobType)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-white dark:bg-background-dark overflow-x-hidden">
      <Header onNewJob={() => setShowNewJobModal(true)} activeView={activeView} onViewChange={setActiveView} />

      {activeView === 'calendar' && (
        <Controls
          currentDate={currentDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onDateChange={handleDateChange}
          onToday={() => setCurrentDate(getEasternDate())}
          filters={filters}
          onFiltersChange={setFilters}
          teamLeaders={teamLeaders}
        />
      )}

      {activeView === 'calendar' && viewMode === 'month' && (
        <Calendar
          currentDate={currentDate}
          jobs={filteredJobs}
          onJobMove={handleJobMove}
          onJobClick={setSelectedJob}
        />
      )}

      {activeView === 'calendar' && viewMode === 'week' && (
        <WeekView
          currentDate={currentDate}
          jobs={filteredJobs}
          onJobMove={handleJobMove}
          onJobClick={setSelectedJob}
        />
      )}

      {activeView === 'calendar' && viewMode === 'day' && (
        <DayView
          currentDate={currentDate}
          jobs={filteredJobs}
          onJobMove={handleJobMove}
          onJobClick={setSelectedJob}
        />
      )}

      {activeView === 'table' && (
        <TableView
          jobs={filteredJobs}
          onJobClick={setSelectedJob}
        />
      )}

      {activeView === 'current' && (
        <TableView
          jobs={filteredJobs.filter(j => j.status === 'inprogress' || j.status === 'confirmed')}
          onJobClick={setSelectedJob}
        />
      )}

      {activeView === 'completed' && (
        <TableView
          jobs={filteredJobs.filter(j => j.status === 'completed')}
          onJobClick={setSelectedJob}
        />
      )}

      {selectedJob && (
        <JobModal
          job={selectedJob}
          teamLeaders={teamLeaders}
          employees={employees}
          onClose={() => setSelectedJob(null)}
          onUpdate={handleUpdateJob}
          onDelete={handleDeleteJob}
        />
      )}

      {showNewJobModal && (
        <NewJobModal
          onClose={() => setShowNewJobModal(false)}
          onAdd={handleAddJob}
        />
      )}
    </div>
  );
}

export default App;
