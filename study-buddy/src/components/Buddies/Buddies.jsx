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

const Buddies = () => {
  const [buddies, setBuddies] = useState([]);
  const [activeBuddy, setActiveBuddy] = useState("Jane Doe");
  const [sentRequests, setSentRequests] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRecommendations, setUserRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
          // Check if the user is stored in localStorage
          const storedUser = localStorage.getItem("user");
          if (!storedUser) {
            throw new Error("Failed to load user data from localStorage");
          }


          const user = JSON.parse(storedUser);
          const userId = user.uid;

          const callGetUserRecommendations = async () => {
            try {
              const recommendations = await getUserRecommendations(userId);
              setUserRecommendations(recommendations);
              setLoading(false);

              const buddies = recommendations.map((buddy) => `${buddy.firstName} ${buddy.lastName}`);
              setBuddies(buddies);

            } catch (error) {
              console.error("Error fetching recommendations:", error);
            }
          }
          callGetUserRecommendations();
        }, []);
    



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

    if (loading) {
      return <div>Loading...</div>;
  }

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
                            <h3 className="profile-school">{"testing"}</h3>
                            <h4 className="profile-major">{"testing"}</h4>
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
                        <PreferenceCard title="Preferred Study Time" value={"testing"} />
                        <PreferenceCard title="Study Environment" value={"testing"} />
                        <PreferenceCard title="Collaboration Style" value={"testing"} />
                        <PreferenceCard title="Type of Learner" value={"testing"} />
                        <CourseList title="Courses to Study" courses={["testing", "testing"]} />
                        <CourseList title="School Interests" courses={["testing", "testing"]} />
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