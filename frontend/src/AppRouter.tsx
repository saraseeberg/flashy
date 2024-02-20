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
import TopBar from "./components/TopBar";
import ViewCards from "./pages/ViewCardsPage";
import NotFound from "./pages/NotFoundPage";
import Settings from "./pages/SettingsPage";

function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-set"
          element={isAuthenticated ? <CreateSet /> : <Navigate to="/login" />}
        />
        <Route
          path="/edit-set/:setId"
          element={isAuthenticated ? <EditSet /> : <Navigate to="/login" />}
        />
        <Route
          path="/viewcards/:setId"
          element={isAuthenticated ? <ViewCards /> : <Navigate to="/login" />}
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
