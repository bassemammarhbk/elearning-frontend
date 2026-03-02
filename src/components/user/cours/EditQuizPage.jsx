// src/components/quizzes/EditQuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, editQuiz } from '../../../services/quizservice';
import EditQuiz from './EditQuiz';
import { toast } from 'react-toastify';

export default function EditQuizPage() {
  const { courseId, quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizById(quizId);
        setQuiz(res.data);
      } catch (err) {
        toast.error('Impossible de charger le quiz');
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleQuizUpdated = () => {
    toast.success('Quiz mis à jour !');
    navigate(`/cours/${courseId}/quizzes`);
  };

  if (loading) return <p>Chargement…</p>;
  if (!quiz)    return <p>Quiz introuvable.</p>;

  return (
    <EditQuiz
      show={true}
      handleClose={() => navigate(-1)}
      quizToEdit={quiz}
      onQuizUpdated={handleQuizUpdated}
    />
  );
}
