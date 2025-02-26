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

    console.log(mondays, tuesdays, wednesdays, thursdays, fridays, saturdays, sundays);
    return {mondays, tuesdays, wednesdays, thursdays, fridays, saturdays, sundays};  //Condense thise function when time permits
};


// Get first day of month and then find that weekdays number 0-6
//Then use that number to find previous weekdays before the first day of the month
// Then create date objects for the corresponding weekdays {date: '2025-02-07', dayNumber: '7', weekday: 'Friday', weekdayNumber: 5}
// Then push these objects into the corresponding weekday array
// Then go ahead and add all the other weekdays to their respective arrays


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

  const formattedDays = daysInMonth.map(day => ({
    date: format(day, "yyyy-MM-dd"),
    dayNumber: format(day, "d"),
    weekday: format(day, "EEEE"),  
    weekdayNumber: getDay(day)
  }));

 
  if (formattedDays[0].weekdayNumber > 0 || formattedDays[0].weekdayNumber < 6) {
    for (let i = 0; i < formattedDays[0].weekdayNumber; i++) {
      const weekdayName = Object.keys(weekdays)[i];
      
   
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

  console.log(weekdays);
  return weekdays;
};



const WeekdayCalendarDayContainer = ({weekday, daysInfo}) => {
  return(
    <>
    <div className="Agenda-weekday-day-container">
      <div className='Agenda-weekday-name'>{weekday}</div>
        {daysInfo.map(dayInfo => (
          <CalendarDay date={dayInfo.dayNumber} />
        ))}
    </div>
    </>
  )
}



const Agenda = () => {
  getNumbersForWeekdays1();
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