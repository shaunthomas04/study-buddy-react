import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import "./Buddies.css"; 
import StudyTimeIcon from './iconbuddy/StudyTime.png';
import StudyEnivrIcon from "./iconbuddy/studyEnvir.png";
import StyleIcon from './iconbuddy/style.png';
import TypeLearnerIcon from './iconbuddy/TypeLearner.png';
import CourseStudyIcon from './iconbuddy/CourseStudy.png';
import InterestIcon from './iconbuddy/SchoolInterest.png';
import { db } from "../../firebase.js"; 
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Loading from '../Loading/Loading.jsx';
import Redirect from '../Redirect/Redirect.jsx';
// ignore this error don't know why it is showing up when it works
import { sendRequestAlert } from '../Email/Email.js';


const preferenceIconMap = {
  "Preferred Study Time": StudyTimeIcon,
  "Study Environment": StudyEnivrIcon,
  "Collaboration Style": StyleIcon,
  "Type of Learner": TypeLearnerIcon,
  "Courses to Study": CourseStudyIcon,
  "School Interests": InterestIcon
};

const sendBuddyRequest = async (userId, suggestedBuddyId) => {
  try {
    const userInfo = doc(db, "users", userId);
    const suggestedBuddyInfo = doc(db, "users", suggestedBuddyId);

    const userDocSnapshot = await getDoc(userInfo);  
    const suggestedBuddyDocSnapshot = await getDoc(suggestedBuddyInfo);

    if (!userDocSnapshot.exists() || !suggestedBuddyDocSnapshot.exists()) return false;

    if (
      userDocSnapshot.data().buddyRequestsSent?.includes(suggestedBuddyId) ||
      suggestedBuddyDocSnapshot.data().buddyRequests?.includes(userId)
    ) {
      console.log("Request already sent to this user.");
      return false;
    }

    // Send email notification
    const userName = `${userDocSnapshot.data().firstName} ${userDocSnapshot.data().lastName}`;
    const suggestedBuddyName = `${suggestedBuddyDocSnapshot.data().firstName} ${suggestedBuddyDocSnapshot.data().lastName}`;
    const suggestedBuddyEmail = suggestedBuddyDocSnapshot.data().email;
    const message = `${userName} has sent you a buddy request!`;

    await sendRequestAlert(suggestedBuddyName, suggestedBuddyEmail, message);


    // Update Firestore
    await updateDoc(userInfo, { buddyRequestsSent: arrayUnion(suggestedBuddyId) });
    await updateDoc(suggestedBuddyInfo, { buddyRequests: arrayUnion(userId) });

    console.log("Buddy request sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending request:", error);
    return false;
  }
};

