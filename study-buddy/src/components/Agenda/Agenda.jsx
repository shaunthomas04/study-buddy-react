import React from 'react';
import Navbar from '../Navbar/Navbar';
import CalendarDay from '../CalendarDay/CalendarDay';
import './Agenda.css';


import { format, startOfMonth, getDaysInMonth, getDay } from "date-fns";

const today = new Date();
const month = format(today, "MMMM");  // Full month name (e.g., "February")
const year = format(today, "yyyy");   // Year (e.g., "2025")

const firstDayOfMonthDate = startOfMonth(today); // Gets the first day of the current month
const firstDayOfMonth = format(firstDayOfMonthDate, "EEEE"); // Full weekday name (e.g., "Monday")

console.log({ month, year, firstDayOfMonth });



const Agenda = () => {
  return (
    <>
    <Navbar /> 
       <div className="Agenda-outer-container">
        <div className="Agenda-calendar-day-container">
          <CalendarDay date="10" />
          <CalendarDay date="11" />
        </div>
      </div>
    </>
  );
};

export default Agenda;