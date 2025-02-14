import React, { useState } from "react";
import "./Login.css";
import login_image from "../../assets/login_image.jpg";
import logo from "../../assets/logo.png";


function LoginForm(){
  return (
    <div id="login-form" className="auth-items-container">
      <img src={logo} className="login-logo" alt="Logo" />
      <h1>Welcome to Study Buddy!</h1>
      <form id="login-form-element" className="auth-form">
          <input type="email" id="login-email" placeholder="Email" required />
          <input type="password" id="login-password" placeholder="Password" required />

        <div className="buttons-container">   
          <button type="submit" className="action-button">Login</button>
          <button id="switch-to-signup" className="action-button" >Sign Up</button>
        </div>
      </form>
    </div>
  );
}

function SignupForm(){
  return (
    <div id="signup-form" className="auth-items-container">
        <img src={logo} className="login-logo" alt="Logo" />
        <h2>Sign up to get started!</h2>
        <form id="signup-form-element">
            <input type="text" id="signup-first-name" placeholder="First Name" required />
            <input type="text" id="signup-last-name" placeholder="Last Name" required />
            <input type="email" id="signup-email" placeholder="Email" required />
            <input type="password" id="signup-password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
        <button id="switch-to-login">Already have an account? Login</button>
    </div>
  );
}



function App() {
  return (
    <div className="login-page">
      <div class="login-and-image-container">
        <div class="login-container">
              <div class="auth-container">
                <LoginForm />
              </div>
        </div>
        <div class="image-container">
            <img src={login_image} alt="Login Image" />
        </div>
      </div>
    </div>
  );
}

export default App;

