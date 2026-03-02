import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// Composants Utilisateur
import Homes from "./pages/Homes";
import Register from "./components/authentification/Register";
import Login from "./components/authentification/Login";
import Logout from "./components/authentification/Logout";
import Footerz from "./components/user/Footerz";
import Filierez from './components/user/filieres/Filierez';
import FiliereDetail from './components/user/filieres/FiliereDetail';
import Cours from "./components/user/cours/Cours";
import Navbarz from "./components/user/Navbarz";
import AdminLayout from "./layouts/AdminLayout";
import { adminRoutes } from "./components/routes/AdminRoutes";
import ProtectedRoutes from "./ProtectedRoute";
import CoursDetails from "./components/user/cours/CoursDetails";
import MesCours from "./components/user/cours/MesCours";
import CoursManagement from "./components/user/cours/CoursManagement";
import AfficheQuiz from "./components/user/cours/AfficheQuiz";
import Terms from "./components/authentification/Terms";
import MesCoursEtudiant from "./components/user/cours/MesCoursEtudiant";
import ContactPage from "./components/user/Contact";
import Loginbolt from "./components/authentification/Loginbolt";
import Registerbolt from "./components/authentification/Registerbolt";
import FinalTestPage from "./components/user/cours/FinalTestPage";
import About from "./pages/About";
import CourseQuizzesPage from "./components/user/cours/CoursQuizzes";
import TeacherFinalTestPage from "./components/user/cours/FinaltestTeacher";
import ProfilePage from "./components/user/Profil";
import Forum from "./components/user/Forum/Forum";
import EditQuizPage from "./components/user/cours/EditQuizPage";
import StudentDashboard from "./components/user/cours/MesCoursEtudiant";
import FormChatbot from "./components/user/chatbot/FormChatbot";
import ForgotPassword from "./components/authentification/ForgotPassword";
import ResetPassword from "./components/authentification/ResetPassword";
import Standings from "./components/user/cours/Leaderbord";









// 💡 Layout utilisateur avec Navbarz et Footerz
const AppLayout = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
  }}>
    {/* Navbar en haut */}
    <Navbarz style={{ position: "sticky", top: 0, left: 0, width: "100%", zIndex: 1000 }} />

    {/* Contenu principal */}
    <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: "0" }}>
      <Outlet />
    </div>

    {/* Footer en bas */}
    <Footerz />
  </div>
);

// 🔐 Layout Admin protégé (sans Navbarz ni Footerz)


function App() {
  return (
    <Router>
      <Routes>

        {/* Routes Admin (sans Navbarz/Footerz) */}
        <Route element={<ProtectedRoutes />}>
        {adminRoutes}

        </Route>

        {/* Routes Utilisateur (avec Navbarz/Footerz) */}
        <Route element={<AppLayout />}>
          <Route path="/homes" element={<Homes />} />
          <Route path="/filieres" element={<Filierez />} />
          <Route path="/filiere/:filiereId" element={<FiliereDetail />} />
          <Route path="/cours" element={<Cours />} />
          <Route path="/cours/:id" element={<CoursDetails />} />
          <Route path="/mes-cours" element={<MesCours />} />
          <Route path="/cours/:id/manage" element={<CoursManagement />} />
          <Route path="/affichequiz/:coursId" element={<AfficheQuiz />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/mes-cours-etudiant" element={<StudentDashboard />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/cours/:courseId/quizzes" element={<CourseQuizzesPage />} />
           <Route path="/cours/:courseId/quiz/:quizId/edit" element={<EditQuizPage />} /> {/* Nouvelle route */}
          <Route path="/cours/:courseId/teacher-final-test" element={<TeacherFinalTestPage />} />
          <Route path="/profil" element={<ProfilePage />} />
          <Route path="/cours/:id/forum" element={<Forum />} />
          <Route path="/chatbot" element={<FormChatbot/>}/>
          <Route path="/standings" element={<Standings/>}/>





        </Route>
        <Route path="/register" element={<Registerbolt />} />
        <Route path="/login" element={<Loginbolt />} />
        <Route path="/cours/:courseId/final-test" element={<FinalTestPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />



        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/homes" />} />
      </Routes>
    </Router>
  );
}

export default App;
