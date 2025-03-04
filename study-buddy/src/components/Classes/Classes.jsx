import React from 'react';
import Navbar from '../Navbar/Navbar';
// import ClassesSidebar from './ClassesSidebar';
import './Classes.css';

const Classes = () => {
  return (
    <>
      <Navbar />
      <div className="classes-container">
        {/* <ClassesSidebar /> */}
        <main className="classes-main-content">
          <h2>Welcome to the Classes Page!</h2>
          <h2>Current Classes</h2>
        </main>
      </div>
    </>
  );
};

export default Classes;
