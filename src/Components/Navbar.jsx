import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa";
import "./navbar.css";
import logo from './logo.jpg'

function Navbar() {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };

  return (
    <header>
        <div>
            <img className='logo'src={logo} alt="logo"></img>
        </div>
      <nav ref={navRef}>
        <div className="gpt3__navbar-links_container">
          <p><Link to="/">Home</Link></p>
          <p><Link to="/connections">Connections</Link></p>
          <p><Link to="/match">Swipe</Link></p>
          <p><Link to="/mymatches">My Matches</Link></p>
          <div className="signIn_container">
            <Link to="/login">
              <button type="button">Log In / Register</button>
            </Link>
          </div>
        </div>
        <button className="nav-btn nav-close-btn" onClick={showNavbar}>
          <FaTimes />
        </button>
      </nav>
      <button className='nav-btn' onClick={showNavbar}>
        <FaBars />
      </button>
    </header>
  );
}

export default Navbar;