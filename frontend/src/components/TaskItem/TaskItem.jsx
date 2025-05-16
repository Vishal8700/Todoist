import { useState } from 'react';
import { formatDate, getPriorityColor } from '../../utils/helpers';
import './TaskItem.css';

function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  const {
    _id,
    title,
    description,
    dueDate,
    priority,
    category,
    completed,
    status,
    documentUrl
  } = task;

  const priorityColor = getPriorityColor(priority);
  const formattedDate = formatDate(dueDate);
  const isOverdue = dueDate && new Date(dueDate) < new Date() && status !== 'completed';

  const handleSingleDocumentClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div
      className={`task-item ${status === 'completed' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="task-content">
        <div className="task-header">
          <h3 className="task-title">{title}</h3>
          {category && <span className="task-category">{category}</span>}
        </div>

        {description && (
          <p className="task-description">{description}</p>
        )}

        <div className="task-footer">
          {dueDate && (
            <span className={`task-date ${isOverdue ? 'overdue' : ''}`}>
              {formattedDate}
            </span>
          )}

          {priority && (
            <span
              className="task-priority"
              style={{
                backgroundColor: priorityColor,
                opacity: status === 'completed' ? 0.5 : 1 // Use status for opacity
              }}
            >
              {priority}
            </span>
          )}
           {/* Display Status Text */}
           <div className="task-status-display">
              <span className={`status-badge ${status}`}> {/* Use status for styling */}
                {status.replace('-', ' ')} {/* Display status, replace hyphen with space */}
              </span>
            </div>
            {/* Display a document icon for each URL if documentUrl exist */}
            {documentUrl && documentUrl.length > 0 && (
              <div className="task-documents-icons"> {/* New container for multiple icons */}
                {documentUrl.map((url, index) => (
                  <span
                    key={index} // Use index as key for mapping
                    className="document-icon clickable" // Added clickable class
                    onClick={() => handleSingleDocumentClick(url)} // Added click handler for single URL
                    title={`Open document ${index + 1}`} // Add tooltip
                  >
                    {/* SVG Document Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                    </svg>
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>

      <div className={`task-actions ${showActions ? 'visible' : ''}`}>
        <button
          className="action-button edit-button"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          ✎
        </button>
        <button
          className="action-button delete-button"
          onClick={() => onDelete(_id)} // Use _id
          aria-label="Delete task"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default TaskItem;