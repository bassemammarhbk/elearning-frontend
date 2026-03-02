import React from 'react';
import { UserCircle, Phone, Calendar, BadgeCheck, Edit } from 'lucide-react';


const ProfileCard = ({ user, onEdit }) => {
  return (
    <div className="profile-card">
      <div className="status-indicator">
        <div className="status-badge">
          <span className={`status-dot ${user.isActive ? 'active' : 'inactive'}`}></span>
          <span className="status-text">{user.isActive ? 'Actif' : 'Inactif'}</span>
        </div>
      </div>

      <button onClick={onEdit} className="edit-button-profile" aria-label="Edit profile">
        <Edit size={18} />
      </button>

      <div className="profile-content">
        <div className="profile-header">
          <div className="avatar-container">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={`${user.firstname} ${user.lastname}`}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                <UserCircle size={64} />
              </div>
            )}
            <span className="badge-icon">
              <BadgeCheck className={user.role === 'admin' ? 'admin' : 'user'} />
            </span>
          </div>
          <h1 className="profile-name">{user.firstname} {user.lastname}</h1>
          <p className="profile-role">{user.role || 'User'}</p>
        </div>

        <div className="profile-details">
          <div className="details-section">
            <h2 className="section-title">Contact Information</h2>

            <div className="detail-item">
              <div className="detail-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M21 5v14h-18v-14h18zm-18 0l9 6.5 9-6.5"></path>
                </svg>
              </div>
              <div className="detail-content">
                <p className="detail-label">Email</p>
                <p className="detail-value">{user.email}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <Phone className="icon" />
              </div>
              <div className="detail-content">
                <p className="detail-label">Téléphone</p>
                <p className="detail-value">{user.tel || 'Non renseigné'}</p>
              </div>
            </div>

            <div className="detail-item">
              <div className="detail-icon">
                <svg className="icon" viewBox="0 0 24 24">
                  <path d="M12 21a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9z"></path>
                  <path d="M12 12h.01"></path>
                  <path d="M7 15h10"></path>
                </svg>
              </div>
              <div className="detail-content">
                <p className="detail-label">Sexe</p>
                <p className="detail-value">{user.sexe || 'Non renseigné'}</p>
              </div>
            </div>
          </div>

          <div className="detail-item registration">
            <div className="detail-icon">
              <Calendar className="icon" />
            </div>
            <div className="detail-content">
              <p className="detail-label">Inscrit le</p>
              <p className="detail-value">
                {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;