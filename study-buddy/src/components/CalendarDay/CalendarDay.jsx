import React, { useState, useEffect  } from 'react';
import './CalendarDay.css';

// This component is used to show the study sessions for a specific day in a popup when the user clicks on the day in the calendar
const CalendarDaySessionPopup = ({ calendarDayStudySessions, isOpen, setIsOpen }) => {    
    let studySessions = [];
    if (calendarDayStudySessions){
        studySessions = calendarDayStudySessions;
    }
    else{
        return null;
    }
    
    if (!isOpen) return null;
    const closePopup = (e) => {
        e.stopPropagation(); 
        setIsOpen(!isOpen); 
    }

    if (studySessions[0] === undefined){
        return null;
    }

    return (
        <div className="CalendarDay-popup-outer-container" onClick={(e) => e.stopPropagation()}>
            <button className="CalendarDay-popup-close-button" onClick={closePopup}>X</button>
            <h1 style={{ margin: "20px" }}>Agenda for {studySessions[0].date}</h1>
            <div className="CalendarDay-popup-inner-container">
                {studySessions?.map((studySession, index) => (
                    <CalendarPopupSessions key={index} studySession={studySession} />
                ))}
            </div>
        </div>
    );
};

//This component is used to show the study sessions for a day in a popup when the pipup is open
const CalendarPopupSessions = ({studySession}) => {
  const color = studySession.status === "accepted" ? "green" : studySession.status === "pending" ? "yellow" : studySession.status === "request" ? "blue": "red";
  const studySessionText = studySession.status === "accepted" ? `Study session with ${studySession.person} at ${studySession.time}`
   : studySession.status === "pending" ? `Study session with ${studySession.person} at ${studySession.time} is pending` 
   : studySession.status === "request" ? `Study session with ${studySession.person} at ${studySession.time} is requested`
   : `Study session with ${studySession.person} at ${studySession.time} has been rejected`;

   const [isOpen, setIsOpen] = useState(false);
   const togglePopup = () => {
    setIsOpen(prevState => !prevState); 
};


    return(
        <div className="CalendarDay-popup-session-container" style={{backgroundColor: color}}  onClick={togglePopup}>
            <div className="CalendarDay-popup-session-text"> {studySessionText}</div>

            {isOpen && (
                <div className="CalendarDay-popup-session-notes">
                {studySession.notes}
                </div>
            )}
        </div>
    )
  
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
        setIsOpen(!isOpen);
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
