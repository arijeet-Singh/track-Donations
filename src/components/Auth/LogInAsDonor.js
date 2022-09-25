import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";

import "./LogIn.css";
function LogInAsDonor() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(false);
  function saveTokenInLocalStorage(tokenDetails) {
    localStorage.setItem("userEmail", JSON.stringify(tokenDetails));
  }

  // THIS API WILL BE USED FOR STORING THE LOGIN INFO OF THE DONOR TO A DATABASE PROVIDED BY FIREBASE
  
  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyB0I1gvMRvmO1maRsFbDKMS1K_GPzNt1r0",
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
          setIsLogin(true);
          return res.json();
        } else {
          return res.json().then(() => {
            let errorMessage = "Authentication Failed!";
            setIsLogin(false);
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
        <h1 className="head">DONOR LOG IN</h1>
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
        {!isLogin && (
          <button className="button-su transaction-list-btn">LOG IN</button>
        )}
      </form>
      {isLogin && <Redirect to="/homePage" />}
    </div>
  );
}

export default LogInAsDonor;
