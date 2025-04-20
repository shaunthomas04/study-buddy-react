import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Classes.css';
import { startOfMonth, endOfMonth, eachDayOfInterval, getDay, format, getDate, set } from "date-fns";
import { useEffect } from 'react';
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
// import Loading from '../Loading/Loading.jsx';
// import Redirect from '../Redirect/Redirect.jsx';
// // import { Filter } from 'bad-words'
// import { RegExpMatcher, TextCensor, englishDataset, englishRecommendedTransformers} from 'obscenity';

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
    } 
    else {
      // If the class document doesn't exist, create it with the question
      await setDoc(classRef, {
        questions: [question],
        trendingTopic: null 
      });
      console.log("Class document does not exist.");
    }
  } catch (error) {
    console.error("Error uploading question:", error);
  }
}

// Function to upload a reply to a question in a class
const uploadReply = async (className, parentId, replyObj) => {
  try {
    const classRef = doc(db, "forums", className.trim());
    const classDoc = await getDoc(classRef);

    if (classDoc.exists()) {
      const currentData = classDoc.data().questions;

      const addReply = (items) => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              replies: [...item.replies, replyObj],
            };
          } else if (item.replies?.length > 0) {
            return {
              ...item,
              replies: addReply(item.replies),
            };
          }
          return item;
        });
      };

      const updatedQuestions = addReply(currentData);

      await updateDoc(classRef, {
        questions: updatedQuestions,
      });

      console.log("Reply uploaded to Firebase");
    } else {
      console.log("Class document does not exist.");
    }
  } catch (error) {
    console.error("Error uploading reply:", error);
  }
};

// Function to get the current date and time
const getCurrentDateTime = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();  
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; 

  return `${month}/${day} ${hours}:${minutes}${ampm}`;
};


// React component for the classes page
const Classes = () => {
  const [activeClass, setActiveClass] = useState(null);
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [replyInputs, setReplyInputs] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const filter = new Filter();
  // Custom filtered out bad words
  filter.addWords(
    'FUBAR', 
    'SNAFU', 
    'POS', 
    'WTF', 
    'BS', 
    'GTFO', 
    'LMAO', 
    'FML', 
    'IDGAF'
);
  const matcher = new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
  });

  // Function to handle the post submission and creation of a new post
  const handlePost = async () => {
    if (subject.trim() === '' || details.trim() === '') return;

    const newPost = {
      id: Date.now(),
      subject,
      text: details,
      timestamp: getCurrentDateTime(),
      replies: [],
      user: name,
      profilePicture: profilePicture
    };

    // Check for profanity using the filter and matcher
    if (filter.isProfane(subject) || filter.isProfane(details) || matcher.hasMatch(subject) || matcher.hasMatch(details)) {
      alert("Please avoid using inappropriate language.");
    }
    else {
    setForumsData((prev) => ({
      ...prev,
      [activeClass]: [...prev[activeClass], newPost],
    }));

    await uploadQuestion(activeClass, newPost);

  }

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

  const handleReplySubmit = async (parentId) => {
    const replyText = replyInputs[parentId]?.trim();
    if (!replyText) return;
  
    const newReply = {
      id: Date.now(),
      text: replyText,
      timestamp: getCurrentDateTime(),
      replies: [],
      user: name,
      profilePicture: profilePicture,
    };
  
    const addReply = (items) => {
      return items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            replies: [...item.replies, newReply],
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
  
    // Update frontend state
    setForumsData((prev) => ({
      ...prev,
      [activeClass]: addReply(prev[activeClass]),
    }));
  
    // Upload reply to Firestore
    await uploadReply(activeClass, parentId, newReply);
  
    setReplyInputs((prev) => ({ ...prev, [parentId]: "" }));
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

          <div className="post-header-row">
            <div className="user-info">
              <img src={reply.profilePicture} alt="Profile" className="profile-picture" /> 
              <span className="user-name">{reply.user}</span>
            </div>
            <span className="timestamp">{reply.timestamp}</span>
          </div>

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
  if (courses.length === 0) {
    return <Redirect />
  }



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

          {Array.isArray(forumsData[activeClass]) && forumsData[activeClass].length > 0 ? (
              [...forumsData[activeClass]].reverse().map((post) => (
                <div key={post.id} className="post">
                  <div className="post-text">
                    <div className="post-header">
                      <div className="post-subject">{post.subject}</div>
                      <>
                        <div className="post-header-row">
                          <div className="user-info">
                            <img src={post.profilePicture} alt="Profile" className="profile-picture" /> 
                            <span className="user-name">{post.user}</span>
                          </div>
                          <span className="timestamp">{post.timestamp}</span>
                        </div>
                          
                      </>


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
              ))
            ) : (
              <p className="no-posts">No questions yet. Be the first to post!</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Classes;