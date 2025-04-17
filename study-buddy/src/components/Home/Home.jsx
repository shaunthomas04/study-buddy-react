import Navbar from '../Navbar/Navbar';
import "./homeIndex.css";
import React, { useState, useEffect } from 'react';
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
import { parseISO, isWithinInterval, addDays, compareAsc, format  } from "date-fns";
import agendaIcon from "./images/agendaPlaceholder.png";
import buddiesIcon from "./images/buddiesPlaceholder.png";
import Loading from '../Loading/Loading.jsx';
// ignore this error don't know why it is showing up when it works
import { sendRequestAlert } from '../Email/Email.js';


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
      const buddyName = `${buddyInfoSnapshot.data().firstName} ${buddyInfoSnapshot.data().lastName}`;
      const buddyEmail = buddyInfoSnapshot.data().email;

      userBuddies.push(buddyID.trim())
      buddyBuddies.push(userID.trim())
    

      if (isAccepted) {
        const updatedUserRequestsSent = userRequestsSent.filter(request => request !== buddyID.trim());
        const updatedBuddyRequests = buddyBuddyRequests.filter(request => request !== userID.trim());
        await updateDoc(userInfo, { buddyRequests: updatedUserBuddyRequests, buddies: userBuddies, buddyRequestsSent: updatedUserRequestsSent });
        await updateDoc(buddyInfo, { buddyRequestsSent: updatedBuddyRequestsSent, buddies: buddyBuddies, buddyRequests: updatedBuddyRequests });
        
        // Send email notification to the buddy
        const message = `${userInfoSnapshot.data().firstName} ${userInfoSnapshot.data().lastName} has accepted your buddy request!`;
        // await sendRequestAlert(buddyName, buddyEmail, message);

        window.location.reload();
      }
      else {
        await updateDoc(userInfo, { buddyRequests: updatedUserBuddyRequests });
        await updateDoc(buddyInfo, { buddyRequestsSent: updatedBuddyRequestsSent });

        // Send email notification to the buddy
        const message = `${userInfoSnapshot.data().firstName} ${userInfoSnapshot.data().lastName} has rejected your buddy request.`;
        // await sendRequestAlert(buddyName, buddyEmail, message);

        window.location.reload();
      }

    } 
    catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
}

