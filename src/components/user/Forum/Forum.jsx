import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getMessages,
  postMessage,
  deleteMessage,
  updateMessage,
} from "../../../services/forumservice";
import { getcoursById } from "../../../services/courservice";
import { getCurrentUser } from "../../../services/authservice";
import {
  MessageCircle,
  Send,
  User,
  GraduationCap,
  ArrowLeft,
  Edit3 as EditIcon,
  Trash2 as DeleteIcon,
} from "lucide-react";
import { Modal, Button } from 'react-bootstrap';
import MessageEditModal from "./MessageEditModal";
import "./forum.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Forum(props) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const coursId = props.coursId || paramId;

  const [courseName, setCourseName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);
  const [deleteMessageId, setDeleteMessageId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    const user = getCurrentUser();
    if (user && user._id) {
      setCurrentUserId(user._id);
    }
  }, []);

  // Récupérer le nom du cours
  useEffect(() => {
    if (!coursId) {
      console.error('coursId est undefined');
      toast.error('Erreur : ID du cours non défini');
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchCourseName = async () => {
      try {
        const response = await getcoursById(coursId);
        const nom = response.data?.nomcours ?? response.nomcours ?? "";
        setCourseName(nom);
      } catch (err) {
        console.error("Erreur récupération nom du cours :", err.message);
        toast.error('Erreur lors de la récupération du nom du cours');
      }
    };

    fetchCourseName();
  }, [coursId]);

  // Charger les messages
  useEffect(() => {
    console.log('coursId utilisé :', coursId);
    if (!coursId) {
      console.error('coursId est undefined');
      return;
    }
    const fetchMessages = async () => {
      try {
        const data = await getMessages(coursId);
        const formatted = data.map((msg) => ({
          id: msg._id,
          author: msg.utilisateurId
            ? `${msg.utilisateurId.firstname} ${msg.utilisateurId.lastname}`
            : 'Utilisateur inconnu',
          role: msg.utilisateurId
            ? (msg.utilisateurId.role === "enseignant" ? "teacher" : "student")
            : 'unknown',
          content: msg.message,
          timestamp: new Date(msg.dateMessage).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          userId: msg.utilisateurId ? msg.utilisateurId._id : null,
        }));
        setMessages(formatted);
      } catch (err) {
        console.error("Erreur récupération messages :", err.message);
        toast.error('Erreur lors de la récupération des messages');
      }
    };

    fetchMessages();
  }, [coursId]);

  // Bouton retour
  const goBackToCourse = () => {
    navigate(`/cours/${coursId}`);
  };

  // Envoi message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }
    if (!coursId) {
      toast.error('Erreur : ID du cours non défini');
      return;
    }
    try {
      const saved = await postMessage(coursId, newMessage);
      const formattedNewMsg = {
        id: saved._id,
        author: `${saved.utilisateurId.firstname} ${saved.utilisateurId.lastname}`,
        role: saved.utilisateurId.role === "enseignant" ? "teacher" : "student",
        content: saved.message,
        timestamp: new Date(saved.dateMessage).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        userId: saved.utilisateurId._id,
      };
      setMessages((prev) => [...prev, formattedNewMsg]);
      setNewMessage("");
      toast.success('Message publié avec succès');
    } catch (err) {
      console.error("Erreur publication message :", err.message);
      toast.error('Erreur lors de la publication du message');
    }
  };

  // Supprimer un message
  const handleDelete = (msgId) => {
    setDeleteMessageId(msgId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteMessageId) return;
    try {
      await deleteMessage(deleteMessageId);
      setMessages((prev) => prev.filter((m) => m.id !== deleteMessageId));
      setShowDeleteModal(false);
      setDeleteMessageId(null);
      toast.success('Message supprimé avec succès');
    } catch (err) {
      console.error("Erreur suppression message :", err.message);
      toast.error('Erreur lors de la suppression du message');
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteMessageId(null);
  };

  // Ouvrir la modale de modification
  const handleEdit = (msg) => {
    setEditingMessage(msg);
    setIsModalOpen(true);
  };

  // Sauvegarder la modification
  const handleSaveEdit = async (newContent) => {
    if (!newContent.trim()) {
      toast.error('Le message ne peut pas être vide');
      return;
    }
    try {
      const updated = await updateMessage(editingMessage.id, newContent);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === editingMessage.id
            ? {
                ...m,
                content: updated.message,
                timestamp: new Date(updated.dateMessage).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }
            : m
        )
      );
      setIsModalOpen(false);
      setEditingMessage(null);
      toast.success('Message modifié avec succès');
    } catch (err) {
      console.error("Erreur modification message :", err.message);
      toast.error('Erreur lors de la modification du message');
    }
  };

  // Filtrer messages
  const filteredMessages =
    activeTab === "all"
      ? messages
      : messages.filter((msg) => msg.role === activeTab);

  return (
    <div className="forum-forum-container">
      <header className="forum-forum-header">
        <button
          onClick={goBackToCourse}
          className="forum-back-button"
          title="Retour au cours"
        >
          <ArrowLeft size={20} />
        </button>
        <MessageCircle className="forum-forum-icon" />
        <div className="forum-title-group">
          <h1 className="forum-main-title">Forum</h1>
          {courseName && <h2 className="forum-course-name">{courseName}</h2>}
        </div>
      </header>

      <nav className="forum-forum-nav">
        <button
          className={`forum-nav-button ${activeTab === "all" ? "forum-active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          Tous les messages
        </button>
        <button
          className={`forum-nav-button ${activeTab === "teacher" ? "forum-active" : ""}`}
          onClick={() => setActiveTab("teacher")}
        >
          Messages Enseignant
        </button>
        <button
          className={`forum-nav-button ${activeTab === "student" ? "forum-active" : ""}`}
          onClick={() => setActiveTab("student")}
        >
          Messages Étudiants
        </button>
      </nav>

      <div className="forum-messages-container">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`forum-message forum-${message.role}`}
          >
            <div className="forum-message-header">
              <div className="forum-author-info">
                {message.role === "teacher" ? (
                  <GraduationCap className="forum-role-icon" />
                ) : (
                  <User className="forum-role-icon" />
                )}
                <span className="forum-author-name">{message.author}</span>
                <span className="forum-timestamp">{message.timestamp}</span>
              </div>

              {currentUserId === message.userId && (
                <div className="forum-message-actions">
                  <button
                    className="forum-action-button forum-edit-button"
                    onClick={() => handleEdit(message)}
                    title="Modifier"
                  >
                    <EditIcon size={16} />
                  </button>
                  <button
                    className="forum-action-button forum-delete-button"
                    onClick={() => handleDelete(message.id)}
                    title="Supprimer"
                  >
                    <DeleteIcon size={16} />
                  </button>
                </div>
              )}
            </div>
            <p className="forum-message-content">{message.content}</p>
          </div>
        ))}
      </div>

      <form className="forum-message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          className="forum-message-input"
        />
        <button type="submit" className="forum-send-button">
          <Send className="forum-send-icon" />
        </button>
      </form>

      <MessageEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEdit}
        initialText={editingMessage?.content || ""}
      />

      {/* Modale de confirmation pour la suppression */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer ce message ? Cette action est irréversible.
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}

export default Forum;