import React, { useState, useRef, useEffect } from "react";
import "../styles/navbar.css";

const Navbar = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="navbar-title">TaskFlow</span>
      </div>

      <div className="profile-box" onClick={() => setOpen(!open)}>
        <img
          src="https://i1.wp.com/res.cloudinary.com/tuzup/image/upload/v1658929366/SplitApp/user_l7xmft.png"
          alt="profile"
        />
        <span className="user-name">{user?.name}</span>
      </div>

      {open && (
        <div className="profile-dropdown" ref={menuRef}>
          <div className="profile-info">
            <strong>{user?.name}</strong>
            <small>{user?.email}</small>
          </div>

          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
