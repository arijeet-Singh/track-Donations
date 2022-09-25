import React, { useRef, useState } from "react";
import { Redirect } from "react-router-dom";
import "./SignUp.css";
function SignUpAsNGO() {
  const [create, setCreate] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  // THIS API WILL BE USED FOR STORING THE SIGNUP INFO OF THE NGO TO A DATABASE PROVIDED BY FIREBASE

  const submitHandler = (event) => {
    event.preventDefault();
    setCreate(true);
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCWshObZRK4immwWy7uzJFMAyvsKO33kXA",
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
  };

  return (
    <section>
      <div className="container10">
        <form className="login" onSubmit={submitHandler}>
          <h1 className="head">NGO SIGN UP</h1>
          <div className="control">
            <input
              id="email"
              type="text"
              className="login__input"
              placeholder="Email"
              required
              autoComplete="off"
              ref={emailInputRef}
            />
            <br />
            <input
              id="password"
              type="password"
              className="login__input"
              placeholder="Password"
              required
              autoComplete="off"
              ref={passwordInputRef}
            />
            <button className="button-su transaction-list-btn">SIGN UP</button>
          </div>
        </form>
        {create && <Redirect to="/cmcF" />}
      </div>
    </section>
  );
}

export default SignUpAsNGO;
