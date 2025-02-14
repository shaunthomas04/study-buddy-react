import React, { useState } from "react";
import "./Login.css";
import login_image from "../../assets/login_image.jpg";

function App() {
  
  return (
    <div className="login-page">
      <div class="login-and-image-container">
        <div class="login-container">
              <div class="auth-container">
                  
            
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

