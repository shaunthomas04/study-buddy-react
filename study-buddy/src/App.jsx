import React from 'react';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Classes from './components/Classes/Classes';
import Buddies from './components/Buddies/Buddies';
import Agenda from './components/Agenda/Agenda';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


const App = () => {
  return (
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/buddies" element={<Buddies />} />
          <Route path="/agenda" element={<Agenda />} />

        </Routes>
      </div>
  );
};

export default App;


