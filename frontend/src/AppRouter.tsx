import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/DashboardPage";
import { useAuth } from "./hooks/useAuth";
import CreateSet from "./pages/CreateLearningsetPage";
import EditSet from "./pages/EditLearningSetPage";
import ViewCards from "./pages/ViewCardsPage";
import NotFound from "./pages/NotFoundPage";
import Settings from "./pages/SettingsPage";
import App from "./App";
import AdminPage from "./pages/AdminPage";
import { auth, db } from "./config/firebase";
import { Firestore, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import ErrorPopup from "./components/ErrorPopup";
import CreateAdminUserPage from "./pages/CreateAdminUserPage";

function AppRouter() {
  const { isAuthenticated } = useAuth();
  const currentUserId = auth.currentUser?.uid;
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (currentUserId) {
        const userDocRef = doc(db as Firestore, "usersData", currentUserId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const role = userData?.role;
          setUserRole(role);
        } else {
          console.error("User document not found.");
        }
      }
    };

    if (isAuthenticated && currentUserId) {
      fetchUserRole();
    }
  }, [isAuthenticated, currentUserId]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Navigate to="login" />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="create-set"
            element={isAuthenticated ? <CreateSet /> : <Navigate to="/login" />}
          />
          <Route
            path="edit-set/:setId"
            element={isAuthenticated ? <EditSet /> : <Navigate to="/login" />}
          />
          <Route
            path="viewcards/:setId"
            element={isAuthenticated ? <ViewCards /> : <Navigate to="/login" />}
          />
          <Route
            path="adminpage"
            element={
              (isAuthenticated && userRole === "superadmin") ||
              (isAuthenticated && userRole === "admin") ? (
                <AdminPage />
              ) : (
                <ErrorPopup
                  open={true}
                  onClose={() => <Navigate to="/dashboard" />}
                />
              )
            }
          />
          <Route
            path="create-adminUser"
            element={
              isAuthenticated && userRole === "superadmin" ? (
                <CreateAdminUserPage />
              ) : (
                <ErrorPopup
                  open={true}
                  onClose={() => <Navigate to="/adminpage" />}
                />
              )
            }
          />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
