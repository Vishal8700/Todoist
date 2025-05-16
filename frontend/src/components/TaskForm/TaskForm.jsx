import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TaskForm.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TaskForm = ({ onSubmit, users = [], editTask }) => {
  const [task, setTask] = useState(() => {
    return {
      title: editTask?.title || '',
      description: editTask?.description || '',
      dueDate: editTask?.dueDate || '',
      priority: editTask?.priority || 'medium',
      assignedTo: editTask?.assignedTo || [],
      category: editTask?.category || '',
      status: editTask?.status || 'pending',
      document: [], // Always start with a new array for local files
      documentUrl: editTask?.documentUrl || [] // Ensure this is an array
    };
  });


  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({
      ...prevTask,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newDocuments = [];
    const newErrors = { ...errors };
    delete newErrors.document; // Clear previous document errors

    if (task.document.length + files.length > 3) {
        newErrors.document = 'You can upload a maximum of 3 PDF files.';
    } else {
        files.forEach(file => {
            if (file.type === 'application/pdf') {
                newDocuments.push(file);
            } else {
                newErrors.document = 'Only PDF files are allowed.';
            }
        });
    }

    setTask(prevTask => ({
      ...prevTask,
      document: [...prevTask.document, ...newDocuments] // Add new valid documents to the array
    }));
    setErrors(newErrors);
  };

  // Function to remove a selected document before submission
  const handleRemoveDocument = (index) => {
    setTask(prevTask => ({
      ...prevTask,
      document: prevTask.document.filter((_, i) => i !== index)
    }));
  };

  // Function to remove an already uploaded document URL (for edit mode)
  const handleRemoveDocumentUrl = (index) => {
    setTask(prevTask => ({
      ...prevTask,
      documentUrl: prevTask.documentUrl.filter((_, i) => i !== index)
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    if (!task.title) newErrors.title = 'Title is required';
    if (!task.dueDate) newErrors.dueDate = 'Due date is required';
    if (!editTask && task.assignedTo.length === 0) newErrors.assignedTo = 'Please assign to at least one team member';
    if (editTask && task.assignedTo.length === 0) newErrors.assignedTo = 'Please assign to at least one team member';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setUploading(true);

      // Handle document upload to Cloudinary for each new document
      const uploadedUrls = [...task.documentUrl]; // Start with existing URLs
      for (const doc of task.document) {
        const formData = new FormData();
        formData.append('file', doc);

        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          },
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload document: ${doc.name}`);
        }

        const uploadResult = await uploadResponse.json();
        uploadedUrls.push(uploadResult.url); // Add new URL to the array
      }


      // Get current user's information
      const userResponse = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user information');
      }

      const currentUser = await userResponse.json();

      let savedTask;

      if (editTask) {
        const taskResponse = await fetch(`${API_BASE_URL}/api/tasks/${editTask._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          },
          body: JSON.stringify({
            ...task,
            documentUrl: uploadedUrls, // Send array of URLs
            assignedBy: editTask.assignedBy._id || editTask.assignedBy
          })
        });

        if (!taskResponse.ok) {
          throw new Error('Failed to update task');
        }
        savedTask = await taskResponse.json();

      } else {
        const taskResponse = await fetch(`${API_BASE_URL}/api/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
          },
          body: JSON.stringify({
            ...task,
            documentUrl: uploadedUrls, // Send array of URLs
            assignedBy: {
              id: currentUser._id,
              name: `${currentUser.firstName} ${currentUser.lastName}`,
              email: currentUser.email
            }
          })
        });

        if (!taskResponse.ok) {
          throw new Error('Failed to create task');
        }

        savedTask = await taskResponse.json();

        if (task.assignedTo && task.assignedTo.length > 0) {
          const assignmentResponse = await fetch(`${API_BASE_URL}/api/tasks/assign`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            body: JSON.stringify({
              taskId: savedTask._id,
              assignedTo: task.assignedTo,
              title: task.title,
              description: task.description,
              dueDate: task.dueDate,
              priority: task.priority,
              category: task.category,
              status: task.status,
              documentUrl: uploadedUrls, // Send array of URLs
              assignedBy: {
                id: currentUser._id,
                name: `${currentUser.firstName} ${currentUser.lastName}`,
                email: currentUser.email
              }
            })
          });

          if (!assignmentResponse.ok) {
            console.error('Failed to assign task after creation');
          }
        }
      }

      setTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        assignedTo: [],
        category: '',
        status: 'pending',
        document: [], // Reset to empty array
        documentUrl: [] // Reset to empty array
      });
      setErrors({});
      onSubmit(savedTask);

    } catch (error) {
      console.error("Submission error:", error);
      setErrors({ submit: error.message || 'An error occurred during submission.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
        {errors.submit && (
            <div className="error-message form-error">{errors.submit}</div>
        )}
      <div className="form-group">
        <label htmlFor="title" className="form-label">Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={task.title}
          onChange={handleChange}
          className={`form-input ${errors.title ? 'error' : ''}`}
          placeholder="What needs to be done?"
        />
        {errors.title && <div className="error-message">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          name="description"
          value={task.description}
          onChange={handleChange}
          className="form-input"
          placeholder="Optional description"
        ></textarea>
      </div>

      <div className="form-group">
        <label htmlFor="dueDate" className="form-label">Due Date *</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''} // Format date for input
          onChange={handleChange}
          className={`form-input ${errors.dueDate ? 'error' : ''}`}
        />
        {errors.dueDate && <div className="error-message">{errors.dueDate}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="priority" className="form-label">Priority</label>
        <select
          id="priority"
          name="priority"
          value={task.priority}
          onChange={handleChange}
          className="form-input form-select"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

       <div className="form-group">
        <label htmlFor="category" className="form-label">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={task.category}
          onChange={handleChange}
          className="form-input"
          placeholder="e.g., Work, Personal, Shopping"
        />
      </div>

      <div className="form-group">
        <label htmlFor="assignedTo" className="form-label">Assign To:</label>
        {users && users.length > 0 ? (
          <>
              <select
                multiple
                id="assignedTo"
                name="assignedTo"
                value={task.assignedTo}
                onChange={(e) => setTask({
                    ...task,
                    assignedTo: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className={`form-input form-select ${errors.assignedTo ? 'error' : ''}`}
                size="5" // Show 5 options at once
                style={{
                  minHeight: '120px', // Ensure enough height for multiple selections
                  padding: '8px',
                  cursor: 'pointer'
                }}
              >
                {users.map(user => (
                  <option
                    key={user._id}
                    value={user._id}
                    style={{
                      padding: '8px',
                      margin: '2px 0',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
              {errors.assignedTo && <div className="error-message">{errors.assignedTo}</div>}
              <small className="help-text" style={{ display: 'block', marginTop: '4px', color: '#666' }}>
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple users
              </small>
            </>
          ) : (
            <p>Loading users...</p>
          )}
      </div>

      {/* Status field - maybe only show/editable on edit? */}
      {editTask && (
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleChange}
            className="form-input form-select"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}


      <div className="form-group">
        <label htmlFor="document" className="form-label">Document(s) (PDF, max 3)</label> {/* Updated label */}
        <input
          type="file"
          id="document"
          name="document"
          accept=".pdf"
          multiple // Allow multiple file selection
          onChange={handleFileChange}
          className={`form-input ${errors.document ? 'error' : ''}`}
          disabled={task.document.length + task.documentUrl.length >= 3} // Disable if max files reached
        />
        {errors.document && <div className="error-message">{errors.document}</div>}

        {/* Display selected files before upload */}
        {task.document.length > 0 && (
          <div className="document-preview">
            <p>Selected for upload:</p>
            <ul>
              {task.document.map((doc, index) => (
                <li key={index}>
                  {doc.name} <button type="button" className='remove-btn' onClick={() => handleRemoveDocument(index)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Display already uploaded documents (URLs) */}
        {task.documentUrl.length > 0 && (
          <div className="document-preview">
            <p>Existing documents:</p>
            <ul>
              {task.documentUrl.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-file-pdf"></i> Document {index + 1}
                  </a>
                   {editTask && <button type="button" onClick={() => handleRemoveDocumentUrl(index)}>Remove</button>} {/* Allow removing existing in edit mode */}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Status field - maybe only show/editable on edit? */}
      {editTask && (
        <div className="form-group">
          <label htmlFor="status" className="form-label">Status</label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleChange}
            className="form-input form-select"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      )}


      <button type="submit" className="submit-button" disabled={uploading}>
        {uploading ? 'Uploading...' : (editTask ? 'Update Task' : 'Add Task')}
      </button>
    </form>
  );
};

TaskForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  users: PropTypes.array,
  editTask: PropTypes.object
};

export default TaskForm;