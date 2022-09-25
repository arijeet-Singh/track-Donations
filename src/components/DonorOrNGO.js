import React from "react";
import { Link } from "react-router-dom";
import "./DonorOrNGO.css";

// GIVES TWO OPTIONS EACH FOR SIGNUP AND LOGIN: DONOR OR NGO?

function DonorOrNGO() {
  return (
    <div className="container-don">
      <p className="option1">SIGN UP</p>
      <Link to="/suD" style={{ textDecoration: "none" }}>
        <button className="button transaction-list-btn">DONOR</button>
      </Link>
      <Link to="/suN" style={{ textDecoration: "none" }}>
        <button className="button transaction-list-btn">NGO</button>
      </Link>
      <hr />
      <p className="option2">LOG IN</p>
      <Link to="/liD" style={{ textDecoration: "none" }}>
        <button className="button transaction-list-btn">DONOR</button>
      </Link>
      <Link to="/liN" style={{ textDecoration: "none" }}>
        <button className="button transaction-list-btn">NGO</button>
      </Link>
    </div>
  );
}
export default DonorOrNGO;
