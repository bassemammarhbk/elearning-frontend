import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getcoursById } from '../../../services/courservice';
import InsertQuiz from './InsertQuiz';
import '../../../user.css';

const CoursManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cours, setCours] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    const fetchCours = async () => {
      try {
        const res = await getcoursById(id);
        if (res.data.enseignantId !== user._id) {
          navigate('/unauthorized');
          return;
        }
        setCours(res.data);
      } catch (err) {
        console.error(err);
        navigate('/error');
      }
    };
    fetchCours();
  }, [id, navigate, user._id]);

  if (!cours) return <div>Chargement...</div>;

  return (
    <div className="cours-management-container">
      <h1>Gestion du cours: {cours.nomcours}</h1>

      <div className="management-actions">
        <button onClick={() => setShowQuizModal(true)} className="add-quiz-btn">
          Ajouter un Quiz
        </button>

        <button onClick={() => navigate(`/cours/${id}`)} className="preview-btn">
          Prévisualiser le cours
        </button>
      </div>
    </div>
  );
};

export default CoursManagement;