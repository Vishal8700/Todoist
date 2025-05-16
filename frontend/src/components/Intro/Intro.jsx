import { useState, useEffect } from 'react';
import React from 'react';
import './Intro.css';
import { useNavigate } from 'react-router-dom';
// SVG Components
import { Link } from 'react-router-dom';
const TodoistLogo = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" fill="#E44332"/>
    <path d="M8 15.5L13 20.5L22 11.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD43B" stroke="#FFD43B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TodoistApp = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
 const navigate = useNavigate();
  // Render the TodoistApp component with the header and mai
  return (
    <div className="app-container">
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="logo-container">
          <TodoistLogo />
          <span className="logo-text">todoist</span>
        </div>        
        <div className="auth-buttons">
          <Link to="/login" className="login-button">Log in</Link>
          <Link to="/signup" className="start-free-button">Start for free</Link>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Clarity, finally.</h1>
            <p className="hero-subtitle">
              Join 50+ million professionals who simplify work and life with the world's #1 to-do list app.
            </p>
            <div className="rating-badge">
              <div className="platform-icons">
                <span className="apple-icon">⌘</span>
                <span className="android-icon">◯</span>
              </div>
              <div className="rating-text">
                374K+ ★★★★★ reviews
              </div>
            </div>
            <button className="start-free-button hero-button">Start for free</button>
            <p className="hero-footnote">Calm the chaos in a matter of minutes!</p>
          </div>
          <div className="hero-visual">
            <div className="app-screenshot">
              <div className="browser-screenshot">
                <div className="browser-header">
                  <div className="user-icon">
                    <span>D</span>
                  </div>
                  <div className="browser-actions">
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div className="browser-content">
                  <div className="sidebar">
                    <div className="sidebar-item active">Today</div>
                    <div className="sidebar-item">Upcoming</div>
                    <div className="sidebar-item">Filters & Labels</div>
                    <div className="sidebar-section">
                      <div className="section-header">My Projects</div>
                      <div className="sidebar-item">Fitness</div>
                      <div className="sidebar-item">Groceries</div>
                      <div className="sidebar-item">Appointments</div>
                    </div>
                    <div className="sidebar-section">
                      <div className="section-header">Team</div>
                      <div className="sidebar-item">New Brand</div>
                      <div className="sidebar-item">Website Update</div>
                      <div className="sidebar-item">Product Roadmap</div>
                      <div className="sidebar-item">Meeting Agenda</div>
                    </div>
                  </div>
                  <div className="main-content">
                    <div className="today-section">
                      <h2>Today</h2>
                      <div className="projects-header">My Projects</div>
                      <div className="task-list">
                        <div className="task-item">
                          <input type="checkbox" />
                          <span>Do 30 minutes of yoga</span>
                          <span className="task-tag">🏋️‍♀️</span>
                        </div>
                        <div className="task-item">
                          <input type="checkbox" />
                          <span>Dentist appointment</span>
                        </div>
                        <div className="task-item">
                          <input type="checkbox" />
                          <span>Buy bread</span>
                          <span className="task-tag">🥖</span>
                        </div>
                      </div>
                      <button className="add-task-button">+ Add task</button>
                      
                      <div className="team-section">
                        <div className="team-header">Team</div>
                        <div className="task-list">
                          <div className="task-item">
                            <input type="checkbox" />
                            <span>Plan user research sessions</span>
                          </div>
                          <div className="task-item">
                            <input type="checkbox" />
                            <span>Provide feedback on Amy's design</span>
                          </div>
                          <div className="task-item">
                            <input type="checkbox" />
                            <span>All-hands meeting</span>
                          </div>
                        </div>
                        <button className="add-task-button">+ Add task</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mobile-screenshot">
                <div className="mobile-header">
                  <div className="status-bar">
                    <div className="time">9:30</div>
                    <div className="status-icons">
                      <span>···</span>
                    </div>
                  </div>
                  <div className="inbox-header">Inbox</div>
                </div>
                <div className="mobile-content">
                  <div className="mobile-task">
                    <div className="task-note">Write agenda for Monday's meeting</div>
                    <div className="task-date">Tomorrow</div>
                    <div className="task-tags">
                      <span className="task-tag">#Website Update</span>
                      <span className="task-tag">#Paul</span>
                    </div>
                  </div>
                </div>
                <div className="mobile-keyboard">
                  <div className="keyboard-row">
                    <div className="key">q</div>
                    <div className="key">w</div>
                    <div className="key">e</div>
                    <div className="key">r</div>
                    <div className="key">t</div>
                    <div className="key">y</div>
                    <div className="key">u</div>
                    <div className="key">i</div>
                    <div className="key">o</div>
                    <div className="key">p</div>
                  </div>
                  <div className="keyboard-row">
                    <div className="key">a</div>
                    <div className="key">s</div>
                    <div className="key">d</div>
                    <div className="key">f</div>
                    <div className="key">g</div>
                    <div className="key">h</div>
                    <div className="key">j</div>
                    <div className="key">k</div>
                    <div className="key">l</div>
                  </div>
                  <div className="keyboard-row">
                    <div className="key large">⇧</div>
                    <div className="key">z</div>
                    <div className="key">x</div>
                    <div className="key">c</div>
                    <div className="key">v</div>
                    <div className="key">b</div>
                    <div className="key">n</div>
                    <div className="key">m</div>
                    <div className="key large">⌫</div>
                  </div>
                  <div className="keyboard-row">
                    <div className="key xlarge">space</div>
                    <div className="key large send-button">↵</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="decorative-elements">
            <StarIcon className="star-1" />
            <StarIcon className="star-2" />
            <div className="dot-1"></div>
            <div className="dot-2"></div>
          </div>
        </section>

        <section className="testimonials-section">
          <div className="testimonial-curve"></div>
          <div className="testimonials-container">
            <div className="testimonial">
              <p className="testimonial-text">"Simple, straightforward, and super powerful"</p>
              <div className="testimonial-source">
                <div className="source-logo the-verge"></div>
              </div>
            </div>
            <div className="testimonial">
              <p className="testimonial-text">"The best to-do list app on the market"</p>
              <div className="testimonial-source">
                <div className="source-logo pc-mag"></div>
              </div>
            </div>
            <div className="testimonial">
              <p className="testimonial-text">"Nothing short of stellar"</p>
              <div className="testimonial-source">
                <div className="source-logo techradar"></div>
              </div>
            </div>
          </div>
          <div className="decorative-elements bottom">
            <div className="dot-3"></div>
            <StarIcon className="star-3" />
          </div>
        </section>
      </main>
    </div>
  );
};
export default TodoistApp;