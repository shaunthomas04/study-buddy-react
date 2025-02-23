import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './CalendarDay.css';

const CalendarDayDate = ({studySession}) => {
    console.log(studySession.status);
    const color = studySession.status === "accepted" ? "green" : studySession.status === "in progress" ? "yellow" : "red";
    return(
        <div className="CalendarDay-study-session-outer-container" style={{backgroundColor: color}}> 
            <div className="CalendarDay-study-session-text"> {studySession.time} with {studySession.person}</div>
        </div>
    )

};


const CalendarDay = ({date, studySessionsForCalendarDay}) => {
    return(
        <div className="CalendarDay-outer-container">
            <h1 className="CalendarDay-date">{date}</h1>
            <div className='CalendarDay-tasks-container'>
            {studySessionsForCalendarDay.map((studySession, index) => (
                    <CalendarDayDate key={index} studySession={studySession} />
                ))}
            </div>

        </div>
    )
    
};

export default CalendarDay;
