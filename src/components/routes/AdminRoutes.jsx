import { Navigate, Route } from "react-router-dom";
import Dashboard from "../admin/Dashboard"
import ListfiliereAdmin from "../admin/filiereadmin/ListfiliereAdmin";
import InsertfiliereAdmin from "../admin/filiereadmin/InsertfiliereAdmin";
import EditfiliereAdmin from "../admin/filiereadmin/EditfiliereAdmin";
import ListcoursAdmin from "../admin/coursadmin/ListcoursAdmin"
import ListetudiantsAdmin from "../admin/etudiant/ListetudiantsAdmin"
import AdminLayout from "../../layouts/AdminLayout";
import ListenseignantsAdmin from "../admin/enseignants/ListenseignantAdmin";
import ListSousFiliereAdmin from "../admin/sousfilieresadmin/ListSousFiliereAdmin";
import InsertSousFiliereAdmin from "../admin/sousfilieresadmin/InsertSousFiliereAdmin";
import EditSousFiliereAdmin from "../admin/sousfilieresadmin/EditSousFiliereAdmin";
import ListNewsletterAdmin from "../admin/newsletteradmin/ListNewsletterAdmin";
import ContactMessagesAdmin from "../admin/contactadmin/ContactMessagesAdmin";

const getUser = () => JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("CC_Token");

const ProtectedAdminRoute = ({ children }) => {
  const user = getUser();
  if (token && user?.role === "admin") {
    return children;
  }
  return <Navigate to="/login" />;
};

export const adminRoutes = (
  <Route
    element={
      <ProtectedAdminRoute>
        <AdminLayout />
      </ProtectedAdminRoute>
    }
  >
    <Route path="/admin/dashboard" element={<Dashboard />} />
    <Route path="/admin/filiereadmin" element={<ListfiliereAdmin />} />
    <Route path="/admin/filiereadmin/add" element={<InsertfiliereAdmin />} />
    <Route path="/admin/filiereadmin/edit/:id" element={<EditfiliereAdmin />} />
    <Route path="/admin/coursadmin" element={<ListcoursAdmin />} />
    <Route path="/admin/etudiants" element={<ListetudiantsAdmin />} />
    <Route path="/admin/enseignants" element={<ListenseignantsAdmin />} />
     <Route path="/admin/sous-filiere"          element={<ListSousFiliereAdmin />} />
    <Route path="/admin/sous-filiere/add"      element={<InsertSousFiliereAdmin />} />
    <Route path="/admin/sous-filiere/edit/:id" element={<EditSousFiliereAdmin />} />
    <Route path="/admin/newsletter" element={<ListNewsletterAdmin />} />
    <Route path="/admin/contact-messages" element={<ContactMessagesAdmin />} />

</Route>
)