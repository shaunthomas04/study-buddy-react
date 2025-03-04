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
        </div>

    </>
)