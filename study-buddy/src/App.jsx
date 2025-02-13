import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Classes from './components/Classes/Classes';
import Buddies from './components/Buddies/Buddies';
import Agenda from './components/Agenda/Agenda';

const App = () => {
  return (
      <div>
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

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/buddies" element={<Buddies />} />
          <Route path="/agenda" element={<Agenda />} />

        </Routes>
      </div>
  );
};

export default App;


