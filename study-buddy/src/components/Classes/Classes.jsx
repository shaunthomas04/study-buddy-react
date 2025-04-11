import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Classes.css';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, getDate, set } from "date-fns";
import { useEffect } from 'react';
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
import Loading from '../Loading/Loading.jsx';


// get user info from firebase
const getUserInfo = async (userHash) => {  
  try {
    const userInfo = doc(db, "users", userHash.trim());
    const docSnapshot = await getDoc(userInfo);  
    if (docSnapshot.exists()) {
      return docSnapshot.data();  
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

// Function to upload a question to a class
const uploadQuestion = async (className, question) => {
  try {
    const classRef = doc(db, "forums", className.trim());
    const classDoc = await getDoc(classRef);

    if (classDoc.exists()) {
      await updateDoc(classRef, {
        questions: arrayUnion(question),
      });
    } else {
      console.log("Class document does not exist.");
    }
  } catch (error) {
    console.error("Error uploading question:", error);
  }
}


// React component for the classes page
const Classes = () => {
  const [activeClass, setActiveClass] = useState(null);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Function to handle the post submission and creation of a new post
  const handlePost = async () => {
    if (subject.trim() === '' || details.trim() === '') return;

    const newPost = {
      id: Date.now(),
      subject,
      text: details,
      timestamp: new Date(),
      replies: [],
    };

    setForumsData((prev) => ({
      ...prev,
      [activeClass]: [...prev[activeClass], newPost],
    }));

    await uploadQuestion(activeClass, newPost);

    setSubject('');
    setDetails('');
  };

  const toggleReplyInput = (id) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReplyChange = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleReplySubmit = (parentId) => {
    const replyText = replyInputs[parentId]?.trim();
    if (!replyText) return;

    const addReply = (items) => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [
              ...item.replies,
              {
                id: Date.now(),
                text: replyText,
                timestamp: new Date(),
                replies: [],
              },
            ],
          };
        } else if (item.replies.length > 0) {
          return {
            ...item,
            replies: addReply(item.replies),
          };
        }
        return item;
      });
    };

    setForumsData((prev) => ({
      ...prev,
      [activeClass]: addReply(prev[activeClass]),
    }));

    setReplyInputs((prev) => ({ ...prev, [parentId]: '' }));
    setShowReplyInput((prev) => ({ ...prev, [parentId]: false }));
  };

// time stamop format
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

// render replies not actually create them, takes in the replies and depth of the reply
// replies contains the replies and text is the body
// id, text, timestamp, replies, user, profilePicture
  const renderReplies = (replies, depth = 1) => {
    return replies.map((reply) => (
      <div key={reply.id} className="reply" style={{ marginLeft: depth * 20 }}>
        <div className="reply-header">
          <span className="reply-text">→ {reply.text}</span>
          <span className="timestamp">{formatTimestamp(reply.timestamp)}</span>
        </div>
        <button className="reply-button" onClick={() => toggleReplyInput(reply.id)}>
          Reply
        </button>
        {showReplyInput[reply.id] && (
          <div className="reply-section-row">
            <input
              type="text"
              placeholder="Write a reply..."
              value={replyInputs[reply.id] || ''}
              onChange={(e) => handleReplyChange(reply.id, e.target.value)}
            />
            <button className="submit-reply" onClick={() => handleReplySubmit(reply.id)}>
              Post
            </button>
          </div>
        )}
        {renderReplies(reply.replies, depth + 1)}
      </div>
    ));
  };


