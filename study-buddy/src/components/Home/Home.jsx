import Navbar from '../Navbar/Navbar';
import "./homeIndex.css";
import React, { useState, useEffect } from 'react';
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
import { parseISO, isWithinInterval, addDays, compareAsc, format  } from "date-fns";

// Popup that shows a buddy's tags when clicked
// allow user to accept or reject buddy requests
// placeholders to tell user to add a buddy or agenda session when none

// Function to handle buddy requests (accept or reject)
const handleBuddyRequest = async (buddyID, userID, isAccepted) => {
  try {
      const userInfo = doc(db, "users", userID.trim());
      const userInfoSnapshot = await getDoc(userInfo);  
      const buddyInfo = doc(db, "users", buddyID.trim());
      const buddyInfoSnapshot = await getDoc(buddyInfo);

      if (!userInfoSnapshot.exists() || !buddyInfoSnapshot.exists()) {
          console.log("Error accepting buddy request");
          return null;
      }

      const userBuddyRequests = userInfoSnapshot.data().buddyRequests;
      const userRequestsSent = userInfoSnapshot.data().buddyRequestsSent;
      const userBuddies = userInfoSnapshot.data().buddies;
      const buddyBuddyRequests = buddyInfoSnapshot.data().buddyRequests;
      const buddyRequestsSent = buddyInfoSnapshot.data().buddyRequestsSent;
      const buddyBuddies = buddyInfoSnapshot.data().buddies;

      const updatedUserBuddyRequests = userBuddyRequests.filter(request => request !== buddyID.trim());
      const updatedBuddyRequestsSent = buddyRequestsSent.filter(request => request !== userID.trim());

      userBuddies.push(buddyID.trim())
      buddyBuddies.push(userID.trim())
    

      if (isAccepted) {
        const updatedUserRequestsSent = userRequestsSent.filter(request => request !== buddyID.trim());
        const updatedBuddyRequests = buddyBuddyRequests.filter(request => request !== userID.trim());
        await updateDoc(userInfo, { buddyRequests: updatedUserBuddyRequests, buddies: userBuddies, buddyRequestsSent: updatedUserRequestsSent });
        await updateDoc(buddyInfo, { buddyRequestsSent: updatedBuddyRequestsSent, buddies: buddyBuddies, buddyRequests: updatedBuddyRequests });
      }
      else {
        await updateDoc(userInfo, { buddyRequests: updatedUserBuddyRequests });
        await updateDoc(buddyInfo, { buddyRequestsSent: updatedBuddyRequestsSent });
      }

    } 
    catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
}


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

