import React from 'react';
import Navbar from '../Navbar/Navbar';
import CalendarDay from '../CalendarDay/CalendarDay';



const Agenda = () => {
  return (
    <>
    <Navbar /> 
       
      <div className="Agenda-calendar-day-container">
        <CalendarDay/>
        <CalendarDay/>
        <CalendarDay/>
        <CalendarDay/>
        <CalendarDay/>
        <CalendarDay/>
        <CalendarDay/>
      </div>
    </>
  );
};

export default Agenda;