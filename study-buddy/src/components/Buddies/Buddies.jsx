import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import "./Buddies.css"; // Importing the Style Sheet for Buddies
import StudyPreferences from './StudyPreferences';


const BuddySidebar = ({ buddies, activeBuddy, setActiveBuddy }) => {
  return (
    <aside className="buddy-sidebar">
      <h2 className="buddy-sidebar-title">Current Buddies</h2>
      <div className="buddy-list">
        {buddies.map((buddy, index) => (
          <div
            key={index}
            className={`buddy-item ${activeBuddy === buddy ? "buddy-active" : ""}`}
            onClick={() => setActiveBuddy(buddy)}
          >
            {buddy}
          </div>
        ))}
      </div>
    </aside>
  );
};

// Component for Profile Section
const BuddyProfile = ({ activeBuddy }) => {
  return (
    <main className="buddy-profile-section">
      <div className="buddy-profile-header">
        <div className="buddy-profile-avatar"></div>
        <div>
          <h3 className="buddy-profile-name">{activeBuddy}</h3>
          <p className="buddy-profile-status">Student at California Baptist University</p>
          <p className="buddy-profile-major"> Junior Studying Computer Science</p>
        </div>
      </div>
    </main>
  );
};

// Component for Actions Section
const BuddyActions = () => {
  return (
    <div className="buddy-actions">
      <h4 className="buddy-section-title">Actions</h4>
      <div className="buddy-action-grid">
        <div className="buddy-action-card">
          <Link to = "/buddies/study-preferences">View Study Preferences</Link>
        </div>
        <div className="buddy-action-card">View Courses</div>
        <div className="buddy-action-card">Buddy Up To Agenda</div>
      </div>
    </div>
  );
};

// Component for Suggested Buddies
const SuggestedBuddies = ({ suggestions }) => {
  return (
    <div className="buddy-suggestions">
      <h4 className="buddy-section-title">You May Also Know</h4>
      <div className="buddy-suggestions-grid">
        {suggestions.map((buddy, index) => (
          <div key={index} className="buddy-suggestion-card">
            {buddy}
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Buddies Component
const Buddies = () => {
  const [buddies] = useState(["Jane Doe","Buddy 2", "Buddy 3", "Buddy 4", "Buddy 5", "Buddy 6"]);
  const [suggestions] = useState(["Buddy 17", "Buddy 32", "Buddy 74"]);
  const [activeBuddy, setActiveBuddy] = useState(buddies[0]);

  return (
    <>
      <Navbar />
      <div className="buddy-container">
        <div className="buddy-main">
          <BuddySidebar buddies={buddies} activeBuddy={activeBuddy} setActiveBuddy={setActiveBuddy} />
          <div className="buddy-profile-content">
            <Routes>
              <Route path ="/" element = {
                <>
                  <BuddyProfile activeBuddy={activeBuddy} />
                  <BuddyActions />
                 <SuggestedBuddies suggestions={suggestions} />
            </>
              } />
              <Route path ="/study-preferences" element={<StudyPreferences />} />
              </Routes>
          </div>
        </div>
      </div>
    </>
  );
};

export default Buddies;
