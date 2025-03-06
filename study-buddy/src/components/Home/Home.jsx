import React from 'react';
import Navbar from '../Navbar/Navbar';
import "./homeIndex.css";

// Import Navbar from NavBar.jsx
const Header = () => (
  <header className="flex justify-between bg-gray-800 text-white p-4 items-center">
    <div className="logo"></div>
    {/* <input type="text" placeholder="Search" className="p-2 rounded" /> */}
  <Navbar />
  </header>
);

const Sidebar = () => (
  <aside className="sidebar">
    <h2>Online</h2>
    <ul>
      <li>John Doe</li>
      <li>Jane Doe</li>
      <li>John Smith</li>
      <li>Jane Smith</li>
    </ul>
    <h2>You May Know</h2>
    <ul>
      <li>John Doe</li>
      <li>John Doe</li>
      <li>John Doe</li>
    </ul>
  </aside>
);

const Card = ({ title, description }) => (
  <div className="card">
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

const Content = () => (
  <section className="content">
    <h2>Good Evening, [Name]</h2>
    <h3>Upcoming</h3>
    <Card title="Assignment Due 2/15" description="Algorithms" />
    <Card title="Assignment Due 2/27" description="Leadership Cohort" />
    <h3>Popular Discussions</h3>
    <Card title="John Doe" description="[Course] [Subject]" />
    <Card title="John Doe" description="[Course] [Subject]" />
    <Card title="[Name]" description="[Course] [Subject]" />
    <Card title="John Doe" description="[Course] [Subject]" />
  </section>
);

// Feature temporaily relocated
const Glance = () => (
  <aside className="glance">
    {/* <h2>At a Glance</h2>
    <div className="event">Request Buddy XYZ</div>
    <div className="event">Tue, Jan 4 - Study Session with XYZ</div>
    <div className="event">Wed, Jan 5 - Study Session with XYZ</div>
    <div className="event">Thur, Jan 6 - Study Session with XYZ</div>
    <div className="event">Fri, Jan 7 - Study Session with XYZ</div> */}
  </aside>
);

const Dashboard = () => (
  <div className="dashboard">
    <Header />
    <main className="main-layout">
      <Sidebar />
      <Content />
      <Glance />
    </main>
  </div>
);

export default Dashboard;
