import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className="navbar-container">
            <nav className="navbar">
                <ul className="nav-list">
                    <li className="nav-item" onClick={() => setActiveIndex(0)}>
                        <Link className={activeIndex === 0 ? "nav-link active" : "nav-link"} to="/">Home</Link>
                    </li>
                    <li className="nav-item" onClick={() => setActiveIndex(1)}>
                        <Link className={activeIndex === 1 ? "nav-link active" : "nav-link"} to="/classes">Classes</Link>
                    </li>
                    <li className="nav-item" onClick={() => setActiveIndex(2)}>
                        <Link className={activeIndex === 2 ? "nav-link active" : "nav-link"} to="/buddies">Buddies</Link>
                    </li>
                    <li className="nav-item" onClick={() => setActiveIndex(3)}>
                        <Link className={activeIndex === 3 ? "nav-link active" : "nav-link"} to="/agenda">Agenda</Link>
                    </li>
                    <li className="nav-item" onClick={() => setActiveIndex(4)}>
                        <Link className={activeIndex === 4 ? "nav-link active" : "nav-link"} to="/profile">Profile</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Navbar;
