import React, { useState, useEffect,useRef  } from 'react';
import './CalendarDay.css';
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
import { parseISO, isWithinInterval, addDays, compareAsc, format  } from "date-fns";
import { sendRequestAlert } from '../Email/Email.js';


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

    const studySessionDate = studySessions[0].date;
    const formattedDate = format(parseISO(studySessionDate), "MMMM dd");  

    return (
        <div className="CalendarDay-popup-outer-container" onClick={(e) => e.stopPropagation()}>
            <button className="CalendarDay-popup-close-button" onClick={closePopup}>X</button>
            <h1 style={{ margin: "20px" }}>Agenda for {formattedDate}</h1>
            <div className="CalendarDay-popup-inner-container">
                {studySessions?.map((studySession, index) => (
                    <CalendarPopupSessions key={index} studySession={studySession} />
                ))}
            </div>
        </div>
    );
};

const acceptStudySession = async (senderID, recieverID, studySessionHash) => {
    try {
        const reciever = doc(db, "users", recieverID.trim());
        const recieverDocSnapshot = await getDoc(reciever);  
        const sender = doc(db, "users", senderID.trim());
        const senderDocSnapshot = await getDoc(sender);

        if (!recieverDocSnapshot.exists() || !senderDocSnapshot.exists()) {
            console.log("Error accepting study session");
            return null;
        }

        const recieverStudySessions = recieverDocSnapshot.data().agendaStudySessions;
        const senderStudySessions = senderDocSnapshot.data().agendaStudySessions;

        const matchedSession = recieverStudySessions.find(
            session => session.sessionID === studySessionHash
          );


        const updatedReceiverSessions = recieverStudySessions.map(session =>
            session.sessionID === studySessionHash ? { ...session, status: "accepted" } : session
        );
        const updatedSenderSessions = senderStudySessions.map(session =>
            session.sessionID === studySessionHash ? { ...session, status: "accepted" } : session
        );

        await updateDoc(reciever, { agendaStudySessions: updatedReceiverSessions });
        await updateDoc(sender, { agendaStudySessions: updatedSenderSessions });


          
        // Send notification email to buddy
        const time = matchedSession.time;
        const date = matchedSession.date;
        const buddyEmail = senderDocSnapshot.data().email;
        const buddyName = `${senderDocSnapshot.data().firstName} ${senderDocSnapshot.data().lastName}`;
        const userName = `${recieverDocSnapshot.data().firstName} ${recieverDocSnapshot.data().lastName}`;
        const message = `Your study session with ${userName} on ${date} at ${time} has been accepted!`;
        sendRequestAlert(buddyName, buddyEmail, message);

      } 
      catch (error) {
        console.error("Error getting document:", error);
        return null;
      }
  }

  const declineStudySession = async (senderID, recieverID, studySessionHash) => {
    try {
        const reciever = doc(db, "users", recieverID.trim());
        const recieverDocSnapshot = await getDoc(reciever);  
        const sender = doc(db, "users", senderID.trim());
        const senderDocSnapshot = await getDoc(sender);

        if (!recieverDocSnapshot.exists() || !senderDocSnapshot.exists()) {
            console.log("Error accepting study session");
            return null;
        }

        const recieverStudySessions = recieverDocSnapshot.data().agendaStudySessions;
        const senderStudySessions = senderDocSnapshot.data().agendaStudySessions;

        const matchedSession = recieverStudySessions.find(
            session => session.sessionID === studySessionHash
          );


        const updatedReceiverSessions = recieverStudySessions.filter(session => 
            session.sessionID !== studySessionHash 
        );
        const updatedSenderSessions = senderStudySessions.filter(session => 
            session.sessionID !== studySessionHash
        );

        await updateDoc(reciever, { agendaStudySessions: updatedReceiverSessions });
        await updateDoc(sender, { agendaStudySessions: updatedSenderSessions });

        // Send notification email to buddy
        const time = matchedSession.time;
        const date = matchedSession.date;
         const buddyEmail = senderDocSnapshot.data().email;
         const buddyName = `${senderDocSnapshot.data().firstName} ${senderDocSnapshot.data().lastName}`;
         const userName = `${recieverDocSnapshot.data().firstName} ${recieverDocSnapshot.data().lastName}`;
         const message = `Your study session with ${userName} on ${date} at ${time} has been declined.`;
        //  sendRequestAlert(buddyName, buddyEmail, message);
      } 
      catch (error) {
        console.error("Error getting document:", error);
        return null;
      }
  }