// function to remove buddy
const removeBuddy = async (buddyID, userID) => {
  try {
    const userInfo = doc(db, "users", userID.trim());
    const userInfoSnapshot = await getDoc(userInfo);  
    const buddyInfo = doc(db, "users", buddyID.trim());
    const buddyInfoSnapshot = await getDoc(buddyInfo);

    if (!userInfoSnapshot.exists() || !buddyInfoSnapshot.exists()) {
        console.log("Error removing buddy");
        return null;
    }

    const userBuddies = userInfoSnapshot.data().buddies;
    const buddyBuddies = buddyInfoSnapshot.data().buddies
    const updateduserBuddies = userBuddies.filter(request => request.trim() !== buddyID.trim());
    const updatedbuddyBuddies = buddyBuddies.filter(request => request.trim() !== userID.trim());

    await updateDoc(userInfo, { buddies: updateduserBuddies });
    await updateDoc(buddyInfo, { buddies: updatedbuddyBuddies });


    // Send email notification to the buddy
    const buddyName = `${buddyInfoSnapshot.data().firstName} ${buddyInfoSnapshot.data().lastName}`;
    const buddyEmail = buddyInfoSnapshot.data().email;
    const message = `${userInfoSnapshot.data().firstName} ${userInfoSnapshot.data().lastName} has removed you from their buddy list.`;
    // await sendRequestAlert(buddyName, buddyEmail, message);

    window.location.reload();
  
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
      return [];
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


const Sidebar = ({ friendsList, requestsList, userInfo }) => {

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
  
      <div style={{ marginLeft: "auto", display: "flex", gap: "7px", alignItems: "center" }}>
        {isRequest ? (
          <>
            <button 
              style={{ backgroundColor: "green" }} 
              className="request-button"
              onClick={(e) => { 
                e.stopPropagation(); 
                handleBuddyRequest(friend.id, userID, true);
              }}
            >
              ✓
            </button>
            <button 
              style={{ backgroundColor: "red" }} 
              className="request-button"
              onClick={(e) => { 
                e.stopPropagation(); 
                handleBuddyRequest(friend.id, userID, false);
              }}
            >
              x
            </button>
          </>
        ) : (
          <button 
            style={{ backgroundColor: "red" }} 
            className="request-button"
            onClick={(e) => {
              e.stopPropagation();
              removeBuddy(friend.id, userID);
            }}
          >
            x
          </button>
        )}
      </div>
    </div>
  );
  

  return (
    <aside className="friends-list">
      {console.log("Friends List:", friendsList)}
      {console.log("Requests List:", requestsList)}
      {requestsList.length !== 0 && (
        <>
          <h2>Buddy Requests</h2>
          <ul>
            {requestsList.map((friend) => (
              <li key={friend.id}>
                <FriendCard friend={friend} isRequest={true} userID={userInfo.id} />
              </li>
            ))}
          </ul>
        </>
      )}

      <h2>Buddies</h2>

      
      {friendsList.length === 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "50%" }}>
          <h3>Head to the Buddies Page to add some Buddies!</h3>
        </div>
      )}




      <ul>
        {friendsList.map((friend) => (
          <li key={friend.id}>
            <FriendCard friend={friend} isRequest={false} userID={userInfo.id} />
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
          { title: "Preferred Study Time", items: selectedFriend.studyTimes, userItems: userInfo.studyTimes },
          { title: "Study Environment", items: selectedFriend.studyEnvironment, userItems: userInfo.studyEnvironment },
          { title: "Collaboration Style", items: selectedFriend.collaborationStyles, userItems: userInfo.collaborationStyles },
          { title: "Type of Learner", items: selectedFriend.learnTypes, userItems: userInfo.learnTypes },
          { title: "Courses to Study", items: selectedFriend.courses, userItems: userInfo.courses },
          { title: "School Interests", items: selectedFriend.interests, userItems: userInfo.interests },
        ].map((category, index) => (
          <div key={index} className="category-box">
            <h5 style={{ marginBottom: "10px", fontSize: "14px" }}>{category.title}</h5>
            <ul style={{ paddingLeft: "20px", margin: 0 }}>
              {category.items && category.items.length > 0 ? (
                category.items.map((item, i) => (
                  <li
                  key={i}
                  style={{
                    fontSize: category.userItems.includes(item) ? "16px" : "13px", 
                    fontWeight: category.userItems.includes(item) ? "bolder" : "normal",
                  }}
                >
                  {item}
                </li>
                ))
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
    <h3>Upcoming Study Session</h3>

    <section className="upcoming-section"  style={agendaStudySessions.length === 0 ? { display: "flex", justifyContent: "center", alignItems: "center" } : {}}>
   


  {agendaStudySessions.length === 0 ? (
    <div className="empty-message" style={{ display: "flex"}}>

      <img src={agendaIcon} style={{height:"230px", width:"250px"}}></img>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: "70px"}}>
        <h1 style={{fontSize:"20px"}}>No upcoming study sessions,</h1>
        <h1 style={{ fontSize:"20px"}}>Head to Agenda page to get started!</h1>
      </div>

     
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
  const [userRequests, setUserRequests] = useState([]);
  
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

      if (!buddiesInfo) {
        console.log("Buddies data is missing");
        setBuddies([]);
      } else {
        setBuddies(buddiesInfo);
      }
      
      if (!agendaInfo) {
        console.log("Agenda data is missing");
        setAgenda([]);
      } else {
        setAgenda(agendaInfo);
      }
      
      if (!userRequests) {
        console.log("User Requests data is missing");
        setUserRequests([]);
      } else {
        setUserRequests(userRequests);
      }
      
      setLoading(false);

    };
    getBuddiesInfoAndAgenda(userID);

    // Firestore real-time listener for user info
    const unsubscribe = onSnapshot(doc(db, "users", userID), (docSnapshot) => {
      if (docSnapshot.exists()) {
        console.log("Data changed:", docSnapshot.data());
        setUserInfo(docSnapshot.data());  // Update state with Firestore data
      }
    });

    return () => unsubscribe();

  }, []); 

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <>
    <Navbar />
    <div className="dashboard">
      <main className="main-layout">
        <Sidebar friendsList={buddies} requestsList={userRequests} userInfo={userInformation}/> 
        <Content agendaStudySessions={agenda} userInfo={userInformation}/>
      </main>
    </div>
  </>
  );
};

export default Dashboard;
