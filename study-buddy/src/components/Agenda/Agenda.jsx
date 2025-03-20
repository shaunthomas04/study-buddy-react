import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import CalendarDay from '../CalendarDay/CalendarDay';
import './Agenda.css';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, getDate } from "date-fns";
import { useEffect } from 'react';
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 

// Function to upload a session to user agenda database
const uploadSession = async (userHash, session) => {
  try{
    const userInfo = doc(db, "users", userHash);
    await updateDoc(userInfo, {agendaStudySessions: arrayUnion(session)});
  }
  catch (error) {
    console.error("Error uploading session:", error);
  }
}

// popup for to be able to add study sessions
const AddStudySessionPopup = ({ studySessions, setStudySessions, setIsVisible, userHash }) => {
  const [formData, setFormData] = useState({
    classCode: '',
    date: '',
    time: '',
    person: '',
    status: 'pending',
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
    const newSession = { ...formData };
    

    setFormData({
      classCode: '',
      date: '',
      time: '',
      person: '',
      status: 'pending',
      notes: '',
    });


    // Add the new session to the user's agenda
    uploadSession(userHash, newSession)

    // Add the new session to user's buddy's agenda
    // Update the userNmame to the user's name and the buddyID to the buddy's ID that correlates to the selected buddy
    const userName = "User's Name"
    const buddyID = "Lk9IRfnLa7bS5dvuJvjF1JZuxR73"
    const buddySession = { ...newSession, status: "request", person: userName };
    uploadSession(buddyID, buddySession);


    setStudySessions(prevSessions => {
      const updatedSessions = [...prevSessions, newSession];
      return updatedSessions;
    });

    setIsVisible(false);
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
        {daysInfo.map((dayInfo, index) => (
          <CalendarDay key={index} date={dayInfo.dayNumber} calendarDayInfo={dayInfo}/>
        ))}
    </div>
    </>
  )
}

// Function to retrieve the user's agenda
const getUserAgenda = async (userHash) => {  
  try {
    const userInfo = doc(db, "users", userHash);
    const docSnapshot = await getDoc(userInfo);  
    if (docSnapshot.exists()) {
      return docSnapshot.data().agendaStudySessions;  
    } 
    else {
      console.log("No such document");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}



// Main Agenda component
const Agenda = () => {
  const [userHashID, setUserHashID] = useState(null)
  const [agendaSessions, setAgendaSessions] = useState([]);

  useEffect(() => {

    const loadAgenda = async () => {
      try{
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          throw new Error("Failed to load user data from localStorage");
        }
        const userHashID = JSON.parse(storedUser).uid;
        const agenda = await getUserAgenda(userHashID);
        setUserHashID(userHashID);
        setAgendaSessions(agenda);

        // Listen for changes to the user's agenda
         const userInfo = doc(db, "users", userHashID);
         const unsubscribe = onSnapshot(userInfo, (docSnap) => {
           if (docSnap.exists()) {
             setAgendaSessions(docSnap.data().agendaStudySessions || []);
           } else {
             console.log("No such document");
           }
         }); 
         return () => unsubscribe();

      }
      catch (error) {
        console.error("Error fetching agenda:", error);
      }


    }
    loadAgenda();
    }, []); 
  
  
  // Dummy data for study sessions
  const [studySessions, setStudySessions] = useState(agendaSessions);

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
  agendaSessions.forEach(studySession => {
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
        {isVisible && <AddStudySessionPopup studySessions={studySessions} setStudySessions={setStudySessions} setIsVisible={setIsVisible} userHash={userHashID}/>}
      </div>
    </>
  );
};

export default Agenda;