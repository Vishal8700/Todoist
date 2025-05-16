import { useState } from 'react';
import './TaskFilter.css';

function TaskFilter({ filter, setFilter, sort, setSort }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => setIsExpanded(!isExpanded);
  
  return (
    <div className={`task-filter ${isExpanded ? 'expanded' : ''}`}>
      <div className="filter-header" onClick={toggleExpand}>
        <h2>Filter & Sort</h2>
        <button className="expand-button">
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      <div className="filter-content">
        <div className="filter-section">
          <h3>Filter by Status</h3>
          <div className="filter-options">
            <button 
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button 
              className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Filter by Priority</h3>
          <div className="filter-options">
            <button 
              className={`filter-button ${filter === 'high' ? 'active' : ''}`}
              onClick={() => setFilter('high')}
            >
              High
            </button>
            <button 
              className={`filter-button ${filter === 'medium' ? 'active' : ''}`}
              onClick={() => setFilter('medium')}
            >
              Medium
            </button>
            <button 
              className={`filter-button ${filter === 'low' ? 'active' : ''}`}
              onClick={() => setFilter('low')}
            >
              Low
            </button>
          </div>
        </div>
        
        <div className="filter-section">
          <h3>Sort Tasks</h3>
          <select 
            className="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="date-asc">Due Date (Earliest First)</option>
            <option value="date-desc">Due Date (Latest First)</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="alpha-asc">Name (A-Z)</option>
            <option value="alpha-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default TaskFilter;