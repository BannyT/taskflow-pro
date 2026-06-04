import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import '../styles/navbar.css';

function Navbar({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-mark">✓</span>
          <span className="logo-text">TaskFlow</span>
        </Link>

        <button className="mobile-btn" onClick={() => setMobileOpen(!mobileOpen)}>
          ☰
        </button>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="user-section">
                <span className="user-email">{user.email}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;