import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Configuration.css";
import { app, auth , db } from "../../firebase"; 
import { getDownloadURL, getStorage, listAll, ref , uploadBytes} from "firebase/storage";
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 

// Function to update the image path in Firestore
const updateImagePath = async (userHash, newUserImage) => {
  try{
    const userInfo = doc(db, "users", userHash);
    await updateDoc(userInfo, {profilePicture: newUserImage});
  }
  catch (error) {
    console.error("Error uploading session:", error);
  }
}

// Function to get schoolClasses from firebase
const getAvailableClasses = async (schoolClassId) => {  
  try {
    const schoolInfo = doc(db, "users", schoolClassId.trim());
    const docSnapshot = await getDoc(schoolInfo);  
    if (docSnapshot.exists()) {
      return docSnapshot.data().courseCodes;  
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

// Function to get the image URL from Firebase Storage
const getUserImage = async (userImage) => {
  try {
    const storage = getStorage(app);
    const fileRef = ref(storage, userImage); 

    const url = await getDownloadURL(fileRef); 
    return url;

  } catch (error) {
    console.error("Error fetching file:", error);
    return null; 
  }
}

// Function to set the image in Firebase Storage
const setUserImage = async (event, userID) => {
  const file = event.target.files[0];
  if (file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const userImage = `${userID}.${fileExtension}`; 
    const storage = getStorage(app); 
    const fileRef = ref(storage, userImage)
    
    try{
      await uploadBytes(fileRef, file);
      const userUrl = await getUserImage(userImage);
      await updateImagePath(userID, userUrl);
    }
    catch(error){
      console.error("Error uploading file:", error);
    }
  }
  else {
    alert('Please select an image file.');
  }
  
};

// Function to get the user data from localStorage
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

// Function to updateField a field of user's database
const updateField = async (userHash, field, updatedInformation) => {
  try{
    
    if (!Array.isArray(updatedInformation)) {
      updatedInformation = [updatedInformation];
    }

    const userInfo = doc(db, "users", userHash);
    const docSnapshot = await getDoc(userInfo);
    if (!docSnapshot.exists()) {
      console.log("No such document");
      return;
    }
    const userData = docSnapshot.data();
    const existingField = userData[field] || []; 
    const updatedField = [...existingField, ...updatedInformation];

    await updateDoc(userInfo, {[field]: updatedField});
  }
  catch (error) {
    console.error("Error uploading session:", error);
  }
}

const deleteItem = async (userHash, field, item) => {
  try{
    const userInfo = doc(db, "users", userHash);
    const docSnapshot = await getDoc(userInfo);
    if (!docSnapshot.exists()) {
      console.log("No such document");
      return;
    }
    const userData = docSnapshot.data();
    const existingField = userData[field] || []; 
    const updatedField = existingField.filter((i) => i !== item); 

    await updateDoc(userInfo, {[field]: updatedField});
  }
  catch (error) {
    console.error("Error uploading session:", error);
  }

}



// The plan is to allow a user to add to their different sections by inputintg text and pressing enter.
// This function should then search the db for that field and append the new information to the exisitng array
// Each item should be given a component that displays on member of a section and then the user can press delete on it
// It should then search the db for the array of that field and that item and remove it from the array


const FieldItem = ({fieldItemName, filed, userHashId}) => {
  return(
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h3>{fieldItemName}</h3>
        <button className="delete-button" onClick={() => deleteItem(userHashId, filed, fieldItemName)} style={{backgroundColor: "red", borderRadius: "50%", width: "20px", height: "20px"}}>x</button>
      </div>
    </>
  )
}


const SettingsPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [descriptions, setDescriptions] = useState({}); // Fix for editable grid
  const [loading, setLoading] = useState(true);
  const [userInfoDb, setUserInfoDb] = useState(null); 
  const [schoolClasses, setSchoolClasses] = useState([]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }

    const userHash = JSON.parse(storedUser).uid;


    // const fetchUserInfo = async () => {
    //   const userInfo = await getUserInfo(userHash);  
    //   if (userInfo) {
    //     setUserInfoDb(userInfo); 
    //   } else {
    //     console.error("No user information found in Firestore");
    //   }
    //   setLoading(false);
    // }
    // fetchUserInfo();
    const unsubscribe = onSnapshot(doc(db, "users", userHash), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserInfoDb(docSnapshot.data());
  
        setLoading(false);
      }
    });
    return () => unsubscribe();

  }, []);

  if (loading) {
    return(
      <>
        <Navbar/>
       <div>Loading...</div>;
      </>
    )
  }


  return (
    <>
    <Navbar/>
    <div className="configuration-settings-page">
      <div className="configuration-settings-container">
        {/* Profile Section (Moved to the Right) */}
        <div className="profile-header" style={{ display: "flex" , flexDirection: "row" }}>
          <div className="profile-avatar">
              <img src={userInfoDb.profilePicture}/>
          </div>

          <div className="profile-info">
            <h2>{`${userInfoDb.firstName} ${userInfoDb.lastName}`}</h2>
            <p>{`${userInfoDb.school}`}</p>
            <p><em>Description</em></p>
          </div>

          <div>
            <h3>Major: {userInfoDb.major}</h3>
          </div>
        </div>

        {/* Editable Grid (Fixed State Issue) */}
        <div className="editable-grid">
          {[
  { title: "Preferred Study Time", key: "studyTime", field: "studyTimes", options: ["Morning", "Afternoon", "Evening", "Late Night", "Early Morning", "Midday", "Weekdays", "Weekends", "Flexible", "After Classes"] },
  { title: "Study Environment", key: "environment", field: "studyEnvironment", options: ["Library (Yeager Center)", "The Walk", "Innovation Lab", "Coffee Shop (The Hut)", "Residential Hall Lounge", "Outdoor Areas (Quad)", "Classroom", "CBU Campus Green", "Private Study Room", "At Home"] },
  { title: "Collaboration Style", key: "collaboration", field: "collaborationStyle", options: ["Independent", "Small Group", "Large Group", "Partner Work", "Team Projects", "Peer Review", "Online Collaboration", "One-on-One Mentoring", "Discussion-Based", "Brainstorming Sessions"] },
  { title: "Type of Learner", key: "learnerType", field: "learnTypes", options: ["Visual", "Auditory", "Kinesthetic", "Reading/Writing", "Logical/Mathematical", "Social", "Solitary", "Interactive", "Reflective", "Practical"] },
  { title: "Courses to Study", key: "courses", field: "courses", options: ["Business Administration", "Computer Science", "Nursing", "Engineering", "Psychology", "Education", "Theology", "Social Work", "Graphic Design", "Health Science"] },
  { title: "School Interests", key: "interests", field: "interests", options: ["STEM (Science, Technology, Engineering, Math)", "Arts & Media", "Athletics", "Faith & Spirituality", "Business", "Healthcare", "Education", "Social Justice", "Community Service", "International Studies"] }
]
.map((item) => {
            const fieldValue = userInfoDb[item.field];

            return (
              <div className="grid-box" key={item.key}>
                <h3>{item.title}</h3>
                {Array.isArray(fieldValue) ? (
                  fieldValue.map((value, index) => (
                    <FieldItem fieldItemName={value} key={index} filed={item.field} userHashId={userInfoDb.id}/>
                  ))
                ) : (
                  <h4>{fieldValue}</h4>
                )}

                  <select
                    value={descriptions[item.key] || ""}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setDescriptions({ ...descriptions, [item.key]: newValue });
                      updateField(userInfoDb.id, item.field, newValue);  
                      setTimeout(() => {
                        setDescriptions({ ...descriptions, [item.key]: "" });
                      }, 500); 
                    }}
                    className="configuration-dropdown"
                  >
                    <option value="" disabled>
                      Add Tags
                    </option>
                    {item.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>


              </div>
            );
          })}
        </div>

        {/* Settings Options */}
        <div className="configuration-settings-options">
        
          <button className="configuration-logout-button">Logout</button>

          {/* Input for users profile picture, currently using my id here */}
          <input type="file" accept="image/*" onChange={(event) => setUserImage(event, userInfoDb.id)} />

        </div>
      </div>
    </div>
    </>
  );
};

export default SettingsPage;