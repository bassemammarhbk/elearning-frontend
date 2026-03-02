import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../services/profilservice';
import { getCurrentUser } from '../../services/authservice';
import ProfileCard from './ProfileCard';
import EditProfileModal from './EditProfileModal';
import './profil.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    avatar: '',
    tel: '',
    sexe: '',
  });

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProfile();
      setUser(response.data);
      setFormData({
        firstname: response.data.firstname || '',
        lastname: response.data.lastname || '',
        avatar: response.data.avatar || '',
        tel: response.data.tel || '',
        sexe: response.data.sexe || '',
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // New handler for avatar changes
  const handleAvatarChange = (avatarUrl) => {
    setFormData({ ...formData, avatar: avatarUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = getCurrentUser();
      if (!currentUser?._id) {
        throw new Error('User ID not found.');
      }
      await updateProfile(currentUser._id, formData);
      await fetchProfile();
      setOpenModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <h3>Erreur</h3>
          <p>{error}</p>
          <button onClick={fetchProfile}>Réessayer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {user && (
        <>
          <ProfileCard user={user} onEdit={handleOpenModal} />
          <EditProfileModal
            isOpen={openModal}
            onClose={handleCloseModal}
            formData={formData}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            error={error}
            onAvatarChange={handleAvatarChange} // Pass the new handler
          />
        </>
      )}
    </div>
  );
};

export default ProfilePage;