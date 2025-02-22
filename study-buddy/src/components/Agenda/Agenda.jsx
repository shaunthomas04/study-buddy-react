import React from 'react';
import Navbar from '../Navbar/Navbar';
import CalendarDay from '../CalendarDay/CalendarDay';
import './Agenda.css';


const Agenda = () => {
  return (
    <>
    <Navbar /> 
       <div className="Agenda-outer-container">
        <div className="Agenda-calendar-day-container">
          <CalendarDay date="10"/>
        </div>
      </div>
    </>
  );
};

export default Agenda;