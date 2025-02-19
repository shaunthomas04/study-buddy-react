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
      <h2>Welcome to the Buddies Page!</h2>
    </div>
  );
};

export default Buddies;