import React, { useState, useEffect } from 'react';
import './MemberList.css';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/members`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch members');
        }

        const data = await response.json();
        setMembers(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchMembers();
  }, [API_BASE_URL]);

  if (loading) {
    return <div className="member-list-loading">Loading members...</div>;
  }

  if (error) {
    return <div className="member-list-error">Error: {error}</div>;
  }

  return (
    <div className="member-list-container">
      <h2>Team Members</h2>
      <div className="member-list">
        {members.length > 0 ? (
          members.map((member) => (
            <div key={member._id} className="member-card">
              <div className="member-avatar">
                {member.firstName ? member.firstName[0].toUpperCase() : 'U'}
              </div>
              <div className="member-info">
                <h3>{member.firstName} {member.lastName}</h3>
                <p>{member.email}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-members">
            <p>No team members found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberList;