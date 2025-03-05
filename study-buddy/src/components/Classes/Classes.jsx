import React from 'react';
import Navbar from '../Navbar/Navbar';
// import ClassesSidebar from './ClassesSidebar';
import './Classes.css';

const Classes = () => {
  return (
    <>
      <Navbar />
      <div className="Classes-outer-container">
        <div className='Classes-inner-container'>
          <div className="Classes-class-codes-container"></div>
          <div className="Classes-questions-container"></div>
        </div>
      </div>
    </>
  );
};

export default Classes;
