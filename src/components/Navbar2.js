import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./Heading.css";
function Navbar2() {
  const [LogOut, setLogOut] = useState(false);

  function logOut() {
    localStorage.clear();
    setLogOut(true);
  }

  return (
    <div className="heading3">
      <button className="variable-width-btn-1 button-su log" onClick={logOut}>
        <span className="text">LOG OUT</span>
      </button>
      {LogOut && <Redirect to="/landingPage" />}
    </div>
  );
}
export default Navbar2;
