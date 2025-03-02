import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './CalendarDay.css';

// This component is used to show the study sessions for a specific day in a popup when the user clicks on the day in the calendar
const CalendarDaySessionPopup = ({ calendarDayStudySessions, isOpen, setIsOpen }) => {    
    let studySessions = [];
    if (calendarDayStudySessions){
        studySessions = calendarDayStudySessions;
    }
    

    if (!isOpen) return null;
    const closePopup = (e) => {
        e.stopPropagation(); 
        setIsOpen(false); 
    }

    return (
        <div className="CalendarDay-popup-outer-container" onClick={(e) => e.stopPropagation()}>
            <button className="CalendarDay-popup-close-button" onClick={closePopup}>X</button>
            <h1 style={{ margin: "20px" }}>Agenda for {calendarDayStudySessions.date}</h1>
            <div className="CalendarDay-popup-inner-container">
                {studySessions?.map((studySession, index) => (
                    <CalendarPopupSessions studySession={studySession} />
                ))}
            </div>
        </div>
    );
};

// // // This component is used to show the study sessions for a day in a popup when the pipup is open
const CalendarPopupSessions = ({studySession}) => {
  const color = studySession.status === "accepted" ? "green" : studySession.status === "pending" ? "yellow" : studySession.status === "request" ? "blue": "red";

  if (studySession.status === "accepted") {
    return(
        <div className="CalendarDay-popup-session-container" style={{backgroundColor: color}}>
            <div className="CalendarDay-popup-session-text"> Study session with {studySession.person} at {studySession.time}</div>
        </div>
    )
  }
  else if (studySession.status === "pending") {
    return(
        <div className="CalendarDay-popup-session-container" style={{backgroundColor: color}}>
            <div className="CalendarDay-popup-session-text"> Study session with {studySession.person} at {studySession.time} is pending</div>
        </div>
    )
  }
  else if (studySession.status === "request") {
    return(
        <div className="CalendarDay-popup-session-container" style={{backgroundColor: color}}>
            <div className="CalendarDay-popup-session-text"> Study session with {studySession.person} at {studySession.time} is requested</div>
        </div>
    )
  }
  else{
    return(
        <div className="CalendarDay-popup-session-container" style={{backgroundColor: color}}>
            <div className="CalendarDay-popup-session-text"> Study session with {studySession.person} at {studySession.time} has been rejected</div>
        </div>
    )
  }

};


// This component is used to show the study sessions for a specific day in the acutal calendar day component in the agenda page
const CalendarDaySession = ({studySession}) => {
    const color = studySession.status === "accepted" ? "green" : studySession.status === "pending" ? "yellow" : studySession.status === "request" ? "blue": "red";
    return(
        <div className="CalendarDay-study-session-outer-container" style={{backgroundColor: color}}> 
            <div className="CalendarDay-study-session-text"> {studySession.time} with {studySession.person}</div>
        </div>
    )
};

// This is the main parent component that is returned and displays an acutal day in the calendar on the agenda page 
const CalendarDay = ({date, calendarDayInfo}) => {
    // calendarDayInfo
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
        setIsOpen(true);
    };
    
    return(
        <div className="CalendarDay-outer-container" onClick={togglePopup}>
            <h1 className="CalendarDay-date">{date}</h1>
            <div className='CalendarDay-tasks-container'>
            
            {calendarDayInfo.studySessions?.length > 0 &&  
                    calendarDayInfo.studySessions.map((studySession, index) => (
                        <CalendarDaySession key={index} studySession={studySession} />
                    ))
                }
            </div>
            <CalendarDaySessionPopup calendarDayStudySessions={calendarDayInfo.studySessions} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
    
};

export default CalendarDay;
