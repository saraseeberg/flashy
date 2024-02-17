import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Dashboard from "./pages/DashboardPage";
import NotFound from "./pages/NotFoundPage";
import { useAuth } from "./hooks/useAuth";
import CreateSet from "./pages/CreateLearningsetPage";
import EditSet from "./pages/EditLearningSetPage";
import TopBar from "./components/TopBar";
import ViewCards from "./pages/ViewCardsPage";

function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <TopBar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-set" element={<CreateSet />} />
        <Route path="/edit-set/:setId" element={<EditSet />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
