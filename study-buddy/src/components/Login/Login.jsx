import React, { Profiler, useState } from "react";
import "./Login.css";
import login_image from "../../assets/login_image.jpg";
import login_image2 from "../../assets/login_background2.png";
import logo from "../../assets/logo.png";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth , db } from "../../firebase.js"; 
import { setDoc, doc, } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom";
import { getDoc } from "firebase/firestore";


const userLogin = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("user", JSON.stringify(userCredential.user));
    return userCredential.user;
  }
  catch (error) {
    console.error(error);
    throw error;
  }

}

const getSchoolsMap = async () => {
  const map = doc(db, "availableSchools", "map");

  try {
    const docSnapshot = await getDoc(map);  // Fetch the document snapshot
    if (docSnapshot.exists()) {
      return docSnapshot.data().schoolDomains;  
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


const userSignup = async (email, password, firstName, lastName) => {
  const schoolsMap = await getSchoolsMap();

  const emailDomain = email.split('@')[1];  
    
    // Check if the domain exists as a key in the schoolsMap
    if (!schoolsMap || !schoolsMap[emailDomain]) {
      throw new Error("Invalid School Email");;
    }


  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      firstName: firstName,
      lastName: lastName,
      buddies: [],
      buddyRequests: [],
      buddyRequestsSent: [],
      buddySuggestions: [],
      collaborationStyles: [],
      courses: [],
      learnTypes: [],
      interests: [],
      studyEnvironment: [],
      studyTimes: [],
      agendaStudySessions: [],
      profilePicture: "default",
      school: schoolsMap[emailDomain],
      id : user.uid
    });

    localStorage.setItem("user", JSON.stringify(userCredential.user));

    return user;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email is already in use.");
    }
    else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid Email.");
    }
    else if (error.code === "auth/weak-password") {
      throw new Error("Password is not strong enough.");
    }

    else {
      console.error(error);
      throw new Error("Signup failed. Please try again.");
    }
  }

}

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); 

  const toggleForm = () => {
    setIsLogin(!isLogin); 
  };

  return (
    <div className="login-page">
      <div className="login-and-image-container">
        <div className="login-container">
          <div className="auth-container">
            {isLogin ? (
              <LoginForm toggleForm={toggleForm} />
            ) : (
              <SignupForm toggleForm={toggleForm} />
            )}
          </div>
        </div>
        <div className="image-container">
          <img src={login_image2} alt="Login Image" />
        </div>
      </div>
    </div>
  );
}

function LoginForm({ toggleForm }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await userLogin(email, password);
      navigate("/home");

    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  }

  return (
    <div id="login-form" className="auth-items-container">
      <img src={logo} className="login-logo" alt="Logo" />
      <h1 style={{textAlign: "center"}} >Welcome to Study Buddy!</h1>
      <form id="login-form-element" className="auth-form" onSubmit={handleLogin}>
        <input type="email" id="login-email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" id="login-password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div className="buttons-container">
          <button type="submit" className="action-button">Login</button>
          <button
            id="switch-to-signup"
            className="action-button"
            onClick={toggleForm}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
function SignupForm({ toggleForm }) {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await userSignup(email, password, firstName, lastName);
      console.log(userSignup);
      navigate("/home");

    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }

  }

  return (
    <div id="signup-form" className="auth-items-container">
      <img src={logo} className="login-logo" alt="Logo" />
      <h1>Sign up to get started!</h1>
      <form id="signup-form-element" className="auth-form" onSubmit={handleSignup}>
          <input type="text" id="signup-first-name" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" id="signup-last-name" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} required />
          <input type="email" id="signup-email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" id="signup-password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          {errorMessage && <div className="error-message">{errorMessage}</div>}

        
        <div className="buttons-container">
          <button type="submit" className="action-button">Sign Up</button>
          <button
            id="switch-to-login"
            className="action-button"
            onClick={toggleForm} 
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;

