import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import ProfitCraftMini from '../../assets/ProfitCraftMini.png';
import './Navbar.scss';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <div className="placeholder"></div>
      <nav>
        <ul className="nav-list">
          <li className="logo-container">
            <NavLink to="/#header" className="logo" onClick={closeMenu}>
              <img src={ProfitCraftMini} alt="ProfitCraft-Logo" />
            </NavLink>
            <h1>Profit Craft</h1>
          </li>

          <li className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <NavLink to="/" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Dashboard
            </NavLink>
            <NavLink to="/journal" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Journal
            </NavLink>
            <NavLink to="/analyse" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Analyse
            </NavLink>
            <NavLink to="/shop" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Shop
            </NavLink>
            <NavLink to="/profil" onClick={closeMenu} className={({ isActive }) => (isActive ? 'active' : '')}>
              Profil
            </NavLink>
          </li>

          <div className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </div>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;
