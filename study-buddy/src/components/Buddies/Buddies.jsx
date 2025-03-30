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

const preferenceIconMap = {
    "Preferred Study Time": StudyTimeIcon,
    "Study Environment": StudyEnivrIcon,
    "Collaboration Style": StyleIcon,
    "Type of Learner": TypeLearnerIcon,
    "Courses to Study": CourseStudyIcon,
    "School Interests": InterestIcon
};

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
  
  const generateBuddyPreferences = (suggestedUsers) => {
    const buddyPreferences = suggestedUsers.reduce((acc, user) => {
      const fullName = `${user.firstName} ${user.lastName}`;
  
      // Create the preference structure for each user dynamically
      acc[fullName] = {
        school: user.school || "Unknown School",
        major: user.major || "Undeclared", 
        studyTime: user.studyTimes?.[0] || "Anytime",
        environment: user.studyEnvironment?.[0] || "Any",
        collaboration: user.collaborationStyles?.[0] || "Group Study",
        typeLearner: user.learnTypes?.[0] || "Visual Learner", 
        preferredCourses: user.courses || [],
        schoolInterests: user.interests || []
      };
  
      return acc;
    }, {});
  
    return buddyPreferences;
  };
    
const Buddies = () => {

    const [suggestedUsers, setSuggestedUsers] = useState([]);
    // Check if the user is logged in and redirect if not
    useEffect(() => {
          // Check if the user is stored in localStorage
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            throw new Error("Failed to load user data from localStorage");
          }

          const user = JSON.parse(storedUser);
          const userId = user.uid;
          const suggestedUsersInfo = []

        //   Fetch all suggested buddies for the logged-in user
          const fetchUserInfo = async () => {
            const userInfo = await getUserInfo(userId);
            const buddySuggestions = userInfo.buddySuggestions || [];

            const buddyPromises = buddySuggestions.map(async (buddyId) => {
                const buddyInfo = await getUserInfo(buddyId);
                if (buddyInfo) {
                    suggestedUsersInfo.push(buddyInfo);
                }
            });
            await Promise.all(buddyPromises);
            setSuggestedUsers(suggestedUsersInfo);

          }
            fetchUserInfo();
        

        },[]);
    
    // const [buddies] = useState(["Jane Doe", "John Smith", "Taylor Smith", "Alice John", "Bob Anderson"]);
    const buddies = suggestedUsers.map(user => `${user.firstName} ${user.lastName}`);


    // const [activeBuddy, setActiveBuddy] = useState(buddies[0] || ""); // Default to the first buddy or empty string if none
    const [activeBuddy, setActiveBuddy] = useState("Jane Doe" )
    const [sentRequests, setSentRequests] = useState({});
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const buddyPreferences1 = generateBuddyPreferences(suggestedUsers);

    const buddyPreferences = {
        "Jane Doe": {
            school: "California Baptist University",
            major: "Mechanical Engineering",
            studyTime: "Morning",
            environment: "Coffee Shop",
            collaboration: "One-on-One Study",
            typeLearner: "Auditory Learner",
            preferredCourses: ["Circuits II", "Fluid Mechanics"],
            schoolInterests: ["ASME", "Intramural Sports"]
        },
        "John Smith": {
            school: "California Baptist University",
            major: "Computer Science",
            studyTime: "Evening",
            environment: "Library",
            collaboration: "Group Study",
            typeLearner: "Visual Learner",
            preferredCourses: ["Algorithms", "Artificial Intelligence"],
            schoolInterests: ["ACM", "Game Design and Video Games"]
        },
        "Taylor Smith": {
            school: "California Baptist University",
            major: "Biomedical Engineering",
            studyTime: "Afternoon",
            environment: "Empty Classroom",
            collaboration: "Group Discussion",
            typeLearner: "Kinesthetic Learner",
            preferredCourses: ["Biomaterials I", "Machine Learning", "Strength of Materials"],
            schoolInterests: ["BMES", "Basketball Games", "Crochet Club"]
        },
        "Alice John": {
            school: "California Baptist University",
            major: "Software Engineering",
            studyTime: "Night",
            environment: "Dorm Room",
            collaboration: "Group Study",
            typeLearner: "Pair Programming",
            preferredCourses: ["Machine Learning", "Information Security"],
            schoolInterests: ["SWE", "Cruize at CBU", "Competitive Soccer"]
        },
        "Bob Anderson": {
            school: "California Baptist University",
            major: "Civil Engineering",
            studyTime: "Morning",
            environment: "Library",
            collaboration: "Group Study",
            typeLearner: "Visual Learner",
            preferredCourses: ["Fluid Mechanics", "Hydrology", "Structural Design II"],
            schoolInterests: ["Disney Club", "Lacrosse Club"]
        }
    };

    // console.log(buddyPreferences1);
    // console.log(buddyPreferences);

    const buddyPref = buddyPreferences[activeBuddy];

    const handleSendRequest = () => {
        setSentRequests(prev => ({
            ...prev,
            [activeBuddy]: true
        }));
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

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
                        <div className="profile-avatar"></div>
                        <div className="profile-info">
                            <h1 className="profile-name">{activeBuddy}</h1>
                            <h3 className="profile-school">{buddyPref.school}</h3>
                            <h4 className="profile-major">{buddyPref.major}</h4>
                        </div>
                    </div>

                    {/* Send Buddy Request Button */}
                    <button className="send-request-btn" onClick={handleSendRequest}>
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
        <p>{value}</p>
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
