import { NavLink } from 'react-router-dom';
import ProfitCraftMini from '../../assets/ProfitCraftMini.png';
import './Navbar.scss';

function Navbar() {
  return (
    <>
      <div className="placeholder"></div>
      <nav>
        <ul className="nav-list">
          <li className="logo-container">
            <NavLink to="/" className="logo">
              <img src={ProfitCraftMini} alt="ProfitCraft-Logo" />
            </NavLink>
            <h1>Profit Craft</h1>
          </li>
          <li className="nav-links">
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/journal"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Journal
            </NavLink>
            <NavLink
              to="/analyse"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Analyse
            </NavLink>
            <NavLink
              to="/shop"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Shop
            </NavLink>
            <NavLink
              to="/profil"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Profil
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;