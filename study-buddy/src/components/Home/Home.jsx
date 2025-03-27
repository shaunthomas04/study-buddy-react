import React from 'react';
import Navbar from '../Navbar/Navbar';
import "./homeIndex.css";
import { useEffect } from 'react';

const Header = () => (
  <header className="flex justify-between bg-gray-800 text-white p-4 items-center">
    <div className="logo"></div>
    <Navbar />
  </header>
);


const Sidebar = () => (
  <aside className="friends-list">
    <h2>Online</h2>
    <ul>
      {["John Doe", "Jane Doe", "John Smith", "Jane Smith","Find New Buddies"].map((friend, index) => (
        <li key={index}>
          <button className="friend-button">{friend}</button>
        </li>
      ))}
    </ul>
  </aside>
);

const Card = ({ title, description }) => (
  <div className="card">
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

const ForumGrid = () => (
  <section className="forum-grid">
    {[...Array(6)].map((_, index) => (
      <Card key={index} title={`Forum ${index + 1}`} description="Forum details here" />
    ))}
  </section>
);

const Content = () => (
  <section className="content">
      <h2>Welcome,</h2>
      <h2>[Name]</h2>
      <h2></h2>
      <h3>At a glance</h3>
      <section className="upcoming-section">
    <div className="upcoming-card">
      <h4>Upcoming Event: [Date]</h4>
      <p>[Event]</p>
    </div>
    <div className="upcoming-card">
      <h4>Upcoming Event:  [Date]</h4>
      <p>[Event]</p>
  </div>
</section>

    <h3>Forums</h3>
    <ForumGrid />
  </section>
);

const Dashboard = () => {
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }
  }); 

  return (
    <div className="dashboard">
      <Header />
      <main className="main-layout">
        <Sidebar />
        <Content />
      </main>
    </div>
  );
};

export default Dashboard;
