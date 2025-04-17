import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    // Using NavLink from react-router-dom to manage active state based on the route
    return (
        <div className="navbar-container">
            <nav className="navbar">
                <ul className="nav-list">
                    <li className="nav-item">
                        <NavLink exact className="nav-link" activeClassName="active" to="/home">Home</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/classes">Classes</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/buddies">Buddies</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/agenda">Agenda</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" activeClassName="active" to="/profile">Profile</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
