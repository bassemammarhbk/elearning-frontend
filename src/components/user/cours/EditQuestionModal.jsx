"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
} from "@mui/material"
import "./test.css"
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

/**
 * Modal component to edit a quiz question.
 * Props:
 * - open: boolean to control visibility
 * - onClose: function to call when closing without saving
 * - question: { question: String, options: [{ text, isCorrect }...] }
 * - onSave: function(updatedQuestion) to call with new data
 */
const QuestionEditModal = ({ open, onClose, question, onSave }) => {
  const [localQuestion, setLocalQuestion] = useState({ question: "", options: [] })

  useEffect(() => {
    if (question) {
      // Deep-copy to avoid mutating parent state
      setLocalQuestion({
        question: question.question || "",
        options: question.options.map((opt) => ({ ...opt })),
      })
    }
  }, [question])

  const handleTextChange = (e) => {
    setLocalQuestion((prev) => ({ ...prev, question: e.target.value }))
  }

  const handleOptionTextChange = (index, value) => {
    setLocalQuestion((prev) => {
      const opts = [...prev.options]
      opts[index].text = value
      return { ...prev, options: opts }
    })
  }

  const handleOptionToggle = (index) => {
    setLocalQuestion((prev) => {
      const opts = prev.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index, // enforce single correct answer
      }))
      return { ...prev, options: opts }
    })
  }

  const handleSave = () => {
    onSave(localQuestion)
  }

  return (
    <Dialog open={open} onClose={onClose}  >
      <DialogTitle className="question-edit-title">Modifier la question</DialogTitle>
      <DialogContent className="modal-content">
        <Box className="input-container">
          <TextField
            label="Question"
            fullWidth
            value={localQuestion.question}
            onChange={handleTextChange}
            className="modal-textfield"
            InputLabelProps={{ className: "textfield-label" }}
            InputProps={{ className: "textfield-input" }}
          />
        </Box>
        {localQuestion.options.map((opt, idx) => (
          <Box key={idx} className="option-container">
            <TextField
              label={`Option ${idx + 1}`}
              fullWidth
              value={opt.text}
              onChange={(e) => handleOptionTextChange(idx, e.target.value)}
              className="modal-textfield"
              InputLabelProps={{ className: "textfield-label" }}
              InputProps={{ className: "textfield-input" }}
            />
            <FormControlLabel
              control={
                <Checkbox checked={opt.isCorrect} onChange={() => handleOptionToggle(idx)} className="checkbox" />
              }
              label="Correct"
              className="checkbox-label"
            />
          </Box>
        ))}
      </DialogContent>
      <DialogActions className="modal-actions">
        <Button type="button" onClick={onClose} className="cancel-button">
          <CancelIcon/>
          &nbsp;
          Annuler
        </Button>
        <Button type="button" onClick={handleSave} className="save-button">
          <SaveIcon/>
          &nbsp;
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default QuestionEditModal