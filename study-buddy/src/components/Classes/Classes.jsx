import React from 'react';
import Navbar from '../Navbar/Navbar';
import './Classes.css';


const Classes = () => {
  return (
    <>
      <Navbar />
      <div className="classes-container">
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

        <main className="main-content">
          <h2>Welcome to the Classes Page!</h2>
          <h2>Current Classes</h2>

          <div className="class-card">
            <h3>CSC 312 - Class Discussion</h3>
            <p>Ask questions, share notes, and discuss topics here!</p>
          </div>
        </main>
      </div>
    </>
  );
};

export default Classes;