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
          className="action-button Tedit-button"
          onClick={() => onEdit(task)}
          aria-label="Edit task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
          </svg>
        </button>
        <button
          className="action-button Tdelete-button"
          onClick={() => onDelete(_id)}
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TaskItem;