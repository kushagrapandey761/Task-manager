import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login"
import Register from "./pages/Register";
import "./index.css"

import LandingPage from "./pages/LandingPage";
import Tasks from "./pages/Tasks";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/tasks" element={<Tasks/>} />

        
      </Routes>
    </Router>
  );
};

export default AppRoutes;