//This component is used to show the study sessions for a day in a popup when the pipup is open
const CalendarPopupSessions = ({studySession}) => {
    const green = "#71FF65";
    const yellow = "#FFFD62";
    const blue = "#6E6FFF";
    const red = "#FF5B57";

    const formattedTime = format(
           new Date(`1970-01-01T${studySession.time}:00`),
           "hh:mm a"
         );

    const color = studySession.status === "accepted" ? green : studySession.status === "pending" ? yellow : studySession.status === "request" ? blue: red;
    const studySessionText = studySession.status === "accepted" ? `Study session with ${studySession.person} at ${formattedTime}`
    : studySession.status === "pending" ? `Study session with ${studySession.person} at ${formattedTime} is pending` 
    : studySession.status === "request" ? `Study session with ${studySession.person} at ${formattedTime} is requested`
    : `Study session with ${studySession.person} at ${formattedTime} has been rejected`;

    const [isOpen, setIsOpen] = useState(false);
    const togglePopup = () => {
            setIsOpen(prevState => !prevState); 
        };

    const senderID = studySession.senderID;
    const receiverID = studySession.recieverID;
    const studySessionID = studySession.sessionID;


    return(
        <div className="CalendarDay-popup-session-container" style={{backgroundColor: color}}  onClick={togglePopup}>
            <div className="CalendarDay-popup-session-text"> {studySessionText}</div>

            {isOpen && (
                <div className="CalendarDay-popup-session-notes">
                    {studySession.notes}

                    {studySession.status === "request" && (
                        <div>
                            <button onClick={async () => await acceptStudySession(senderID, receiverID, studySessionID)} className="CalendarDay-popup-session-buttons" style={{"backgroundColor": "green"}}>✓</button>
                            <button onClick={async () => await declineStudySession(senderID, receiverID, studySessionID)} className="CalendarDay-popup-session-buttons" style={{"backgroundColor": "red"}}>x</button>
                        </div>
                    )}

                </div>
            )}
        </div>
    )
  
};


// This component is used to show the study sessions for a specific day in the acutal calendar day component in the agenda page
const CalendarDaySession = ({studySession}) => {
    const green = "#71FF65";
    const yellow = "#FFFD62";
    const blue = "#6E6FFF";
    const red = "#FF5B57";

    const formattedTime = format(
           new Date(`1970-01-01T${studySession.time}:00`),
           "hh:mm a"
         );
    
    const color = studySession.status === "accepted" ? green : studySession.status === "pending" ? yellow : studySession.status === "request" ? blue: red;
    return(
        <div className="CalendarDay-study-session-outer-container" style={{backgroundColor: color}}> 
            <div className="CalendarDay-study-session-text"> {formattedTime} with {studySession.person}</div>
        </div>
    )
};

// This is the main parent component that is returned and displays an acutal day in the calendar on the agenda page 
const CalendarDay = ({ date, calendarDayInfo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const popupContainerRef = useRef(null);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    // Close the popup when clicking outside of the container
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupContainerRef.current && !popupContainerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="CalendarDay-outer-container" onClick={togglePopup}>
            <h1 className="CalendarDay-date">{date}</h1>
            <div className="CalendarDay-tasks-container">
                {calendarDayInfo.studySessions?.length > 0 && calendarDayInfo.studySessions.map((studySession, index) => (
                    <CalendarDaySession key={index} studySession={studySession} />
                ))}
            </div>
            <div ref={popupContainerRef}>
                <CalendarDaySessionPopup
                    calendarDayStudySessions={calendarDayInfo.studySessions}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            </div>
        </div>
    );
};

export default CalendarDay;
