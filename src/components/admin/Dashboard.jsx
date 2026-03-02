"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts"
import { getEtudiants, getEnseignants, getUsers } from "../../services/userservice"
import { getcours } from "../../services/courservice"
import { getfiliere, getFilieresAvecCours } from "../../services/filiereservice"
import { getSousFilieresByFiliere } from "../../services/sousfiliereservice"
import "./admindash.css"

const StatCard = ({ icon, label, count, color }) => (
  <div className="stat-card" style={{ "--card-color": color }}>
    <div className="stat-icon" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div className="stat-content">
      <div className="stat-label">{label}</div>
      <div className="stat-count">{count}</div>
    </div>
  </div>
)

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEtudiants: 0,
    totalCours: 0,
    totalEnseignants: 0,
    totalFilieres: 0,
    totalSousFilieres: 0,
  })
  const [chartData, setChartData] = useState([])
  const [sexData, setSexData] = useState([])
  const [roleData, setRoleData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const etudiants = await getEtudiants()
        const cours = await getcours()
        const enseignants = await getEnseignants()
        const filieres = await getfiliere()
        const filieresAvecCours = await getFilieresAvecCours()
        const users = await getUsers()

        // Récupérer toutes les sous-filières pour chaque filière
        const sousFilieres = await Promise.all(filieres.data.map((filiere) => getSousFilieresByFiliere(filiere._id)))

        const totalSousFilieres = sousFilieres.reduce((acc, curr) => acc + curr.data.length, 0)

        setStats({
          totalEtudiants: etudiants.data.length,
          totalCours: cours.data.length,
          totalEnseignants: enseignants.data.length,
          totalFilieres: filieres.data.length,
          totalSousFilieres,
        })

        // Données pour le graphique de répartition des cours et sous-filières par filière
        const chartData = filieresAvecCours.data.map((filiere) => ({
          name: filiere.nomfiliere || "Sans nom",
          cours: filiere.cours.length,
          sousFilieres: sousFilieres.find((sf) => sf.data[0]?.filiereId === filiere._id)?.data.length || 0,
        }))
        setChartData(chartData)

        // Répartition par sexe
        const sexCount = users.data.reduce((acc, user) => {
          const sex = user.sexe || "Non spécifié"
          acc[sex] = (acc[sex] || 0) + 1
          return acc
        }, {})
        const sexChartData = Object.entries(sexCount).map(([name, value]) => ({ name, value }))
        setSexData(sexChartData)

        // Pourcentage enseignants vs étudiants
        const totalUsers = users.data.length
        const enseignantCount = enseignants.data.length
        const etudiantCount = etudiants.data.length
        const roleChartData = [
          { name: "Enseignants", value: (enseignantCount / totalUsers) * 100 },
          { name: "Étudiants", value: (etudiantCount / totalUsers) * 100 },
        ]
        setRoleData(roleChartData)
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error)
      }
    }

    fetchData()
  }, [])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  // Fonction pour afficher les labels avec les nombres dans le cercle
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="bold"
      >
        {value}
      </text>
    )
  }

  // Icônes SVG simples
  const PeopleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2 1l-3 4v2h2l2.54-3.4L18.5 16H16v6h4zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm1.5 2h-2C3.34 8 2 9.34 2 11v5.5c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5V13h1v7h4v-7h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V11c0-1.66-1.34-3-3-3z" />
    </svg>
  )

  const SchoolIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
    </svg>
  )

  const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
    </svg>
  )

  const CategoryIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )

  const ArrowIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 15l-6 6-1.42-1.42L15.17 16H4V4h2v10h9.17l-3.59-3.58L13 9l6 6z" />
    </svg>
  )

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Tableau de bord</h1>

      <div className="stats-grid">
        <StatCard icon={<PeopleIcon />} label="Étudiants" count={stats.totalEtudiants} color="#42a5f5" />
        <StatCard icon={<BookIcon />} label="Cours" count={stats.totalCours} color="#66bb6a" />
        <StatCard icon={<SchoolIcon />} label="Enseignants" count={stats.totalEnseignants} color="#ffa726" />
        <StatCard icon={<CategoryIcon />} label="Filières" count={stats.totalFilieres} color="#ab47bc" />
        <StatCard icon={<ArrowIcon />} label="Sous-filières" count={stats.totalSousFilieres} color="#ff7043" />
      </div>

      <div className="charts-grid">
        <div className="chart-container full-width">
          <div className="chart-paper">
            <h3 className="chart-title">Répartition des cours et sous-filières par filière</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cours" fill="#42a5f5" />
                <Bar dataKey="sousFilieres" fill="#ab47bc" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container half-width">
          <div className="chart-paper">
            <h3 className="chart-title">Nombre des utilisateurs par sexe</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sexData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
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
          </div>
        </div>

        <div className="chart-container half-width">
          <div className="chart-paper">
            <h3 className="chart-title">Pourcentage des utilisateurs</h3>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
