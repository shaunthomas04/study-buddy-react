import React from 'react';
import Navbar from '../Navbar/Navbar';
import CalendarDay from '../CalendarDay/CalendarDay';
import './Agenda.css';

// Dummy Testing data
const studySessions = [
  {
    "id": "1a2b3c4d5e6f",
    "classCode": "MAT101",
    "date": "2025-02-23",
    "time": "14:00",
    "person": "John Doe",
    "status": "accepted",
    "notes": "Make sure to review chapter 3 thoroughly, especially the problems on derivatives and integrals. Also, review the sample exam questions I sent last week, as they are likely to be similar to what will be on the exam."
  },
  {
    "id": "2f3g4h5i6j7k",
    "classCode": "CS101",
    "date": "2025-02-24",
    "time": "09:00",
    "person": "Jane Smith",
    "status": "in progress",
    "notes": "Let's go over the project draft together to discuss the improvements. I'll bring my laptop, so we can work on the code directly. I think we need to focus on debugging the algorithm section as it's been causing some issues, and we need to fix it before submission."
  },
  {
    "id": "3k4l5m6n7o8p",
    "classCode": "STAT202",
    "date": "2025-02-25",
    "time": "16:00",
    "person": "Alex Johnson",
    "status": "declined",
    "notes": "I had to cancel this session due to a conflict with another meeting. Please let me know if we can reschedule. I’ll be available later in the week after Thursday afternoon, so let’s find another time that works for both of us."
  },
  {
    "id": "4m5n6o7p8q9r",
    "classCode": "ENG202",
    "date": "2025-02-26",
    "time": "11:30",
    "person": "Samantha Lee",
    "status": "accepted",
    "notes": "Let's review the thesis outline and focus on tightening the argument in the introduction. Make sure the literature review connects the dots clearly, and we need to refine the methodology section."
  },
  {
    "id": "5q6r7s8t9u0v",
    "classCode": "BIO303",
    "date": "2025-02-27",
    "time": "13:30",
    "person": "Michael Brown",
    "status": "in progress",
    "notes": "Prepare for the lab practical by reviewing the biological processes we discussed in class. I'll bring the slides, and we can do a quick mock-up of the experiment procedure before we go over the lab results."
  }
];



const Agenda = () => {
  return (
    <>
    <Navbar /> 
       <div className="Agenda-outer-container">
        <div className="Agenda-calendar-day-container">
          <CalendarDay date="10" studySessionsForCalendarDay={studySessions}/>
        </div>
      </div>
    </>
  );
};

export default Agenda;