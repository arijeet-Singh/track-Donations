import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import "./SignUp.css";
function SignUpAsDonor() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isSignUp, setIsSignUp] = useState(false);

  // THIS API WILL BE USED FOR STORING THE SIGNUP INFO OF THE DONOR TO A DATABASE PROVIDED BY FIREBASE

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB0I1gvMRvmO1maRsFbDKMS1K_GPzNt1r0",
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    setIsSignUp(true);
  };

  return (
    <div className="container10">
      <form className="login" onSubmit={submitHandler}>
        <h1 className="head">DONOR SIGN UP</h1>
        <input
          type="text"
          className="login__input"
          placeholder="Email"
          required
          ref={emailInputRef}
        />
        <br />
        <input
          type="password"
          className="login__input"
          placeholder="Password"
          required
          ref={passwordInputRef}
        />
        <button
          className="button-su transaction-list-btn"
        >
          SIGN UP
        </button>
      </form>
      {isSignUp && <Redirect to="/liD" />}
    </div>
  );
}

export default SignUpAsDonor;
