import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
// import Dashboard from "./pages/DashboardPage";
// import NotFound from "./pages/NotFoundPage";
import { useAuth } from "./hooks/useAuth";
// import AppBar from "./components/AppBar";
import CreateSet from "./pages/CreateLearingsetPage";

function AppRouter() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {/* <AppBar /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-set" element={<CreateSet />} />
        <Route
          path="/"
          // element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default AppRouter;
