import React, { useState } from "react";
import "../styles/navbar.css";

const Logo = "/taskflow-logo.png";

const Navbar = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <nav className="navbar">
      
      <div className="navbar-left">
        <img src={Logo} alt="Logo" className="navbar-logo" />
        <span className="navbar-title">TaskFlow</span>
      </div>

      

      <div className="navbar-profile" onClick={toggleDropdown}>
        <img
          src="https://i1.wp.com/res.cloudinary.com/tuzup/image/upload/v1658929366/SplitApp/user_l7xmft.png?ssl=1"
          alt="Avatar"
          className="navbar-avatar"
        />
        {dropdownOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-header">
              <strong>{user?.name}</strong>
              <small>{user?.email}</small>
            </div>
            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;