const getUserInfo = async (userHash) => {
  try {
    const userInfo = doc(db, "users", userHash.trim());
    const docSnapshot = await getDoc(userInfo);
    return docSnapshot.exists() ? docSnapshot.data() : null;
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

const getUserRecommendations = async (userHash) => {
  try {
    const userInfo = await getUserInfo(userHash);
    const buddySuggestions = userInfo?.buddySuggestions || [];

    const buddyPromises = buddySuggestions.map(async (buddyId) => {
      const buddyInfo = await getUserInfo(buddyId);
      return buddyInfo;
    });

    const suggestions = await Promise.all(buddyPromises);
    return suggestions.filter(Boolean); // Remove nulls
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return [];
  }
};

const generateBuddyPreferences = (suggestedUsers) => {
  const defaultArray = (arr, fallback) => Array.isArray(arr) && arr.length ? arr : [fallback];

  return suggestedUsers.reduce((acc, user) => {
    const fullName = `${user.firstName} ${user.lastName}`;

    acc[fullName] = {
      school: user.school || "Unknown School",
      major: user.major || "Undeclared",
      studyTime: defaultArray(user.studyTimes, "Anytime"),
      environment: defaultArray(user.studyEnvironment, "Any"),
      collaboration: defaultArray(user.collaborationStyles, "Group Study"),
      typeLearner: defaultArray(user.learnTypes, "Visual Learner"),
      preferredCourses: defaultArray(user.courses, "General Studies"),
      schoolInterests: defaultArray(user.interests, "Studying"),
      userId: user.id || "Unknown",
      profilePicture: user.profilePicture || "https://firebasestorage.googleapis.com/v0/b/egr302-study-buddy.firebasestorage.app/o/default.jpg?alt=media&token=04fa121f-af34-4a53-a0ac-548679302791"
    };

    return acc;
  }, {});
};

const Buddies = () => {
  const [buddies, setBuddies] = useState([]);
  const [activeBuddy, setActiveBuddy] = useState("");
  const [sentRequests, setSentRequests] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userRecommendations, setUserRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }

    const user = JSON.parse(storedUser);
    const userId = user.uid;
    setCurrentUserId(userId);

    const callGetUserRecommendations = async () => {
      try {
        const userData = await getUserInfo(userId);
        const recommendations = await getUserRecommendations(userId);
        const buddyPrefs = generateBuddyPreferences(recommendations);
        setUserRecommendations(buddyPrefs);
        setLoading(false);

        const sent = {};
        recommendations.forEach((buddy) => {
          const fullName = `${buddy.firstName} ${buddy.lastName}`;
          if (userData?.buddyRequestsSent?.includes(buddy.id)) {
            sent[fullName] = true;
          }
        });
        setSentRequests(sent);

        const buddiesList = recommendations.map((buddy) => `${buddy.firstName} ${buddy.lastName}`);
        setBuddies(buddiesList);
        if (buddiesList.length > 0) {
          setActiveBuddy(buddiesList[0]);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    callGetUserRecommendations();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!buddies.length) {
    return (
      <Redirect/>
    );
  }

  const buddyPref = userRecommendations[activeBuddy];

  return (
    <>
      <Navbar />

      <aside className={`buddy-sidebar ${sidebarOpen ? "buddy-active" : ""}`}>
        <h2 className="buddy-sidebar-header">Find Buddies</h2>
        <ul>
          {buddies.map((buddy, index) => (
            <li 
              key={index} 
              className={activeBuddy === buddy ? "buddy-selected" : ""}
              onClick={() => setActiveBuddy(buddy)}
            >
              {buddy}
            </li>
          ))}
        </ul>
      </aside>

      <div className={`buddy-container ${sidebarOpen ? "shifted" : ""}`}>
        <div className="profile-section">
          <div className="profile-header">
            <div className="profile-avatar">
              <img src={buddyPref.profilePicture} alt="Profile" />
            </div>
            <div className="profile-info">
              <h1 className="profile-name">{activeBuddy}</h1>
              <h3 className="profile-school">{buddyPref.school}</h3>
              <h4 className="profile-major">{buddyPref.major}</h4>
            </div>
          </div>

          <button
            className="send-request-btn"
            disabled={sentRequests[activeBuddy]}
            onClick={async () => {
              const success = await sendBuddyRequest(currentUserId, buddyPref.userId);
              if (success) {
                setSentRequests(prev => ({
                  ...prev,
                  [activeBuddy]: true
                }));
              }
            }}
          >
            {sentRequests[activeBuddy] ? "Request Sent" : "Send Buddy Request"}
          </button>
        </div>

        <main className="buddy-profile-content">
          <div className="preference-grid">
            <PreferenceCard title="Preferred Study Time" value={buddyPref.studyTime} />
            <PreferenceCard title="Study Environment" value={buddyPref.environment} />
            <PreferenceCard title="Collaboration Style" value={buddyPref.collaboration} />
            <PreferenceCard title="Type of Learner" value={buddyPref.typeLearner} />
            <CourseList title="Courses to Study" courses={buddyPref.preferredCourses} />
            <CourseList title="School Interests" courses={buddyPref.schoolInterests} />
          </div>
        </main>
      </div>
    </>
  );
};

const PreferenceCard = ({ title, value }) => {
  const icon = preferenceIconMap[title];

  return (
    <div className="preference-card">
      <h4 className="preference-heading">
        {icon && <img src={icon} alt={`${title} icon`} className="preference-icon" />}
        {title}
      </h4>
      {Array.isArray(value) ? (
        <ul className="hidden-scroll">
          {value.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
};

const CourseList = ({ title, courses }) => {
  const icon = preferenceIconMap[title]; 

  return (
    <div className="preference-card course-list">
      <h4 className="preference-heading">
        {icon && <img src={icon} alt={`${title} icon`} className="preference-icon" />}
        {title}
      </h4>
      <ul className="hidden-scroll">
        {courses.map((course, index) => (
          <li key={index}>{course}</li>
        ))}
      </ul>
    </div>
  );
};

export default Buddies;
