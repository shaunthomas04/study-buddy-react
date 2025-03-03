import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import CalendarDay from '../CalendarDay/CalendarDay';
import './Agenda.css';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, getDate } from "date-fns";

// popup for to be able to add study sessions
const AddStudySessionPopup = ({ studySessions}) => {
  const [formData, setFormData] = useState({
    classCode: '',
    date: '',
    time: '',
    person: '',
    status: 'In Progress',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const studySessionJson = {
      classCode: formData.classCode,
      date: formData.date,
      time: formData.time,
      person: formData.person,
      status: formData.status,
      notes: formData.notes,
    };
    console.log(studySessionJson);
    setFormData({
      classCode: '',
      date: '',
      time: '',
      person: '',
      status: 'In Progress',
      notes: '',
    });
  };

  return (
    <div className="Agenda-popup-add-sessions-container">
      <h2>Add Study Session</h2>
      <form onSubmit={handleSubmit} className='Agenda-popup-add-sessions-form'>
        <input type="text" name="classCode" placeholder="Enter class code" value={formData.classCode} onChange={handleChange} required className='Agenda-popup-form-field'/>
        <input type="date" name="date" placeholder="date" value={formData.date} onChange={handleChange}required className='Agenda-popup-form-field'/>
        <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required className='Agenda-popup-form-field'/>        
        <input type="text" id="person" name="person" placeholder="Person" value={formData.person} onChange={handleChange}required className='Agenda-popup-form-field'/>
        <textarea style={{marginBottom: '20px',height: "90px"}} name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className='Agenda-popup-form-field' />
        <button type="submit">Submit</button>

      </form>

    </div>
  );
};



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
    weekdayNumber: getDay(day),
    studySessions: []
  }));

  // Add empty day objects to weekdays that are before month (e.g. if first day of month is a Wednesday, add Sunday, Monday, and Tuesday placeholders)
  if (formattedDays[0].weekdayNumber > 0 || formattedDays[0].weekdayNumber < 6) {
    for (let i = 0; i < formattedDays[0].weekdayNumber; i++) {   
      if (i === 0) {
        const dateObject = {date: '', dayNumber: null, weekday: 'Sunday', weekdayNumber: 0, studySessions: []}
        weekdays["Sunday"].push(dateObject);
      }
      else if (i === 1) {
        const dateObject = {date: '', dayNumber: null, weekday: 'Monday', weekdayNumber: 1, studySessions: []}
        weekdays["Monday"].push(dateObject);
      }
      else if (i === 2){
        const dateObject = {date: '', dayNumber: null, weekday: 'Tuesday', weekdayNumber: 2, studySessions: []}
        weekdays["Tuesday"].push(dateObject);
      }
      else if (i === 3){
        const dateObject = {date: '', dayNumber: null, weekday: 'Wednesday', weekdayNumber: 3, studySessions: []}
        weekdays["Wednesday"].push(dateObject);
      }
      else if (i === 4){
        const dateObject = {date: '', dayNumber: null, weekday: 'Thursday', weekdayNumber: 4, studySessions: []}
        weekdays["Thursday"].push(dateObject);
      }
      else if (i === 5){
        const dateObject = {date: '', dayNumber: null, weekday: 'Friday', weekdayNumber: 5, studySessions: []}
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
    while (weekdays[weekday].length < 6) {
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
          <CalendarDay date={dayInfo.dayNumber} calendarDayInfo={dayInfo}/>
        ))}
    </div>
    </>
  )
}



const Agenda = () => {
  // Dummy data for study sessions
  const studySessions = [
    {
      "classCode": "MAT101",
      "date": "2025-03-31",
      "time": "14:00",
      "person": "John Doe",
      "status": "accepted",
      "notes": "Make sure to review chapter 3 thoroughly, especially the problems on derivatives and integrals. Also, review the sample exam questions I sent last week, as they are likely to be similar to what will be on the exam."
    },
    {
      "classCode": "MAT101",
      "date": "2025-03-31",
      "time": "14:00",
      "person": "John Doe",
      "status": "accepted",
      "notes": "Make sure to review chapter 3 thoroughly, especially the problems on derivatives and integrals. Also, review the sample exam questions I sent last week, as they are likely to be similar to what will be on the exam."
    },
    {
      "classCode": "MAT101",
      "date": "2025-03-31",
      "time": "14:00",
      "person": "John Doe",
      "status": "accepted",
      "notes": "Make sure to review chapter 3 thoroughly, especially the problems on derivatives and integrals. Also, review the sample exam questions I sent last week, as they are likely to be similar to what will be on the exam."
    },
    {
      "classCode": "CS101",
      "date": "2025-03-23",
      "time": "09:00",
      "person": "Jane Smith",
      "status": "in progress",
      "notes": "Let's go over the project draft together to discuss the improvements. I'll bring my laptop, so we can work on the code directly. I think we need to focus on debugging the algorithm section as it's been causing some issues, and we need to fix it before submission."
    }
  ];

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

  // Get the weekday for each study session and then find weekday array and then add session to sessions array in that weekday object
  studySessions.forEach(studySession => {
    const [year, month, day] = studySession.date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const weekday = format(dateObj, "EEEE");

    const currentWeekday = weekdays[weekday];
    currentWeekday.forEach(day => {
      if (day.date === studySession.date) {
        day.studySessions.push(studySession);
      }
    });
  });

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };
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
        <button className='Agenda-popup-add-sessions' onClick={toggleVisibility}>
          {isVisible ? 'x' : '+'}
        </button>
        {isVisible && <AddStudySessionPopup studySessions={studySessions}/>}
      </div>
    </>
  );
};

export default Agenda;