// Function to get the user's current buddiesme
const getUserRequests = async (userHash) => {  
  try {
    const userInfo = doc(db, "users", userHash.trim());
    const docSnapshot = await getDoc(userInfo);  
    if (!docSnapshot.exists()) {
      console.log("No such document!");
      return  
    } 
    
    const data = docSnapshot.data();
    const requested = data.buddyRequests || [];

    if (requested.length === 0){
      return null;
    }

    const buddyRequests = await Promise.all(requested.map(async (buddyID) => {
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
    return buddyRequests.filter(buddy => buddy !== null);


  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}

// Function to get the user's name and profile picture
const getUserInfo = async (userHash) => {  
  try {
    const userInfo = doc(db, "users", userHash.trim());
    const docSnapshot = await getDoc(userInfo);  
    if (docSnapshot.exists()) {
      return docSnapshot.data();  
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

// Function to get the user's current agenda sessions within the next 7 days
const getUserAgenda = async (userHash) => {  
  try {
    const userInfo = doc(db, "users", userHash.trim());
    const docSnapshot = await getDoc(userInfo);  
    if (docSnapshot.exists()) {
      const agendaSessions = docSnapshot.data().agendaStudySessions || []; 
      const today = new Date();
      const nextWeek = addDays(today, 7);

      const agendaSessionsCurrentWeek = agendaSessions.filter((session) => {
        const sessionDate = parseISO(session.date); 
        return isWithinInterval(sessionDate, { start: today, end: nextWeek });
      });

      const sortedSessions = agendaSessionsCurrentWeek.sort((a, b) => {
        return compareAsc(parseISO(a.date), parseISO(b.date));
      });
      
      return sortedSessions

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


const Sidebar = ({ friendsList, requestsList, userHash }) => {
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleClick = (friend) => {
    setSelectedFriend(friend);
  };

  const closeModal = () => {
    setSelectedFriend(null);
  };

  const FriendCard = ({ friend, isRequest, userID }) => (
    <div
      onClick={() => handleClick(friend)}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "gray",
        padding: "8px",
        borderRadius: "8px",
        marginBottom: "8px",
        cursor: "pointer",
      }}
      className="friend-card"
    >
      <img
        src={friend.profilePicture}
        alt={`${friend.firstName} ${friend.lastName}`}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          marginRight: "10px",
        }}
      />
      <div>{friend.firstName} {friend.lastName}</div>
      {isRequest && (
        <div style={{ marginLeft: "auto", display: "flex", gap: "7px", alignItems: "center" }}>
          <button style={{width:"25px", height:"25px", borderRadius:"50px", backgroundColor: "green"}} onClick={() => handleBuddyRequest(friend.id, userID, true)}>✓</button>
          <button style={{width:"25px", height:"25px", borderRadius:"50px", backgroundColor: "red"}} onClick={() => handleBuddyRequest(friend.id, userID, false)}>x</button>
        </div>
      )}
    </div>
  );

  return (
    <aside className="friends-list">
      <h2>Buddies</h2>
      <ul>
        {friendsList.map((friend) => (
          <li key={friend.id}>
            <FriendCard friend={friend} isRequest={false} />
          </li>
        ))}
      </ul>

      <h2>Buddy Requests</h2>
      <ul>
        {requestsList.map((friend) => (
          <li key={friend.id}>
            <FriendCard friend={friend} isRequest={true} userID={userHash}/>
          </li>
        ))}
      </ul>

      {/* Popup Modal */}
      {selectedFriend && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              width: "600px",
              height: "600px",
              textAlign: "center",
            }}
          >
            <img
              src={selectedFriend.profilePicture}
              alt={`${selectedFriend.firstName} ${selectedFriend.lastName}`}
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                marginBottom: "10px",
              }}
            />
            <h1>{selectedFriend.firstName} {selectedFriend.lastName}</h1>
            {selectedFriend.major 
             ? <h3>{selectedFriend.major} student at {selectedFriend.school}</h3>
             : <h3>Student at {selectedFriend.school}</h3>}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            marginTop: "30px",
            textAlign: "left"
          }}
          >
        {[
          { title: "Preferred Study Time", items: selectedFriend.studyTimes },
          { title: "Study Environment", items: selectedFriend.studyEnvironment },
          { title: "Collaboration Style", items: selectedFriend.collaborationStyles },
          { title: "Type of Learner", items: selectedFriend.learnTypes },
          { title: "Courses to Study", items: selectedFriend.courses },
          { title: "School Interests", items: selectedFriend.interests },
        ].map((category, index) => (
          <div
            key={index}
            className="category-box"
          >
            <h5 style={{ marginBottom: "10px", fontSize: "14px" }}>{category.title}</h5>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              {category.items && category.items.length > 0 ? (
                category.items.map((item, i) => <li key={i} style={{ fontSize: "13px" }} >{item}</li>)
              ) : (
                <li style={{ fontStyle: "italic", color: "gray" }}>None listed</li>
              )}
            </ul>
          </div>
        ))}
      </div>
           
          </div>
        </div>
      )}
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

const Content = ({ agendaStudySessions, userInfo }) => (
  <section className="content">
    <h2>Welcome back {userInfo.firstName} {userInfo.lastName}!</h2>
    <h3>At a glance</h3>

    <section className="upcoming-section">
  {agendaStudySessions.length === 0 ? (
    <div className="empty-message">
      <h1>You have no upcoming agenda sessions. Add one to get started!</h1>
    </div>
  ) : (
    agendaStudySessions.map((session, index) => {
      const backgroundColor =
        session.status === "accepted"
          ? "#71FF65"
          : session.status === "pending"
          ? "#FFFD62"
          : session.status === "request"
          ? "#6E6FFF"
          : "#FF5B57";

          const formattedDate = format(parseISO(session.date), "MMMM dd");         
          const formattedTime = format(
           new Date(`1970-01-01T${session.time}:00`),
           "hh:mm a"
         );

      return (
        <div
          key={index}
          className="upcoming-card"
          style={{ backgroundColor }}
        >
          <h4>{formattedDate}</h4>
          <h6 style={{ marginBottom: "7px" }}>
            Meeting with {session.person} at {formattedTime}
          </h6>
          <p style={{ wordWrap: "break-word" }}>{session.notes}</p>
        </div>
      );
    })
  )}
</section>


    <h3>Forums</h3>
    <ForumGrid />
  </section>
);


const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [buddies, setBuddies] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [userInformation, setUserInfo] = useState(null);
  const [userRequests, setUserRequests] = useState(null);
  const dummyData = [
    {
      classCode: "CSC312",
      date: "2025-04-11",
      notes: "Testing data object 1 afbfaskdhb fakbfkadfkahsd bfkahbfkaf fhbakbfkhdbsfk adbhakdbshfkah fh dfa dfbadsbf akdfhb ak fadfhak dsfbadkhfbakdsf dfhad fhbakdfh adfakhdfbk adshbf akdshfb akdf afh",
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
      status: "request",
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
      status: "accepted",
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
      status: "pending",
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
  
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }
    const user = JSON.parse(storedUser);
    const userID = user.uid;

    const getBuddiesInfoAndAgenda = async (userID) => {
      const buddiesInfo = await getUserBuddies(userID);
      const agendaInfo = await getUserAgenda(userID);
      const userInfo = await getUserInfo(userID);
      const userRequests = await getUserRequests(userID);

      if (!buddiesInfo || !agendaInfo) {
        console.log("Some data is missing");
      } else {
        setBuddies(buddiesInfo);
        setAgenda(agendaInfo);
        setUserInfo(userInfo);
        setUserRequests(userRequests);
        setLoading(false);

      }
    }
    getBuddiesInfoAndAgenda(userID);

  }, []); 


  if (loading) {
    return (
      <div className="loading-screen">
        <h1>Loading...</h1>
      </div>
    );
  }


  return (
    <>
    <Header />

    <div className="dashboard">
      <main className="main-layout">
        <Sidebar friendsList={buddies} requestsList={userRequests} userHash={userInformation.id}/> 
        <Content agendaStudySessions={agenda} userInfo={userInformation}/>
      </main>
    </div>
  </>
  );
};

export default Dashboard;
