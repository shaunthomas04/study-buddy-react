import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar';
import "./Buddies.css";

const Buddies = () => {
    const [buddies] = useState(["Jane Doe", "Buddy 2", "Buddy 3", "Buddy 4", "Buddy 5"]);
    const [activeBuddy, setActiveBuddy] = useState("Jane Doe"); 
    const [requestSent, setRequestSent] = useState(false);

    // Define Buddies' Study Preferences
    const buddyPreferences = {
        "Jane Doe": {
            school: "California Baptist University",
            major: "Mechanical Engineering",
            studyTime: "Morning",
            environment: "Coffee Shop",
            collaboration: "Solo Study",
            typeLearner: "Auditory Learner",
            preferredCourses: ["Cybersecurity", "Data Science"],
            schoolInterests: ["Machine Learning", "Cybersecurity"]
        },
        "Buddy 2": {
            school: "California Baptist University",
            major: "Computer Science",
            studyTime: "Evening",
            environment: "Library",
            collaboration: "Group Study",
            typeLearner: "Visual Learner",
            preferredCourses: ["Algorithms", "Artificial Intelligence"],
            schoolInterests: ["Software Development", "Game Design"]
        },
        "Buddy 3": {
            school: "California Baptist University",
            major: "Biomedical Engineering",
            studyTime: "Afternoon",
            environment: "Home Office",
            collaboration: "Pair Programming",
            typeLearner: "Kinesthetic Learner",
            preferredCourses: ["Networking", "Machine Learning"],
            schoolInterests: ["Cybersecurity", "Cloud Computing"]
        },
        "Buddy 4": {
            school: "California Baptist University",
            major: "Software Engineering",
            studyTime: "Night",
            environment: "Dorm Room",
            collaboration: "Solo Study",
            typeLearner: "Reading/Writing",
            preferredCourses: ["Ethical Hacking", "Cybersecurity"],
            schoolInterests: ["Ethical Hacking", "Data Privacy"]
        },
        "Buddy 5": {
            school: "California Baptist University",
            major: "Civil Engineering",
            studyTime: "Morning",
            environment: "Library",
            collaboration: "Group Study",
            typeLearner: "Visual Learner",
            preferredCourses: ["Software Engineering", "Databases"],
            schoolInterests: ["Software Engineering", "AI"]
        }
    };

    // Get selected buddy’s preferences
    const buddyPref = buddyPreferences[activeBuddy];

    const handleSendRequest = () => {
        setRequestSent(true);
    };

    return (
        <>
            <Navbar />
            <div className="buddy-container">
                {/* Sidebar - Buddy List */}
                <aside className="buddy-sidebar">
                    <h2>Find Buddies</h2>
                    <ul>
                        {buddies.map((buddy, index) => (
                            <li 
                                key={index} 
                                className={activeBuddy === buddy ? "buddy-active" : ""}
                                onClick={() => setActiveBuddy(buddy)}
                            >
                                {buddy}
                            </li>
                        ))}
                    </ul>
                </aside>

                <div className="buddy-main">
                    {/* Profile Header Bar Across the Page */}
                    <div className="profile-section">
                        <div className="profile-header">
                            <div className="profile-avatar"></div>
                            <div className="profile-info">
                                <h1 className="profile-name">{activeBuddy}</h1>
                                <h3 className="profile-school">{buddyPref.school}</h3>
                                <h4 className="profile-major">{buddyPref.major}</h4> 
                            </div>
                        </div>

                        {/* ✅ Send Buddy Request Button (Fixed size & positioned to the right) */}
                        <button className="send-request-btn" onClick={handleSendRequest}>
                            {requestSent ? "Request Sent" : "Send Buddy Request"}
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
            </div>
        </>
    );
};

const PreferenceCard = ({ title, value }) => {
    return (
        <div className="preference-card">
            <h4>{title}</h4>
            <p>{value}</p>
        </div>
    );
};

const CourseList = ({ title, courses }) => {
    return (
        <div className="preference-card">
            <h4>{title}</h4>
            <ul>
                {courses.map((course, index) => (
                    <li key={index}>{course}</li>
                ))}
            </ul>
        </div>
    );
};

export default Buddies;
