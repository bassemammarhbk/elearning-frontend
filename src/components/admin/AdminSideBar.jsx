import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import { FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import SchoolIcon from '@mui/icons-material/School';
import BookIcon from '@mui/icons-material/Book';
import MailIcon from '@mui/icons-material/Mail';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { ListTree } from 'lucide-react';
import { getCurrentUser } from '../../services/authservice';

function AdminSideBar() {
  const drawerWidth = 60;
  const expandedWidth = 250;
  const currentUser = getCurrentUser();

  return (
    <div style={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ backgroundColor: '#1a2035', px: 2 }}>
        <Toolbar sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Titre centré absolument */}
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <img
              src="https://res.cloudinary.com/dchbcbmr2/image/upload/v1744334548/image_2025-04-11_022216764_o37a70.png"
              alt="Logo"
              style={{ width: 30, marginRight: 10 }}
            />
            <Typography variant="h6" sx={{ color: '#fff', fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
              Learnista
            </Typography>
          </Box>

          {/* Espace flexible à gauche pour laisser la zone libre */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Bouton Accueil à droite */}
          <IconButton component={Link} to="/homes" edge="end" sx={{ color: '#fff' }} aria-label="Accueil">
            <HomeIcon sx={{ fontSize: 28 }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          transition: 'width 0.3s ease-in-out',
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            backgroundColor: '#1a2035',
            color: '#fff',
            overflowX: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            transition: 'width 0.3s ease-in-out'
          },
          '&:hover': {
            width: expandedWidth,
            '& .MuiDrawer-paper': { width: expandedWidth }
          }
        }}
        className="sidebar-admin"
      >
        <div style={{ padding: 16, display: 'flex', justifyContent: 'center' }}>
          {currentUser && (
            <div className="mobile-avatar">
              <img
                src={currentUser.avatar || '/default-avatar.png'}
                alt="Avatar"
                className="avatar-img"
              />
            </div>
          )}
        </div>

        <Divider sx={{ backgroundColor: '#ffffff33' }} />

        <List sx={{ p: 0 }}>
          <ListItem button component={Link} to="/admin/dashboard">
            <ListItemIcon sx={{ color: '#fff' }}><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Tableau de bord" />
          </ListItem>
          <ListItem button component={Link} to="/admin/enseignants">
            <ListItemIcon sx={{ color: '#fff' }}><FaChalkboardTeacher style={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Enseignants" />
          </ListItem>
          <ListItem button component={Link} to="/admin/etudiants">
            <ListItemIcon sx={{ color: '#fff' }}><FaUserGraduate style={{ fontSize: 20 }} /></ListItemIcon>
            <ListItemText primary="Étudiants" />
          </ListItem>
          <ListItem button component={Link} to="/admin/filiereadmin">
            <ListItemIcon sx={{ color: '#fff' }}><SchoolIcon /></ListItemIcon>
            <ListItemText primary="Filière" />
          </ListItem>
          <ListItem button component={Link} to="/admin/sous-filiere">
            <ListItemIcon sx={{ color: '#fff' }}><ListTree /></ListItemIcon>
            <ListItemText primary="Sous-filières" />
          </ListItem>
          <ListItem button component={Link} to="/admin/coursadmin">
            <ListItemIcon sx={{ color: '#fff' }}><BookIcon /></ListItemIcon>
            <ListItemText primary="Cours" />
          </ListItem>
          <ListItem button component={Link} to="/admin/contact-messages">
            <ListItemIcon sx={{ color: '#fff' }}><MailIcon /></ListItemIcon>
            <ListItemText primary="Messages" />
          </ListItem>
        </List>

        <Divider sx={{ backgroundColor: '#ffffff33', mt: 'auto' }} />

        <List>
          <ListItem button component={Link} to="/login">
            <ListItemIcon sx={{ color: '#fff' }}><ExitToAppIcon /></ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default AdminSideBar;
