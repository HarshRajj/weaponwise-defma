import React from "react";
import "./Navbar.css";

function DefmaNavbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="\images\logo.png" alt="DEFMA" />
      </div>
      <div className="nav-links">
        <a href="/HomePage1">Back To Home</a>
      </div>
    </nav>
  );
}

export default DefmaNavbar;
