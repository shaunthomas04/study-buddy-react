import React from 'react';
import Navbar from '../Navbar/Navbar';
// import ClassesSidebar from './ClassesSidebar';
import './Classes.css';

const dummyData = {
  "questions": [
    {
      "title": "What's due tonight?",
      "author": "Jane Doe",
      "description": "I am confused about what is due tonight. Please help.",
      "replies": [
        {
          "author": "John Smith",
          "message": "Video Lecture is due",
          "replies": [
            {
              "author": "Jane Doe",
              "message": "Thanks for the clarification!"
            },
            {
              "author": "Bob Williams",
              "message": "Is there a quiz too?"
            }
          ]
        },
        {
          "author": "Bob Williams",
          "message": "Well, actually",
          "replies": [
            {
              "author": "John Smith",
              "message": "What do you mean?"
            }
          ]
        }
      ]
    },
    {
      "title": "How do I submit the assignment?",
      "author": "Alice Johnson",
      "description": "I'm not sure where to upload my project file.",
      "replies": [
        {
          "author": "David Lee",
          "message": "You need to submit it through the course portal.",
          "replies": [
            {
              "author": "Alice Johnson",
              "message": "Got it, thanks!"
            }
          ]
        }
      ]
    }
  ]
}


const ClassCodeButton = ({ code }) => {
  return (
      <button className="Classes-class-code-button">{code}</button>
  );
}

const ClassQuestion = () => {
  return (
    <div className="Classes-question">
      <h2 className="Classes-question-title">Class Code - I am confused what is due tonight</h2>
    </div>
  )
}

const ClassForum = () => {
  return (
    <div className="Classes-class-forum">
        <h2>CS 101</h2>
        <ClassQuestion />
      
    </div>
  )


}


const Classes = () => {
  return (
    <>
      <Navbar />
      <div className="Classes-outer-container">
        <div className='Classes-inner-container'>
          <div className="Classes-class-codes-container">
            <ClassCodeButton code="CS 101" />
            <ClassCodeButton code="CS 102" />
            
          </div>
          <div className="Classes-questions-container">
            <ClassForum />
          </div>
        </div>
      </div>
    </>
  );
};

export default Classes;
