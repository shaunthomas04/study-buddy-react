import React from 'react';
import Navbar from '../Navbar/Navbar';
import "./Buddies.css"; // Importing the Style Sheet for Buddies


const Buddies = () => {
  return (
    <>
      <Navbar />
      <div className="buddies-container">
        {/* Main Content of Buddies Page */}
        <div className="buddies-main">
          <aside className="sidebar">
            <h2 className="sidebar-title">Current Buddies</h2>
            <div className="buddy-list">
              <div className="buddy-item active">Buddy [Viewing]</div>
              <div className="buddy-item">Buddy 1</div>
              <div className="buddy-item">Buddy 2</div>
              <div className="buddy-item">Buddy 3</div>
              <div className="buddy-item">Buddy 4</div>
              
            </div>
          </aside>

          {/* Profile Section */}
          <main className="profile-section">
            <div className="profile-header">
              <div className="profile-avatar"></div>
              <div>
                <h3 className="profile-name">Study Buddy XYZ</h3>
                <p className="profile-status">Student at California Baptist University</p>
              </div>
            </div>

            {/* Actions */}
            <div className="actions">
              <h4 className="section-title">Actions</h4>
              <div className="action-grid">
                <div className="action-card">
                  <a href="sendBuddyRequest.jsx">View Study Preferences</a>
                </div>
                <div className="action-card">View Courses</div>
                <div className="action-card">Buddy Up To Agenda</div>
              </div>
            </div>

            {/* Suggested Buddies (Friends) */}
            <div className="suggestions">
              <h4 className="section-title">You May Also Know</h4>
              <div className="suggestions-grid">
                <div className="suggestion-card">Buddy 17</div>
                <div className="suggestion-card">Buddy 32</div>
                <div className="suggestion-card">Buddy 74</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Buddies;
