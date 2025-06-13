import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VisitorsList from "./pages/visitors/VisitorsList";
import Dashboard from "./pages/dashboard/Dashboard";
import RegistrationForm from "./pages/registration/RegistrationForm";
import VisitorsProfile from './pages/visitors/VisitorsProfile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visitors" element={<VisitorsList />} />
        <Route path="/visitors/:id" element={<VisitorsProfile />} />
        <Route path="/register-user" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
