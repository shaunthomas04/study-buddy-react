import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./Configuration.css";
import { app } from "../../firebase"; 
import { getDownloadURL, getStorage, listAll, ref , uploadBytes} from "firebase/storage";

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

const setUserImage = async (event, userID) => {
  const file = event.target.files[0];
  if (file) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const userImage = `${userID}.${fileExtension}`; 
    const storage = getStorage(app); 
    const fileRef = ref(storage, userImage)
    
    try{
      await uploadBytes(fileRef, file);
      console.log("File uploaded successfully!");
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
          <input type="file" accept="image/*" onChange={(event) => setUserImage(event, "userNameGoesHere")} />

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;