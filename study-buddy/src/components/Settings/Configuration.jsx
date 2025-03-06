import React from 'react';
import Navbar from '../Navbar/Navbar';
import "./Configuration.css";

const SettingsPage = () => {
    return (
      <div className="configuration-settings-page">
        <header className="flex justify-between bg-gray-800 text-white p-4 items-center">
            <div className="logo"></div>
            {/* <input type="text" placeholder="Search" className="p-2 rounded" /> */}
        <Navbar />
        </header>
  
        <div className="configuration-settings-container">
          <div className="configuration-profile-description">
            <div className="configuration-profile-image"></div>
            <h2>[firstName], [lastName]</h2>
            <p className="description">
              <strong>Desc:</strong> Current student at XYZ EDU <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
               ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                 sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <button className="configuration-logout-button">Logout</button>
          </div>
  
          <div className="configuration-settings-options">
            <button className="configuration-settings-button">Change Image</button>
            <button className="configuration-settings-button">Change Description</button>
            <button className="configuration-settings-button">Email Preferences</button>
            <button className="configuration-settings-button">Accessibility Options</button>
            <button className="configuration-settings-button">Change Password</button>
            <button className="configuration-settings-button">Your Preferences</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default SettingsPage;

