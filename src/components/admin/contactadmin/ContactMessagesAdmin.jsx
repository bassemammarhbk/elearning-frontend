"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import {
  Delete as DeleteIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Search as SearchIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  MarkEmailUnread as UnreadIcon,
} from "@mui/icons-material"
import { getAllContactMessages, deleteContactMessage, markMessageAsRead } from "../../../services/contactservice"
import "./contactadmin.css"

const ContactMessagesAdmin = () => {
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMsg, setSelectedMsg] = useState(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [filterMenuAnchor, setFilterMenuAnchor] = useState(null)

  const fetchMessages = async () => {
    setLoading(true)
    try {
      const resp = await getAllContactMessages()
      setMessages(resp)
      setFilteredMessages(resp)
    } catch (err) {
      setError("Erreur lors du chargement des messages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    const filtered = messages.filter((msg) => {
      const matchesSearch =
        msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFilter =
        filterStatus === "all" || (filterStatus === "read" && msg.isRead) || (filterStatus === "unread" && !msg.isRead)

      return matchesSearch && matchesFilter
    })

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "name":
          return a.name.localeCompare(b.name)
        case "unread":
          return b.isRead - a.isRead
        default:
          return 0
      }
    })

    setFilteredMessages(filtered)
  }, [messages, searchTerm, filterStatus, sortBy])

  const handleMarkRead = async (msg) => {
    try {
      await markMessageAsRead(msg._id)
      setSnackbar({ open: true, message: "Message marqué comme lu", severity: "success" })
      fetchMessages()
    } catch (err) {
      console.error("Mark read error:", err)
      setSnackbar({ open: true, message: "Impossible de marquer le message", severity: "error" })
    }
  }

  const handleDeleteClick = (msg) => {
    setSelectedMsg(msg)
    setConfirmDeleteOpen(true)
  }

  const handleDeleteCancel = () => setConfirmDeleteOpen(false)

  const handleConfirmDelete = async () => {
    try {
      await deleteContactMessage(selectedMsg._id)
      setSnackbar({ open: true, message: "Message supprimé avec succès", severity: "success" })
      fetchMessages()
    } catch (err) {
      console.error("Delete error:", err)
      setSnackbar({ open: true, message: "Erreur lors de la suppression", severity: "error" })
    }
    setConfirmDeleteOpen(false)
  }

  const handleCloseSnackbar = () => setSnackbar((s) => ({ ...s, open: false }))

  const getStats = () => {
    const total = messages.length
    const unread = messages.filter((msg) => !msg.isRead).length
    const read = total - unread
    return { total, unread, read }
  }

  const stats = getStats()

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <Typography variant="h6">Chargement des messages...</Typography>
      </div>
    )
  }

  if (error) {
    return (
      <div className="admin-error">
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </div>
    )
  }

  return (
    <div className="admin-contact-container">
      {/* Header avec statistiques */}
      <div className="admin-header">
        <div className="admin-title-section">
          <Typography variant="h4" className="admin-title">
            📧 Messages de Contact
          </Typography>
          <Typography variant="subtitle1" className="admin-subtitle">
            Gérez les messages reçus via le formulaire de contact
          </Typography>
        </div>

        <div className="admin-stats">
          <div className="stat-card total">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
          <div className="stat-card unread">
            <div className="stat-icon">📬</div>
            <div className="stat-content">
              <div className="stat-number">{stats.unread}</div>
              <div className="stat-label">Non lus</div>
            </div>
          </div>
          <div className="stat-card read">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{stats.read}</div>
              <div className="stat-label">Lus</div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'outils */}
      <div className="admin-toolbar">
        <TextField
          placeholder="Rechercher dans les messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <div className="toolbar-actions">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => setFilterStatus("all")}
            >
               Tous ({stats.total})
            </button>
            <button
              className={`filter-btn ${filterStatus === "unread" ? "active" : ""}`}
              onClick={() => setFilterStatus("unread")}
            >
               Non lus ({stats.unread})
            </button>
            <button
              className={`filter-btn ${filterStatus === "read" ? "active" : ""}`}
              onClick={() => setFilterStatus("read")}
            >
               Lus ({stats.read})
            </button>
          </div>

          <FormControl size="small" className="sort-select">
            <InputLabel>Trier par</InputLabel>
            <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} label="Trier par">
              <MenuItem value="newest">Plus récent</MenuItem>
              <MenuItem value="oldest">Plus ancien</MenuItem>
              <MenuItem value="name">Nom</MenuItem>
              <MenuItem value="unread">Non lus d'abord</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Actualiser">
            <IconButton onClick={fetchMessages} className="refresh-btn">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Liste des messages */}
      <div className="messages-grid">
        {filteredMessages.length === 0 ? (
          <div className="no-messages">
            <div className="no-messages-icon">📭</div>
            <Typography variant="h6">Aucun message trouvé</Typography>
            <Typography variant="body2" color="textSecondary">
              {searchTerm || filterStatus !== "all"
                ? "Essayez de modifier vos critères de recherche"
                : "Aucun message de contact pour le moment"}
            </Typography>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <Card key={msg._id} className={`message-card ${!msg.isRead ? "unread" : "read"}`}>
              <CardContent className="message-content">
                {/* Header de la carte */}
                <div className="message-header">
                  <div className="message-avatar-section">
                    <Avatar className="message-avatar">{getInitials(msg.name)}</Avatar>
                    <div className="message-info">
                      <Typography variant="h6" className="message-name">
                        {msg.name}
                      </Typography>
                      <Typography variant="body2" className="message-email">
                        {msg.email}
                      </Typography>
                    </div>
                  </div>

                  <div className="message-status">
                    {!msg.isRead && <Chip label="Nouveau" size="small" className="new-badge" icon={<UnreadIcon />} />}
                    <Typography variant="caption" className="message-date">
                      <ScheduleIcon fontSize="small" />
                      {formatDate(msg.createdAt)}
                    </Typography>
                  </div>
                </div>

                {/* Sujet */}
                <div className="message-subject">
                  <Typography variant="subtitle1" className="subject-text">
                    📝 Sujet : {msg.subject}
                  </Typography>
                </div>

                {/* Message */}
                <div className="message-body">
                  <Typography variant="body2" className="message-text">
                    <strong>Message :</strong>{" "}
                    {msg.message.length > 150 ? `${msg.message.substring(0, 150)}...` : msg.message}
                  </Typography>
                </div>

                {/* Actions */}
                <div className="message-actions">
                  <div className="action-buttons">
                    {!msg.isRead && (
                      <Tooltip title="Marquer comme lu">
                        <IconButton onClick={() => handleMarkRead(msg)} className="action-btn read-btn" size="small">
                          <MarkEmailReadIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Supprimer le message">
                      <IconButton onClick={() => handleDeleteClick(msg)} className="action-btn delete-btn" size="small">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <div className="message-meta">
                    <Chip
                      label={msg.isRead ? "Lu" : "Non lu"}
                      size="small"
                      className={msg.isRead ? "status-read" : "status-unread"}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={confirmDeleteOpen} onClose={handleDeleteCancel} maxWidth="sm" fullWidth className="delete-dialog">
        <DialogTitle className="dialog-title">🗑️ Confirmation de suppression</DialogTitle>
        <DialogContent className="dialog-content">
          <Typography variant="body1">
            Êtes-vous sûr de vouloir supprimer le message de <strong>{selectedMsg?.name}</strong> ?
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions className="dialog-actions">
          <Button onClick={handleDeleteCancel} className="cancel-btn">
            Annuler
          </Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained" className="delete-confirm-btn">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar pour les notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" className="custom-alert">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ContactMessagesAdmin
