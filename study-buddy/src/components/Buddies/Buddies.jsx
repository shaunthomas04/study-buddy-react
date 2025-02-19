import React from 'react';
import "./Buddies.css"; //Importing the Style Sheet for Buddies
import logo from "./Logo.png"

const Buddies = () => {
  return (
    <div className ="buddies-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt ="Logo" className="logo" />
          <h1 className = "title"> Buddies</h1>
        </div>
        <div className="nav-links">
          <a href = "#" className = "nav-item">Agenda</a>
          <a href = "#" className = "nav-item active">Buddies</a>    
          <a href = "#" className = "nav-item">Classes</a>
          <a href = "#" className = "nav-item">Settings</a>
          </div>
      </nav>

      {/* Main Content of Buddies Page */}
      <div className="buddies-main">
        <aside className="sidebar">
          <h2 className = "sidebar-title">Find Buddies</h2>
          <div className="buddy-list">
            <div className ="buddy-item active"> Buddy [Viewing]</div>
            <div className ="buddy-item"> Buddy 1</div>
            <div className ="buddy-item"> Buddy 2</div>
            <div className ="buddy-item"> Buddy 3</div>
            <div className ="buddy-item"> Buddy 4</div>
            <div className ="buddy-item"> Buddy 5</div>
          </div>
        </aside>

        {/*Profile Section*/}
        <main className= "profile-section">
          <div className = "profile-header">
            <div className= "profile-avatar"></div>
          </div>
          <h3 className ="profile-name">Buddy XYZ</h3>
          <p className ="profile-status"> Student at California Baptist University</p>
          </div>
      </div>

      {/* Avliable Actions */}
      <div className ="actions">
        <h4 className ="section-title">Actions</h4>
        <div className = "action-grid">
          <div className ="action-card"> Send Buddy Requests</div>
          <div className ="action-card">View Buddies Courses</div>
          <div className="action-card"> Buddy Up To Agenda</div>
        </div>
      </div>

      {/* Suggested Buddies (Find friends) */}
      <div className ="suggestions">
        <h4 className = "section-title"> You May Also Know</h4>
        <div className ="suggestions-grid">
          <div className = "suggestion-card">Buddy 14</div>
          <div className ="suggestion-card"> Buddy 74</div>
          <div className = "suggestion-card"> Buddy 3</div>
        </div>
      </div>
    </main>
    </div>
    </div>
    
  );
};

export default Buddies;