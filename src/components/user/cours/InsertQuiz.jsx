import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../../services/authservice';
import axios from '../../../api/axios';
import { addQuiz } from '../../../services/quizservice';
import '../../../user.css';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

export default function InsertQuiz({ show, handleClose, courseId, chapterId, onQuizCreated }) {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    descriptionquiz: '',
    questions: [],
    cours: courseId,
    chapterId: chapterId || null,
    timeLimit: 30,
    passingScore: 70
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      setError('Authentification requise');
    } else if (user.role !== 'enseignant') {
      setError('Seuls les enseignants peuvent créer des quiz');
    } else {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if (show) {
      setError('');
      setSuccess('');
      setIsSubmitting(false);
      setQuiz({
        title: '',
        descriptionquiz: '',
        questions: [],
        cours: courseId,
        chapterId: chapterId || null,
        timeLimit: 30,
        passingScore: 70
      });
    }
  }, [show, courseId, chapterId]);

  const validateQuiz = () => {
    const errors = [];
    if (!quiz.title.trim()) errors.push('Le titre est requis');
    if (!quiz.descriptionquiz.trim()) errors.push('La description est requise');
    if (quiz.questions.length < 1) errors.push('Ajoutez au moins une question');
    if (!quiz.cours) errors.push('Cours non spécifié');
    quiz.questions.forEach((q, i) => {
      if (!q.question.trim()) errors.push(`Question ${i + 1} : énoncé manquant`);
      if (q.options.length < 2) errors.push(`Question ${i + 1} : au moins 2 options`);
      const hasCorrect = q.options.some(opt => opt.isCorrect);
      if (!hasCorrect) errors.push(`Question ${i + 1} : aucune réponse correcte sélectionnée`);
    });
    if (quiz.timeLimit < 1) errors.push('Durée minimale : 1 minute');
    if (quiz.passingScore < 1 || quiz.passingScore > 100) errors.push('Score de passage invalide (1-100%)');
    return errors.length ? errors.join('\n') : null;
  };

  const handleSubmit = async (continueAdding) => {
    if (!currentUser) return setError('Utilisateur non authentifié');
    const validationError = validateQuiz();
    if (validationError) return setError(validationError);

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('CC_Token');
      if (!token) throw new Error("Token d'authentification manquant");

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const payload = { ...quiz, enseignantId: currentUser.id || currentUser._id };
      await addQuiz(payload);

      setSuccess('Quiz créé avec succès !');
      if (continueAdding) {
        setQuiz({
          title: '',
          descriptionquiz: '',
          questions: [],
          cours: courseId,
          chapterId: chapterId || null,
          timeLimit: 30,
          passingScore: 70
        });
      } else {
        handleClose();
      }

      if (onQuizCreated) await onQuizCreated();
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        logout();
        return navigate('/login');
      }
      if (status === 403) setError('Non autorisé pour ce cours');
      else if (status === 404) setError('Cours non trouvé');
      else setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }], points: 1 }
      ]
    }));
  };

  const addOption = qIdx => {
    const updated = [...quiz.questions];
    updated[qIdx].options.push({ text: '', isCorrect: false });
    setQuiz({ ...quiz, questions: updated });
  };

  const removeOption = (qIdx, oIdx) => {
    setQuiz(prev => {
      const qs = prev.questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: q.options.filter((_, j) => j !== oIdx) }
          : q
      );
      return { ...prev, questions: qs };
    });
  };

  if (!currentUser) {
    return (
      <Modal show={show} onHide={handleClose} style={{ zIndex: 1302 }}>
        <Modal.Body>
          <Alert variant="danger">{error}</Alert>
          <Button onClick={() => navigate('/login')}>Se connecter</Button>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" style={{ zIndex: 1302 }}>
      <Modal.Header closeButton>
        <Modal.Title >Créer un nouveau quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger" className="pre-wrap">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Titre *</Form.Label>
            <Form.Control
              type="text"
              value={quiz.title}
              onChange={e => setQuiz({ ...quiz, title: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={quiz.descriptionquiz}
              onChange={e => setQuiz({ ...quiz, descriptionquiz: e.target.value })}
              required
            />
          </Form.Group>
          <div className="row mb-4">
            <div className="col-md-6">
              <Form.Label>Durée (min)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                value={quiz.timeLimit}
                onChange={e => setQuiz({ ...quiz, timeLimit: Math.max(1, +e.target.value) })}
              />
            </div>
            <div className="col-md-6">
              <Form.Label>Score de passage (%)</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={100}
                value={quiz.passingScore}
                onChange={e => setQuiz({ ...quiz, passingScore: Math.min(100, Math.max(1, +e.target.value)) })}
              />
            </div>
          </div>
          <h5>Questions</h5>
          {quiz.questions.map((q, qIdx) => (
            <div key={qIdx} className="mb-4 border rounded p-3">
              <div className="d-flex justify-content-between mb-2">
                <strong>Question {qIdx + 1}</strong>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setQuiz(prev => ({ ...prev, questions: prev.questions.filter((_, i) => i !== qIdx) }))}
                >
                  <DeleteIcon fontSize="small" />
                </Button>
              </div>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Énoncé de la question"
                  value={q.question}
                  onChange={e => {
                    const up = [...quiz.questions];
                    up[qIdx].question = e.target.value;
                    setQuiz({ ...quiz, questions: up });
                  }}
                />
              </Form.Group>
              <Form.Label>Options</Form.Label>
              {q.options.map((opt, oIdx) => (
                <div key={oIdx} className="d-flex align-items-center mb-2 gap-2">
                  <Form.Control
                    type="text"
                    placeholder={`Option ${oIdx + 1}`}
                    value={opt.text}
                    onChange={e => {
                      const up = [...quiz.questions];
                      up[qIdx].options[oIdx].text = e.target.value;
                      setQuiz({ ...quiz, questions: up });
                    }}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Correcte"
                    checked={opt.isCorrect}
                    onChange={e => {
                      const up = [...quiz.questions];
                      up[qIdx].options[oIdx].isCorrect = e.target.checked;
                      setQuiz({ ...quiz, questions: up });
                    }}
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeOption(qIdx, oIdx)}
                    disabled={q.options.length <= 2}
                    title={q.options.length <= 2 ? 'Minimum 2 options requis' : 'Supprimer cette option'}
                  >
                    <DeleteIcon fontSize="small" />
                  </Button>
                </div>
              ))}
              <Button variant="outline-primary" size="sm" onClick={() => addOption(qIdx)}>
                + Option
              </Button>
            </div>
          ))}
          <Button onClick={addQuestion} disabled={isSubmitting}>
            <AddCircleIcon /> Ajouter une question
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose} disabled={isSubmitting}>
          <CancelIcon /> Annuler
        </Button>
        <Button variant="success" onClick={() => handleSubmit(false)} disabled={isSubmitting}>
          <SaveIcon /> Enregistrer & Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}