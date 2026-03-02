import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getcoursById, addContenuToCours, deleteContenuFromCours, editContenuInCours } from '../../../services/courservice';
import { getQuizByCoursId, deleteQuiz, submitQuiz, getQuizzesReussis, deleteQuestionFromQuiz } from '../../../services/quizservice';
import { completeChapitre, getChapitresCompletes } from '../../../services/userservice';
import { getCurrentUser } from '../../../services/authservice';
import InsertQuiz from './InsertQuiz';
import AddContenuModal from './AddContenuModal';
import EditQuiz from './EditQuiz';
import PreviewIcon from '@mui/icons-material/Preview';
import { EyeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import QuizIcon from '@mui/icons-material/Quiz';
import InserTestFinal from './InserTestFinal';
import { Button, Card, Modal } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from '../../../api/axios';
import '../../../user.css';
import ReplayIcon from '@mui/icons-material/Replay';
import { CheckCircle2Icon } from 'lucide-react';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  CheckCircleOutline,
  HighlightOff
} from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const CoursDetails = () => {
  const { id } = useParams();
  const [cours, setCours] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showContenuModal, setShowContenuModal] = useState(false);
  const [showEditContenuModal, setShowEditContenuModal] = useState(false);
  const [showEditQuizModal, setShowEditQuizModal] = useState(false);
  const [showFinalTestModal, setShowFinalTestModal] = useState(false);
  const [showInserFinalTestModal, setshowInserFinalTestModal] = useState(false);
  const [contenuToEdit, setContenuToEdit] = useState(null);
  const [quizToEdit, setQuizToEdit] = useState(null);
  const [answers, setAnswers] = useState({});
  const [completionStatus, setCompletionStatus] = useState({});
  const [quizzesReussis, setQuizzesReussis] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteQuestionIndex, setDeleteQuestionIndex] = useState(null);
  const [finalTestPassed, setFinalTestPassed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const user = getCurrentUser();
        setCurrentUser(user);

        const [coursRes, quizzesRes] = await Promise.all([
          getcoursById(id),
          getQuizByCoursId(id),
        ]);
        setCours(coursRes.data);
        setQuizzes(quizzesRes.data);

        if (coursRes.data.contenu && coursRes.data.contenu.length > 0) {
          setSelectedContentId(coursRes.data.contenu[0]._id);
        }

        if (user?.role === 'etudiant') {
          const { data: reussis } = await getQuizzesReussis(user._id);
          const ids = reussis.map((item) =>
            typeof item === 'string' ? item : item.quizId?._id
          );
          setQuizzesReussis(ids);

          const finalTestReussi = user.finalTestsReussis?.some(
            (test) => test.testId === coursRes.data.finalTest?._id
          );
          setFinalTestPassed(finalTestReussi || false);
        }

        if (user?.role === 'etudiant') {
          getChapitresCompletes(user._id)
            .then((res) => {
              const status = {};
              res.data.forEach(({ coursId, chapitreId }) => {
                if (coursId === id) status[chapitreId] = true;
              });
              setCompletionStatus(status);
            })
            .catch(() => {});
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setErreur('Erreur de chargement.');
        setLoading(false);
      }
    };

    init();
  }, [id]);

  useEffect(() => {
    if (!selectedContentId || currentUser?.role !== 'etudiant') return;

    const chapterQuizzes = quizzes.filter(q => q.chapterId === selectedContentId);
    if (chapterQuizzes.length === 0) return;

    const allQuizzesPassed = chapterQuizzes.every(quiz =>
      quizResults[quiz._id]?.passed
    );

    if (allQuizzesPassed && !completionStatus[selectedContentId]) {
      handleCompleteChapter(selectedContentId);
    }
  }, [quizResults, selectedContentId, quizzes, completionStatus, currentUser]);

  const handleCompleteChapter = async (chapterId) => {
    try {
      const chapterQuizzes = quizzes.filter((q) => q.chapterId === chapterId);

      const allQuizzesSubmitted = chapterQuizzes.every(quiz =>
        quizResults[quiz._id] !== undefined
      );

      if (!allQuizzesSubmitted) {
        toast.error(
          'Vous devez soumettre tous les quizzes de ce chapitre avant de le marquer comme complété.'
        );
        return;
      }

      const allQuizzesPassed = chapterQuizzes.every(quiz =>
        quizResults[quiz._id]?.passed
      );

      if (!allQuizzesPassed) {
        toast.error(
          'Vous devez réussir tous les quizzes de ce chapitre pour le marquer comme complété.'
        );
        return;
      }

      await completeChapitre(id, chapterId);
      setCompletionStatus((prev) => ({ ...prev, [chapterId]: true }));
      toast.success('Chapitre marqué comme complété !');
    } catch (err) {
      console.error('Erreur complète chapitre :', err);
      toast.error('Échec de la mise à jour.');
    }
  };

  const openQuizModal = () => {
    if (!selectedContentId) {
      setErreur('Veuillez sélectionner un chapitre avant d’ajouter un quiz.');
      return;
    }
    setQuizToEdit(null);
    setShowQuizModal(true);
  };

  const handleQuizCreated = async () => {
    try {
      const quizzesRes = await getQuizByCoursId(id);
      setQuizzes(quizzesRes.data);
    } catch (err) {
      setErreur('Impossible de recharger les quiz.');
    }
  };

  const handleDeleteQuiz = (quizId) => {
    setDeleteType('quiz');
    setDeleteId(quizId);
    setShowDeleteModal(true);
  };

  const handleDeleteQuestion = (quizId, questionIndex) => {
    setDeleteType('question');
    setDeleteId(quizId);
    setDeleteQuestionIndex(questionIndex);
    setShowDeleteModal(true);
  };

  const handleDeleteContenu = (contenuId) => {
    setDeleteType('contenu');
    setDeleteId(contenuId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'quiz') {
        await deleteQuiz(deleteId);
        handleQuizCreated();
        toast.success('Quiz supprimé avec succès !');
      } else if (deleteType === 'question') {
        await deleteQuestionFromQuiz(deleteId, deleteQuestionIndex);
        toast.success('Question supprimée avec succès !');
        const quizzesRes = await getQuizByCoursId(id);
        setQuizzes(quizzesRes.data);
      } else if (deleteType === 'contenu') {
        await deleteContenuFromCours(id, deleteId);
        const { data } = await getcoursById(id);
        setCours(data);
        if (selectedContentId === deleteId) {
          setSelectedContentId(null);
        }
        toast.success('Chapitre supprimé !');
      }
    } catch (err) {
      console.error(`Erreur suppression ${deleteType} :`, err);
      toast.error(`Erreur lors de la suppression du ${deleteType}`);
    } finally {
      setShowDeleteModal(false);
      setDeleteType(null);
      setDeleteId(null);
      setDeleteQuestionIndex(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteType(null);
    setDeleteId(null);
    setDeleteQuestionIndex(null);
  };

  const handleEditQuiz = (quiz) => {
    setQuizToEdit(quiz);
    setShowEditQuizModal(true);
  };

  const handleContenuAdded = async (newContenu) => {
    try {
      await addContenuToCours(id, newContenu);
      const { data } = await getcoursById(id);
      setCours(data);
      toast.success('Chapitre ajouté !');
    } catch (err) {
      console.error(err);
      toast.error(`Échec de l’ajout : ${err.message}`);
    }
  };

  const handleEditContenu = async (updatedContenu) => {
    try {
      await editContenuInCours(id, contenuToEdit._id, updatedContenu);
      const { data } = await getcoursById(id);
      setCours(data);
      setShowEditContenuModal(false);
      toast.success('Contenu mis à jour !');
    } catch (err) {
      console.error(err);
      toast.error(`Échec de la mise à jour : ${err.message}`);
    }
  };

  const openEditContenuModal = (contenu) => {
    setContenuToEdit(contenu);
    setShowEditContenuModal(true);
  };

  const handleSelectContent = (contenuId) => {
    setSelectedContentId(contenuId);
    window.scrollTo(0, 0);
  };

  const handleOptionChange = (questionKey, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: optionIndex,
    }));
  };

  const isQuizReussi = (quizId) => {
    return quizzesReussis.includes(quizId);
  };

  const handleSubmitQuiz = async (quiz) => {
    if (!quiz?._id) {
      toast.error('Impossible de soumettre : quiz invalide.');
      return;
    }
    const total = quiz.questions?.length || 0;
    if (total === 0) {
      toast.warn('Ce quiz ne contient aucune question.');
      return;
    }
    const answeredCount = quiz.questions.filter((_, idx) => answers[`${quiz._id}-${idx}`] !== undefined).length;
    if (answeredCount < total) {
      toast.warn(`Veuillez répondre à toutes les questions (${answeredCount}/${total}).`);
      return;
    }
    try {
      const reponses = quiz.questions.map((_, idx) => answers[`${quiz._id}-${idx}`]);
      const res = await submitQuiz(quiz._id, { reponses });
      const { score, passed, pointsObtenus } = res.data;

      const resultDetails = {};
      quiz.questions.forEach((question, idx) => {
        const correctAnswer = question.options.findIndex(opt => opt.isCorrect);
        resultDetails[idx] = {
          selected: answers[`${quiz._id}-${idx}`],
          correct: correctAnswer,
          isCorrect: answers[`${quiz._id}-${idx}`] === correctAnswer
        };
      });

      setQuizResults(prev => ({
        ...prev,
        [quiz._id]: {
          passed,
          score,
          details: resultDetails
        }
      }));

      if (passed) {
        setQuizzesReussis(prev => [...prev, quiz._id]);
        toast.success(`Quiz réussi ! Score : ${Math.round(score)}% | Points obtenus : ${pointsObtenus}`);
      } else {
        toast.error(`Quiz échoué ! Score : ${Math.round(score)}%`);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      console.error('Erreur soumission quiz :', err);
      toast.error(`Erreur lors de la soumission : ${msg}`);
    }
  };

  const handleRetryQuiz = (quiz) => {
    setQuizResults(prev => {
      const { [quiz._id]: _, ...rest } = prev;
      return rest;
    });
    setAnswers(prev => {
      const newAns = { ...prev };
      quiz.questions.forEach((_, idx) => {
        delete newAns[`${quiz._id}-${idx}`];
      });
      return newAns;
    });
    setQuizzesReussis(prev => prev.filter(id => id !== quiz._id));
  };

  const allChaptersCompleted = cours?.contenu.every((chap) => completionStatus[chap._id]);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress size={60} thickness={4} style={{ color: '#1976d2' }} />
        <p style={{ marginTop: '1rem', fontSize: '1.2rem', color: '#333' }}>
          Chargement du cours en cours...
        </p>
      </div>
    );
  }
  if (erreur) return <div className="error-message">{erreur}</div>;
  if (!cours) return <div className="no-data">Aucun cours trouvé.</div>;

  const selectedContent = cours.contenu.find((item) => item._id === selectedContentId) || null;
  const lastChapterId = cours?.contenu?.length
    ? cours.contenu[cours.contenu.length - 1]._id
    : null;
  const isLastChapter = selectedContentId === lastChapterId;

  const chapterQuizzes = quizzes.filter((q) => q.chapterId === selectedContent?._id);

  const allQuizzesPassed = chapterQuizzes.length > 0 &&
                           chapterQuizzes.every(quiz => quizResults[quiz._id]?.passed);

  return (
    <div className="cours-detail-layout">
      <aside className="cours-sidebar">
        <h2>Chapitres</h2>
        <ul>
          {cours.contenu.map((item, idx) => (
            <li
              key={item._id}
              className={selectedContentId === item._id ? 'active' : ''}
              onClick={() => setSelectedContentId(item._id)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.5rem 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="chapitre-number">{idx + 1}.</span>
                {item.titreChapitre || `Chapitre ${idx + 1}`}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {completionStatus[item._id] && (
                  <CheckCircle2Icon style={{ color: 'green' }} titleAccess="Chapitre complété" />
                )}
                {currentUser?.role === 'enseignant' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditContenuModal(item);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                      title="Modifier le chapitre"
                    >
                      <EditIcon style={{ color: '#1976d2', fontSize: '1.2rem' }} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteContenu(item._id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.2rem',
                      }}
                      title="Supprimer le chapitre"
                    >
                      <DeleteIcon style={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
          {currentUser?.role === 'etudiant' && (
            <li
              key="final-test"
              className={`final-test-item ${allChaptersCompleted && cours.finalTest ? '' : 'disabled'}`}
              onClick={() => {
                if (!allChaptersCompleted) {
                  toast.error("Vous devez d’abord terminer tous les chapitres du cours pour passer le test");
                } else if (!cours.finalTest) {
                  toast.error("Le test final n’est pas encore disponible pour ce cours. Revenez bientôt pour le passer !");
                } else {
                  navigate(`/cours/${id}/final-test`);
                }
              }}
              style={{
                cursor: allChaptersCompleted && cours.finalTest ? 'pointer' : 'not-allowed',
                opacity: allChaptersCompleted && cours.finalTest ? 1 : 0.5,
              }}
            >
              🎓 Test final
              {finalTestPassed && (
                <span
                  style={{ color: 'green', marginLeft: '10px', cursor: 'pointer' }}
                  onClick={() => navigate(`/cours/${id}/certificat`)}
                >
                  ✅ Entrer pour télécharger ton certificat
                </span>
              )}
              {!allChaptersCompleted && (
                <small className="d-block text-muted">(Terminez tous les chapitres)</small>
              )}
              {allChaptersCompleted && !cours.finalTest && (
                <small className="d-block text-muted">(Test non disponible)</small>
              )}
            </li>
          )}
        </ul>
      </aside>

      <main className="cours-content">
        <h1>{cours.nomcours}</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <p style={{ margin: 0 }}>
            <strong>Niveau :</strong> {cours.niveau} | <strong>Durée :</strong> {cours.duree}
          </p>
          {currentUser && currentUser.role === 'enseignant' && (
            <Button
              onClick={() => setShowContenuModal(true)}
              className="mt-0"
              style={{ width: 'auto', padding: '0.5rem 1rem' }}
            >
              <AddCircleIcon style={{ marginRight: '0.5rem' }} />
              Nouveau chapitre
            </Button>
          )}
        </div>
        <img src={cours.imagecours} alt={cours.nomcours} className="cours-img" />
        <p>{cours.description}</p>

        {currentUser?.role === 'enseignant' && (
          <div className="teacher-actions">
            {!cours.finalTest ? (
              <button
                onClick={() => setshowInserFinalTestModal(true)}
                className="btn-action primary"
              >
                <AddCircleIcon className="icon" /> Ajouter le test final
              </button>
            ) : (
              <button
                onClick={() => navigate(`/cours/${id}/teacher-final-test`)}
                className="btn-action primary"
              >
                <PreviewIcon className="icon" /> Voir le test final
              </button>
            )}
          </div>
        )}

        <div className="action-buttons-container forum-line">
          <button
            className="btn-action btn-forum"
            onClick={() => navigate(`/cours/${id}/forum`)}
          >
            <ChatBubbleLeftRightIcon className="icon" /> Accéder au forum
          </button>
        </div>

        {selectedContent ? (
          <div className="selected-content mt-4">
            <h3>{selectedContent.titreChapitre}</h3>
            <p><strong>Durée :</strong> {selectedContent.duree}</p>
            {selectedContent.titreType && <p>{selectedContent.titreType}</p>}
            {selectedContent.url && (
              <div>
                <a href={selectedContent.url} target="_blank" rel="noopener noreferrer">
                  Voir la ressource
                </a>
              </div>
            )}
            {currentUser && currentUser.role === 'enseignant' && (
              <Button onClick={openQuizModal} className="mt-3">
                Ajouter un quiz à ce chapitre
              </Button>
            )}

            {currentUser?.role === 'etudiant' && chapterQuizzes.length > 0 && (
              <div className="quiz-requirement">
                <p>
                  <strong>Attention :</strong> Vous devez soumettre et réussir tous les
                  quizzes de ce chapitre pour pouvoir le marquer comme complété.
                </p>
                <div className="quiz-status-summary">
                  {chapterQuizzes.map(quiz => (
                    <div key={quiz._id} className="quiz-status-item">
                      <span>{quiz.title}: </span>
                      {quizResults[quiz._id] ? (
                        quizResults[quiz._id].passed ? (
                          <span className="passed">✓ Réussi</span>
                        ) : (
                          <span className="failed">✗ Échoué</span>
                        )
                      ) : (
                        <span className="not-submitted">Non soumis</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <section className="quiz-section mt-4">
              <h4>Quizzes de ce chapitre</h4>
              {chapterQuizzes.map((quiz) => {
                const quizResult = quizResults[quiz._id];
                const isSubmitted = !!quizResult;
                const isPassed = quizResult?.passed;

                return (
                  <Card key={quiz._id} className="mb-4">
                    <Card.Body>
                      <Card.Title>
                        {quiz.title}
                        {isSubmitted && (
                          <span className={`quiz-status ${isPassed ? 'passed' : 'failed'}`}>
                            {isPassed ? 'Réussi' : 'Échoué'} ({Math.round(quizResult.score)}%)
                          </span>
                        )}
                      </Card.Title>
                      <Card.Text>{quiz.descriptionquiz}</Card.Text>
                      {isQuizReussi(quiz._id) && (
                        <p
                          style={{
                            color: 'green',
                            fontWeight: 'bold',
                            marginBottom: '0.5rem',
                            textAlign: 'center',
                          }}
                        >
                          Quiz réussi ! Continuez votre progression avec le module suivant
                        </p>
                      )}
                      <Card.Text>
                        <small>Durée : {quiz.timeLimit} min | Score requis : {quiz.passingScore}%</small>
                      </Card.Text>

                      <div className="quiz-questions">
                        {quiz.questions.map((question, qIndex) => {
                          const questionNumber = qIndex + 1;
                          const questionKey = `${quiz._id}-${qIndex}`;
                          const questionResult = quizResult?.details?.[qIndex];
                          const isQuestionCorrect = questionResult?.isCorrect;
                          const correctAnswerIndex = question.options.findIndex(opt => opt.isCorrect);

                          return (
                            <div key={qIndex} className="mb-3">
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h6>
                                  Question {questionNumber} : {question.question}
                                  {isSubmitted && isQuestionCorrect && (
                                    <CheckCircleIcon style={{ color: 'green', marginLeft: '5px' }} />
                                  )}
                                  {isSubmitted && !isQuestionCorrect && (
                                    <CancelIcon style={{ color: 'red', marginLeft: '5px' }} />
                                  )}
                                </h6>
                                {currentUser?.role === 'enseignant' && (
                                  <Button
                                    variant="link"
                                    onClick={() => handleDeleteQuestion(quiz._id, qIndex)}
                                    title="Supprimer cette question"
                                    style={{ color: 'red' }}
                                  >
                                    <DeleteIcon />
                                  </Button>
                                )}
                              </div>
                              <div className="options-list">
                                {question.options.map((option, oIndex) => {
                                  const isCorrect = oIndex === correctAnswerIndex;
                                  const isSelected = answers[questionKey] === oIndex;
                                  let optionClass = "";

                                  if (isSubmitted) {
                                    if (isCorrect) {
                                      optionClass = "correct-answer";
                                    } else if (isSelected && !isCorrect) {
                                      optionClass = "incorrect-answer";
                                    }
                                  }

                                  return (
                                    <div key={oIndex} className={`option-item ${optionClass}`}>
                                      <label>
                                        <input
                                          type="radio"
                                          name={questionKey}
                                          value={oIndex}
                                          checked={isSelected}
                                          onChange={() => handleOptionChange(questionKey, oIndex)}
                                          className="me-2"
                                          disabled={isQuizReussi(quiz._id) || isSubmitted}
                                        />
                                        {option.text}
                                        {isSubmitted && isCorrect && (
                                          <CheckCircleOutline
                                            style={{
                                              color: 'green',
                                              marginLeft: '5px',
                                              verticalAlign: 'middle',
                                              fontSize: '1rem'
                                            }}
                                          />
                                        )}
                                        {isSubmitted && isSelected && !isCorrect && (
                                          <HighlightOff
                                            style={{
                                              color: 'red',
                                              marginLeft: '5px',
                                              verticalAlign: 'middle',
                                              fontSize: '1rem'
                                            }}
                                          />
                                        )}
                                      </label>
                                    </div>
                                  );
                                })}
                              </div>
                              {isSubmitted && !isQuestionCorrect && (
                                <div className="correct-answer-text mt-2">
                                  <strong>Bonne réponse :</strong> {
                                    question.options.find(opt => opt.isCorrect)?.text
                                  }
                                </div>
                              )}
                              {isSubmitted && question.explanation && (
                                <div className="explanation-box mt-2">
                                  <strong>Explication :</strong> {question.explanation}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {currentUser && currentUser.role === 'etudiant' && (
                        <Button
                          onClick={() => handleSubmitQuiz(quiz)}
                          className="mt-2"
                          disabled={isQuizReussi(quiz._id) || isSubmitted}
                        >
                          {isQuizReussi(quiz._id) ? 'Quiz déjà réussi' : isSubmitted ? 'Quiz soumis' : 'Soumettre'}
                        </Button>
                      )}
                      {isSubmitted && !isPassed && (
                        <Button
                          onClick={() => handleRetryQuiz(quiz)}
                          className="mt-2"
                        >
                          <ReplayIcon/>
                          Réessayer
                        </Button>
                      )}

                      {currentUser && currentUser.role === 'enseignant' && (
                        <div
                          className="quiz-actions"
                          style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}
                        >
                          <Button className="modif-quiz" onClick={() => handleEditQuiz(quiz)} title="Modifier ce quiz">
                            <EditIcon className="modif-quiz__icon" />
                            Modifier Quiz
                          </Button>
                          <Button
                            className="supp-quiz"
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            title="Supprimer ce quiz"
                          >
                            <DeleteIcon className="supp-quiz__icon" />
                            Supprimer Quiz
                          </Button>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                );
              })}

              {chapterQuizzes.length === 0 && (
                <p className="text-muted">Aucun quiz disponible pour ce chapitre</p>
              )}
            </section>

            {currentUser && currentUser.role === 'etudiant' && (
              <Button
                className="mt-3"
                disabled={completionStatus[selectedContent._id]}
                style={{
                  backgroundColor: completionStatus[selectedContent._id] ? '#4caf50' : '',
                  color: completionStatus[selectedContent._id] ? 'white' : ''
                }}
              >
                {completionStatus[selectedContent._id]
                  ? 'Chapitre complété'
                  : allQuizzesPassed
                      ? 'Chapitre complété'
                      : 'Marquer comme complété'}
              </Button>
            )}
          </div>
        ) : (
          <p>Sélectionne un chapitre à gauche pour voir le contenu.</p>
        )}

        {currentUser?.role === 'etudiant' && isLastChapter && (
          <Button
            className="mt-3"
            disabled={!allChaptersCompleted || !cours.finalTest}
            onClick={() => {
              if (cours.finalTest) {
                navigate(`/cours/${id}/final-test`);
              } else {
                toast.error("Le test final n’est pas encore disponible pour ce cours. Revenez bientôt pour le passer !");
              }
            }}
          >
            {cours.finalTest ? 'Passer le test final' : 'Test final non disponible'}
          </Button>
        )}
      </main>

      <InsertQuiz
        show={showQuizModal}
        handleClose={() => {
          setShowQuizModal(false);
          setQuizToEdit(null);
        }}
        courseId={id}
        chapterId={selectedContentId}
        onQuizCreated={handleQuizCreated}
        quizToEdit={quizToEdit}
      />

      <AddContenuModal
        show={showContenuModal}
        handleClose={() => setShowContenuModal(false)}
        onContenuAdded={handleContenuAdded}
      />

      <AddContenuModal
        show={showEditContenuModal}
        handleClose={() => setShowEditContenuModal(false)}
        onContenuUpdated={handleEditContenu}
        isEdit={true}
        contenuToEdit={contenuToEdit}
      />

      <EditQuiz
        show={showEditQuizModal}
        handleClose={() => setShowEditQuizModal(false)}
        quizToEdit={quizToEdit}
        onQuizUpdated={handleQuizCreated}
      />

      <InserTestFinal
        show={showInserFinalTestModal}
        handleClose={() => setshowInserFinalTestModal(false)}
        courseId={id}
        onFinalTestCreated={() => {
          getcoursById(id).then((res) => setCours(res.data));
        }}
      />

      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer {deleteType === 'quiz' ? 'ce quiz' : deleteType === 'question' ? 'cette question' : 'ce chapitre'} ? Cette action est irréversible.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cancelDelete}>
            Annuler
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
};

export default CoursDetails;