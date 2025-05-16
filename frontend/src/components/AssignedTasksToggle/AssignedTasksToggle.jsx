import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AssignedTasksToggle.css';

const AssignedTasksToggle = ({ assignedTasks, onUpdateAssignedTaskStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  if (!assignedTasks || assignedTasks.length === 0) {
    return null; // Don't render if there are no assigned tasks
  }

  return (
    <div className="assigned-tasks-toggle">
      <div className="toggle-header" onClick={toggleOpen}>
        <h2>Tasks Assigned to You ({assignedTasks.length})</h2>
        <span className={`toggle-icon ${isOpen ? 'open' : ''}`}>▼</span> {/* Simple toggle icon */}
      </div>
      {isOpen && (
        <div className="assigned-tasks-list">
          {assignedTasks.map(task => (
            <div key={task._id} className="assigned-task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div className="task-details">
                <span>Priority: {task.priority}</span>
                <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                <span>Assigned by: {task.assignerName}</span>
              </div>
              <div className="task-status">
                <select
                  value={task.status}
                  onChange={(e) => onUpdateAssignedTaskStatus(task._id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

AssignedTasksToggle.propTypes = {
  assignedTasks: PropTypes.array.isRequired,
  onUpdateAssignedTaskStatus: PropTypes.func.isRequired,
};

export default AssignedTasksToggle;