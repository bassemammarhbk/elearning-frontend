"use client";

import { useState, useEffect, useRef } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import "./etudiant.css";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';

const AddQuestionModalTest = ({ open, onClose, onSave }) => {
  // État initial avec une seule question et deux options
  const initialQuestions = [
    {
      question: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [errors, setErrors] = useState([]); // État pour stocker les messages d'erreur
  const alertRef = useRef(null); // Référence pour l'alerte

  // Réinitialiser les questions et erreurs lorsque le modal s'ouvre
  useEffect(() => {
    if (open) {
      setQuestions(initialQuestions);
      setErrors([]);
    }
  }, [open]);

  // Défilement vers l'alerte lorsque les erreurs changent
  useEffect(() => {
    if (errors.length > 0 && alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [errors]);

  // Ajouter une nouvelle question
  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
    setErrors([]); // Réinitialiser les erreurs
  };

  // Supprimer une question (minimum une question)
  const removeQuestion = (idx) => {
    if (questions.length <= 1) {
      setErrors(["Vous devez avoir au moins une question."]);
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
    setErrors([]); // Réinitialiser les erreurs
  };

  // Ajouter une option à une question
  const addOption = (qIdx) => {
    setQuestions((prev) =>
      prev.map((question, idx) =>
        idx === qIdx
          ? {
              ...question,
              options: [...question.options, { text: "", isCorrect: false }],
            }
          : question
      )
    );
    setErrors([]); // Réinitialiser les erreurs
  };

  // Supprimer une option d'une question
  const removeOption = (qIdx, oIdx) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIdx].options = newQuestions[qIdx].options.filter(
        (_, j) => j !== oIdx
      );
      return newQuestions;
    });
    setErrors([]); // Réinitialiser les erreurs
  };

  // Mettre à jour le texte d'une question
  const updateQuestionText = (qIdx, text) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIdx].question = text;
      return newQuestions;
    });
    setErrors([]); // Réinitialiser les erreurs
  };

  // Mettre à jour le texte d'une option
  const updateOptionText = (qIdx, oIdx, text) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIdx].options[oIdx].text = text;
      return newQuestions;
    });
    setErrors([]); // Réinitialiser les erreurs
  };

  // Définir l'option correcte (une seule par question)
  const setCorrectOption = (qIdx, oIdx) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[qIdx].options = newQuestions[qIdx].options.map((opt, j) => ({
        ...opt,
        isCorrect: j === oIdx,
      }));
      return newQuestions;
    });
    setErrors([]); // Réinitialiser les erreurs
  };

  // Validation avant soumission
  const validateQuestions = () => {
    const newErrors = [];
    for (const [index, q] of questions.entries()) {
      if (!q.question.trim()) {
        newErrors.push(`La question ${index + 1} doit être remplie.`);
      }
      if (q.options.length < 2) {
        newErrors.push(`La question ${index + 1} doit avoir au moins deux options.`);
      }
      if (!q.options.some((o) => o.isCorrect)) {
        newErrors.push(`Vous devez cocher une réponse correcte pour la question ${index + 1}.`);
      }
      for (const [optIndex, o] of q.options.entries()) {
        if (!o.text.trim()) {
          newErrors.push(`L'option ${optIndex + 1} de la question ${index + 1} doit avoir un texte.`);
        }
      }
    }
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Gestion de la soumission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateQuestions()) {
      return;
    }
    onSave(questions);
    setQuestions(initialQuestions); // Réinitialiser après soumission
    setErrors([]); // Réinitialiser les erreurs
    onClose();
  };

  return (
    <Modal show={open} onHide={onClose} size="lg" backdrop="static" style={{ zIndex: 1302 }}>
      <Modal.Header closeButton>
        <Modal.Title className="itf-modal-title">Ajouter des questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errors.length > 0 && (
          <Alert variant="danger" ref={alertRef}>
            <ul>
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          {questions.map((question, qIdx) => (
            <div key={qIdx} className="itf-question-block">
              <div className="itf-question-header">
                <span className="itf-question-title">Question {qIdx + 1}</span>
                <Button
                  type="button"
                  variant="danger"
                  className="itf-btn itf-btn-remove"
                  onClick={() => removeQuestion(qIdx)}
                  disabled={questions.length <= 1}
                >
                  <DeleteIcon />
                  Supprimer
                </Button>
              </div>

              <Form.Control
                type="text"
                placeholder="Texte de la question"
                className="itf-form-control itf-form-group"
                value={question.question}
                onChange={(e) => updateQuestionText(qIdx, e.target.value)}
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
                      onChange={(e) => updateOptionText(qIdx, oIdx, e.target.value)}
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
                      <DeleteIcon fontSize="small" />
                      Suppr.
                    </Button>
                  </Col>
                </Row>
              ))}

              <Button
                type="button"
                variant="success"
                className="itf-btn itf-btn-add"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addOption(qIdx);
                }}
              >
                <AddCircleIcon />
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
            <AddCircleIcon />
            Ajouter une question
          </Button>

          <Button type="submit" className="itf-btn itf-btn-submit">
            Ajouter les questions
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddQuestionModalTest;