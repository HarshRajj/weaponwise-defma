import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './HomePage1.css';

function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    "/images/d1.jpg",
    "/images/d2.jpg",
    "/images/d3.jpg",
    "/images/d4.jpg",

  ];
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/defmaRequestForm'); 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval); 
  }, [slides.length]);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="App">
      <header className="navbar">
        <div className="logo">
          {/* Replace MyLogo with an image */}
          <img src="/images/logo.png" alt="Logo" className="logo-img" />
        </div>
        <nav className="nav-links">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="#about">Contact Us</a></li>
          </ul>
        </nav>
        <div className="hamburger" onClick={toggleMenu}>☰</div>
      </header>

      {isMenuOpen && (
        <div className="hamburger-menu">
          <ul>
            <li><a href="#inventory">Inventory</a></li>
            <li><a href="#available-drivers with vehicle">Available Drivers with vehicle</a></li>
          </ul>
        </div>
      )}

      <div className="slideshow">
        <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
      </div>

      <div className="buttons">
        <button className="btn" onClick={handleClick}>Request</button>
        <Link to="/allotted">
        <button className="btn">Allotted Driver</button></Link>
        <Link to="/monitor">
        <button className="btn">Monitor</button>
      </Link>
      </div>

      {/* About Us Section */}
      <div className="about-us" id="about">
        <h2>About Us</h2>
        <p>
          This  is a product of team BugHunter.
          This product will serve our defence forces by providing a better , efficient and reliable way to manage and track the fleet in real-time. Currently our forces  only track the odometer in the vehicle and that too manually for all the information they can get . But with this product the fleet management  system will be automated and will report any unusual activity with the vehicle .Our system will keep track of all  the parameters of the vehicle and will alert the  person in charge and the driver of the vehicle of the abnormality in the parameters .
        </p>
      </div>

      {/* Footer */}
      <footer className="footer">

       <p> © 2024 DeFMA. All rights reserved       </p>
       <p>
          Contact us: 
          <a href="mailto:harsh1744raj@gmail.com">  harsh1744raj@gmail.com</a> |  
          <a href="mailto:arjun.gupta.cseaiml.2022@miet.ac.in">  arjun.gupta.cseaiml.2022@miet.ac.in</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
