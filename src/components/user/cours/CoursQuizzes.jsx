import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizByCoursId, deleteQuiz } from '../../../services/quizservice';
import { getCurrentUser } from '../../../services/authservice';
import { Box, Card, CardContent, CardActions, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const CourseQuizzesPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);

        // Récupérer les quizzes
        const quizzesRes = await getQuizByCoursId(courseId);
        // Filtrer les quizzes normaux (non finaux)
        const normalQuizzes = quizzesRes.data.filter(quiz => !quiz.isFinalTest);
        setQuizzes(normalQuizzes);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        setError(err.response?.data?.message || 'Erreur lors du chargement des quizzes.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      try {
        await deleteQuiz(quizId);
        setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
        toast.success('Quiz supprimé avec succès !');
      } catch (err) {
        toast.error('Erreur lors de la suppression du quiz.');
      }
    }
  };

  const handleEditQuiz = (quiz) => {
    navigate(`/cours/${courseId}/quiz/${quiz._id}/edit`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5, color: 'error.main' }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="course-quizzes-page" sx={{ minHeight: '100vh', padding: '2rem' }}>
      <Box className="container" sx={{ maxWidth: '900px', margin: '0 auto' }}>
        <Typography variant="h4" color="primary" fontWeight="bold" sx={{ mb: 4 }}>
          Quizzes du cours
        </Typography>

        {/* Liste des quizzes */}
        {quizzes.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            Aucun quiz disponible pour ce cours.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {quizzes.map(quiz => (
              <Card key={quiz._id} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: '12px' }}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {quiz.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    {quiz.descriptionquiz}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Durée :</strong> {quiz.timeLimit} min | <strong>Score requis :</strong> {quiz.passingScore}%
                  </Typography>
                  <Typography variant="body2">
                    <strong>Questions :</strong> {quiz.questions.length}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  {currentUser?.role === 'enseignant' ? (
                    <>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditQuiz(quiz)}
                        title="Modifier le quiz"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteQuiz(quiz._id)}
                        title="Supprimer le quiz"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => navigate(`/affichequiz/${courseId}`)}
                    >
                      Voir le quiz
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CourseQuizzesPage;