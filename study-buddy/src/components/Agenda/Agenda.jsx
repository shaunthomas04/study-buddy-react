import React from 'react';
import Navbar from '../Navbar/Navbar';
import CalendarDay from '../CalendarDay/CalendarDay';
import './Agenda.css';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, getDate } from "date-fns";

// Second function to get all the numbers for the weekdays of the current month that accoutns for previous days, need to update jsx to support this
const getNumbersForWeekdays1 = () => {
  const weekdays = {"Monday": [], "Tuesday": [], "Wednesday": [], "Thursday": [], "Friday": [], "Saturday": [], "Sunday": []};
  const today = new Date();
  const startOfMonthDate = startOfMonth(today); // Start of the current month
  const endOfMonthDate = endOfMonth(today); // End of the current month

  // Get all days of the current month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonthDate,
    end: endOfMonthDate
  });

  // Create an array of date objects for each day in the month
  const formattedDays = daysInMonth.map(day => ({
    date: format(day, "yyyy-MM-dd"),
    dayNumber: format(day, "d"),
    weekday: format(day, "EEEE"),  
    weekdayNumber: getDay(day)
  }));

  // Add empty day objects to weekdays that are before month (e.g. if first day of month is a Wednesday, add Sunday, Monday, and Tuesday placeholders)
  if (formattedDays[0].weekdayNumber > 0 || formattedDays[0].weekdayNumber < 6) {
    for (let i = 0; i < formattedDays[0].weekdayNumber; i++) {   
      if (i === 0) {
        const dateObject = {date: '', dayNumber: '', weekday: 'Sunday', weekdayNumber: 0}
        weekdays["Sunday"].push(dateObject);
      }
      else if (i === 1) {
        const dateObject = {date: '', dayNumber: '', weekday: 'Monday', weekdayNumber: 1}
        weekdays["Monday"].push(dateObject);
      }
      else if (i === 2){
        const dateObject = {date: '', dayNumber: '', weekday: 'Tuesday', weekdayNumber: 2}
        weekdays["Tuesday"].push(dateObject);
      }
      else if (i === 3){
        const dateObject = {date: '', dayNumber: '', weekday: 'Wednesday', weekdayNumber: 3}
        weekdays["Wednesday"].push(dateObject);
      }
      else if (i === 4){
        const dateObject = {date: '', dayNumber: '', weekday: 'Thursday', weekdayNumber: 4}
        weekdays["Thursday"].push(dateObject);
      }
      else if (i === 5){
        const dateObject = {date: '', dayNumber: '', weekday: 'Friday', weekdayNumber: 5}
        weekdays["Friday"].push(dateObject);
      }

    }
  }

  // Add the rest of the weekdays to their respective arrays
  formattedDays.forEach(day => {
    weekdays[day.weekday].push(day);
  });

  // Add empty objects to the weekdays that have less than 5 days so all CalendarDay components are same size
  Object.keys(weekdays).forEach(weekday => {
    while (weekdays[weekday].length < 5) {
      weekdays[weekday].push({ date: '', dayNumber: '', weekday, weekdayNumber: getDay(new Date(weekday)) });
    }
  });
  
  return weekdays;
};



const WeekdayCalendarDayContainer = ({weekday, daysInfo}) => {
  // Take in the weekday info to create the column title and the daysInto to add specific days to calendar
  return(
    <>
    <div className="Agenda-weekday-day-container">
      <div className='Agenda-weekday-name'>{weekday}</div>
      {/* Map each array's days into CalendarDay components into the WeekdayCalendarDayContainer component */}
        {daysInfo.map(dayInfo => (
          <CalendarDay date={dayInfo.dayNumber} />
        ))}
    </div>
    </>
  )
}



const Agenda = () => {
  // Get all the weekdays for the current month
  const weekdays = getNumbersForWeekdays1();
  const sundays = weekdays["Sunday"];
  const mondays = weekdays["Monday"];
  const tuesdays = weekdays["Tuesday"];
  const wednesdays = weekdays["Wednesday"];
  const thursdays = weekdays["Thursday"];
  const fridays = weekdays["Friday"];
  const saturdays = weekdays["Saturday"];
  const today = new Date();
  const currentMonth = format(today, "MMMM");
  console.log(currentMonth)

  return (
    <>
    <Navbar /> 
       <div className="Agenda-outer-container">
        <div className='Agenda-month-heading'>{currentMonth}</div>
        <div className="Agenda-calendar-day-container">

          {/* For each weekday array create a WeekdayCalendarContainer component */}
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