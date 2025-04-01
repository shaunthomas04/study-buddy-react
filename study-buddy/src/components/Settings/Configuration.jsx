import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Configuration.css";
import { app, auth , db } from "../../firebase"; 
import { getDownloadURL, getStorage, listAll, ref , uploadBytes} from "firebase/storage";
import { setDoc, doc, getDoc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore"; 

const updateImagePath = async (userHash, newUserImage) => {
  try{
    const userInfo = doc(db, "users", userHash);
    await updateDoc(userInfo, {profilePicture: newUserImage});
  }
  catch (error) {
    console.error("Error uploading session:", error);
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


const SettingsPage = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [descriptions, setDescriptions] = useState({}); // Fix for editable grid

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      throw new Error("Failed to load user data from localStorage");
    }
  }, []);

  return (
    <div className="configuration-settings-page">
      {/* Header */}
      <header className="flex justify-between bg-gray-800 text-white p-4 items-center">
        <Navbar />
      </header>

      <div className="configuration-settings-container">
        {/* Profile Section (Moved to the Right) */}
        <div className="profile-header">
          <div className="profile-info">
            <h2>Student Name</h2>
            <p>California Baptist University</p>
            <p><em>Description</em></p>
          </div>
        </div>

        {/* Editable Grid (Fixed State Issue) */}
        <div className="editable-grid">
          {[
            { title: "Preferred Study Time", key: "studyTime" },
            { title: "Study Environment", key: "environment" },
            { title: "Collaboration Style", key: "collaboration" },
            { title: "Type of Learner", key: "learnerType" },
            { title: "Courses to Study", key: "courses" },
            { title: "School Interests", key: "interests" },
          ].map((item) => (
            <div className="grid-box" key={item.key}>
              <h3>{item.title}</h3>
              <input
                type="text"
                placeholder={`Edit ${item.title}`}
                value={descriptions[item.key] || ""}
                onChange={(e) =>
                  setDescriptions({ ...descriptions, [item.key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

        {/* Settings Options */}
        <div className="configuration-settings-options">
          {/* Change Name */}
          <div className="input-row">
            <div className="input-group">
              <label>Change Name</label>
              <input
                type="text"
                placeholder="Enter new name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          {/* Change Description */}
          <div className="input-row">
            <div className="input-group">
              <label>Change Description</label>
              <input
                type="text"
                placeholder="Update your description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

          </div>

          {/* Additional Buttons - More customization needed*/}
          {/* <div className="button-group">
            <button className="configuration-settings-button">Button1</button>
            <button className="configuration-settings-button">Button2</button>
          </div> */}

          {/* Logout Button */}
          <button className="save-button">Save</button>
          <button className="configuration-logout-button">Logout</button>

          {/* Testing Image upload and read */}
          <button onClick={() => getUserImage("default.jpg")}> Test</button>
          {/* Input for users profile picture, currently using my id here */}
          <input type="file" accept="image/*" onChange={(event) => setUserImage(event, "L6OWogOvbBV5ywI9B9JgMcRPOSx1")} />

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;