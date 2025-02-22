import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './CalendarDay.css';

const CalendarDay = ({date}) => {
    return(
        <div className="CalendarDay-outer-container">
            <h1 className="CalendarDay-date">{date}</h1>
            <h2>Calendar Day</h2>

        </div>
    )
    
};

export default CalendarDay;
