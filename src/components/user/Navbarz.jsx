import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AcademicCapIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  BookOpenIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { getCurrentUser, logout } from '../../services/authservice';
import './navbar.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbarz = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    const handleStorageChange = () => {
      setCurrentUser(getCurrentUser());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [location]);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsAvatarMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setIsAvatarMenuOpen(false);
    navigate('/homes');
    window.dispatchEvent(new Event('storage'));
    toast.success('Déconnexion réussie');
  };

  const handleProfileClick = () => {
    setIsAvatarMenuOpen(false);
    navigate('/profil');
  };

  const isActive = (path) => (location.pathname === path ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to="/homes" className="navbar-brand">
            <AcademicCapIcon className="icon" />
            <span className="brand-text">Learnista</span>
          </Link>
        </div>

        <div className="navbar-menu">
          <Link to="/homes" className={isActive('/homes')}>
            Accueil
          </Link>
          <Link to="/filieres" className={isActive('/filieres')}>
            Filières
          </Link>
          {currentUser?.role === 'enseignant' && (
            <Link to="/mes-cours" className={isActive('/mes-cours')}>
              Mes Cours
            </Link>
          )}
          {currentUser?.role === 'etudiant' && (
            <Link to="/mes-cours-etudiant" className={isActive('/mes-cours-etudiant')}>
              Mes Cours
            </Link>
          )}
          {currentUser?.role === 'etudiant' && (
            <Link to="/standings" className={isActive('/standings')}>
              Classements
            </Link>
          )}
          <Link to="/chatbot" className={isActive('/chatbot')}>
            Chatbot
          </Link>
          <Link to="/contact" className={isActive('/contact')}>
            Contact
          </Link>
          {currentUser?.role === 'admin' && (
            <Link to="/admin/dashboard" className={isActive('/admin/dashboard')}>
              Espace Admin
            </Link>
          )}
          {currentUser ? (
            <div className="navbar-avatar" ref={dropdownRef}>
              <img
                src={currentUser.avatar || '/default-avatar.png'}
                alt="Avatar"
                className="avatar-img"
                onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
              />
              <div className={`avatar-dropdown ${isAvatarMenuOpen ? 'active' : ''}`}>
                <Link
                  to="/profil"
                  className="avatar-dropdown-item"
                  onClick={handleProfileClick}
                >
                  <UserIcon className="icon-small" />
                  Profil
                </Link>
                <button onClick={handleLogout} className="avatar-dropdown-item">
                  <ArrowRightOnRectangleIcon className="icon-small" />
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="login-button">
              <UserIcon className="icon-small" />
              Connexion
            </Link>
          )}
        </div>

        <div className="navbar-toggle">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-btn" aria-label="Toggle menu">
            {isMenuOpen ? <XMarkIcon className="icon" /> : <Bars3Icon className="icon" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/homes" className="mobile-link">
            Accueil
          </Link>
          <Link to="/filieres" className="mobile-link">
            Filières
          </Link>
          <Link to="/about" className="mobile-link">
            À propos
          </Link>
          <Link to="/contact" className="mobile-link">
            Contact
          </Link>
          {currentUser?.role === 'enseignant' && (
            <Link to="/mes-cours" className="mobile-link">
              <BookOpenIcon className="icon-small" />
              Mes Cours
            </Link>
          )}
          {currentUser?.role === 'etudiant' && (
            <Link to="/mes-cours-etudiant" className="mobile-link">
              <BookOpenIcon className="icon-small" />
              Mes Cours
            </Link>
          )}
          {currentUser?.role === 'etudiant' && (
            <Link to="/standings" className="mobile-link">
              Classements
            </Link>
          )}
          <Link to="/chatbot" className="mobile-link">
            Chatbot
          </Link>
          {currentUser?.role === 'admin' && (
            <Link to="/admin/dashboard" className="mobile-link">
              Espace Admin
            </Link>
          )}
          {currentUser ? (
            <div className="mobile-avatar" ref={dropdownRef}>
              <img
                src={currentUser.avatar || '/default-avatar.png'}
                alt="Avatar"
                className="avatar-img"
                onClick={() => setIsAvatarMenuOpen(!isAvatarMenuOpen)}
              />
              {isAvatarMenuOpen && (
                <div className="avatar-dropdown">
                  <Link
                    to="/profil"
                    className="mobile-link"
                    onClick={handleProfileClick}
                  >
                    Profil
                  </Link>
                  <button onClick={handleLogout} className="mobile-link">
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button mobile-login">
              <UserIcon className="icon-small" />
              Connexion
            </Link>
          )}
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </nav>
  );
};

export default Navbarz;