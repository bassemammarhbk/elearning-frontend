import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  fetchTeacherFinalTestForCourse,
  editQuestion,
  deleteQuestion as apiDeleteQuestion,
  updateQuizInfo,
  addQuestion,
  deleteQuiz,
} from "../../../services/quizservice";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Modal,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import QuestionEditModal from "./EditQuestionModal";
import EditTestModal from "./EditTestFinal";
import AddQuestionModalTest from "./AddQuestionModalTest";
import InserTestFinal from "./InserTestFinal";
import "./test.css";

const TeacherFinalTestPage = () => {
  const { courseId } = useParams();
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editTestOpen, setEditTestOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [createTestOpen, setCreateTestOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'question' ou 'test'
  const [deleteIndex, setDeleteIndex] = useState(null); // Index de la question à supprimer

  useEffect(() => {
    (async () => {
      try {
        const quiz = await fetchTeacherFinalTestForCourse(courseId);
        setTest(quiz);
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError(err.response?.data?.message || "Impossible de charger le test final.");
        toast.error("Erreur de chargement du test final");
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  const handleDeleteQuestion = (qIndex, e) => {
    e.stopPropagation();
    setDeleteType('question');
    setDeleteIndex(qIndex);
    setShowDeleteModal(true);
  };

  const handleOpenEdit = (idx, e) => {
    e.stopPropagation();
    setEditIndex(idx);
    setEditOpen(true);
  };

  const handleSaveEdit = async (updatedQuestion) => {
    try {
      await editQuestion(test._id, editIndex, updatedQuestion);
      const newTest = { ...test };
      newTest.questions[editIndex] = updatedQuestion;
      setTest(newTest);
      toast.success("Question modifiée avec succès");
    } catch (err) {
      console.error("Error editing question:", err);
      toast.error("Erreur lors de la modification de la question");
    } finally {
      setEditOpen(false);
    }
  };

  const handleSaveTestInfo = async (updatedTest) => {
    try {
      await updateQuizInfo(updatedTest._id, updatedTest);
      setTest(updatedTest);
      toast.success("Test modifié avec succès");
    } catch (err) {
      console.error("Erreur de modification du test:", err);
      toast.error("Erreur lors de la modification du test");
    } finally {
      setEditTestOpen(false);
    }
  };

  const handleAddQuestion = async (newQuestions) => {
    try {
      for (const newQuestion of newQuestions) {
        await addQuestion(test._id, newQuestion);
      }
      const updatedTest = {
        ...test,
        questions: [...test.questions, ...newQuestions],
      };
      setTest(updatedTest);
      toast.success("Questions ajoutées avec succès");
    } catch (err) {
      console.error("Erreur lors de l'ajout des questions:", err);
      toast.error("Erreur lors de l'ajout des questions");
    } finally {
      setAddOpen(false);
    }
  };

  const handleDeleteTest = () => {
    setDeleteType('test');
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === 'question') {
        await apiDeleteQuestion(test._id, deleteIndex);
        const updatedQuestions = test.questions.filter((_, i) => i !== deleteIndex);
        setTest({ ...test, questions: updatedQuestions });
        toast.success("Question supprimée avec succès");
      } else if (deleteType === 'test') {
        await deleteQuiz(test._id);
        setTest(null);
        toast.success("Test supprimé avec succès");
      }
    } catch (err) {
      console.error(`Erreur lors de la suppression du ${deleteType}:`, err);
      toast.error(`Erreur lors de la suppression du ${deleteType}`);
    } finally {
      setShowDeleteModal(false);
      setDeleteType(null);
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteType(null);
    setDeleteIndex(null);
  };

  const handleCreateTest = () => {
    setCreateTestOpen(true);
  };

  const handleCloseCreateTest = () => {
    setCreateTestOpen(false);
  };

  const handleTestCreated = (newTest) => {
    setTest(newTest);
    setCreateTestOpen(false);
    toast.success("Nouveau test final créé avec succès");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Typography variant="h6" className="error-text">
          {error}
        </Typography>
      </div>
    );
  }

  return (
    <div className="test-page-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 16 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
          startIcon={<ArrowDownwardIcon fontSize="small" />}
        >
          Bas
        </Button>
      </div>

      <Typography variant="h4" className="test-page-title">
        Votre Test Final
      </Typography>

      {!test ? (
        <div>
          <Typography className="no-test-text">
            Aucun test final disponible pour ce cours.
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateTest}
            sx={{
              marginTop: "10px",
              backgroundColor: "#00897b",
              color: "white",
              "&:hover": { backgroundColor: "#00695c" },
            }}
          >
            Créer un nouveau test final
          </Button>
        </div>
      ) : (
        <Card className="test-card">
          <CardContent className="test-card-content">
            <Typography variant="h5" className="test-title">
              {test.title}
            </Typography>
            <Typography className="test-description">
              {test.descriptionquiz || test.description}
            </Typography>

            {test.questions.map((q, idx) => (
              <div key={idx} className="question-container">
                <Typography variant="subtitle1" className="question-text">
                  Question {idx + 1} : {q.question}
                </Typography>
                <List dense className="option-list">
                  {q.options.map((opt, i) => (
                    <ListItem key={i} className="option-item">
                      <ListItemText
                        primary={`${i + 1}. ${opt.text}`}
                        secondary={opt.isCorrect ? "Bonne réponse" : null}
                        classes={{ primary: "option-text", secondary: "correct-text" }}
                      />
                    </ListItem>
                  ))}
                </List>

                <div className="action-buttons">
                  <Button
                    type="button"
                    size="small"
                    className="edit-button"
                    onClick={(e) => handleOpenEdit(idx, e)}
                    startIcon={<EditIcon fontSize="small" />}
                  >
                    Modifier
                  </Button>
                  <Button
                    type="button"
                    size="small"
                    className="delete-button"
                    onClick={(e) => handleDeleteQuestion(idx, e)}
                    startIcon={<DeleteIcon fontSize="small" />}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="global-edit-container">
            <Button
              type="button"
              variant="contained"
              onClick={() => setEditTestOpen(true)}
              sx={{
                padding: "10px 20px",
                borderRadius: "20px",
                fontSize: "14px",
                textTransform: "uppercase",
                backgroundColor: "#7b1fa2",
                color: "white",
                "&:hover": { backgroundColor: "#6a1b9a" },
              }}
            >
              <ModeEditOutlineIcon /> Modifier le test global
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={() => setAddOpen(true)}
              sx={{
                padding: "10px 20px",
                borderRadius: "20px",
                fontSize: "14px",
                textTransform: "uppercase",
                backgroundColor: "#00897b",
                color: "white",
                marginLeft: "10px",
                "&:hover": { backgroundColor: "#00695c" },
              }}
            >
              <AddCircleIcon /> Ajouter une question
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={handleDeleteTest}
              sx={{
                padding: "10px 20px",
                borderRadius: "20px",
                fontSize: "14px",
                textTransform: "uppercase",
                backgroundColor: "#d32f2f",
                color: "white",
                marginLeft: "10px",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
            >
              <DeleteIcon /> Supprimer le test
            </Button>
          </div>
        </Card>
      )}
      <div className="scroll-up-button">
        <Button
          variant="outlined"
          size="small"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          startIcon={<ArrowUpwardIcon fontSize="small" />}
        >
          Haut
        </Button>
      </div>

      <QuestionEditModal
        open={editOpen}
        question={test?.questions[editIndex]}
        onClose={() => setEditOpen(false)}
        onSave={handleSaveEdit}
      />

      <EditTestModal
        open={editTestOpen}
        onClose={() => setEditTestOpen(false)}
        onSave={handleSaveTestInfo}
        test={test}
      />

      <AddQuestionModalTest
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleAddQuestion}
      />

      <InserTestFinal
        show={createTestOpen}
        handleClose={handleCloseCreateTest}
        courseId={courseId}
        onFinalTestCreated={handleTestCreated}
      />

      <Modal
        open={showDeleteModal}
        onClose={cancelDelete}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div style={{
          backgroundColor: 'white',
          margin: '15% auto',
          padding: 20,
          width: 400,
          borderRadius: 8,
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Confirmer la suppression
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Êtes-vous sûr de vouloir supprimer {deleteType === 'question' ? 'cette question' : 'ce test final'} ? Cette action est irréversible.
          </Typography>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button
              variant="outlined"
              onClick={cancelDelete}
              sx={{ color: '#757575', borderColor: '#757575' }}
            >
              Annuler
            </Button>
            <Button
              variant="contained"
              onClick={confirmDelete}
              sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}
            >
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default TeacherFinalTestPage;