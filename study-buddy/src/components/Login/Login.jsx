import React, { useState } from "react";
import "./Login.css";
import login_image2 from "../../assets/login_background2.png";
import logo from "../../assets/logo.png";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase.js";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const userLogin = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("user", JSON.stringify(userCredential.user));
    return userCredential.user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getSchoolsMap = async () => {
  const map = doc(db, "availableSchools", "map");
  try {
    const docSnapshot = await getDoc(map);
    if (docSnapshot.exists()) {
      return docSnapshot.data().schoolDomains;
    } else {
      console.log("No such document");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
};

const userSignup = async (email, password, firstName, lastName) => {
  const schoolsMap = await getSchoolsMap();
  const emailDomain = email.split('@')[1];

  if (!schoolsMap || !schoolsMap[emailDomain]) {
    throw new Error("Invalid School Email");
  }

  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      email,
      firstName,
      lastName,
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
      id: user.uid
    });

    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("Email is already in use.");
    } else if (error.code === "auth/invalid-email") {
      throw new Error("Invalid Email.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Password is not strong enough.");
    } else {
      console.error(error);
      throw new Error("Signup failed. Please try again.");
    }
  }
};

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await userLogin(email, password);
      navigate("/home");
    } catch (error) {
      console.error(error);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  const handleSignup = async () => {
    try {
      await userSignup(email, password, firstName, lastName);
      navigate("/home");
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const handleLeftButton = async (e) => {
    e.preventDefault();
    if (isLogin) {
      setIsLogin(false); // Switch to signup form
    } else {
      await handleSignup(); // Submit signup
    }
  };

  const handleRightButton = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogin(); // Submit login
    } else {
      setIsLogin(true); // Switch to login form
    }
  };

  return (
    <div className="login-page">
      <div className="login-and-image-container">
        <div className="login-container">
          <div className="auth-container">
            <div className="auth-items-container">
              <img src={logo} className="login-logo" alt="Logo" />
              <h1>{isLogin ? "Welcome to Study Buddy!" : "Sign up to get started!"}</h1>
              <form className="auth-form">
                {!isLogin && (
                  <>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </>
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}

                <div className="buttons-container">
                  <button
                    type="button"
                    className="action-button secondary"
                    onClick={handleLeftButton}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    className="action-button primary"
                    onClick={handleRightButton}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="image-container">
          <img src={login_image2} alt="Login Image" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
