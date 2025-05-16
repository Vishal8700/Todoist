import { useState } from 'react';
import './MeetingForm.css';

function MeetingForm({ onSubmit, editMeeting, onClose }) {
  const [formData, setFormData] = useState({
    title: editMeeting?.title || '',
    description: editMeeting?.description || '',
    startTime: editMeeting?.startTime || '',
    endTime: editMeeting?.endTime || '',
    attendees: editMeeting?.attendees || '',
    location: editMeeting?.location || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: editMeeting?.id || Date.now().toString(),
    });
    onClose();
  };

  return (
    <div className="meeting-form-container">
      <h2 className="form-title">{editMeeting ? 'Edit Meeting' : 'Schedule Meeting'}</h2>
      <form onSubmit={handleSubmit} className="meeting-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time *</label>
            <input
              type="datetime-local"
              id="startTime"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="endTime">End Time *</label>
            <input
              type="datetime-local"
              id="endTime"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="attendees">Attendees (comma-separated emails)</label>
          <input
            type="text"
            id="attendees"
            value={formData.attendees}
            onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
            placeholder="john@example.com, jane@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Meeting Room A or Video Call Link"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            {editMeeting ? 'Update Meeting' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MeetingForm;