const [courses, setUserCourses] = useState([]);
const [name, setUserName] = useState(null);
const [profilePicture, setProfilePicture] = useState("https://firebasestorage.googleapis.com/v0/b/egr302-study-buddy.firebasestorage.app/o/default.jpg?alt=media&token=04fa121f-af34-4a53-a0ac-548679302791");
const [loading, setLoading] = useState(true);
const [forumsData, setForumsData] = useState(null);
const [forumsLoading, setForumsLoading] = useState(true);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }
    const user = JSON.parse(storedUser);
    const userID = user.uid;

    const callingGetUserInfo = async () => 
      {
        const userInfo = await getUserInfo(userID);
        const userCourses = userInfo.courses;
        const userName = `${userInfo.firstName} ${userInfo.lastName}`;
        const profilePicture = userInfo.profilePicture;

        setUserCourses(userCourses);
        setUserName(userName);
        setProfilePicture(profilePicture);
        setActiveClass(userCourses[0]);
        setLoading(false);
      }


    callingGetUserInfo();

  }, []);

  useEffect(() => {
    if (!courses || courses.length === 0) return;
  
    const unsubscribes = [];
    const loadedCourses = new Set();
  
    courses.forEach((course) => {
      const classRef = doc(db, 'forums', course.trim());
  
      const unsubscribe = onSnapshot(classRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          setForumsData((prev) => ({
            ...prev,
            [course]: docSnapshot.data().questions,
          }));
        } else {
          console.log(`No document found for course: ${course}`);
          setForumsData((prev) => ({
            ...prev,
            [course]: [],
          }));
        }
  
        // Mark this course as loaded
        loadedCourses.add(course);
  
        // If all courses have been loaded, stop loading
        if (loadedCourses.size === courses.length) {
          setForumsLoading(false);
        }
      });
  
      unsubscribes.push(unsubscribe);
    });
  
    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [courses]);


  if (loading || forumsLoading) {
    return <Loading/> ;
  }

  // console.log("Forums Data:", forumsData); // Log the forums data to check its structure
  // console.log("Courses:", courses); // Log the courses to check their values
  // console.log(forumsData["CSC312"])

  return (
    <>
      {/* Sidebar content */}
      <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </div>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2>Classes</h2>
        <ul>
          {courses.map((cls) => (
            <li
              key={cls}
              className={`sidebar-item ${activeClass === cls ? 'active' : ''}`}
              onClick={() => {
                setActiveClass(cls);
                setSidebarOpen(false);
              }}
            >
              {cls}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <Navbar />

      {/* Container for welcome info of class */}
      <div className="classes-container">
        <div className="scrollable-box">
          <h1>{activeClass}</h1>
          <p className="welcome-text">
            Hello! Welcome to the {activeClass} Discussion Post. <br />
            Feel free to post any questions you have for the class.
          </p>

          {/* Container to post input */}
          <div className="post-input">
            <input
              type="text"
              className="post-subject-input"
              placeholder="Enter subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <textarea
              className="post-details-textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Type your question details here..."
            />
            <button onClick={handlePost} disabled={!subject.trim() || !details.trim()}>
              Post
            </button>
          </div>

          {/* Container that holds all of the posts */}
          {/* Subject is the title, text is the body, replies holds the replies, id is used for something */}
          <div className="discussion-posts">

            {/* Functio that maps info to a class div wich is a question */}
            {[...forumsData[activeClass]].reverse().map((post) => (
              <div key={post.id} className="post">
                <div className="post-text">
                  <div className="post-header">
                    <div className="post-subject">{post.subject}</div>
                    <span className="timestamp">{formatTimestamp(post.timestamp)}</span>
                  </div>
                  <p>{post.text}</p>
                  <button className="reply-button" onClick={() => toggleReplyInput(post.id)}>
                    Reply
                  </button>

                  {showReplyInput[post.id] && (
                    <div className="reply-section-row">
                      <input
                        type="text"
                        placeholder="Write a reply..."
                        value={replyInputs[post.id] || ''}
                        onChange={(e) => handleReplyChange(post.id, e.target.value)}
                      />
                      <button
                        className="submit-reply"
                        onClick={() => handleReplySubmit(post.id)}
                      >
                        Post
                      </button>
                    </div>
                  )}

                  {renderReplies(post.replies)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Classes;