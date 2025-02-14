import React, { useState } from "react";
import "./Login.css";
import login_image from "../../assets/login_image.jpg";
import logo from "../../assets/logo.png";

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
          <img src={login_image} alt="Login Image" />
        </div>
      </div>
    </div>
  );
}

function LoginForm({ toggleForm }) {
  return (
    <div id="login-form" className="auth-items-container">
      <img src={logo} className="login-logo" alt="Logo" />
      <h1 style={{textAlign: "center"}} >Welcome to Study Buddy!</h1>
      <form id="login-form-element" className="auth-form">
        <input type="email" id="login-email" placeholder="Email" required />
        <input type="password" id="login-password" placeholder="Password" required />

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
  return (
    <div id="signup-form" className="auth-items-container">
      <img src={logo} className="login-logo" alt="Logo" />
      <h1>Sign up to get started!</h1>
      <form id="signup-form-element" className="auth-form">
        <input type="text" id="signup-first-name" placeholder="First Name" required />
        <input type="text" id="signup-last-name" placeholder="Last Name" required />
        <input type="email" id="signup-email" placeholder="Email" required />
        <input type="password" id="signup-password" placeholder="Password" required />

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
