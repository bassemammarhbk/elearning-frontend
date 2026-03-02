import React, { useEffect, useState } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  Avatar,
  useTheme,
  Grow,
} from "@mui/material";
import { People, School, MenuBook } from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getEtudiants,
  getEnseignants,
  getUsers,
} from "../../services/userservice";
import {
  getcours,
} from "../../services/courservice";
import {
  getfiliere,
} from "../../services/filiereservice";

const StatCard = ({ icon, label, count, color }) => (
  <Grow in={true} timeout={1000}>
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        borderRadius: 3,
        boxShadow: 3,
        bgcolor: "#fff",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Avatar sx={{ bgcolor: color, mr: 2, p: 2, fontSize: 30 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {count}
        </Typography>
      </Box>
    </Card>
  </Grow>
);

const Dashboard = () => {
  const theme = useTheme();
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalCours: 0,
    totalEnseignants: 0,
    totalFilieres: 0,
  });
  const [sexData, setSexData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const etudiants = await getEtudiants();
        const cours = await getcours();
        const enseignants = await getEnseignants();
        const filieres = await getfiliere();
        const users = await getUsers();

        setStats({
          totalEtudiants: etudiants.data.length,
          totalCours: cours.data.length,
          totalEnseignants: enseignants.data.length,
          totalFilieres: filieres.data.length,
        });

        // Répartition par sexe
        const sexCount = users.data.reduce((acc, user) => {
          const sex = user.sexe || "Non spécifié";
          acc[sex] = (acc[sex] || 0) + 1;
          return acc;
        }, {});
        const sexChartData = Object.entries(sexCount).map(([name, value]) => ({ name, value }));
        setSexData(sexChartData);

        // Pourcentage enseignants vs étudiants
        const totalUsers = users.data.length;
        const enseignantCount = enseignants.data.length;
        const etudiantCount = etudiants.data.length;
        const roleChartData = [
          { name: "Enseignants", value: (enseignantCount / totalUsers) * 100 },
          { name: "Étudiants", value: (etudiantCount / totalUsers) * 100 },
        ];
        setRoleData(roleChartData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ p: 4, bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom>
        Tableau de bord
      </Typography>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<People />}
            label="Étudiants"
            count={stats.totalEtudiants}
            color="#42a5f5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<MenuBook />}
            label="Cours"
            count={stats.totalCours}
            color="#66bb6a"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<School />}
            label="Formateurs"
            count={stats.totalEnseignants}
            color="#ffa726"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: "#fff" }}>
            <Typography variant="h6" gutterBottom>
              Utilisateurs par sexe
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sexData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {sexData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: "#fff" }}>
            <Typography variant="h6" gutterBottom>
              Pourcentage d'enseignants vs étudiants
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(2)}%)`}
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
