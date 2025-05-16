import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Calendar({ tasks, onSelectSlot, onSelectEvent }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [meetings, setMeetings] = useState([]);
  const [error, setError] = useState(null);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  // Add function to fetch current user
  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Add delete meeting function
  const handleDeleteMeeting = async (meetingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (response.ok) {
        setMeetings(meetings.filter(meeting => meeting._id !== meetingId));
        setSelectedMeeting(null);
      } else {
        setError('Failed to delete meeting');
      }
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError('Failed to delete meeting');
    }
};

  const fetchMeetings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch meetings');
      }

      const data = await response.json();
      setMeetings(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      setError('Failed to load meetings');
    }
  };

  useEffect(() => {
    fetchMeetings(); // Initial fetch
    // Set up auto-refresh every 30 seconds
    const intervalId = setInterval(fetchMeetings, 30000);
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
}, [API_BASE_URL]);

  const handleSelectEvent = (event) => {
    if (event.type === 'meeting') {
      setSelectedMeeting(event);
    } else {
      onSelectEvent(event);
    }
  };

  const handleClosePopup = () => {
    setSelectedMeeting(null);
  };

  const events = [
    ...tasks.map(task => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      type: 'task',
    })),
    ...meetings.map(meeting => ({
      id: meeting._id,
      title: meeting.title,
      start: new Date(meeting.startTime),
      end: new Date(meeting.endTime),
      type: 'meeting',
      description: meeting.description,
      location: meeting.location,
      attendees: meeting.attendees,
      organizer: meeting.organizer  // Add this line to include organizer info
    })),
  ];

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleEditClick = (meeting) => {
    setEditFormData({
      id: meeting.id,
      title: meeting.title,
      description: meeting.description || '',
      startTime: format(meeting.start, "yyyy-MM-dd'T'HH:mm"),
      endTime: format(meeting.end, "yyyy-MM-dd'T'HH:mm"),
      location: meeting.location || '',
      attendees: meeting.attendees ? meeting.attendees.join(', ') : ''
    });
    setIsEditing(true);
  };

  const handleUpdateMeeting = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          title: editFormData.title,
          description: editFormData.description,
          startTime: new Date(editFormData.startTime).toISOString(),
          endTime: new Date(editFormData.endTime).toISOString(),
          location: editFormData.location,
          attendees: editFormData.attendees.split(',').map(email => email.trim()).filter(email => email)
        }),
      });

      if (response.ok) {
        const updatedMeeting = await response.json();
        setMeetings(meetings.map(meeting => 
          meeting._id === updatedMeeting._id ? updatedMeeting : meeting
        ));
        setIsEditing(false);
        setEditFormData(null);
        setSelectedMeeting(null);
      } else {
        setError('Failed to update meeting');
      }
    } catch (error) {
      console.error('Error updating meeting:', error);
      setError('Failed to update meeting');
    }
  };
  return (
    <div className="calendar-container">
      {error && <div className="error-message">{error}</div>}
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={onSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        views={['month', 'week', 'day', 'agenda']}
        eventPropGetter={(event) => ({
          className: `event-${event.type}`,
        })}
      />

      {selectedMeeting && (
        <div className="meeting-popup-overlay" onClick={handleClosePopup}>
          <div className="meeting-popup" onClick={(e) => e.stopPropagation()}>
            <div className="meeting-popup-header">
              <h2>{selectedMeeting.title}</h2>
              <div className="meeting-actions">
                {currentUser && selectedMeeting.organizer && currentUser._id === selectedMeeting.organizer._id && (
                  <>
                    <button 
                      className="Medit-button"
                      onClick={() => handleEditClick(selectedMeeting)}
                    >
                      Edit
                    </button>
                    <button 
                      className="Mdelete-button"
                      onClick={() => handleDeleteMeeting(selectedMeeting.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
                <button className="close-button" onClick={handleClosePopup}>&times;</button>
              </div>
            </div>
            <div className="meeting-popup-content">
              <p><strong>Time:</strong> {format(selectedMeeting.start, 'PPp')} - {format(selectedMeeting.end, 'PPp')}</p>
              {selectedMeeting.location && (
                <p>
                  <strong>Location:</strong>{' '}
                  {isValidUrl(selectedMeeting.location) ? (
                    <a 
                      href={selectedMeeting.location} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="meeting-link"
                    >
                      {selectedMeeting.location}
                    </a>
                  ) : (
                    selectedMeeting.location
                  )}
                </p>
              )}
              {selectedMeeting.description && (
                <p><strong>Description:</strong> {selectedMeeting.description}</p>
              )}
              {selectedMeeting.attendees && selectedMeeting.attendees.length > 0 && (
                <div>
                  <strong>Attendees:</strong>
                  <ul>
                    {selectedMeeting.attendees.map((attendee, index) => (
                      <li key={index}>{attendee}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isEditing && editFormData && (
        <div className="meeting-popup-overlay">
          <div className="meeting-popup edit-form">
            <div className="meeting-popup-header">
              <h2>Edit Meeting</h2>
              <button className="close-button" onClick={() => {
                setIsEditing(false);
                setEditFormData(null);
              }}>&times;</button>
            </div>
            <form onSubmit={handleUpdateMeeting}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Start Time:</label>
                <input
                  type="datetime-local"
                  value={editFormData.startTime}
                  onChange={(e) => setEditFormData({...editFormData, startTime: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time:</label>
                <input
                  type="datetime-local"
                  value={editFormData.endTime}
                  onChange={(e) => setEditFormData({...editFormData, endTime: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location:</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Attendees (comma-separated emails):</label>
                <input
                  type="text"
                  value={editFormData.attendees}
                  onChange={(e) => setEditFormData({...editFormData, attendees: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-button">Save Changes</button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditFormData(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
