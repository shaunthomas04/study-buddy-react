import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './CalendarDay.css';

const CalendarDayDate = ({studySession}) => {
    const color = studySession.status === "accepted" ? "green" : studySession.status === "pending" ? "yellow" : studySession.status === "request" ? "blue": "red";
    return(
        <div className="CalendarDay-study-session-outer-container" style={{backgroundColor: color}}> 
            <div className="CalendarDay-study-session-text"> {studySession.time} with {studySession.person}</div>
        </div>
    )

};

const CalendarDayDatePopup = ({ studySessionsForCalendarDay, isOpen, setIsOpen}) => {
  console.log(studySessionsForCalendarDay);
  if (!isOpen) return null;

  const closePopup = () => {
    e.stopPropagation();
    setIsOpen(false);
  }


  return (
      <div className="CalendarDay-popup-outer-container">
      <button className="CalendarDay-popup-close-button" onClick={closePopup}>X</button>
        <h1 style={{"margin":"20px"}}>Agenda for {studySessionsForCalendarDay[0].date}</h1>
          <div className="CalendarDay-popup-inner-container" onClick={(e) => e.stopPropagation()}>
              {studySessionsForCalendarDay.map((studySession, index) => (
                  <CalendarPopupSessions key={index} studySession={studySession} />
              ))}
          </div>
      </div>
  );
};

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


const CalendarDay = ({date, studySessionsForCalendarDay}) => {
    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
        setIsOpen(true);
    };
    
    return(
        <div className="CalendarDay-outer-container" onClick={togglePopup}>
            <h1 className="CalendarDay-date">{date}</h1>
            <div className='CalendarDay-tasks-container'>
            
            {studySessionsForCalendarDay?.length > 0 &&  
                    studySessionsForCalendarDay.map((studySession, index) => (
                        <CalendarDayDate key={index} studySession={studySession} />
                    ))
                }
            </div>
            <CalendarDayDatePopup studySessionsForCalendarDay={studySessionsForCalendarDay} isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
    )
    
};

export default CalendarDay;
