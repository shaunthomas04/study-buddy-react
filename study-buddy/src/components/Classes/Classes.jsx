import React from 'react';
import Navbar from '../Navbar/Navbar';
// import ClassesSidebar from './ClassesSidebar';
// import ClassesSidebar from './ClassesSidebar';
import './Classes.css';
import { useEffect } from 'react';
import { db } from "../../firebase.js";
import { collection, getDocs } from "firebase/firestore";


const dummyData = {
  "questions": [
    {
      "title": "What's the deadline for the project?",
      "author": "Alice Johnson",
      "description": "Can someone clarify the deadline for the project? I missed the announcement.",
      "replies": [
        {
          "author": "Bob Adams",
          "message": "The project is due next Friday at 5 PM.",
          "replies": [
            {
              "author": "Alice Johnson",
              "message": "Thanks for the info, Bob!",
              "replies": [
                {
                  "author": "Charlie Green",
                  "message": "Actually, it was extended to next Monday."
                }
              ]
            }
          ]
        },
        {
          "author": "Dave Lee",
          "message": "Don't forget about the group presentation as well, which is right after the project deadline.",
          "replies": [
            {
              "author": "Alice Johnson",
              "message": "Got it! Thanks for the heads-up."
            }
          ]
        }
      ]
    },
    {
      "title": "Can I submit my homework late?",
      "author": "Eva Mitchell",
      "description": "I missed the homework submission. Is there a possibility of submitting it late?",
      "replies": [
        {
          "author": "George White",
          "message": "You can submit it up to 2 days late with a 10% penalty.",
          "replies": [
            {
              "author": "Eva Mitchell",
              "message": "Thanks for the info! Do I need to inform the professor?",
              "replies": [
                {
                  "author": "Hannah Brown",
                  "message": "Yes, make sure to send them an email explaining the situation."
                }
              ]
            }
          ]
        },
        {
          "author": "James Black",
          "message": "I think there’s also an automatic 5% deduction for late submissions, even without the 10% penalty.",
          "replies": [
            {
              "author": "Eva Mitchell",
              "message": "I'll keep that in mind. Thanks!"
            }
          ]
        }
      ]
    },
    {
      "title": "When is the next class session?",
      "author": "Michael Turner",
      "description": "I need to confirm the timing for the next class. Can anyone help?",
      "replies": [
        {
          "author": "Sarah Lewis",
          "message": "It’s scheduled for Monday at 2 PM.",
          "replies": [
            {
              "author": "Michael Turner",
              "message": "Thanks, Sarah! Is it in the same room as last time?",
              "replies": [
                {
                  "author": "Robert Scott",
                  "message": "Yes, same room, 101."
                }
              ]
            }
          ]
        },
        {
          "author": "Daniel Wilson",
          "message": "Don't forget, there’s also a guest lecture next week, and it starts at 3:30 PM.",
          "replies": [
            {
              "author": "Michael Turner",
              "message": "I almost forgot about that! Thanks for the reminder."
            }
          ]
        }
      ]
    },
    {
      "title": "Can we review for the final exam in class?",
      "author": "Samantha Clark",
      "description": "Will we be reviewing for the final exam in class before it starts?",
      "replies": [
        {
          "author": "Olivia Harris",
          "message": "Yes, there will be a review session this Friday in class.",
          "replies": [
            {
              "author": "Samantha Clark",
              "message": "Perfect, I’ll make sure to attend."
            }
          ]
        },
        {
          "author": "Liam Martinez",
          "message": "There’s also an online review session available if you can’t make it to class.",
          "replies": [
            {
              "author": "Samantha Clark",
              "message": "That sounds great, thanks for the info!"
            }
          ]
        }
      ]
    }
  ]
}

