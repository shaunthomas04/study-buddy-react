import React from 'react';
import Navbar from '../Navbar/Navbar';

// Scrapped for now
// const Header = () => (
//   <header className="flex justify-between bg-gray-800 text-white p-4 items-center">
//     <div className="logo"></div>
//     <input type="text" placeholder="Search" className="p-2 rounded" />
//     <nav>
//       <a href="#" className="mx-2">Agenda</a>
//       <a href="#" className="mx-2">Buddies</a>
//       <a href="#" className="mx-2">Classes</a>
//       <a href="#" className="mx-2">Settings</a>
//     </nav>
//   </header>
// );

const Navbar = () => {
    return(
        <nav>
          <ul>
           
            <li>
              <Link to="/">Home</Link>
              <Link to="/classes">Classes</Link>
              <Link to="/buddies">Buddies</Link>
              <Link to="/agenda">Agenda</Link>
            </li>
           
          </ul>
        </nav>
    )
}

const Sidebar = () => (
  <aside className="w-1/5 bg-gray-200 p-4">
    <h2>Online</h2>
    <ul>
      <li>John Doe</li>
      <li>Jane Doe</li>
      <li>John Smith</li>
      <li>Jane Smith</li>
    </ul>
    <h2 className="mt-4">You May Know</h2>
    <ul>
      <li>John Doe</li>
      <li>John Doe</li>
      <li>John Doe</li>
    </ul>
  </aside>
);

const Card = ({ title, description }) => (
  <div className="bg-gray-300 p-4 m-2 rounded">
    <h4>{title}</h4>
    <p>{description}</p>
  </div>
);

const Content = () => (
  <section className="flex-grow p-4">
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

const Glance = () => (
  <aside className="w-1/5 bg-gray-200 p-4">
    <h2>At a Glance</h2>
    <div className="bg-white p-2 border rounded"> Request Buddy XYZ</div>
    <div className="bg-white p-2 border rounded mt-2">Tue, Jan 4 - Study Session with XYZ</div>
    <div className="bg-white p-2 border rounded mt-2">Wed, Jan 5 - Nothing Scheduled</div>
    <div className="bg-white p-2 border rounded mt-2">Thur, Jan 6 - Study Session with XYZ</div>
    <div className="bg-white p-2 border rounded mt-2">Fri, Jan 7 - Study Session with XYZ</div>
  </aside>
);

const Dashboard = () => (
  <div className="flex flex-col h-screen">
    <Header />
    <main className="flex flex-grow">
      <Sidebar />
      <Content />
      <Glance />
    </main>
  </div>
);

export default Dashboard;
