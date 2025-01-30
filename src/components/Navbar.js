// Navbar.js
import React from "react";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
        <div className="logo">
          <img src="\images\logo2.jpg"
                alt="WeaponWise">

                </img>

        </div>
        <div className="nav-links">
          <a href="/HomePage">Back To Home</a>
          </div>
      </nav>
  );
}

export default Navbar;
