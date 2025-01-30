import React from "react";
import { Link } from "react-router-dom";
import "./first-page.css";
import logo1 from "./logo1.png"; // Add your logo images
import logo2 from "./logo2.png";

function FirstPage() {
  return (
    <div id="box">
    <div className="Appgg">
      {/* Background is handled in CSS */}
      <div className="button-container">
        {/* Link for Weaponwise */}
        <Link to="/weaponwise-login">
          <button className="logo-button">
            <img src={logo1} alt="Weaponwise Logo" className="button-logo" />
          </button>
        </Link>

        {/* Link for Defma */}
        <Link to="/defma-login">
          <button className="logo-button">
            <img src={logo2} alt="Defma Logo" className="button-logo" />
          </button>
        </Link>
      </div>
    </div>
    </div>
  );
}

export default FirstPage;

