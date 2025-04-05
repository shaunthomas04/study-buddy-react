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
  const [loading, setLoading] = useState(true);
  const [buddies, setBuddies] = useState([]);
  
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
    <div className="dashboard">
      <Header />
      <main className="main-layout">
        <Sidebar friendsList={buddies}/> 
        <Content />
      </main>
    </div>
  );
};

export default Dashboard;
