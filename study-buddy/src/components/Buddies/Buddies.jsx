import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import "./Buddies.css"; 
import StudyTimeIcon from './iconbuddy/StudyTime.png';
import StudyEnivrIcon from "./iconbuddy/studyEnvir.png";
import StyleIcon from './iconbuddy/style.png';
import TypeLearnerIcon from './iconbuddy/TypeLearner.png';
import CourseStudyIcon from './iconbuddy/CourseStudy.png';
import InterestIcon from './iconbuddy/SchoolInterest.png';
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
import { getDownloadURL, getStorage, listAll, ref , uploadBytes} from "firebase/storage";

const preferenceIconMap = {
    "Preferred Study Time": StudyTimeIcon,
    "Study Environment": StudyEnivrIcon,
    "Collaboration Style": StyleIcon,
    "Type of Learner": TypeLearnerIcon,
    "Courses to Study": CourseStudyIcon,
    "School Interests": InterestIcon
};

// Function to send a buddy request
const sendBuddyRequest = async (userId, suggestedBuddyId) => {
  try{
    const userInfo = doc(db, "users", userId);
    const suggestedBuddyInfo = doc(db, "users", suggestedBuddyId);

    const userDocSnapshot = await getDoc(userInfo);  
    const suggestedBuddyDocSnapshot = await getDoc(suggestedBuddyInfo);

    if (!userDocSnapshot.exists() || !suggestedBuddyDocSnapshot.exists()) {
      console.log("No such document");
      return;
    }

    if (userDocSnapshot.data().buddyRequestsSent.includes(suggestedBuddyId) || suggestedBuddyDocSnapshot.data().buddyRequests.includes(userId)) {
      console.log("Request already sent to this user.");
      return;
    }
    await updateDoc(userInfo, {buddyRequestsSent: arrayUnion(suggestedBuddyId)});
    await updateDoc(suggestedBuddyInfo, {buddyRequests: arrayUnion(userId)});
    console.log("Buddy request sent successfully!");

  }
  catch (error) {
    console.error("Error sending request:", error);
  }

}

const testFunction = (userId, suggestedBuddyId) => {
  console.log(`User ID:${userId}`);
  console.log(`Suggested Buddy ID:${suggestedBuddyId}`);
}







// Function to get user information from Firestore
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

// Function to get user buddies from Firestore
const getUserRecommendations = async (userHash) => {  
  try {
      const userInfo = await getUserInfo(userHash);
      const buddySuggestions = userInfo.buddySuggestions || [];

      const buddySuggestionsPromises = []
      const buddyPromises = buddySuggestions.map(async (buddyId) => {
          const buddyInfo = await getUserInfo(buddyId);
          return buddyInfo;
      });
      const suggestions = await Promise.all(buddyPromises);
      return suggestions;
    } 
    
   catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

// Function to generate buddy preferences dynamically
const generateBuddyPreferences = (suggestedUsers) => {
  const buddyPreferences = suggestedUsers.reduce((acc, user) => {
    const fullName = `${user.firstName} ${user.lastName}`;

    // Create the preference structure for each user dynamically
    acc[fullName] = {
      school: user.school || "Unknown School",
      major: user.major || "Undeclared", 
      studyTime: user.studyTimes?.[0] || ["Anytime"],
      environment: user.studyEnvironment?.[0] || ["Any"],
      collaboration: user.collaborationStyles?.[0] || ["Group Study"],
      typeLearner: user.learnTypes?.[0] || ["Visual Learner"], 
      preferredCourses: user.courses || ["Science", "Math", "Literature", "History"],
      schoolInterests: user.interests || ["Studying"],
      userId: user.id || "Unknown",
      profilePicture: user.profilePicture || "https://firebasestorage.googleapis.com/v0/b/egr302-study-buddy.firebasestorage.app/o/default.jpg?alt=media&token=04fa121f-af34-4a53-a0ac-548679302791"
    };

    return acc;
  }, {});

  return buddyPreferences;
};


const Buddies = () => {
  const [buddies, setBuddies] = useState([]);
  const [activeBuddy, setActiveBuddy] = useState("");
  const [sentRequests, setSentRequests] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  
  useEffect(() => {
          // Check if the user is stored in localStorage
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            throw new Error("Failed to load user data from localStorage");
          }


          const user = JSON.parse(storedUser);
          const userId = user.uid;
          setCurrentUserId(userId);

          const callGetUserRecommendations = async () => {
            try {
              const recommendations = await getUserRecommendations(userId);
              const buddyPreferences12 = generateBuddyPreferences(recommendations);
              setUserRecommendations(buddyPreferences12);
              setLoading(false);

              const buddies = recommendations.map((buddy) => `${buddy.firstName} ${buddy.lastName}`);
              setBuddies(buddies);
              if (buddies.length > 0) {
                setActiveBuddy(buddies[0]); // Set the first buddy as the active one
              }
             
            } catch (error) {
              console.error("Error fetching recommendations:", error);
            }
          }
          callGetUserRecommendations();
        }, []);
    



    const handleSendRequest = () => {
        setSentRequests(prev => ({
            ...prev,
            [activeBuddy]: true
        }));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    if (loading) {
      return (
        <>
          <Navbar />
          <div>Loading...</div>;
        </>
      )
      
  }
  if (!buddies.length) {
    return (
      <>
        <Navbar />
        <div className="no-buddies-message">Add some courses in your profile to get started!</div>
      </>
    )
  }

  const buddyPref = userRecommendations[activeBuddy];

    return (
        <>
            <Navbar />

            {/* Sidebar Toggle Button */}
            <button className="buddy-menu-button" onClick={toggleSidebar}>
                {sidebarOpen ? "✖" : "☰"}
            </button>

            {/* Sidebar - Buddy List */}
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
                {/* Profile Header */}
                <div className="profile-section">
                    <div className="profile-header">
                        <div className="profile-avatar">
                          <img src={buddyPref.profilePicture}/>
                        </div>
                        <div className="profile-info">
                            <h1 className="profile-name">{activeBuddy}</h1>
                            <h3 className="profile-school">{buddyPref.school}</h3>
                            <h4 className="profile-major">{buddyPref.major}</h4>
                        </div>
                    </div>

                    {/* Send Buddy Request Button */}
                    <button className="send-request-btn" onClick={() => sendBuddyRequest(currentUserId, buddyPref.userId)}>
                        {sentRequests[activeBuddy] ? "Request Sent" : "Send Buddy Request"}
                    </button>
                </div>

                {/* Study Preferences Section */}
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
        <ul>
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
        <ul>
          {courses.map((course, index) => (
            <li key={index}>{course}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  

export default Buddies;