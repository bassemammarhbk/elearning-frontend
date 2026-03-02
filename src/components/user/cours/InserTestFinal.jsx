// InserTestFinal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createFinalQuiz } from '../../../services/quizservice';
import './etudiant.css';

const InserTestFinal = ({ show, handleClose, courseId, onFinalTestCreated }) => {
  const [quiz, setQuiz] = useState({
    title: '',
    descriptionquiz: '',
    timeLimit: '30', // Valeur par défaut de 2 minutes
    questions: [
      {
        question: '',
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
        ],
      },
    ],
  });
  const [loading, setLoading] = useState(false);

  // Ajouter une nouvelle question
  const addQuestion = () => {
    setQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { question: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] },
      ],
    }));
  };

  // Supprimer une question
  const removeQuestion = idx => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };

  // Ajouter une option à une question
  const addOption = qIdx => {
    setQuiz(prev => {
      const qs = prev.questions.map((q, i) =>
        i === qIdx
          ? { ...q, options: [...q.options, { text: '', isCorrect: false }] }
          : q
      );
      return { ...prev, questions: qs };
    });
  };

  // Supprimer une option d'une question
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

  // Mettre à jour le texte d'une question
  const updateQuestionText = (qIdx, text) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === qIdx ? { ...q, question: text } : q
      ),
    }));
  };

  // Mettre à jour le texte d'une option
  const updateOptionText = (qIdx, oIdx, text) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          options: q.options.map((o, j) =>
            j === oIdx ? { ...o, text } : o
          ),
        };
      }),
    }));
  };

  // Définir l'option correcte pour une question
  const setCorrectOption = (qIdx, oIdx) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i !== qIdx) return q;
        return {
          ...q,
          options: q.options.map((o, j) => ({ ...o, isCorrect: j === oIdx })),
        };
      }),
    }));
  };

  // Valider les données du quiz
  const validateQuiz = () => {
    if (!quiz.title.trim()) {
      toast.error('Le titre est requis');
      return false;
    }
    if (!quiz.descriptionquiz.trim()) {
      toast.error('La description est requise');
      return false;
    }
    if (quiz.timeLimit <= 0) {
      toast.error('Le temps limite doit être supérieur à 0');
      return false;
    }
    for (const q of quiz.questions) {
      if (!q.question.trim()) {
        toast.error('Chaque question doit être remplie');
        return false;
      }
      if (q.options.length < 2) {
        toast.error('Au moins 2 options par question');
        return false;
      }
      if (!q.options.some(o => o.isCorrect)) {
        toast.error('Une option correcte par question');
        return false;
      }
      for (const o of q.options) {
        if (!o.text.trim()) {
          toast.error('Chaque option doit avoir un texte');
          return false;
        }
      }
    }
    return true;
  };

  // Soumettre le formulaire
  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateQuiz()) return;
    setLoading(true);
    try {
      const quizDataToSend = { ...quiz, cours: courseId, isFinalTest: true };
      console.log('Données envoyées à createFinalQuiz :', quizDataToSend);
      await createFinalQuiz(courseId, quizDataToSend);
      toast.success('Test final créé avec succès !');
      onFinalTestCreated();
      handleClose();
    } catch (err) {
      console.error('Erreur client :', err);
      toast.error('Erreur lors de création du test final.');
    } finally {
      setLoading(false);
    }
  };

  // Réinitialiser le formulaire lorsque le modal se ferme
  useEffect(() => {
    if (!show) {
      setQuiz({
        title: '',
        descriptionquiz: '',
        timeLimit: 2, // Réinitialisation à 2 minutes
        questions: [
          { question: '', options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] },
        ],
      });
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="lg" backdrop="static" style={{ zIndex: 1302 }}>
      <Modal.Header closeButton>
        <Modal.Title className="itf-modal-title">Créer le test final</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="itf-form-group">
            <Form.Label className="itf-form-label">Titre du test</Form.Label>
            <Form.Control
              type="text"
              className="itf-form-control"
              value={quiz.title}
              onChange={e => setQuiz(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="itf-form-group">
            <Form.Label className="itf-form-label">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="itf-form-control"
              value={quiz.descriptionquiz}
              onChange={e => setQuiz(prev => ({ ...prev, descriptionquiz: e.target.value }))}
              required
            />
          </div>

          <div className="itf-form-group">
            <Form.Label className="itf-form-label">Temps limite (minutes)</Form.Label>
            <Form.Control
              type="number"
              className="itf-form-control"
              value={quiz.timeLimit}
              onChange={e => setQuiz(prev => ({ ...prev, timeLimit: e.target.value }))}
              min="1"
              required
            />
          </div>

          {quiz.questions.map((question, qIdx) => (
            <div key={qIdx} className="itf-question-block">
              <div className="itf-question-header">
                <span className="itf-question-title">Question {qIdx + 1}</span>
                <Button
                  type="button"
                  variant="danger"
                  className="itf-btn itf-btn-remove"
                  onClick={() => removeQuestion(qIdx)}
                  disabled={quiz.questions.length <= 1}
                >
                  Supprimer
                </Button>
              </div>

              <Form.Control
                type="text"
                placeholder="Texte de la question"
                className="itf-form-control itf-form-group"
                value={question.question}
                onChange={e => updateQuestionText(qIdx, e.target.value)}
                required
              />

              {question.options.map((opt, oIdx) => (
                <Row key={oIdx} className="itf-option-row">
                  <Col md={8}>
                    <Form.Control
                      type="text"
                      placeholder={`Option ${oIdx + 1}`}
                      className="itf-form-control itf-option-control"
                      value={opt.text}
                      onChange={e => updateOptionText(qIdx, oIdx, e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      name={`correct-${qIdx}`}
                      label="Correcte"
                      className="itf-option-checkbox"
                      checked={opt.isCorrect}
                      onChange={() => setCorrectOption(qIdx, oIdx)}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      type="button"
                      variant="danger"
                      className="itf-btn itf-btn-remove"
                      onClick={() => removeOption(qIdx, oIdx)}
                      disabled={question.options.length <= 2}
                    >
                      Suppr.
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button
                type="button"
                variant="success"
                className="itf-btn itf-btn-add"
                onClick={() => addOption(qIdx)}
              >
                Ajouter une option
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="success"
            className="itf-btn itf-btn-add"
            onClick={addQuestion}
          >
            Ajouter une question
          </Button>

          <Button
            type="submit"
            className="itf-btn itf-btn-submit"
            disabled={loading}
          >
            {loading ? 'Envoi…' : 'Créer le test final'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default InserTestFinal;