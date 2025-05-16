import { useState, useEffect } from 'react';
import './Header.css';

const TodoistLogo = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" fill="#E44332"/>
    <path d="M8 15.5L13 20.5L22 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Define the Logout SVG icon component
const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

// Define the Calendar/Meeting SVG icon component
const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);


function Header({ onAddTask, onAddMeeting, view, onViewChange }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`home-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="home-homeheader-content">
        <div className="home-logo">
          <TodoistLogo />
          <h1>Todoist</h1>
        </div>
        <div className="home-homeheader-actions">
          <div className="home-view-toggle">
            <button
              className={`home-toggle-button ${view === 'tasks' ? 'active' : ''}`}
              onClick={() => onViewChange('tasks')}
            >
              Tasks
            </button>
            <button
              className={`home-toggle-button ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => onViewChange('calendar')}
            >
              Calendar
            </button>
            <button
              className={`home-toggle-button ${view === 'members' ? 'active' : ''}`}
              onClick={() => onViewChange('members')}
            >
              Members
            </button>
          </div>
          <div className="home-action-buttons">
            <button
              className="home-add-button"
              onClick={onAddTask}
              aria-label="Add new task"
            >
              <span className="home-button-icon">+</span>
              <span className="home-button-text">Task</span>
            </button>
            <button
              className="home-add-button meeting"
              onClick={onAddMeeting}
              aria-label="Schedule meeting"
            >
              {/* Replace the span with the SVG component */}
              <span className="home-button-icon">
                <CalendarIcon />
              </span>
              <span className="home-button-text">Meeting</span>
            </button>
            <button
              className="home-add-button logout"
              onClick={() => {
                // Add logout logic here
                localStorage.clear();
                window.location.href = '/';
              }}
              aria-label="Logout"
            >
              <span className="home-button-icon">
                <LogoutIcon />
              </span>
              <span className="home-button-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
