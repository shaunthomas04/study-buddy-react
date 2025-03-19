import React from 'react';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Classes from './components/Classes/Classes';
import Buddies from './components/Buddies/Buddies';
import Agenda from './components/Agenda/Agenda';
import Profile from './components/Settings/Configuration';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {
  return (
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/buddies" element={<Buddies />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
  );
};

export default App;


