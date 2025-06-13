import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VisitorsList from "./VisitorsList";
import Dashboard from "./components/Dashboard";
import RegistrationForm from "./RegistrationForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/visitors" element={<VisitorsList />} />
        <Route path="/register-user" element={<RegistrationForm />} />
      </Routes>
    </Router>
  );
}

export default App;
