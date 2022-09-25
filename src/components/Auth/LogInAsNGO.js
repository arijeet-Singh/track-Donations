import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";

import "./LogIn.css";
function LogInAsNGO() {
  const [LogIn, setIsLogIn] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // THIS FUNCTION STORES THE LOGGED IN NGO'S EMAIL, FOR DATA RETRIEVAL IN OTHER PAGES.

  function saveTokenInLocalStorage(tokenDetails) {
    localStorage.setItem("userEmail", JSON.stringify(tokenDetails));
    setIsLogIn(true);
  }

  // THIS API WILL BE USED FOR STORING THE LOGIN INFO OF THE NGO TO A DATABASE PROVIDED BY FIREBASE

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCWshObZRK4immwWy7uzJFMAyvsKO33kXA",
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then(() => {
            let errorMessage = "Authentication Failed!";
            alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        saveTokenInLocalStorage(data.email);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div className="container10">
      <form className="login" onSubmit={submitHandler}>
        <h1 className="head">NGO LOG IN</h1>
        <input
          type="text"
          className="login__input"
          placeholder="Email"
          ref={emailInputRef}
        />
        <br />
        <input
          type="password"
          className="login__input"
          placeholder="Password"
          ref={passwordInputRef}
        />
        <button className="button-su transaction-list-btn">LOG IN</button>
      </form>
      {LogIn && <Redirect to="/yourCampaign" />}
    </div>
  );
}

export default LogInAsNGO;
