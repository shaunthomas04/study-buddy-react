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
      </main>
      <h2>Welcome to the Buddies Page!</h2>
    </div>
  );
};

export default Buddies;