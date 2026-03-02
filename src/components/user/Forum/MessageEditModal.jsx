import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";

function MessageEditModal({ isOpen, onClose, onSave, initialText }) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
    }
  }, [isOpen, initialText]);

  const handleSave = () => {
    onSave(text);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      aria-labelledby="edit-message-dialog-title"
    >
      <DialogTitle id="edit-message-dialog-title" sx={{ textAlign: "center" }}>
        Modifier le message
      </DialogTitle>

      <DialogContent dividers>
        <TextField
          autoFocus
          multiline
          minRows={4}
          fullWidth
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Entrez votre message..."
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", p: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Annuler
        </Button>
        <Button onClick={handleSave} variant="contained" color="success">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MessageEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialText: PropTypes.string,
};

MessageEditModal.defaultProps = {
  initialText: "",
};

export default MessageEditModal;