const fetchQuestions = async (classCode) => {
  try {
    const questionsRef = collection(db, "classes", classCode, "questions");
    const snapshot = await getDocs(questionsRef);
    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

// Button component that displays the class code
const ClassCodeButton = ({ code }) => {
  return (
      <button className="Classes-class-code-button">{code}</button>
  );
}

// Reply component that contains a reply and all replies to that reply
const Reply = ({ reply, level = 0 }) => {
  return (
    <div style={{ marginLeft: `${level * 20}px`, borderLeft: "3px solid black", paddingLeft: "10px", marginTop: "10px" }}>
      <p style={{fontSize:"20px"}}><h5>{reply.author}:</h5> {reply.message}</p>
      {reply.replies && reply.replies.length > 0 && (
        <div>
          {reply.replies.map((nestedReply, index) => (
            <Reply key={index} reply={nestedReply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// Question component that contains a question and all replies to that question
const ClassQuestion = ({ question }) => {
  return (
    <div className="Classes-question">
      <h2 className="Classes-question-title">{question.author}: {question.description}</h2>
      <div className='Classes-reply-container'>
        {question.replies.map((reply, index) => (
          <Reply key={index} reply={reply} />
        ))}
      </div>
    </div>
  );
};

// Forum container for each class that maps all questions from a class into this forum container
const ClassForum = ({questionsContainer, classCode}) => {
  const ClassQuestions = questionsContainer.questions;

  return (
    <div className="Classes-class-forum">
        <h2 className='Classes-class-forum-title1'>{classCode}</h2>
        {ClassQuestions.map((question, index) => (
            <ClassQuestion question={question} key={index}/>
          ))}

    </div>
  )


}

// Main component
import { useEffect } from 'react';
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";


const dummyData = {
  "questions": [
    {
      "title": "What's the deadline for the project?",
      "author": "Alice Johnson",
      "description": "Can someone clarify the deadline for the project? I missed the announcement.",
      "replies": [
        {
          "author": "Bob Adams",
          "message": "The project is due next Friday at 5 PM.",
          "replies": [
            {
              "author": "Alice Johnson",
              "message": "Thanks for the info, Bob!",
              "replies": [
                {
                  "author": "Charlie Green",
                  "message": "Actually, it was extended to next Monday."
                }
              ]
            }
          ]
        },
        {
          "author": "Dave Lee",
          "message": "Don't forget about the group presentation as well, which is right after the project deadline.",
          "replies": [
            {
              "author": "Alice Johnson",
              "message": "Got it! Thanks for the heads-up."
            }
          ]
        }
      ]
    },
    {
      "title": "Can I submit my homework late?",
      "author": "Eva Mitchell",
      "description": "I missed the homework submission. Is there a possibility of submitting it late?",
      "replies": [
        {
          "author": "George White",
          "message": "You can submit it up to 2 days late with a 10% penalty.",
          "replies": [
            {
              "author": "Eva Mitchell",
              "message": "Thanks for the info! Do I need to inform the professor?",
              "replies": [
                {
                  "author": "Hannah Brown",
                  "message": "Yes, make sure to send them an email explaining the situation."
                }
              ]
            }
          ]
        },
        {
          "author": "James Black",
          "message": "I think there’s also an automatic 5% deduction for late submissions, even without the 10% penalty.",
          "replies": [
            {
              "author": "Eva Mitchell",
              "message": "I'll keep that in mind. Thanks!"
            }
          ]
        }
      ]
    },
    {
      "title": "When is the next class session?",
      "author": "Michael Turner",
      "description": "I need to confirm the timing for the next class. Can anyone help?",
      "replies": [
        {
          "author": "Sarah Lewis",
          "message": "It’s scheduled for Monday at 2 PM.",
          "replies": [
            {
              "author": "Michael Turner",
              "message": "Thanks, Sarah! Is it in the same room as last time?",
              "replies": [
                {
                  "author": "Robert Scott",
                  "message": "Yes, same room, 101."
                }
              ]
            }
          ]
        },
        {
          "author": "Daniel Wilson",
          "message": "Don't forget, there’s also a guest lecture next week, and it starts at 3:30 PM.",
          "replies": [
            {
              "author": "Michael Turner",
              "message": "I almost forgot about that! Thanks for the reminder."
            }
          ]
        }
      ]
    },
    {
      "title": "Can we review for the final exam in class?",
      "author": "Samantha Clark",
      "description": "Will we be reviewing for the final exam in class before it starts?",
      "replies": [
        {
          "author": "Olivia Harris",
          "message": "Yes, there will be a review session this Friday in class.",
          "replies": [
            {
              "author": "Samantha Clark",
              "message": "Perfect, I’ll make sure to attend."
            }
          ]
        },
        {
          "author": "Liam Martinez",
          "message": "There’s also an online review session available if you can’t make it to class.",
          "replies": [
            {
              "author": "Samantha Clark",
              "message": "That sounds great, thanks for the info!"
            }
          ]
        }
      ]
    }
  ]
}

const fetchQuestions = async (classCode) => {
  try {
    const questionsRef = collection(db, "classes", classCode, "questions");
    const snapshot = await getDocs(questionsRef);
    const questions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return questions;
  } catch (error) {
    console.error("Error fetching questions:", error);
    return [];
  }
};

// Button component that displays the class code
const ClassCodeButton = ({ code }) => {
  return (
      <button className="Classes-class-code-button">{code}</button>
  );
}

// Reply component that contains a reply and all replies to that reply
const Reply = ({ reply, level = 0 }) => {
  return (
    <div style={{ marginLeft: `${level * 20}px`, borderLeft: "3px solid black", paddingLeft: "10px", marginTop: "10px" }}>
      <p style={{fontSize:"20px"}}><h5>{reply.author}:</h5> {reply.message}</p>
      {reply.replies && reply.replies.length > 0 && (
        <div>
          {reply.replies.map((nestedReply, index) => (
            <Reply key={index} reply={nestedReply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// Question component that contains a question and all replies to that question
const ClassQuestion = ({ question }) => {
  return (
    <div className="Classes-question">
      <h2 className="Classes-question-title">{question.author}: {question.description}</h2>
      <div className='Classes-reply-container'>
        {question.replies.map((reply, index) => (
          <Reply key={index} reply={reply} />
        ))}
      </div>
    </div>
  );
};

// Forum container for each class that maps all questions from a class into this forum container
const ClassForum = ({questionsContainer, classCode}) => {
  const ClassQuestions = questionsContainer.questions;

  return (
    <div className="Classes-class-forum">
        <h2 className='Classes-class-forum-title1'>{classCode}</h2>
        {ClassQuestions.map((question, index) => (
            <ClassQuestion question={question} key={index}/>
          ))}

    </div>
  )


}

// Main component
const Classes = () => {
  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await fetchQuestions("CSC312"); // Replace with the selected class code
      console.log(questions); // Later, we will set this to state
    };
    loadQuestions();
  }, []);
  
  useEffect(() => {
    const loadQuestions = async () => {
      const questions = await fetchQuestions("CSC312"); // Replace with the selected class code
      console.log(questions); // Later, we will set this to state
    };
    loadQuestions();
  }, []);
  
  return (
    <>
      <Navbar />
      <div className="Classes-outer-container">
        <div className='Classes-inner-container'>
          <div className="Classes-class-codes-container">
            <ClassCodeButton code="CSC 101" />
            <ClassCodeButton code="CSC 102" />
            
          </div>
          <div className="Classes-questions-container">
            <ClassForum questionsContainer={dummyData} classCode={"CSC 101"}/>
      <div className="Classes-outer-container">
        <div className='Classes-inner-container'>
          <div className="Classes-class-codes-container">
            <ClassCodeButton code="CSC 101" />
            <ClassCodeButton code="CSC 102" />
            
          </div>
          <div className="Classes-questions-container">
            <ClassForum questionsContainer={dummyData} classCode={"CSC 101"}/>
          </div>
          {/* Button to add additional classes */}
          <button className='Classes-popup-add-questions' > x </button>

        </div>
          {/* Button to add additional classes */}
          <button className='Classes-popup-add-questions' > x </button>

        </div>
      </div>
    </>
  );
};

export default Classes;

