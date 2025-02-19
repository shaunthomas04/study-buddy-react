import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const Navbar = () => {
    return(
        <nav>
          <ul>
           
            <li>
              <Link to="/">Home</Link>
              <Link to="/classes">Classes</Link>
              <Link to="/buddies">Buddies</Link>
              <Link to="/agenda">Agenda</Link>
            </li>
           
          </ul>
        </nav>
    )
}

export default Navbar;