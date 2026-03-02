import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { editQuiz } from '../../../services/quizservice';
import { toast } from 'react-toastify';
import './coursUsers.css';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const EditQuiz = ({ show, handleClose, quizToEdit, onQuizUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [questions, setQuestions] = useState([]);

  // Référence pour le textarea
  const textareaRef = useRef(null);

  useEffect(() => {
    if (quizToEdit) {
      setTitle(quizToEdit.title);
      setDescription(quizToEdit.descriptionquiz);
      setTimeLimit(quizToEdit.timeLimit);
      setPassingScore(quizToEdit.passingScore);
      setQuestions(quizToEdit.questions || []);
      // Ajuster la hauteur initiale du textarea
      autoResizeTextarea();
    }
  }, [quizToEdit]);

  // Fonction pour ajuster automatiquement la hauteur du textarea
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Réinitialise la hauteur
      textarea.style.height = `${textarea.scrollHeight}px`; // Ajuste à la hauteur du contenu
    }
  };

  const handleQuestionChange = (qIndex, field, value) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIndex] = { ...copy[qIndex], [field]: field === 'points' ? parseInt(value, 10) || 0 : value };
      return copy;
    });
  };

  const handleOptionChange = (qIdx, oIdx, field, value) => {
    setQuestions(prev => {
      return prev.map((question, idx) => {
        if (idx !== qIdx) return question;
        // Pour la bonne question :
        const newOpts = question.options.map((opt, j) => ({
          ...opt,
          [field]: j === oIdx ? (field === 'isCorrect' ? true : value) : (field === 'isCorrect' ? false : opt[field]),
        }));
        return { ...question, options: newOpts };
      });
    });
  };

  const addQuestion = () => {
    setQuestions(prev => [
      ...prev,
      { question: '', points: 1, options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }] }
    ]);
  };

  const removeQuestion = idx => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  const addOption = (qIdx) => {
    console.log('addOption called for question', qIdx);
    setQuestions(prev =>
      prev.map((question, idx) =>
        idx === qIdx
          ? {
              ...question,
              options: [
                ...question.options,
                { text: '', isCorrect: false },
              ],
            }
          : question
      )
    );
  };

  const removeOption = (qIdx, oIdx) => {
    setQuestions(prev => {
      const copy = [...prev];
      copy[qIdx].options = copy[qIdx].options.filter((_, j) => j !== oIdx);
      return copy;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const updatedQuiz = { ...quizToEdit, title, descriptionquiz: description, questions, timeLimit, passingScore };
    try {
      await editQuiz(updatedQuiz);
      toast.success('Quiz mis à jour avec succès !');
      onQuizUpdated();
      handleClose();
    } catch (err) {
      toast.error('Erreur lors de la mise à jour du quiz');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" className="edit-quiz-modal">
      <Modal.Header closeButton>
        <Modal.Title>Modifier le quiz</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} className="edit-quiz-form">
          <Form.Group className="mb-3">
            <Form.Label>Titre du quiz</Form.Label>
            <Form.Control value={title} onChange={e => setTitle(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                autoResizeTextarea(); // Ajuste la hauteur à chaque changement
              }}
              ref={textareaRef}
              style={{ resize: 'none' }} // Désactive le redimensionnement manuel
              required
            />
          </Form.Group>
          <Row className="mb-3">
            <Col>
              <Form.Group>
                <Form.Label>Durée (minutes)</Form.Label>
                <Form.Control type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} required />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Score requis (%)</Form.Label>
                <Form.Control type="number" value={passingScore} onChange={e => setPassingScore(e.target.value)} required />
              </Form.Group>
            </Col>
          </Row>

          {questions.map((q, qIdx) => (
            <div key={qIdx} className="edit-quiz-question border p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5>Question {qIdx + 1}</h5>
                <Button variant="danger" size="sm" onClick={() => removeQuestion(qIdx)}>Supprimer</Button>
              </div>
              <Form.Group className="mb-2">
                <Form.Label>Énoncé</Form.Label>
                <Form.Control value={q.question} onChange={e => handleQuestionChange(qIdx, 'question', e.target.value)} required />
              </Form.Group>

              {q.options.map((opt, oIdx) => (
                <Row key={oIdx} className="mb-2 align-items-center">
                  <Col md={8}>
                    <Form.Control
                      value={opt.text}
                      onChange={e => handleOptionChange(qIdx, oIdx, 'text', e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                    <Form.Check
                      type="radio"
                      name={`correct-option-${qIdx}`}
                      label="Correcte"
                      checked={opt.isCorrect}
                      onChange={() => handleOptionChange(qIdx, oIdx, 'isCorrect', true)}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeOption(qIdx, oIdx)}
                      disabled={q.options.length <= 2}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                className="mb-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addOption(qIdx);
                }}
              >
                <AddCircleIcon fontSize="small" /> Ajouter une option
              </Button>
            </div>
          ))}

          <div className="mb-3">
            <Button variant="outline-success" onClick={addQuestion}>
              <AddCircleIcon fontSize="small" /> Ajouter une question
            </Button>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="danger" onClick={handleClose}>
              <CancelIcon /> Annuler
            </Button>
            <Button variant="success" type="submit">
              <SaveIcon /> Enregistrer
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditQuiz;