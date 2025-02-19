import React from 'react';
import Navbar from '../Navbar/Navbar';


const Classes = () => {
  return (
    <>
      <Navbar />
      <div className="classes-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Classes</h3>
          <ul>
            <li className="selected">CSC 312</li>
            <li>CSC 411</li>
            <li>EGR 302</li>
            <li>EGR 328</li>
            <li>EGR 304</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h2>Welcome to the Classes Page!</h2>
          <h2>Current Classes</h2>
        </main>
      </div>
    </>
  );
};

export default Classes;