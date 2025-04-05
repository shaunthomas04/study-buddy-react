import Navbar from '../Navbar/Navbar';
import "./homeIndex.css";
import React, { useState, useEffect } from 'react';
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 

// Function to get the user's current buddies
const getUserBuddies = async (userHash) => {  
  try {
    const userInfo = doc(db, "users", userHash.trim());
    const docSnapshot = await getDoc(userInfo);  
    if (!docSnapshot.exists()) {
      console.log("No such document!");
      return  
    } 
    
    const data = docSnapshot.data();
    const buddyIDs = data.buddies || [];

    if (buddyIDs.length === 0){
      return null;
    }

    const buddies = await Promise.all(buddyIDs.map(async (buddyID) => {
      const buddyDoc = doc(db, "users", buddyID.trim());
      const buddySnapshot = await getDoc(buddyDoc);
      if (buddySnapshot.exists()) {
        return buddySnapshot.data();
      } else {
        console.log("No such document!", buddyID);
        return null;
      }
    }

    ));
    return buddies.filter(buddy => buddy !== null);


  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

// Function to get the user's current agenda sessions within the next 7 days
const getUserAgenda = async (userHash) => {  
  try {
    const userInfo = doc(db, "users", userHash.trim());
    const docSnapshot = await getDoc(userInfo);  
    if (docSnapshot.exists()) {
      const agendaSessions = docSnapshot.data().agendaStudySessions || []; 
      
      










    } 
    else {
      console.log("No such document");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}


const Header = () => (
  <header className="flex justify-between bg-gray-800 text-white p-4 items-center">
    <div className="logo"></div>
    <Navbar />
  </header>
);


const Sidebar = ({friendsList}) => {
  return (
    <aside className="friends-list">
      <h2>Buddies</h2>
      <ul>
        {friendsList.map((friend) => (
          <li key={friend.id}>
            <div style={{ display: "flex", alignItems: "center", backgroundColor: "gray", padding: "8px", borderRadius: "8px", marginBottom: "8px" }}>
              <img
                src={friend.profilePicture}
                alt={`${friend.firstName} ${friend.lastName}`}
                className="friend-avatar"
                style={{ width: "50px", height: "50px", borderRadius: "50%", marginRight: "10px" }}
              />
              <div className="friend-button">
                {friend.firstName} {friend.lastName}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
};

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

const Content = ({ agendaStudySessions }) => (
  <section className="content">
    <h2>Welcome,</h2>
    <h2>[Name]</h2>
    <h2></h2>
    <h3>At a glance</h3>
    <section className="upcoming-section">
      {agendaStudySessions.map((session, index) => (
        <div key={index} className="upcoming-card">
          <h4>Upcoming Event: {session.date}</h4>
          <p>{session.notes}</p>
        </div>
      ))}
    </section>

    <h3>Forums</h3>
    <ForumGrid />
  </section>
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [buddies, setBuddies] = useState([]);
  const dummyData = [
    {
      classCode: "CSC312",
      date: "2025-04-11",
      notes: "Testing data object 1 afbfaskdhbfakbfkadfkahsd bfkahbfkaf fhbakbfkhdbsfkadbhakdbshfkah fh dfa dfbadsbfakdfhb ak fadfhak dsfbadkhfbakdsf dfhad fhbakdfh adfakhdfbk adshbf akdshfb akdf afh",
      person: "Alice Johnson",
      recieverID: "Lk9IRfnLa7bS5dvuJvjF1JZuxR73",
      senderID: "L6OWogOvbBV5ywI9B9JgMcRPOSx1",
      sessionID: "79519c6a-63f5-43aa-8325-a7ecb8c73afc",
      status: "pending",
      time: "10:30"
    },
    {
      classCode: "CSC312",
      date: "2025-04-12",
      notes: "Dummy data for session 2",
      person: "John Doe",
      recieverID: "Vw8E4s9bY0rK8sw2t9JH2Tdu3JtR45",
      senderID: "R9LOu4Poj7b0H5ZoZ3b2K8m0Kw1",
      sessionID: "c8f5196e-8904-4b97-bfc6-f41f8c7c3cd3",
      status: "completed",
      time: "14:00"
    },
    {
      classCode: "CSC312",
      date: "2025-04-13",
      notes: "Final test session",
      person: "Jane Smith",
      recieverID: "Yn5F6bK1Pp8lXmvxX5W6T8Zm7ThK9",
      senderID: "Q3N1r8uVsJ3M0aLp1NQG7Z2z8yW",
      sessionID: "a3483f42-1e61-4c7b-96f8-2ad1b1f5b697",
      status: "pending",
      time: "16:45"
    },
    {
      classCode: "CSC312",
      date: "2025-04-14",
      notes: "Backup data for session 4",
      person: "Bob Bot",
      recieverID: "Lk9IRfnLa7bS5dvuJvjF1JZuxR73",
      senderID: "L6OWogOvbBV5ywI9B9JgMcRPOSx1",
      sessionID: "79519c6a-63f5-43aa-8325-a7ecb8c73afc",
      status: "in-progress",
      time: "09:15"
    },
    {
      classCode: "CSC312",
      date: "2025-04-15",
      notes: "Test session with no specific notes",
      person: "Charlie Green",
      recieverID: "d6Nz6U8lI7kZ8tH0o5V7X1TqY2W3",
      senderID: "A2D3JbV0K1uK5Kz2vT9M3Q4P1o9",
      sessionID: "b9fe41a7-dfa3-4cf0-b91a-d47375a93e34",
      status: "pending",
      time: "11:00"
    }
  ];
  
  console.log(dummyData);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }
    const user = JSON.parse(storedUser);
    const userID = user.uid;
    console.log(user)


    const getBuddiesInfo = async (userID) => {
      const buddiesInfo = await getUserBuddies(userID);
      if (!buddiesInfo) {
        console.log("No buddies found for this user.");
      } else {
        setLoading(false);
        setBuddies(buddiesInfo);
      }
    }
    getBuddiesInfo(userID);

  }, []); 


  if (loading) {
    return (
      <div className="loading-screen">
        <h1>Loading...</h1>
      </div>
    );
  }

  console.log(buddies)


  return (
    <>
    <Header />

    <div className="dashboard">
      <main className="main-layout">
        <Sidebar friendsList={buddies}/> 
        <Content agendaStudySessions={dummyData}/>
      </main>
    </div>
  </>
  );
};

export default Dashboard;
