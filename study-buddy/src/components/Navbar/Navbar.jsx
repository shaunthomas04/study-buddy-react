import React from 'react';

const Navbar = () => {
    return(
        <nav>
          <ul>
           
            <li>
              <Link to="/">Login</Link>
              <Link to="/home">Home</Link>
              <Link to="/classes">Classes</Link>
              <Link to="/buddies">Buddies</Link>
              <Link to="/agenda">Agenda</Link>
            </li>
           
          </ul>
        </nav>
    )
}

export default Navbar;