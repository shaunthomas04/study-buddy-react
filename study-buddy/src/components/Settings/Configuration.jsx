import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Configuration.css";
import { app, auth , db } from "../../firebase"; 
import { getDownloadURL, getStorage, listAll, ref , uploadBytes} from "firebase/storage";
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading.jsx';


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
    const schoolInfo = doc(db, "schoolClasses", schoolClassId.trim());
    const docSnapshot = await getDoc(schoolInfo);  
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
  try {
    const userInfo = doc(db, "users", userHash);
    const docSnapshot = await getDoc(userInfo);
    if (!docSnapshot.exists()) {
      console.log("No such document");
      return;
    }
    const userData = docSnapshot.data();
    const existingField = userData[field] || [];

    if (existingField.includes(updatedInformation)) {
      console.log("Item already exists in the field:", updatedInformation);
      return 
    }
    const updatedField = [...existingField, updatedInformation];
    await updateDoc(userInfo, {[field]: updatedField});
  } catch (error) {
    console.error("Error updating field:", error);
  }
};

// Function to replace a field of user's database
const replaceField = async (userHash, field, updatedInformation) => {
  try{

    const userInfo = doc(db, "users", userHash);
    const docSnapshot = await getDoc(userInfo);
    if (!docSnapshot.exists()) {
      console.log("No such document");
      return;
    }
    await updateDoc(userInfo, {[field]: updatedInformation});
  }
  catch (error) {
    console.error("Error uploading session:", error);
  }
}

// Function to delete an item from a field in user's database
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
  const [description, setDescription] = useState("afawefa");
  const [password, setPassword] = useState("");
  const [descriptions, setDescriptions] = useState({}); // Fix for editable grid
  const [loading1, setLoading1] = useState(true);
  const [loading, setLoading] = useState(true); 
  const [userInfoDb, setUserInfoDb] = useState(null); 
  const [schoolInformation, setSchoolInformation] = useState({});

  const navigate = useNavigate();
  const logoutUser = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }
  
    const userHash = JSON.parse(storedUser).uid;
  
    const getSchoolInfo = async (userId) => {
      const userInfo = await getUserInfo(userId);
      const schoolInfo = await getAvailableClasses(userInfo.school);
      return { userInfo, schoolInfo }; 
    };
  
    // Start both async operations
    const fetchData = async () => {
      setLoading(true); 
      try {
        const { userInfo, schoolInfo } = await getSchoolInfo(userHash);
  
        setUserInfoDb(userInfo);
        setSchoolInformation(schoolInfo);
          setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);  
      }
    };
  
    fetchData();
  
    // Setting up the Firestore listener
    const unsubscribe = onSnapshot(doc(db, "users", userHash), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setUserInfoDb(docSnapshot.data());
      }
    });
  
    return () => unsubscribe();
  }, []);
  


  if (loading) {
    return(
      <Loading/>
    )
  }

  return (
    <>
    <Navbar/>
    <div className="configuration-settings-page">
      <div className="configuration-settings-container">
        {/* Profile Section (Moved to the Right) */}


        <div style={{display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
          <div className="profile-image-button-placeholder">

          </div>
          
          <div className="profile-avatar">
              <img src={userInfoDb.profilePicture} alt="Profile" className="profile-avatar"/>
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={(event) => setUserImage(event, userInfoDb.id)}
            className="file-input" // Add class to the input
          />
          <button
            onClick={() => document.querySelector('input[type="file"]').click()}
            className="profile-image-button" // Add class to the button
            aria-label="Change profile picture"
          >
          </button>
        </div>
     
        {/* <div className="profile-header" style={{ display: "grid" , flexDirection: "column", alignItems: "center" }}>
          </div> */}
          <div className="profile-info">

            <h2>{`${userInfoDb.firstName} ${userInfoDb.lastName}`}</h2>

            <p>{`${userInfoDb.school}`}</p>
            <h3>Major: {userInfoDb.major}</h3>
          </div>


          <div className="profile-fields">
              <select value={""}
              onChange={(e) => {
                const newValue = e.target.value;
                replaceField(userInfoDb.id, "major", newValue);  
                setTimeout(() => {
                  setDescriptions({ ...descriptions, [item.key]: "" });
                }, 500); 
              }}>
                
                <option value="" disabled>Select Major</option>
                {schoolInformation.majors.map((major, index) => (
                  <option key={index} value={major}>
                    {major}
                  </option>
                ))}
              </select>

              {/* <input
                type="file"
                accept="image/*"
                onChange={(event) => setUserImage(event, userInfoDb.id)}
                className="file-input" // Add class to the input
              />
              <button
                onClick={() => document.querySelector('input[type="file"]').click()}
                className="profile-image-button" // Add class to the button
                aria-label="Change profile picture"
              >
              </button> */}

         
          </div>


        {/* Editable Grid (Fixed State Issue) */}
        <div className="editable-grid">
          {[
  { title: "Preferred Study Time", key: "studyTime", field: "studyTimes", options: schoolInformation.studyTime },
  { title: "Study Environment", key: "environment", field: "studyEnvironment", options: schoolInformation.studyEnvironment },
  { title: "Collaboration Style", key: "collaboration", field: "collaborationStyle", options: schoolInformation.collaborationStyle },
  { title: "Type of Learner", key: "learnerType", field: "learnTypes", options: schoolInformation.learnerType },
  { title: "Courses to Study", key: "courses", field: "courses", options: schoolInformation.courseCodes },
  { title: "School Interests", key: "interests", field: "interests", options: schoolInformation.schoolInterests }
]
.map((item) => {
            const fieldValue = userInfoDb[item.field];

            return (
              <div className="grid-box" key={item.key}>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                  <h3>{item.title}</h3>
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
                    style={{ marginBottom: "10px"}}
                  >
                    <option value="" disabled>
                      {/* Add Tags */}
                    </option>
                    {item.options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>


                {Array.isArray(fieldValue) ? (
                  fieldValue.map((value, index) => (
                    <FieldItem fieldItemName={value} key={index} filed={item.field} userHashId={userInfoDb.id}/>
                  ))
                ) : (
                  <h4>{fieldValue}</h4>
                )}

              </div>
            );
          })}
        </div>

        {/* Settings Options */}
        <div className="configuration-settings-options">
          <button className="configuration-logout-button" onClick={logoutUser}>Logout</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default SettingsPage;