import { useState, useEffect } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material"
import { toast } from "react-toastify" // Import de react-toastify
import "./test.css"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const EditTestModal = ({ open, onClose, onSave, test }) => {
  const [title, setTitle] = useState("")
  const [descriptionquiz, setDescriptionquiz] = useState("")
  const [timeLimit, setTimeLimit] = useState("")

  useEffect(() => {
    if (test) {
      setTitle(test.title || "")
      setDescriptionquiz(test.descriptionquiz || test.description || "")
      setTimeLimit(test.timeLimit || "")
    }
  }, [test])

  const handleSubmit = (e) => {
    e.preventDefault()

    const timeLimitValue = parseInt(timeLimit, 10)

    if (isNaN(timeLimitValue) || timeLimitValue <= 0) {
      toast.error("Veuillez entrer un temps limite valide (nombre positif).")
      return
    }

    const updatedTest = {
      ...test,
      title,
      descriptionquiz,
      timeLimit: timeLimitValue,
    }

    onSave(updatedTest)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth classes={{ paper: "edit-test-modal" }}>
      <DialogTitle className="question-edit-title">Modifier les informations du test</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent className="modal-content">
          <TextField
            fullWidth
            label="Titre du test"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="modal-textfield"
            InputLabelProps={{ className: "textfield-label" }}
            InputProps={{ className: "textfield-input" }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            minRows={3}
            value={descriptionquiz}
            onChange={(e) => setDescriptionquiz(e.target.value)}
            className="modal-textfield"
            InputLabelProps={{ className: "textfield-label" }}
            InputProps={{ className: "textfield-input" }}
          />
          <TextField
            fullWidth
            label="Temps limite (minutes)"
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            className="modal-textfield"
            InputLabelProps={{ className: "textfield-label" }}
            InputProps={{ className: "textfield-input" }}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions className="modal-actions">
          <Button type="button" onClick={onClose} className="cancel-button">
            <CancelIcon /> Annuler
          </Button>
          <Button type="submit" className="save-button">
            <SaveIcon /> Enregistrer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EditTestModal