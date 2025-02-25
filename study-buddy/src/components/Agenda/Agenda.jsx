import React from 'react';
import Navbar from '../Navbar/Navbar';
import CalendarDay from '../CalendarDay/CalendarDay';
import './Agenda.css';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, getDate } from "date-fns";

const today = new Date();
const month = format(today, "MMMM");  
const year = format(today, "yyyy");  
const firstDayOfMonthDate = startOfMonth(today);
const firstDayOfMonth = format(firstDayOfMonthDate, "EEEE");



// Function to get all the numbers for the weekdays of the current month
const getNumbersForWeekdays = () => {
  const today = new Date();
  const startOfMonthDate = startOfMonth(today); // Start of the current month
  const endOfMonthDate = endOfMonth(today); // End of the current month
  
  // Get all days of the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonthDate,
    end: endOfMonthDate
  });

  const mondays = daysInMonth
    .filter(day => getDay(day) === 1) 
    .map(monday => ({
      date: format(monday, "yyyy-MM-dd"), 
      dayNumber: getDate(monday) 
    }));

    const tuesdays = daysInMonth
    .filter(day => getDay(day) === 2) 
    .map(tuesdays => ({
      date: format(tuesdays, "yyyy-MM-dd"),
      dayNumber: getDate(tuesdays)
    }));

    const wednesdays = daysInMonth
    .filter(day => getDay(day) === 3)
    .map(wednesday => ({
      date: format(wednesday, "yyyy-MM-dd"),
      dayNumber: getDate(wednesday)
    }));

    const thursdays = daysInMonth
    .filter(day => getDay(day) === 4)
    .map(thursday => ({
      date: format(thursday, "yyyy-MM-dd"),
      dayNumber: getDate(thursday)
    }));

    const fridays = daysInMonth
    .filter(day => getDay(day) === 5)
    .map(friday => ({
      date: format(friday, "yyyy-MM-dd"),
      dayNumber: getDate(friday)
    }));

    const saturdays = daysInMonth
    .filter(day => getDay(day) === 6)
    .map(saturday => ({
      date: format(saturday, "yyyy-MM-dd"),
      dayNumber: getDate(saturday)
    }));

    const sundays = daysInMonth
    .filter(day => getDay(day) === 0)
    .map(sunday => ({
      date: format(sunday, "yyyy-MM-dd"),
      dayNumber: getDate(sunday)
    }));

    return {mondays, tuesdays, wednesdays, thursdays, fridays, saturdays, sundays};  //Condense thise function when time permits
};


const WeekdayCalendarDayContainer = ({weekday, daysInfo}) => {
  console.log(daysInfo);
  return(
    <>
    <div className="Agenda-weekday-day-container">
      <div className='Agenda-weekday-name'>{weekday}</div>
        {daysInfo.map(dayInfo => (
          <CalendarDay date={dayInfo.dayNumber} />
        ))}
        <CalendarDay />
    </div>
    </>
  )
}



const Agenda = () => {
  const {mondays, tuesdays, wednesdays, thursdays, fridays, saturdays, sundays} = getNumbersForWeekdays();
  return (
    <>
    <Navbar /> 
       <div className="Agenda-outer-container">
        <div className="Agenda-calendar-day-container">



          <WeekdayCalendarDayContainer weekday={"Sunday"} daysInfo={sundays}/>
          <WeekdayCalendarDayContainer weekday={"Monday"} daysInfo={mondays}/>
          <WeekdayCalendarDayContainer weekday={"Tuesday"} daysInfo={tuesdays}/>
          <WeekdayCalendarDayContainer weekday={"Wednesday"} daysInfo={wednesdays}/>
          <WeekdayCalendarDayContainer weekday={"Thursday"} daysInfo={thursdays}/>
          <WeekdayCalendarDayContainer weekday={"Friday"} daysInfo={fridays}/>
          <WeekdayCalendarDayContainer weekday={"Saturday"} daysInfo={saturdays}/>
            
    



        </div>
      </div>
    </>
  );
};

export default Agenda;