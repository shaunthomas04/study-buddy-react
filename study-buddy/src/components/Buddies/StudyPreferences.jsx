import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import './Buddies.css' //Imports the Buddies style sheet - includes added study preferences code


const StudyPreferences = () => {
    const [preferences, setPreferences] = useState ({
        studyTime: 'Evening',
        enviroment: 'Quiet Libary',
        collaboration: 'Group Study',
        typeLearner : 'Visual Learner',
        preferredCourses : ['Algortihms', 'Artifical Intelligence', 'Cybersecurity']

});

return (
    <>
        <div className = "study-preferences-container">
            {/*SideBar Nav*/}
            <aside className = "study-sidebar">
                <h3>Study Preferences</h3>
                <ul>
                    <li><Link to = "/buddies">Back to Buddies</Link></li>
                    <li><Link to = "/buddies"> Find Study Buddies</Link><li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className = "study-preferences-content">
                <div className = "preferences-grid">
                    <div className = "preferences-card">
                        <h4>Preferred Study Time</h4>
                        <p>{preferences.studyTime}</p>
                    </div>

                    <div className = "preference-card">
                        <h4>Study Enviroment</h4>
                        <p>{preferences.enviroment}</p>
                    </div>

                    <div className = "preference-card">
                        <h4>Collaboration Style</h4>
                        <p>{preferences.collaboration}</p>
                    </div>

                    <div className = "preference-card">
                        <h4>Type of Learner</h4>
                        <p>{preferences.typeLearner}</p>
                    </div>
                    <div className="preference-card">
             <h4>Favorite Courses</h4>
             <ul>
               {preferences.preferredSubjects.map((courses, index) => (
                 <li key={index}>{courses}</li>
               ))}
             </ul>
           </div>
         </div>
       </main>
     </div>
   </>
 );
};

export default StudyPreferences;

