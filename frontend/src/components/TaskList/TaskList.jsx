import TaskItem from '../TaskItem/TaskItem';
import './TaskList.css';

function TaskList({ tasks, onToggleComplete, onEdit, onDelete, onPdfClick }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePdfClick = (url) => {
    window.open(url, '_blank');
  };

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const overdueSection = [];
  const todaySection = [];
  const tomorrowSection = [];
  const thisWeekSection = [];
  const laterSection = [];
  const completedSection = [];

  tasks.forEach(task => {
    if (task.status === 'completed') {
      completedSection.push(task);
      return;
    }

    if (!task.dueDate) {
      laterSection.push(task);
      return;
    }

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today) {
      overdueSection.push(task);
    } else if (dueDate.getTime() === today.getTime()) {
      todaySection.push(task);
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      tomorrowSection.push(task);
    } else if (dueDate < nextWeek) {
      thisWeekSection.push(task);
    } else {
      laterSection.push(task);
    }
  });

  const renderSection = (title, tasks, className = '') => {
    if (tasks.length === 0) return null;

    return (
      <div className={`task-section ${className}`}>
        <h2 className="section-title">{title} <span className="task-count">{tasks.length}</span></h2>
        <div className="tasks-container">
          {tasks.map(task => (
            <div key={task._id} className="task-item">
              <TaskItem
                task={task}
                onToggleComplete={onToggleComplete}
                onEdit={onEdit}
                onDelete={onDelete}
                // Pass the documentUrl array to TaskItem
                documentUrl={task.documentUrl} // Corrected prop name
                // onPdfClick is not used in TaskItem for just displaying count,
                // but keep it here if you plan to make the icon clickable later.
                // onPdfClick={handlePdfClick}
              />
              {/* Removed the document rendering block from here */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="task-list">
      {renderSection('Overdue', overdueSection, 'overdue-section')}
      {renderSection('Today', todaySection)}
      {renderSection('Tomorrow', tomorrowSection)}
      {renderSection('This Week', thisWeekSection)}
      {renderSection('Later', laterSection)}
      {renderSection('Completed', completedSection, 'completed-section')}
    </div>
  );
}

export default TaskList;