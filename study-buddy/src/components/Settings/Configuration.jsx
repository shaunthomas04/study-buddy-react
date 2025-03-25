import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Navbar from "../Navbar/Navbar";
import "./Configuration.css";

const SettingsPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }
  }, []);

  return (
    <div className="configuration-settings-page">
      <header className="flex justify-between bg-gray-800 text-white p-4 items-center">
        <div className="logo"></div>
        <Navbar />
      </header>

      <div className="configuration-settings-container">
        <div className="configuration-profile-description">
          <div className="configuration-profile-image"></div>
          <h2>[firstName], [lastName]</h2>
          <p className="description">
            <strong>Desc:</strong> Current student at XYZ EDU <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
          </p>

        </div>

        <div className="configuration-settings-options">
  
        {/* Change Name */}
        <div className="input-row">
          <div className="input-group">
            <label>Change Name</label>
            <input
              type="text"
              placeholder="Enter new name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button className="save-button">Save</button>
        </div>

        {/* Change Description */}
        <div className="input-row">
          <div className="input-group">
            <label>Change Description</label>
            <input
              type="text"
              placeholder="Update your description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button className="save-button">Save</button>
        </div>

        <div className="configuration-settings-options">
            <button className="configuration-settings-button">Button1</button>
            <button className="configuration-settings-button">Button2</button>
            {/* <button className="configuration-settings-button">Button3</button>
            <button className="configuration-settings-button">Button 4</button> */}
            </div>

        {/* Change Password */}
        <div className="input-row">
          <div className="input-group">
            <label>Change Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="save-button">Update Password</button>
        </div>


          <button className="configuration-logout-button">Logout</button>
          <ul className="configuration-logout-button">
                    <li className="nav-item" onClick={() => setActiveIndex(0)}>
                        <Link className={activeIndex === 0 ? "nav-link active" : "nav-link"} to="/home">Home</Link>
                    </li>
                </ul>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
