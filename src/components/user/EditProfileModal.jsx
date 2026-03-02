import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Person,
  Phone,
  Wc,
  Close,
  Save,
  Cancel,
} from '@mui/icons-material';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const EditProfileModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  error,
  onAvatarChange,
}) => {
  const [localAvatar, setLocalAvatar] = useState(formData.avatar || '');
  const [files, setFiles] = useState([]);

  // Initialize localAvatar and FilePond files when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalAvatar(formData.avatar || '');
      if (formData.avatar) {
        setFiles([
          {
            source: formData.avatar,
            options: { type: 'local' },
          },
        ]);
      } else {
        setFiles([]);
      }
    }
  }, [isOpen, formData.avatar]);

  // Cloudinary upload configuration
  const serverOptions = {
    load: (source, load, error) => {
      fetch(source)
        .then((res) => res.blob())
        .then((blob) => load(blob))
        .catch(() => error('Cannot load image'));
    },
    process: (fieldName, file, metadata, load, error, progress, abort) => {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'bsmammr');
      data.append('cloud_name', 'dchbcbmr2');
      data.append('public_id', `avatars/${Date.now()}_${file.name}`);

      fetch('https://api.cloudinary.com/v1_1/dchbcbmr2/image/upload', {
        method: 'POST',
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.secure_url) {
            setLocalAvatar(data.secure_url);
            onAvatarChange(data.secure_url); // Update parent formData directly
            load(data.secure_url);
          } else {
            error('Upload failed');
            abort();
          }
        })
        .catch(() => {
          error('Upload error');
          abort();
        });
    },
  };

  // Reset on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLocalAvatar(formData.avatar || '');
        onClose();
      }
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, formData.avatar]);

  // Handle Cancel button: revert avatar and close
  const handleCancel = () => {
    setLocalAvatar(formData.avatar || '');
    onClose();
  };

  // Handle Submit: just call onSubmit (avatar already updated via onAvatarChange)
  const handleSave = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <Dialog open={isOpen} onClose={handleCancel} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#e3f2fd',
          borderBottom: '1px solid #bbdefb',
          p: 2.5,
        }}
      >
        <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#1976d2',
            }}
          >
            Modifier le profil
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            color: '#757575',
            '&:hover': {
              color: '#d32f2f',
              transform: 'rotate(90deg) scale(1.1)',
            },
            transition: 'color 0.3s ease, transform 0.3s ease',
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <form onSubmit={handleSave} style={{ width: '100%', maxWidth: '450px' }}>
          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="Prénom"
              name="firstname"
              value={formData.firstname}
              onChange={onChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f5f5f5',
                  '& fieldset': { borderColor: '#bdbdbd' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42a5f5',
                    boxShadow: '0 0 0 4px rgba(66, 165, 245, 0.25)',
                  },
                  '&:hover fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: '#616161', fontWeight: 600 },
              }}
              InputProps={{
                startAdornment: <Person sx={{ color: '#757575', mr: 1 }} />,
              }}
            />
            <TextField
              label="Nom"
              name="lastname"
              value={formData.lastname}
              onChange={onChange}
              required
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f5f5f5',
                  '& fieldset': { borderColor: '#bdbdbd' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42a5f5',
                    boxShadow: '0 0 0 4px rgba(66, 165, 245, 0.25)',
                  },
                  '&:hover fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: '#616161', fontWeight: 600 },
              }}
              InputProps={{
                startAdornment: <Person sx={{ color: '#757575', mr: 1 }} />,
              }}
            />
          </Box>

          {/* Upload FilePond pour avatar */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ mb: 1, color: '#616161', fontWeight: 600 }}>Avatar</Typography>
            <FilePond
              files={files}
              allowMultiple={false}
              acceptedFileTypes={['image/*']}
              onupdatefiles={(fileItems) => {
                setFiles(fileItems);
              }}
              server={serverOptions}
              name="file"
              labelIdle='Glissez-déposez votre image ou <span class="filepond--label-action">Cliquez ici</span>'
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 3, mb: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
            <TextField
              label="Téléphone"
              type="tel"
              name="tel"
              placeholder="44 444 444"
              value={formData.tel}
              onChange={onChange}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f5f5f5',
                  '& fieldset': { borderColor: '#bdbdbd' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42a5f5',
                    boxShadow: '0 0 0 4px rgba(66, 165, 245, 0.25)',
                  },
                  '&:hover fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: '#616161', fontWeight: 600 },
              }}
              InputProps={{
                startAdornment: <Phone sx={{ color: '#757575', mr: 1 }} />,
              }}
            />
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  backgroundColor: '#f5f5f5',
                  '& fieldset': { borderColor: '#bdbdbd' },
                  '&.Mui-focused fieldset': {
                    borderColor: '#42a5f5',
                    boxShadow: '0 0 0 4px rgba(66, 165, 245, 0.25)',
                  },
                  '&:hover fieldset': { borderColor: '#90caf9' },
                },
                '& .MuiInputLabel-root': { color: '#616161', fontWeight: 600 },
              }}
            >
              <InputLabel id="sexe-label">Sexe</InputLabel>
              <Select
                labelId="sexe-label"
                name="sexe"
                value={formData.sexe}
                onChange={onChange}
                label="Sexe"
              >
                <MenuItem value="homme">Homme</MenuItem>
                <MenuItem value="femme">Femme</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {error && (
            <Box
              sx={{
                backgroundColor: '#ffebee',
                color: '#c0392b',
                border: '1px solid #ef9a9a',
                borderRadius: '8px',
                p: 1.5,
                mb: 2,
                textAlign: 'center',
                fontSize: '0.9rem',
                fontWeight: 500,
                animation: 'shake 0.3s ease-in-out',
              }}
            >
              {error}
            </Box>
          )}
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'flex-end', gap: 2 }}>
        <Button
          onClick={handleCancel}
          variant="contained"
          startIcon={<Cancel />}
          sx={{
            backgroundColor: '#dc3545',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#c82333',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            },
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            borderRadius: '10px',
            padding: '12px 28px',
            fontWeight: 700,
          }}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<Save />}
          sx={{
            backgroundColor: '#28a745',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#218838',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 15px rgba(40, 167, 69, 0.5)',
            },
            transition: 'all 0.3s ease',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            borderRadius: '10px',
            padding: '12px 28px',
            fontWeight: 700,
          }}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProfileModal;