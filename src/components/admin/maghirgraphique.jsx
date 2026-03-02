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
import { People, School, MenuBook, Category, SubdirectoryArrowRight } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  getEtudiants,
  getEnseignants,
} from "../../services/userservice";
import {
  getcours,
} from "../../services/courservice";
import {
  getfiliere,
  getFilieresAvecCours,

} from "../../services/filiereservice";
import {getSousFilieresByFiliere} from "../../services/sousfiliereservice"

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
    totalSousFilieres: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const etudiants = await getEtudiants();
        const cours = await getcours();
        const enseignants = await getEnseignants();
        const filieres = await getfiliere();
        const filieresAvecCours = await getFilieresAvecCours();

        // Récupérer toutes les sous-filières pour chaque filière
        const sousFilieres = await Promise.all(
          filieres.data.map((filiere) => getSousFilieresByFiliere(filiere._id))
        );

        const totalSousFilieres = sousFilieres.reduce(
          (acc, curr) => acc + curr.data.length,
          0
        );

        setStats({
          totalEtudiants: etudiants.data.length,
          totalCours: cours.data.length,
          totalEnseignants: enseignants.data.length,
          totalFilieres: filieres.data.length,
          totalSousFilieres,
        });

        // Données pour le graphique : nombre de cours et sous-filières par filière
        const chartData = filieres.data.map((filiere) => ({
          name: filiere.nomfiliere || "Sans nom",
          cours: filiere.cours.length,
          sousFilieres: sousFilieres.find((sf) => sf.data[0]?.filiereId === filiere._id)?.data.length || 0,
        }));
        setChartData(chartData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };

    fetchData();
  }, []);

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
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<Category />}
            label="Filières"
            count={stats.totalFilieres}
            color="#ab47bc"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<SubdirectoryArrowRight />}
            label="Sous-filières"
            count={stats.totalSousFilieres}
            color="#ff7043"
          />
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: "#fff" }}>
        <Typography variant="h6" gutterBottom>
          Répartition des cours et sous-filières par filière
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cours" fill={theme.palette.primary.main} />
            <Bar dataKey="sousFilieres" fill={theme.palette.secondary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default Dashboard;